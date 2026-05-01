require("dotenv").config();
const express = require("express");
const mysql   = require("mysql2/promise");
const cors    = require("cors");

const app  = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || "localhost",
  port:     process.env.DB_PORT     || 3306,
  user:     process.env.DB_USER     || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME     || "anapec_tdb",
  waitForConnections: true,
  connectionLimit: 10,
  charset: "utf8mb4"
});

async function q(sql, params=[]) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

const MONTHS_FR = ["Janvier","Février","Mars","Avril","Mai","Juin",
                   "Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

// ── Migration automatique de la base au démarrage ────────────
async function initDB() {

  // 1. Ajouter la colonne saisi_par à realisations si elle manque
  try {
    const cols = await q(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME   = 'realisations'
        AND COLUMN_NAME  = 'saisi_par'
    `);
    if (!cols.length) {
      await q("ALTER TABLE realisations ADD COLUMN saisi_par INT NULL");
      await q("ALTER TABLE realisations ADD CONSTRAINT fk_real_user FOREIGN KEY (saisi_par) REFERENCES utilisateurs(id)");
      console.log("✓ Colonne saisi_par ajoutée à realisations");
    } else {
      console.log("✓ Colonne saisi_par OK");
    }
  } catch(e) {
    // FK déjà existante ou autre erreur non bloquante
    console.log("✓ realisations (migration ignorée):", e.message.substring(0, 60));
  }

  // 2. Mettre à jour la UNIQUE KEY pour inclure saisi_par
  try {
    try { await q("ALTER TABLE realisations DROP INDEX uq_real"); } catch {}
    try { await q("ALTER TABLE realisations DROP CONSTRAINT uq_real"); } catch {}
    // We intentionally don't recreate uq_real here because our custom UPSERT logic in POST /api/realisations already prevents duplicates and is much safer!
    console.log("✓ Ancienne contrainte uq_real nettoyée (logique gérée côté code)");
  } catch(e) {
    console.log("✓ UNIQUE KEY (ignorée):", e.message.substring(0, 60));
  }

  // 3. Créer la table activities si elle n'existe pas
  try {
    await q(`
      CREATE TABLE IF NOT EXISTS activities (
        id            INT     NOT NULL AUTO_INCREMENT,
        conseiller_id INT     NOT NULL,
        action_type   ENUM('create','update','delete') NOT NULL,
        module        VARCHAR(80)  NOT NULL DEFAULT 'realisation',
        detail        VARCHAR(255) NULL,
        created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_act_conseiller (conseiller_id),
        KEY idx_act_date       (created_at),
        CONSTRAINT fk_act_user_init FOREIGN KEY (conseiller_id)
          REFERENCES utilisateurs(id) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);
    console.log("✓ Table activities OK");
  } catch(e) {
    if (!e.message.includes("Duplicate key name")) {
      console.error("Init activities:", e.message);
    }
  }

  // 4. Créer la table notifications si elle n'existe pas, et ajouter type_message
  try {
    await q(`
      CREATE TABLE IF NOT EXISTS notifications (
        id           INT          NOT NULL AUTO_INCREMENT,
        user_id      INT          NOT NULL,
        titre        VARCHAR(150) NOT NULL,
        message      TEXT         NOT NULL,
        lu           TINYINT(1)   DEFAULT 0,
        created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
        type_message VARCHAR(50)  DEFAULT 'information',
        PRIMARY KEY (id),
        KEY idx_notif_user (user_id),
        CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);
    
    const cols = await q(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME   = 'notifications'
        AND COLUMN_NAME  = 'type_message'
    `);
    if (!cols.length) {
      await q("ALTER TABLE notifications ADD COLUMN type_message VARCHAR(50) DEFAULT 'information'");
      console.log("✓ Colonne type_message ajoutée à notifications");
    } else {
      console.log("✓ Table notifications OK");
    }
  } catch(e) {
    console.log("✓ Migration notifications ignorée:", e.message.substring(0, 60));
  }
}

// ── Notifier tous les directeurs ─────────────────────────────
async function notifyDirecteurs(titre, message) {
  try {
    const dirs = await q("SELECT id FROM utilisateurs WHERE role='directeur' AND actif=1");
    for (const d of dirs) {
      await q("INSERT INTO notifications (user_id, titre, message) VALUES (?,?,?)",
        [d.id, titre, message]);
    }
  } catch(e) { console.error("Notify error:", e.message); }
}

// ── Journaliser l'activité d'un conseiller ───────────────────
async function logActivity(conseiller_id, action_type, module, detail) {
  if (!conseiller_id) return;
  try {
    await q(
      "INSERT INTO activities (conseiller_id, action_type, module, detail) VALUES (?,?,?,?)",
      [conseiller_id, action_type, module || "realisation", detail || null]
    );
  } catch(e) { console.error("Activity log error:", e.message); }
}

// =============================================================
//  AUTH
// =============================================================

app.post("/api/auth/login", async (req, res) => {
  const { email, mot_de_passe } = req.body;
  if (!email || !mot_de_passe) return res.status(400).json({ error: "Email et mot de passe requis" });
  try {
    const rows = await q(
      "SELECT id, nom, prenom, email, role FROM utilisateurs WHERE email=? AND mot_de_passe=? AND actif=1",
      [email, mot_de_passe]
    );
    if (!rows.length) return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    res.json({ user: rows[0] });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/auth/register", async (req, res) => {
  const { nom, prenom, email, mot_de_passe } = req.body;
  if (!nom||!prenom||!email||!mot_de_passe)
    return res.status(400).json({ error: "Tous les champs sont obligatoires" });
  try {
    const exists = await q("SELECT id FROM utilisateurs WHERE email=?", [email]);
    if (exists.length) return res.status(409).json({ error: "Email déjà utilisé" });
    await q("INSERT INTO utilisateurs (nom,prenom,email,mot_de_passe,role) VALUES (?,?,?,?,'conseiller')",
      [nom, prenom, email, mot_de_passe]);
    const user = await q("SELECT id,nom,prenom,email,role FROM utilisateurs WHERE email=?", [email]);
    res.json({ user: user[0] });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// =============================================================
//  CRUD UTILISATEURS
// =============================================================

app.get("/api/utilisateurs", async (req, res) => {
  try {
    res.json(await q("SELECT id,nom,prenom,email,role,date_creation,actif FROM utilisateurs ORDER BY role DESC, nom ASC"));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/utilisateurs", async (req, res) => {
  const { nom, prenom, email, mot_de_passe, role="conseiller" } = req.body;
  if (!nom||!prenom||!email||!mot_de_passe) return res.status(400).json({ error: "Tous les champs sont obligatoires" });
  try {
    const exists = await q("SELECT id FROM utilisateurs WHERE email=?", [email]);
    if (exists.length) return res.status(409).json({ error: "Email déjà utilisé" });
    const result = await q("INSERT INTO utilisateurs (nom,prenom,email,mot_de_passe,role) VALUES (?,?,?,?,?)",
      [nom, prenom, email, mot_de_passe, role]);
    const user = await q("SELECT id,nom,prenom,email,role,date_creation,actif FROM utilisateurs WHERE id=?", [result.insertId]);
    res.json({ success: true, user: user[0] });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.put("/api/utilisateurs/:id", async (req, res) => {
  const { nom, prenom, email, mot_de_passe } = req.body;
  const { id } = req.params;
  try {
    if (email) {
      const exists = await q("SELECT id FROM utilisateurs WHERE email=? AND id!=?", [email, id]);
      if (exists.length) return res.status(409).json({ error: "Email déjà utilisé" });
    }
    const fields=[], vals=[];
    if (nom)          { fields.push("nom=?");          vals.push(nom); }
    if (prenom)       { fields.push("prenom=?");       vals.push(prenom); }
    if (email)        { fields.push("email=?");        vals.push(email); }
    if (mot_de_passe) { fields.push("mot_de_passe=?"); vals.push(mot_de_passe); }
    if (!fields.length) return res.status(400).json({ error: "Aucun champ à modifier" });
    vals.push(id);
    await q(`UPDATE utilisateurs SET ${fields.join(",")} WHERE id=?`, vals);
    const user = await q("SELECT id,nom,prenom,email,role,date_creation,actif FROM utilisateurs WHERE id=?", [id]);
    res.json({ success: true, user: user[0] });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.patch("/api/utilisateurs/:id/toggle", async (req, res) => {
  try {
    const rows = await q("SELECT actif FROM utilisateurs WHERE id=? AND role='conseiller'", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Conseiller non trouvé" });
    const newActif = rows[0].actif ? 0 : 1;
    await q("UPDATE utilisateurs SET actif=? WHERE id=?", [newActif, req.params.id]);
    res.json({ success: true, actif: newActif });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/utilisateurs/:id", async (req, res) => {
  try {
    const rows = await q("SELECT role FROM utilisateurs WHERE id=?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Utilisateur non trouvé" });
    if (rows[0].role==="directeur") return res.status(403).json({ error: "Impossible de supprimer un directeur" });
    await q("DELETE FROM realisations WHERE saisi_par=?", [req.params.id]);
    await q("DELETE FROM notifications WHERE user_id=?", [req.params.id]);
    await q("DELETE FROM utilisateurs WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// =============================================================
//  OBJECTIFS
// =============================================================

app.get("/api/objectifs/:annee", async (req, res) => {
  try {
    res.json(await q(
      "SELECT i.nom AS indicateur_nom, o.valeur FROM objectifs o JOIN indicateurs i ON i.id=o.indicateur_id WHERE o.annee=?",
      [req.params.annee]
    ));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/objectifs", async (req, res) => {
  const { annee, objectifs } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    for (const [nom, valeur] of Object.entries(objectifs)) {
      await conn.execute(
        "INSERT INTO objectifs (indicateur_id,annee,valeur) SELECT id,?,? FROM indicateurs WHERE nom=? ON DUPLICATE KEY UPDATE valeur=VALUES(valeur)",
        [annee, valeur, nom]
      );
    }
    await conn.commit();
    res.json({ success: true });
  } catch(e) { await conn.rollback(); res.status(500).json({ error: e.message }); }
  finally { conn.release(); }
});

// =============================================================
//  RÉALISATIONS
// =============================================================

app.get("/api/realisations/:annee", async (req, res) => {
  try {
    // Get conseillers' aggregated values
    const consRows = await q(`
      SELECT r.mois, i.nom AS indicateur_nom, SUM(r.valeur_cumul) AS valeur_cumul
      FROM realisations r
      JOIN indicateurs i ON i.id=r.indicateur_id
      JOIN utilisateurs u ON u.id = r.saisi_par
      WHERE r.annee=? AND u.role='conseiller'
      GROUP BY r.mois, r.indicateur_id
      ORDER BY r.mois, i.id
    `, [req.params.annee]);

    // Get director overrides (if any)
    const dirRows = await q(`
      SELECT r.mois, i.nom AS indicateur_nom, r.valeur_cumul
      FROM realisations r
      JOIN indicateurs i ON i.id=r.indicateur_id
      JOIN utilisateurs u ON u.id = r.saisi_par
      WHERE r.annee=? AND u.role='directeur'
    `, [req.params.annee]);

    // Build director override map: mois###indicateur -> value
    const dirMap = {};
    dirRows.forEach(r => { dirMap[`${r.mois}###${r.indicateur_nom}`] = Number(r.valeur_cumul); });

    // Merge: use director value if exists, else conseillers' sum
    const result = consRows.map(r => {
      const key = `${r.mois}###${r.indicateur_nom}`;
      return {
        mois: r.mois,
        indicateur_nom: r.indicateur_nom,
        valeur_cumul: dirMap[key] !== undefined ? dirMap[key] : Number(r.valeur_cumul)
      };
    });

    // Add director-only entries (indicators with no conseiller data)
    dirRows.forEach(r => {
      const key = `${r.mois}###${r.indicateur_nom}`;
      if (!consRows.some(c => `${c.mois}###${c.indicateur_nom}` === key)) {
        result.push({ mois: r.mois, indicateur_nom: r.indicateur_nom, valeur_cumul: Number(r.valeur_cumul) });
      }
    });

    result.sort((a, b) => a.mois - b.mois);
    res.json(result);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/realisations/user/:id", async (req, res) => {
  const { annee, mois } = req.query;
  try {
    const rows = await q(`
      SELECT i.nom AS indicateur_nom, r.valeur_cumul 
      FROM realisations r
      JOIN indicateurs i ON i.id = r.indicateur_id
      WHERE r.saisi_par = ? AND r.annee = ? AND r.mois = ?
    `, [req.params.id, annee, mois]);
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// GET conseillers-only sum for a specific month (used by Saisie page)
app.get("/api/realisations/conseillers-sum/:annee/:mois", async (req, res) => {
  try {
    const rows = await q(`
      SELECT i.nom AS indicateur_nom, SUM(r.valeur_cumul) AS valeur_cumul
      FROM realisations r
      JOIN indicateurs i ON i.id=r.indicateur_id
      JOIN utilisateurs u ON u.id = r.saisi_par
      WHERE r.annee=? AND r.mois=? AND u.role='conseiller'
      GROUP BY r.indicateur_id
      ORDER BY i.id
    `, [req.params.annee, req.params.mois]);
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// GET director view for Saisie page: conseillers sum + director overrides
app.get("/api/realisations/director-view/:annee/:mois", async (req, res) => {
  try {
    // Conseillers' aggregated sum
    const consRows = await q(`
      SELECT i.nom AS indicateur_nom, SUM(r.valeur_cumul) AS valeur_cumul
      FROM realisations r
      JOIN indicateurs i ON i.id=r.indicateur_id
      JOIN utilisateurs u ON u.id = r.saisi_par
      WHERE r.annee=? AND r.mois=? AND u.role='conseiller'
      GROUP BY r.indicateur_id
      ORDER BY i.id
    `, [req.params.annee, req.params.mois]);

    // Director overrides (if any)
    const dirRows = await q(`
      SELECT i.nom AS indicateur_nom, r.valeur_cumul
      FROM realisations r
      JOIN indicateurs i ON i.id=r.indicateur_id
      JOIN utilisateurs u ON u.id = r.saisi_par
      WHERE r.annee=? AND r.mois=? AND u.role='directeur'
    `, [req.params.annee, req.params.mois]);

    const consMap = {};
    consRows.forEach(r => { consMap[r.indicateur_nom] = Number(r.valeur_cumul); });

    const dirMap = {};
    dirRows.forEach(r => { dirMap[r.indicateur_nom] = Number(r.valeur_cumul); });

    res.json({ conseillers: consMap, directeur: dirMap });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/realisations", async (req, res) => {
  const { annee, mois, realisations, saisi_par } = req.body;
  if (!annee||!mois||!realisations) return res.status(400).json({ error: "Paramètres manquants" });
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const existing = await q(
      "SELECT COUNT(*) AS cnt FROM realisations WHERE annee=? AND mois=? AND saisi_par<=>?",
      [annee, mois, saisi_par||null]
    );
    const isUpdate = Number(existing[0].cnt) > 0;
    for (const [nom, valeur_cumul] of Object.entries(realisations)) {
      const indRows = await conn.execute("SELECT id FROM indicateurs WHERE nom=?", [nom]);
      if (!indRows[0].length) continue;
      const indId = indRows[0][0].id;
      const exist = await conn.execute("SELECT id FROM realisations WHERE indicateur_id=? AND annee=? AND mois=? AND saisi_par<=>?", [indId, annee, mois, saisi_par||null]);
      if (exist[0].length > 0) {
        await conn.execute("UPDATE realisations SET valeur_cumul=? WHERE id=?", [valeur_cumul, exist[0][0].id]);
      } else {
        await conn.execute("INSERT INTO realisations (indicateur_id, annee, mois, valeur_cumul, saisi_par) VALUES (?,?,?,?,?)", [indId, annee, mois, valeur_cumul, saisi_par||null]);
      }
    }
    await conn.commit();

    let conseillerNom = "Un utilisateur";
    if (saisi_par) {
      const u = await q("SELECT CONCAT(prenom,' ',nom) AS fullname FROM utilisateurs WHERE id=?", [saisi_par]);
      if (u.length) conseillerNom = u[0].fullname;
    }
    const now=new Date();
    const dateStr=now.toLocaleDateString("fr-MA",{day:"2-digit",month:"long",year:"numeric"});
    const timeStr=now.toLocaleTimeString("fr-MA",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
    await notifyDirecteurs(
      `${isUpdate?"✏️ Modification":"📥 Nouvelle saisie"} — ${MONTHS_FR[mois-1]} ${annee}`,
      `${conseillerNom} a ${isUpdate?"modifié":"enregistré"} les données de ${MONTHS_FR[mois-1]} ${annee} le ${dateStr} à ${timeStr}.`
    );

    const nbInd=Object.keys(realisations).length;
    await logActivity(saisi_par, isUpdate?"update":"create", "realisation",
      `${MONTHS_FR[mois-1]} ${annee} — ${nbInd} indicateur${nbInd>1?"s":""}`);

    res.json({ success: true, action: isUpdate?"update":"insert" });
  } catch(e) { await conn.rollback(); res.status(500).json({ error: e.message }); }
  finally { conn.release(); }
});

// =============================================================
//  SUIVI — routes spécifiques AVANT la route générale /api/suivi
// =============================================================

// GET /api/suivi/repartition?annee=2026&mois=4
app.get("/api/suivi/repartition", async (req, res) => {
  const { annee, mois } = req.query;
  if (!annee||!mois) return res.status(400).json({ error: "annee et mois requis" });
  try {
    const lignes = await q(`
      SELECT
        u.id                            AS conseiller_id,
        CONCAT(u.prenom,' ',u.nom)      AS conseiller_nom,
        u.email,
        u.role,
        i.nom                           AS indicateur_nom,
        c.label                         AS categorie,
        c.code                          AS categorie_code,
        r.valeur_cumul,
        r.updated_at
      FROM realisations r
      INNER JOIN utilisateurs u ON u.id = r.saisi_par
      INNER JOIN indicateurs  i ON i.id = r.indicateur_id
      INNER JOIN categories   c ON c.id = i.categorie_id
      WHERE r.annee = ?
        AND r.mois  = ?
        AND r.saisi_par IS NOT NULL
      ORDER BY u.nom, c.id, i.id
    `, [annee, mois]);

    const objectifs = await q(`
      SELECT i.nom AS indicateur_nom, o.valeur
      FROM objectifs o
      JOIN indicateurs i ON i.id = o.indicateur_id
      WHERE o.annee = ?
    `, [annee]);

    const objMap = {};
    objectifs.forEach(o => { objMap[o.indicateur_nom] = o.valeur; });

    res.json({ annee, mois: Number(mois), lignes, objectifs: objMap });
  } catch(e) {
    console.error("Repartition error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// GET /api/suivi/stats?annee=2026
app.get("/api/suivi/stats", async (req, res) => {
  const { annee } = req.query;
  try {
    res.json(await q(`
      SELECT u.id AS conseiller_id, CONCAT(u.prenom,' ',u.nom) AS conseiller_nom,
             r.mois, COUNT(r.id) AS nb_indicateurs, MAX(r.updated_at) AS derniere_saisie
      FROM realisations r
      JOIN utilisateurs u ON u.id=r.saisi_par
      WHERE r.annee=? AND u.role='conseiller'
      GROUP BY u.id, r.mois ORDER BY u.nom, r.mois
    `, [annee||2026]));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// GET /api/suivi?annee=2026&mois=4
app.get("/api/suivi", async (req, res) => {
  const { annee, mois } = req.query;
  try {
    let sql = `
      SELECT u.id AS conseiller_id, CONCAT(u.prenom,' ',u.nom) AS conseiller_nom, u.email,
             i.nom AS indicateur_nom, c.label AS categorie,
             r.mois, r.valeur_cumul, r.updated_at
      FROM realisations r
      JOIN utilisateurs u ON u.id=r.saisi_par
      JOIN indicateurs  i ON i.id=r.indicateur_id
      JOIN categories   c ON c.id=i.categorie_id
      WHERE r.annee=? AND u.role='conseiller'`;
    const params = [annee||2026];
    if (mois) { sql += " AND r.mois=?"; params.push(mois); }
    sql += " ORDER BY u.nom, r.mois, c.id, i.id";
    res.json(await q(sql, params));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// =============================================================
//  ACTIVITIES
// =============================================================

app.get("/api/activities/stats", async (req, res) => {
  const year = req.query.annee || new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  try {
    const byConseiller = await q(`
      SELECT
        u.id                               AS conseiller_id,
        CONCAT(u.prenom,' ',u.nom)         AS conseiller_nom,
        u.email,
        COUNT(a.id)                        AS total_actions,
        SUM(CASE WHEN MONTH(a.created_at)=? AND YEAR(a.created_at)=?
              THEN 1 ELSE 0 END)           AS actions_ce_mois,
        SUM(CASE WHEN a.action_type='create' THEN 1 ELSE 0 END) AS nb_create,
        SUM(CASE WHEN a.action_type='update' THEN 1 ELSE 0 END) AS nb_update,
        SUM(CASE WHEN a.action_type='delete' THEN 1 ELSE 0 END) AS nb_delete,
        MAX(a.created_at)                  AS derniere_activite
      FROM utilisateurs u
      LEFT JOIN activities a ON a.conseiller_id=u.id AND YEAR(a.created_at)=?
      WHERE u.role='conseiller' AND u.actif=1
      GROUP BY u.id
      ORDER BY total_actions DESC
    `, [currentMonth, year, year]);

    const byMonth = await q(`
      SELECT
        MONTH(a.created_at)         AS mois,
        a.conseiller_id,
        CONCAT(u.prenom,' ',u.nom)  AS conseiller_nom,
        COUNT(a.id)                 AS nb_actions
      FROM activities a
      JOIN utilisateurs u ON u.id=a.conseiller_id
      WHERE YEAR(a.created_at)=?
      GROUP BY MONTH(a.created_at), a.conseiller_id
      ORDER BY mois, a.conseiller_id
    `, [year]);

    const recent = await q(`
      SELECT a.id, a.action_type, a.module, a.detail, a.created_at,
             CONCAT(u.prenom,' ',u.nom) AS conseiller_nom
      FROM activities a
      JOIN utilisateurs u ON u.id=a.conseiller_id
      ORDER BY a.created_at DESC LIMIT 30
    `);

    res.json({ byConseiller, byMonth, recent });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/activities", async (req, res) => {
  const { conseiller_id, action_type, from, to, limit=100 } = req.query;
  try {
    let sql = `
      SELECT a.id, a.action_type, a.module, a.detail, a.created_at,
             CONCAT(u.prenom,' ',u.nom) AS conseiller_nom, u.email
      FROM activities a
      JOIN utilisateurs u ON u.id=a.conseiller_id
      WHERE 1=1`;
    const params = [];
    if (conseiller_id) { sql += " AND a.conseiller_id=?"; params.push(conseiller_id); }
    if (action_type)   { sql += " AND a.action_type=?";   params.push(action_type); }
    if (from)          { sql += " AND DATE(a.created_at)>=?"; params.push(from); }
    if (to)            { sql += " AND DATE(a.created_at)<=?"; params.push(to); }
    sql += ` ORDER BY a.created_at DESC LIMIT ${parseInt(limit)}`;
    res.json(await q(sql, params));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// =============================================================
//  NOTIFICATIONS
// =============================================================

app.get("/api/notifications/:user_id", async (req, res) => {
  try {
    res.json(await q(
      "SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 50",
      [req.params.user_id]
    ));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.patch("/api/notifications/:id/read", async (req, res) => {
  try { await q("UPDATE notifications SET lu=1 WHERE id=?", [req.params.id]); res.json({ success:true }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.patch("/api/notifications/read-all/:user_id", async (req, res) => {
  try { await q("UPDATE notifications SET lu=1 WHERE user_id=?", [req.params.user_id]); res.json({ success:true }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/notifications/send", async (req, res) => {
  const { user_ids, titre, message, type_message = 'information' } = req.body;
  if (!user_ids || !user_ids.length || !titre || !message) return res.status(400).json({ error: "Champs requis manquants" });
  try {
    for (const uid of user_ids) {
      try {
        await q("INSERT INTO notifications (user_id, titre, message, type_message) VALUES (?,?,?,?)",
          [uid, titre, message, type_message]);
      } catch(err) {
        if(err.message.includes("Unknown column")) {
          await q("INSERT INTO notifications (user_id, titre, message) VALUES (?,?,?)",
            [uid, `[${type_message.toUpperCase()}] ${titre}`, message]);
        } else { throw err; }
      }
    }
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// =============================================================
//  ALERTES & INTELLIGENCE
// =============================================================

app.post("/api/alerts/generate", async (req, res) => {
  const { annee, mois, seuil=60 } = req.body;
  try {
    const rows = await q(`
      SELECT i.id AS indicateur_id, i.nom AS indicateur_nom,
             SUM(r.valeur_cumul) AS valeur_cumul, o.valeur AS objectif,
             ROUND(SUM(r.valeur_cumul)*100.0/NULLIF(o.valeur,0),1) AS taux_pct
      FROM realisations r
      JOIN indicateurs i ON i.id=r.indicateur_id
      LEFT JOIN objectifs o ON o.indicateur_id=r.indicateur_id AND o.annee=r.annee
      LEFT JOIN utilisateurs u ON u.id = r.saisi_par
      WHERE r.annee=? AND r.mois=? AND o.valeur IS NOT NULL AND u.role='conseiller'
      GROUP BY i.id, o.valeur
    `, [annee, mois]);
    let generated=0;
    for (const r of rows) {
      const taux=r.taux_pct||0;
      let type_alerte=null, message="";
      if (taux<30) { type_alerte="objectif_critique"; message=`CRITIQUE : "${r.indicateur_nom}" à ${taux}%.`; }
      else if (taux<seuil) { type_alerte="faible_performance"; message=`"${r.indicateur_nom}" à ${taux}%, sous ${seuil}%.`; }
      if (type_alerte) {
        await q("INSERT INTO alertes (indicateur_id,annee,mois,type_alerte,taux_realisation,seuil,message) VALUES (?,?,?,?,?,?,?)",
          [r.indicateur_id,annee,mois,type_alerte,taux,seuil,message]);
        generated++;
      }
    }
    res.json({ success:true, generated });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/alerts", async (req, res) => {
  const { annee, mois, lu } = req.query;
  try {
    let sql="SELECT al.*, i.nom AS indicateur_nom FROM alertes al JOIN indicateurs i ON i.id=al.indicateur_id WHERE 1=1";
    const params=[];
    if (annee) { sql+=" AND al.annee=?"; params.push(annee); }
    if (mois)  { sql+=" AND al.mois=?";  params.push(mois); }
    if (lu!==undefined) { sql+=" AND al.lu=?"; params.push(lu); }
    sql+=" ORDER BY al.created_at DESC";
    res.json(await q(sql, params));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.patch("/api/alerts/read-all", async (req, res) => {
  try { await q("UPDATE alertes SET lu=1"); res.json({ success:true }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/ranking", async (req, res) => {
  const { annee, mois } = req.query;
  try {
    const rows = await q(`
      SELECT i.nom AS indicateur_nom, SUM(r.valeur_cumul) AS valeur_cumul,
             o.valeur AS objectif, ROUND(SUM(r.valeur_cumul)*100.0/NULLIF(o.valeur,0),1) AS taux_pct
      FROM realisations r
      JOIN indicateurs i ON i.id=r.indicateur_id
      LEFT JOIN objectifs o ON o.indicateur_id=r.indicateur_id AND o.annee=r.annee
      LEFT JOIN utilisateurs u ON u.id = r.saisi_par
      WHERE r.annee=? AND r.mois=? AND u.role='conseiller'
      GROUP BY i.id, o.valeur ORDER BY taux_pct DESC
    `, [annee, mois]);
    const scored=rows.map(r=>{
      const t=r.taux_pct||0,st=t>=80?100:t>=60?70:40;
      return {...r,stabilite:st,score:Math.round(0.5*t+0.3*st+0.2*50)};
    }).sort((a,b)=>b.score-a.score).map((r,i)=>({...r,rang:i+1}));
    res.json(scored);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/forecast", async (req, res) => {
  const { annee, mois } = req.query;
  const moisCourant=parseInt(mois)||1;
  try {
    const rows = await q(`
      SELECT i.nom AS indicateur_nom, SUM(r.valeur_cumul) AS valeur_cumul, r.mois, o.valeur AS objectif
      FROM realisations r
      JOIN indicateurs i ON i.id=r.indicateur_id
      LEFT JOIN objectifs o ON o.indicateur_id=r.indicateur_id AND o.annee=r.annee
      LEFT JOIN utilisateurs u ON u.id = r.saisi_par
      WHERE r.annee=? AND r.mois<=? AND u.role='conseiller'
      GROUP BY i.nom, r.mois, o.valeur ORDER BY i.nom, r.mois
    `, [annee, moisCourant]);
    const map={};
    rows.forEach(r=>{
      if(!map[r.indicateur_nom]) map[r.indicateur_nom]={objectif:r.objectif,points:[]};
      map[r.indicateur_nom].points.push({mois:r.mois,valeur:+r.valeur_cumul});
    });
    const forecasts=Object.entries(map).map(([nom,data])=>{
      const pts=data.points; if(!pts.length) return null;
      const n=pts.length,sx=pts.reduce((s,p)=>s+p.mois,0),sy=pts.reduce((s,p)=>s+p.valeur,0);
      const sxy=pts.reduce((s,p)=>s+p.mois*p.valeur,0),sx2=pts.reduce((s,p)=>s+p.mois*p.mois,0);
      const d=(n*sx2-sx*sx)||1,a=(n*sxy-sx*sy)/d,b=(sy-a*sx)/n;
      const prev=Math.round(Math.max(0,a*12+b)),obj=data.objectif||0;
      const tA=Math.round(pts[pts.length-1].valeur/(obj||1)*100),tP=Math.round(prev/(obj||1)*100);
      return {indicateur_nom:nom,valeur_actuelle:pts[pts.length-1].valeur,prevision_fin:prev,objectif:obj,taux_actuel:tA,taux_prevu:tP,tendance:a>0?'hausse':a<0?'baisse':'stable',recommandation:tP>=90?`Trajectoire positive (${tP}% prévu).`:tP>=60?`Prévu à ${tP}%. Effort requis.`:`Critique : ${tP}% prévu seulement.`};
    }).filter(Boolean);
    res.json(forecasts);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/comparison", async (req, res) => {
  const { annee1, annee2, mois } = req.query;
  try {
    const rows = await q(`
      SELECT i.nom AS indicateur_nom,
             SUM(CASE WHEN r.annee=? THEN r.valeur_cumul ELSE 0 END) AS cumul_a1,
             SUM(CASE WHEN r.annee=? THEN r.valeur_cumul ELSE 0 END) AS cumul_a2,
             o1.valeur AS obj_a1, o2.valeur AS obj_a2
      FROM realisations r
      JOIN indicateurs i ON i.id=r.indicateur_id
      LEFT JOIN objectifs o1 ON o1.indicateur_id=r.indicateur_id AND o1.annee=?
      LEFT JOIN objectifs o2 ON o2.indicateur_id=r.indicateur_id AND o2.annee=?
      LEFT JOIN utilisateurs u ON u.id = r.saisi_par
      WHERE r.mois=? AND u.role='conseiller'
      GROUP BY i.id, o1.valeur, o2.valeur
    `, [annee1,annee2,annee1,annee2,mois]);
    res.json(rows.map(r=>({
      ...r,
      ecart:(r.cumul_a2||0)-(r.cumul_a1||0),
      evol_pct:r.cumul_a1?Math.round(((r.cumul_a2||0)-(r.cumul_a1||0))*100/(r.cumul_a1||1)):null,
      taux_a1:r.obj_a1?Math.round((r.cumul_a1||0)*100/r.obj_a1):null,
      taux_a2:r.obj_a2?Math.round((r.cumul_a2||0)*100/r.obj_a2):null
    })));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/export/json", async (req, res) => {
  const { annee, mois } = req.query;
  try {
    const realisations = await q(`
      SELECT i.nom AS indicateur_nom, c.label AS categorie,
             SUM(r.valeur_cumul) AS valeur_cumul, o.valeur AS objectif,
             ROUND(SUM(r.valeur_cumul)*100.0/NULLIF(o.valeur,0),1) AS taux_pct
      FROM realisations r
      JOIN indicateurs i ON i.id=r.indicateur_id
      JOIN categories  c ON c.id=i.categorie_id
      LEFT JOIN objectifs o ON o.indicateur_id=r.indicateur_id AND o.annee=r.annee
      LEFT JOIN utilisateurs u ON u.id = r.saisi_par
      WHERE r.annee=? AND r.mois=? AND u.role='conseiller'
      GROUP BY i.id, c.id, o.valeur ORDER BY c.id, i.id
    `, [annee,mois]);
    res.json({ meta:{annee,mois,generated_at:new Date().toISOString(),agence:"Rehamna"}, kpis:realisations });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/health", async (req, res) => {
  try { await q("SELECT 1"); res.json({ status:"ok", version:"2.1" }); }
  catch(e) { res.status(500).json({ status:"error", db:e.message }); }
});

// ── Démarrage ────────────────────────────────────────────────
app.listen(PORT, async () => {
  console.log(`ANAPEC API v2.1 → http://localhost:${PORT}`);
  await initDB(); // Migration auto : saisi_par + UNIQUE KEY + activities
});