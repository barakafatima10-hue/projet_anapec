require("dotenv").config();
const mysql = require("mysql2/promise");

async function run() {
  const pool = mysql.createPool({
    host:     process.env.DB_HOST     || "localhost",
    port:     process.env.DB_PORT     || 3306,
    user:     process.env.DB_USER     || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME     || "anapec_tdb",
  });

  try {
    console.log("Creating dedicated index for indicateur_id...");
    await pool.execute("CREATE INDEX idx_fk_indicateur ON realisations(indicateur_id)");
    console.log("Created index idx_fk_indicateur");
  } catch (e) {
    console.log("Index might already exist:", e.message);
  }

  try {
    console.log("Attempting to drop uq_real...");
    await pool.execute("ALTER TABLE realisations DROP INDEX uq_real");
    console.log("SUCCESS: uq_real dropped.");
  } catch (e) {
    console.log("FAILED to drop uq_real:", e.message);
  }

  process.exit(0);
}

run();
