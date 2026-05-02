-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: anapec_tdb
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activities`
--

DROP TABLE IF EXISTS `activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `conseiller_id` int(11) NOT NULL,
  `action_type` enum('create','update','delete') NOT NULL,
  `module` varchar(80) NOT NULL DEFAULT 'realisation',
  `detail` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_act_conseiller` (`conseiller_id`),
  KEY `idx_act_date` (`created_at`),
  CONSTRAINT `fk_act_user_init` FOREIGN KEY (`conseiller_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activities`
--

LOCK TABLES `activities` WRITE;
/*!40000 ALTER TABLE `activities` DISABLE KEYS */;
INSERT INTO `activities` (`id`, `conseiller_id`, `action_type`, `module`, `detail`, `created_at`) VALUES (1,3,'create','realisation','Avril 2026 ÔÇö 20 indicateurs','2026-04-26 00:35:42'),(3,3,'update','realisation','Avril 2026 ÔÇö 14 indicateurs','2026-04-27 00:27:32'),(5,3,'update','realisation','Avril 2026 ÔÇö 14 indicateurs','2026-04-27 00:36:16'),(7,3,'create','realisation','Avril 2026 ÔÇö 13 indicateurs','2026-04-27 09:39:29'),(9,3,'create','realisation','Avril 2026 ÔÇö 13 indicateurs','2026-04-27 09:55:36'),(11,3,'create','realisation','Avril 2026 ÔÇö 13 indicateurs','2026-04-27 09:56:15'),(12,3,'update','realisation','Avril 2026 ÔÇö 8 indicateurs','2026-04-27 10:11:55'),(14,3,'update','realisation','Avril 2026 ÔÇö 15 indicateurs','2026-04-27 10:36:34'),(16,1,'create','realisation','Avril 2026 ÔÇö 14 indicateurs','2026-04-27 11:02:43'),(17,3,'update','realisation','Avril 2026 ÔÇö 17 indicateurs','2026-04-27 12:33:39'),(19,1,'update','realisation','Avril 2026 ÔÇö 1 indicateur','2026-04-28 06:25:33'),(20,1,'update','realisation','Avril 2026 ÔÇö 1 indicateur','2026-04-28 06:32:48'),(21,5,'create','realisation','Avril 2026 ÔÇö 11 indicateurs','2026-04-28 06:34:43'),(22,1,'update','realisation','Avril 2026 ÔÇö 1 indicateur','2026-04-28 06:41:32'),(23,3,'update','realisation','Avril 2026 ÔÇö 22 indicateurs','2026-04-29 09:08:31'),(24,3,'update','realisation','Avril 2026 ÔÇö 22 indicateurs','2026-04-29 09:13:52'),(25,1,'update','realisation','Avril 2026 ÔÇö 1 indicateur','2026-04-29 09:15:37'),(26,1,'update','realisation','Avril 2026 ÔÇö 1 indicateur','2026-04-29 09:17:53'),(27,3,'update','realisation','Avril 2026 ÔÇö 22 indicateurs','2026-04-29 09:26:09'),(28,3,'update','realisation','Avril 2026 ÔÇö 22 indicateurs','2026-04-29 09:36:23'),(29,5,'update','realisation','Avril 2026 ÔÇö 5 indicateurs','2026-04-29 09:37:09'),(30,1,'update','realisation','Avril 2026 ÔÇö 1 indicateur','2026-04-29 09:37:43'),(31,1,'update','realisation','Avril 2026 ÔÇö 1 indicateur','2026-04-29 09:46:44'),(32,1,'update','realisation','Avril 2026 ÔÇö 1 indicateur','2026-04-29 12:35:15'),(33,1,'update','realisation','Avril 2026 ÔÇö 1 indicateur','2026-04-29 12:35:17'),(34,3,'update','realisation','Avril 2026 ÔÇö 1 indicateur','2026-04-29 12:36:19'),(35,5,'update','realisation','Avril 2026 ÔÇö 1 indicateur','2026-04-29 12:38:13'),(36,3,'update','realisation','Avril 2026 ÔÇö 2 indicateurs','2026-04-29 12:52:42'),(37,5,'update','realisation','Avril 2026 ÔÇö 1 indicateur','2026-04-29 12:53:00'),(38,5,'update','realisation','Avril 2026 ÔÇö 2 indicateurs','2026-04-29 20:18:18'),(39,3,'update','realisation','Avril 2026 ÔÇö 3 indicateurs','2026-04-29 20:18:43'),(40,5,'update','realisation','Avril 2026 ÔÇö 2 indicateurs','2026-04-29 20:19:42'),(41,3,'update','realisation','Avril 2026 ÔÇö 3 indicateurs','2026-04-29 20:49:21'),(42,3,'update','realisation','Avril 2026 ÔÇö 3 indicateurs','2026-04-29 20:49:23'),(43,5,'update','realisation','Avril 2026 ÔÇö 2 indicateurs','2026-04-29 20:49:44'),(44,5,'update','realisation','Avril 2026 ÔÇö 3 indicateurs','2026-04-29 21:11:27'),(45,3,'update','realisation','Avril 2026 ÔÇö 3 indicateurs','2026-04-29 21:11:46'),(46,5,'update','realisation','Avril 2026 ÔÇö 3 indicateurs','2026-04-29 21:28:30'),(47,3,'update','realisation','Avril 2026 ÔÇö 3 indicateurs','2026-04-29 21:28:50'),(48,5,'update','realisation','Avril 2026 ÔÇö 3 indicateurs','2026-04-29 21:37:41'),(49,3,'update','realisation','Avril 2026 ÔÇö 3 indicateurs','2026-04-29 21:38:02'),(50,1,'update','realisation','Avril 2026 ÔÇö 20 indicateurs','2026-04-30 09:15:56'),(51,3,'update','realisation','Avril 2026 ÔÇö 27 indicateurs','2026-04-30 09:53:24'),(52,5,'create','realisation','Janvier 2026 ÔÇö 27 indicateurs','2026-04-30 10:01:54'),(53,5,'update','realisation','Janvier 2026 ÔÇö 27 indicateurs','2026-04-30 10:02:19'),(54,5,'update','realisation','Janvier 2026 ÔÇö 27 indicateurs','2026-04-30 10:02:38'),(55,5,'update','realisation','Janvier 2026 ÔÇö 27 indicateurs','2026-04-30 10:03:39'),(56,3,'create','realisation','Janvier 2026 ÔÇö 11 indicateurs','2026-04-30 10:04:05'),(57,5,'create','realisation','F├®vrier 2026 ÔÇö 13 indicateurs','2026-04-30 10:12:14'),(58,3,'create','realisation','F├®vrier 2026 ÔÇö 16 indicateurs','2026-04-30 10:17:10'),(59,3,'update','realisation','Janvier 2026 ÔÇö 14 indicateurs','2026-04-30 10:21:44'),(60,5,'update','realisation','F├®vrier 2026 ÔÇö 13 indicateurs','2026-04-30 10:24:02'),(61,3,'update','realisation','Janvier 2026 ÔÇö 14 indicateurs','2026-04-30 10:24:45'),(62,3,'update','realisation','Janvier 2026 ÔÇö 14 indicateurs','2026-04-30 10:25:14'),(63,3,'update','realisation','Janvier 2026 ÔÇö 14 indicateurs','2026-04-30 10:25:14'),(64,5,'update','realisation','Janvier 2026 ÔÇö 12 indicateurs','2026-04-30 10:30:32'),(65,5,'update','realisation','Janvier 2026 ÔÇö 12 indicateurs','2026-04-30 10:32:47'),(66,3,'update','realisation','Janvier 2026 ÔÇö 11 indicateurs','2026-04-30 10:35:11'),(67,5,'update','realisation','Janvier 2026 ÔÇö 12 indicateurs','2026-04-30 10:35:15'),(68,5,'update','realisation','Janvier 2026 ÔÇö 26 indicateurs','2026-04-30 10:36:59'),(69,3,'update','realisation','Janvier 2026 ÔÇö 11 indicateurs','2026-04-30 10:37:59'),(70,5,'update','realisation','Janvier 2026 ÔÇö 26 indicateurs','2026-04-30 10:38:15'),(71,3,'update','realisation','Janvier 2026 ÔÇö 11 indicateurs','2026-04-30 10:40:07'),(72,5,'update','realisation','Janvier 2026 ÔÇö 26 indicateurs','2026-04-30 10:40:23'),(73,5,'update','realisation','Janvier 2026 ÔÇö 26 indicateurs','2026-04-30 10:45:46'),(74,5,'update','realisation','Janvier 2026 ÔÇö 26 indicateurs','2026-04-30 10:46:10'),(75,5,'update','realisation','Janvier 2026 ÔÇö 26 indicateurs','2026-04-30 10:46:30'),(76,3,'update','realisation','Janvier 2026 ÔÇö 12 indicateurs','2026-04-30 11:01:42'),(77,3,'update','realisation','Janvier 2026 ÔÇö 11 indicateurs','2026-04-30 11:02:09'),(78,5,'update','realisation','Janvier 2026 ÔÇö 11 indicateurs','2026-04-30 11:09:16'),(79,5,'update','realisation','Janvier 2026 ÔÇö 11 indicateurs','2026-04-30 11:10:51'),(80,3,'update','realisation','Janvier 2026 ÔÇö 11 indicateurs','2026-04-30 11:11:05'),(81,5,'update','realisation','Janvier 2026 ÔÇö 11 indicateurs','2026-04-30 11:23:29'),(82,3,'update','realisation','Avril 2026 ÔÇö 10 indicateurs','2026-04-30 11:24:57'),(83,3,'update','realisation','Avril 2026 ÔÇö 10 indicateurs','2026-04-30 11:25:49'),(84,5,'update','realisation','Janvier 2026 ÔÇö 11 indicateurs','2026-04-30 11:34:33'),(85,3,'update','realisation','Avril 2026 ÔÇö 10 indicateurs','2026-04-30 11:35:25'),(86,3,'update','realisation','Avril 2026 ÔÇö 1 indicateur','2026-04-30 11:40:54'),(87,3,'update','realisation','Avril 2026 ÔÇö 1 indicateur','2026-04-30 11:50:32'),(88,3,'update','realisation','Avril 2026 ÔÇö 1 indicateur','2026-04-30 11:50:32'),(89,5,'update','realisation','Janvier 2026 ÔÇö 11 indicateurs','2026-04-30 12:11:11'),(90,3,'update','realisation','Avril 2026 ÔÇö 10 indicateurs','2026-04-30 12:11:59'),(91,3,'update','realisation','Janvier 2026 ÔÇö 10 indicateurs','2026-04-30 12:12:56'),(92,5,'update','realisation','Janvier 2026 ÔÇö 11 indicateurs','2026-04-30 12:23:03'),(93,3,'update','realisation','Avril 2026 ÔÇö 10 indicateurs','2026-04-30 12:23:56'),(94,3,'update','realisation','Janvier 2026 ÔÇö 10 indicateurs','2026-04-30 12:25:14'),(95,3,'update','realisation','Janvier 2026 ÔÇö 27 indicateurs','2026-04-30 12:45:08'),(96,5,'update','realisation','Janvier 2026 ÔÇö 27 indicateurs','2026-04-30 12:48:59'),(97,1,'create','realisation','Janvier 2026 ÔÇö 27 indicateurs','2026-04-30 12:50:07'),(98,3,'update','realisation','F├®vrier 2026 ÔÇö 27 indicateurs','2026-04-30 13:20:18'),(99,5,'update','realisation','F├®vrier 2026 ÔÇö 27 indicateurs','2026-04-30 13:24:01'),(100,5,'update','realisation','F├®vrier 2026 ÔÇö 27 indicateurs','2026-04-30 13:25:47'),(101,1,'create','realisation','F├®vrier 2026 ÔÇö 27 indicateurs','2026-04-30 13:26:37');
/*!40000 ALTER TABLE `activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `label` varchar(100) NOT NULL,
  `couleur` varchar(10) NOT NULL DEFAULT '#185FA5',
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` (`id`, `code`, `label`, `couleur`) VALUES (1,'inscription','Inscription','#185FA5'),(2,'accompagnement','Accompagnement','#1D9E75'),(3,'insertion','Insertions','#D85A30'),(4,'entrepreneuriat','Entrepreneuriat','#BA7517'),(5,'international','Mobilit├® Internationale','#533AB7'),(6,'formation','Formation','#3B6D11'),(7,'employeurs','Employeurs','#993556');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `indicateurs`
--

DROP TABLE IF EXISTS `indicateurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `indicateurs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `categorie_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nom` (`nom`),
  KEY `fk_ind_cat` (`categorie_id`),
  CONSTRAINT `fk_ind_cat` FOREIGN KEY (`categorie_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `indicateurs`
--

LOCK TABLES `indicateurs` WRITE;
/*!40000 ALTER TABLE `indicateurs` DISABLE KEYS */;
INSERT INTO `indicateurs` (`id`, `nom`, `categorie_id`) VALUES (1,'Inscription des Chercheurs d\'Emploi',1),(2,'Entretien de Positionnement',2),(3,'Ateliers de recherche d\'emploi',2),(4,'IDMAJ (hors PI) & TAHFIZ',3),(5,'CIA',3),(6,'CDC',3),(7,'TAHFIZ',3),(8,'PCS',3),(9,'Insertion via Placement ├á l\'International',3),(10,'Insertion via l\'entreprenariat',3),(11,'Accompagnement des Porteurs de Projet',4),(12,'Cr├®ation D\'Entreprises',4),(13,'TPE accompagn├®es techniquement avec renforcement des capacit├®s',4),(14,'Auto Entrepreneurs appuy├®s',4),(15,'UEI promues ├á l\'autoentrepreneuriat & appuy├®es ├á la formalisation',4),(16,'Nombre de candidats ins├®r├®s (d├®part effectif)',5),(17,'Nombre de travailleur saisonniers agricoles accompagn├®s (ateliers d\'appui, sensibilisation, information, ÔÇª)',5),(18,'Nombre de b├®n├®ficiaires de prestations d\'accompagnement ├á la mobilit├® internationale autre que les ouvriers agricoles (ateliers, entretiens,  ..)',5),(19,'Nombre de candidats pr├® s├®lectionn├®s autres que les ouvriers agricoles',5),(20,'Nombre de candidats pr├® s├®lectionn├®s dans le cadre de recrutement des ├®trangers',5),(21,'TAEHIL',6),(22,'Formation Secteurs Emergents',6),(23,'Formations partenariales',6),(24,'Effectif Postes ├á pourvoir',7),(25,'Nbre d\'employeurs contact├®s',7),(26,'Nbre de nouveau clients',7),(27,'Nbre d\'employeur b├®n├®ficiaire',7);
/*!40000 ALTER TABLE `indicateurs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `titre` varchar(150) NOT NULL,
  `message` text NOT NULL,
  `lu` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `type_message` varchar(50) DEFAULT 'information',
  PRIMARY KEY (`id`),
  KEY `idx_notif_user` (`user_id`),
  CONSTRAINT `fk_notif_user` FOREIGN KEY (`user_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` (`id`, `user_id`, `titre`, `message`, `lu`, `created_at`, `type_message`) VALUES (1,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','yassine folane a modifi├® les donn├®es de Avril 2026 le 27 avril 2026 ├á 11:36:34.',1,'2026-04-27 10:36:34','information'),(2,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','salma imrane a modifi├® les donn├®es de Avril 2026 le 27 avril 2026 ├á 11:37:28.',1,'2026-04-27 10:37:28','information'),(3,3,'r├®union','vous avez une r├®union',1,'2026-04-27 10:39:43','urgente'),(5,1,'­ƒôÑ Nouvelle saisie ÔÇö Avril 2026','Soufiane El ghzale a enregistr├® les donn├®es de Avril 2026 le 27 avril 2026 ├á 12:02:43.',1,'2026-04-27 11:02:43','information'),(6,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','yassine folane a modifi├® les donn├®es de Avril 2026 le 27 avril 2026 ├á 13:33:39.',1,'2026-04-27 12:33:39','information'),(7,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','salma imrane a modifi├® les donn├®es de Avril 2026 le 27 avril 2026 ├á 13:34:26.',1,'2026-04-27 12:34:26','information'),(8,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','Soufiane El ghzale a modifi├® les donn├®es de Avril 2026 le 28 avril 2026 ├á 07:25:33.',1,'2026-04-28 06:25:33','information'),(9,3,'rappel','rappel',1,'2026-04-28 06:28:40','information'),(11,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','Soufiane El ghzale a modifi├® les donn├®es de Avril 2026 le 28 avril 2026 ├á 07:32:48.',1,'2026-04-28 06:32:48','information'),(12,1,'­ƒôÑ Nouvelle saisie ÔÇö Avril 2026','salma Imrane a enregistr├® les donn├®es de Avril 2026 le 28 avril 2026 ├á 07:34:43.',0,'2026-04-28 06:34:43','information'),(13,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','Soufiane El ghzale a modifi├® les donn├®es de Avril 2026 le 28 avril 2026 ├á 07:41:32.',0,'2026-04-28 06:41:32','information'),(14,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','yassine folane a modifi├® les donn├®es de Avril 2026 le 29 avril 2026 ├á 10:08:31.',0,'2026-04-29 09:08:31','information'),(15,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','yassine folane a modifi├® les donn├®es de Avril 2026 le 29 avril 2026 ├á 10:13:52.',0,'2026-04-29 09:13:52','information'),(16,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','Soufiane El ghzale a modifi├® les donn├®es de Avril 2026 le 29 avril 2026 ├á 10:15:37.',0,'2026-04-29 09:15:37','information'),(17,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','Soufiane El ghzale a modifi├® les donn├®es de Avril 2026 le 29 avril 2026 ├á 10:17:53.',0,'2026-04-29 09:17:53','information'),(18,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','yassine folane a modifi├® les donn├®es de Avril 2026 le 29 avril 2026 ├á 10:26:09.',0,'2026-04-29 09:26:09','information'),(19,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','yassine folane a modifi├® les donn├®es de Avril 2026 le 29 avril 2026 ├á 10:36:23.',0,'2026-04-29 09:36:23','information'),(20,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','salma Imrane a modifi├® les donn├®es de Avril 2026 le 29 avril 2026 ├á 10:37:09.',0,'2026-04-29 09:37:09','information'),(21,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','Soufiane El ghzale a modifi├® les donn├®es de Avril 2026 le 29 avril 2026 ├á 10:37:43.',0,'2026-04-29 09:37:43','information'),(22,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','Soufiane El ghzale a modifi├® les donn├®es de Avril 2026 le 29 avril 2026 ├á 10:46:44.',0,'2026-04-29 09:46:44','information'),(23,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','Soufiane El ghzale a modifi├® les donn├®es de Avril 2026 le 29 avril 2026 ├á 13:35:15.',0,'2026-04-29 12:35:15','information'),(24,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','Soufiane El ghzale a modifi├® les donn├®es de Avril 2026 le 29 avril 2026 ├á 13:35:17.',0,'2026-04-29 12:35:17','information'),(25,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','yassine folane a modifi├® les donn├®es de Avril 2026 le 29 avril 2026 ├á 13:36:19.',0,'2026-04-29 12:36:19','information'),(26,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','salma Imrane a modifi├® les donn├®es de Avril 2026 le 29 avril 2026 ├á 13:38:13.',0,'2026-04-29 12:38:13','information'),(27,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','yassine folane a modifi├® les donn├®es de Avril 2026 le 29 avril 2026 ├á 13:52:42.',0,'2026-04-29 12:52:42','information'),(28,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','salma Imrane a modifi├® les donn├®es de Avril 2026 le 29 avril 2026 ├á 13:53:00.',0,'2026-04-29 12:53:00','information'),(29,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','salma Imrane a modifi├® les donn├®es de Avril 2026 le 29 avril 2026 ├á 21:18:18.',0,'2026-04-29 20:18:18','information'),(30,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','yassine folane a modifi├® les donn├®es de Avril 2026 le 29 avril 2026 ├á 21:18:43.',0,'2026-04-29 20:18:43','information'),(31,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','salma Imrane a modifi├® les donn├®es de Avril 2026 le 29 avril 2026 ├á 21:19:42.',0,'2026-04-29 20:19:42','information'),(32,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','yassine folane a modifi├® les donn├®es de Avril 2026 le 29 avril 2026 ├á 21:49:21.',0,'2026-04-29 20:49:21','information'),(33,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','yassine folane a modifi├® les donn├®es de Avril 2026 le 29 avril 2026 ├á 21:49:23.',0,'2026-04-29 20:49:23','information'),(34,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','salma Imrane a modifi├® les donn├®es de Avril 2026 le 29 avril 2026 ├á 21:49:44.',0,'2026-04-29 20:49:44','information'),(35,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','salma Imrane a modifi├® les donn├®es de Avril 2026 le 29 avril 2026 ├á 22:11:27.',0,'2026-04-29 21:11:27','information'),(36,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','yassine folane a modifi├® les donn├®es de Avril 2026 le 29 avril 2026 ├á 22:11:46.',0,'2026-04-29 21:11:46','information'),(37,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','salma Imrane a modifi├® les donn├®es de Avril 2026 le 29 avril 2026 ├á 22:28:30.',0,'2026-04-29 21:28:30','information'),(38,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','yassine folane a modifi├® les donn├®es de Avril 2026 le 29 avril 2026 ├á 22:28:50.',0,'2026-04-29 21:28:50','information'),(39,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','salma Imrane a modifi├® les donn├®es de Avril 2026 le 29 avril 2026 ├á 22:37:41.',0,'2026-04-29 21:37:41','information'),(40,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','yassine folane a modifi├® les donn├®es de Avril 2026 le 29 avril 2026 ├á 22:38:02.',0,'2026-04-29 21:38:02','information'),(41,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','Soufiane El ghzale a modifi├® les donn├®es de Avril 2026 le 30 avril 2026 ├á 10:15:56.',0,'2026-04-30 09:15:56','information'),(42,3,'INFO','BONJOUR',0,'2026-04-30 09:19:50','information'),(43,5,'INFO','BONJOUR',0,'2026-04-30 09:19:50','information'),(44,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','yassine folane a modifi├® les donn├®es de Avril 2026 le 30 avril 2026 ├á 10:53:24.',0,'2026-04-30 09:53:24','information'),(45,1,'­ƒôÑ Nouvelle saisie ÔÇö Janvier 2026','salma Imrane a enregistr├® les donn├®es de Janvier 2026 le 30 avril 2026 ├á 11:01:54.',0,'2026-04-30 10:01:54','information'),(46,1,'Ô£Å´©Å Modification ÔÇö Janvier 2026','salma Imrane a modifi├® les donn├®es de Janvier 2026 le 30 avril 2026 ├á 11:02:19.',0,'2026-04-30 10:02:19','information'),(47,1,'Ô£Å´©Å Modification ÔÇö Janvier 2026','salma Imrane a modifi├® les donn├®es de Janvier 2026 le 30 avril 2026 ├á 11:02:38.',0,'2026-04-30 10:02:38','information'),(48,1,'Ô£Å´©Å Modification ÔÇö Janvier 2026','salma Imrane a modifi├® les donn├®es de Janvier 2026 le 30 avril 2026 ├á 11:03:39.',0,'2026-04-30 10:03:39','information'),(49,1,'­ƒôÑ Nouvelle saisie ÔÇö Janvier 2026','yassine folane a enregistr├® les donn├®es de Janvier 2026 le 30 avril 2026 ├á 11:04:05.',0,'2026-04-30 10:04:05','information'),(50,1,'­ƒôÑ Nouvelle saisie ÔÇö F├®vrier 2026','salma Imrane a enregistr├® les donn├®es de F├®vrier 2026 le 30 avril 2026 ├á 11:12:14.',0,'2026-04-30 10:12:14','information'),(51,1,'­ƒôÑ Nouvelle saisie ÔÇö F├®vrier 2026','yassine folane a enregistr├® les donn├®es de F├®vrier 2026 le 30 avril 2026 ├á 11:17:10.',0,'2026-04-30 10:17:10','information'),(52,1,'Ô£Å´©Å Modification ÔÇö Janvier 2026','yassine folane a modifi├® les donn├®es de Janvier 2026 le 30 avril 2026 ├á 11:21:44.',0,'2026-04-30 10:21:44','information'),(53,1,'Ô£Å´©Å Modification ÔÇö F├®vrier 2026','salma Imrane a modifi├® les donn├®es de F├®vrier 2026 le 30 avril 2026 ├á 11:24:02.',0,'2026-04-30 10:24:02','information'),(54,1,'Ô£Å´©Å Modification ÔÇö Janvier 2026','yassine folane a modifi├® les donn├®es de Janvier 2026 le 30 avril 2026 ├á 11:24:45.',0,'2026-04-30 10:24:45','information'),(55,1,'Ô£Å´©Å Modification ÔÇö Janvier 2026','yassine folane a modifi├® les donn├®es de Janvier 2026 le 30 avril 2026 ├á 11:25:14.',0,'2026-04-30 10:25:14','information'),(56,1,'Ô£Å´©Å Modification ÔÇö Janvier 2026','yassine folane a modifi├® les donn├®es de Janvier 2026 le 30 avril 2026 ├á 11:25:14.',0,'2026-04-30 10:25:14','information'),(57,1,'Ô£Å´©Å Modification ÔÇö Janvier 2026','salma Imrane a modifi├® les donn├®es de Janvier 2026 le 30 avril 2026 ├á 11:30:32.',0,'2026-04-30 10:30:32','information'),(58,1,'Ô£Å´©Å Modification ÔÇö Janvier 2026','salma Imrane a modifi├® les donn├®es de Janvier 2026 le 30 avril 2026 ├á 11:32:47.',0,'2026-04-30 10:32:47','information'),(59,1,'Ô£Å´©Å Modification ÔÇö Janvier 2026','yassine folane a modifi├® les donn├®es de Janvier 2026 le 30 avril 2026 ├á 11:35:11.',0,'2026-04-30 10:35:11','information'),(60,1,'Ô£Å´©Å Modification ÔÇö Janvier 2026','salma Imrane a modifi├® les donn├®es de Janvier 2026 le 30 avril 2026 ├á 11:35:15.',0,'2026-04-30 10:35:15','information'),(61,1,'Ô£Å´©Å Modification ÔÇö Janvier 2026','salma Imrane a modifi├® les donn├®es de Janvier 2026 le 30 avril 2026 ├á 11:36:59.',0,'2026-04-30 10:36:59','information'),(62,1,'Ô£Å´©Å Modification ÔÇö Janvier 2026','yassine folane a modifi├® les donn├®es de Janvier 2026 le 30 avril 2026 ├á 11:37:59.',0,'2026-04-30 10:37:59','information'),(63,1,'Ô£Å´©Å Modification ÔÇö Janvier 2026','salma Imrane a modifi├® les donn├®es de Janvier 2026 le 30 avril 2026 ├á 11:38:15.',0,'2026-04-30 10:38:15','information'),(64,1,'Ô£Å´©Å Modification ÔÇö Janvier 2026','yassine folane a modifi├® les donn├®es de Janvier 2026 le 30 avril 2026 ├á 11:40:07.',0,'2026-04-30 10:40:07','information'),(65,1,'Ô£Å´©Å Modification ÔÇö Janvier 2026','salma Imrane a modifi├® les donn├®es de Janvier 2026 le 30 avril 2026 ├á 11:40:23.',0,'2026-04-30 10:40:23','information'),(66,1,'Ô£Å´©Å Modification ÔÇö Janvier 2026','salma Imrane a modifi├® les donn├®es de Janvier 2026 le 30 avril 2026 ├á 11:45:46.',0,'2026-04-30 10:45:46','information'),(67,1,'Ô£Å´©Å Modification ÔÇö Janvier 2026','salma Imrane a modifi├® les donn├®es de Janvier 2026 le 30 avril 2026 ├á 11:46:10.',0,'2026-04-30 10:46:10','information'),(68,1,'Ô£Å´©Å Modification ÔÇö Janvier 2026','salma Imrane a modifi├® les donn├®es de Janvier 2026 le 30 avril 2026 ├á 11:46:30.',0,'2026-04-30 10:46:30','information'),(69,1,'Ô£Å´©Å Modification ÔÇö Janvier 2026','yassine folane a modifi├® les donn├®es de Janvier 2026 le 30 avril 2026 ├á 12:01:42.',0,'2026-04-30 11:01:42','information'),(70,1,'Ô£Å´©Å Modification ÔÇö Janvier 2026','yassine folane a modifi├® les donn├®es de Janvier 2026 le 30 avril 2026 ├á 12:02:09.',0,'2026-04-30 11:02:09','information'),(71,1,'Ô£Å´©Å Modification ÔÇö Janvier 2026','salma Imrane a modifi├® les donn├®es de Janvier 2026 le 30 avril 2026 ├á 12:09:16.',0,'2026-04-30 11:09:16','information'),(72,1,'Ô£Å´©Å Modification ÔÇö Janvier 2026','salma Imrane a modifi├® les donn├®es de Janvier 2026 le 30 avril 2026 ├á 12:10:51.',0,'2026-04-30 11:10:51','information'),(73,1,'Ô£Å´©Å Modification ÔÇö Janvier 2026','yassine folane a modifi├® les donn├®es de Janvier 2026 le 30 avril 2026 ├á 12:11:05.',0,'2026-04-30 11:11:05','information'),(74,1,'Ô£Å´©Å Modification ÔÇö Janvier 2026','salma Imrane a modifi├® les donn├®es de Janvier 2026 le 30 avril 2026 ├á 12:23:29.',0,'2026-04-30 11:23:29','information'),(75,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','yassine folane a modifi├® les donn├®es de Avril 2026 le 30 avril 2026 ├á 12:24:57.',0,'2026-04-30 11:24:57','information'),(76,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','yassine folane a modifi├® les donn├®es de Avril 2026 le 30 avril 2026 ├á 12:25:49.',0,'2026-04-30 11:25:49','information'),(77,1,'Ô£Å´©Å Modification ÔÇö Janvier 2026','salma Imrane a modifi├® les donn├®es de Janvier 2026 le 30 avril 2026 ├á 12:34:33.',0,'2026-04-30 11:34:33','information'),(78,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','yassine folane a modifi├® les donn├®es de Avril 2026 le 30 avril 2026 ├á 12:35:25.',0,'2026-04-30 11:35:25','information'),(79,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','yassine folane a modifi├® les donn├®es de Avril 2026 le 30 avril 2026 ├á 12:40:54.',0,'2026-04-30 11:40:54','information'),(80,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','yassine folane a modifi├® les donn├®es de Avril 2026 le 30 avril 2026 ├á 12:50:32.',0,'2026-04-30 11:50:32','information'),(81,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','yassine folane a modifi├® les donn├®es de Avril 2026 le 30 avril 2026 ├á 12:50:32.',0,'2026-04-30 11:50:32','information'),(82,1,'Ô£Å´©Å Modification ÔÇö Janvier 2026','salma Imrane a modifi├® les donn├®es de Janvier 2026 le 30 avril 2026 ├á 13:11:11.',0,'2026-04-30 12:11:11','information'),(83,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','yassine folane a modifi├® les donn├®es de Avril 2026 le 30 avril 2026 ├á 13:11:59.',0,'2026-04-30 12:11:59','information'),(84,1,'Ô£Å´©Å Modification ÔÇö Janvier 2026','yassine folane a modifi├® les donn├®es de Janvier 2026 le 30 avril 2026 ├á 13:12:56.',0,'2026-04-30 12:12:56','information'),(85,1,'Ô£Å´©Å Modification ÔÇö Janvier 2026','salma Imrane a modifi├® les donn├®es de Janvier 2026 le 30 avril 2026 ├á 13:23:03.',0,'2026-04-30 12:23:03','information'),(86,1,'Ô£Å´©Å Modification ÔÇö Avril 2026','yassine folane a modifi├® les donn├®es de Avril 2026 le 30 avril 2026 ├á 13:23:56.',0,'2026-04-30 12:23:56','information'),(87,1,'Ô£Å´©Å Modification ÔÇö Janvier 2026','yassine folane a modifi├® les donn├®es de Janvier 2026 le 30 avril 2026 ├á 13:25:14.',0,'2026-04-30 12:25:14','information'),(88,1,'Ô£Å´©Å Modification ÔÇö Janvier 2026','yassine folane a modifi├® les donn├®es de Janvier 2026 le 30 avril 2026 ├á 13:45:08.',0,'2026-04-30 12:45:08','information'),(89,1,'Ô£Å´©Å Modification ÔÇö Janvier 2026','salma Imrane a modifi├® les donn├®es de Janvier 2026 le 30 avril 2026 ├á 13:48:59.',0,'2026-04-30 12:48:59','information'),(90,1,'­ƒôÑ Nouvelle saisie ÔÇö Janvier 2026','Soufiane El ghzale a enregistr├® les donn├®es de Janvier 2026 le 30 avril 2026 ├á 13:50:07.',0,'2026-04-30 12:50:07','information'),(91,1,'Ô£Å´©Å Modification ÔÇö F├®vrier 2026','yassine folane a modifi├® les donn├®es de F├®vrier 2026 le 30 avril 2026 ├á 14:20:18.',0,'2026-04-30 13:20:18','information'),(92,1,'Ô£Å´©Å Modification ÔÇö F├®vrier 2026','salma Imrane a modifi├® les donn├®es de F├®vrier 2026 le 30 avril 2026 ├á 14:24:01.',0,'2026-04-30 13:24:01','information'),(93,1,'Ô£Å´©Å Modification ÔÇö F├®vrier 2026','salma Imrane a modifi├® les donn├®es de F├®vrier 2026 le 30 avril 2026 ├á 14:25:47.',0,'2026-04-30 13:25:47','information'),(94,1,'­ƒôÑ Nouvelle saisie ÔÇö F├®vrier 2026','Soufiane El ghzale a enregistr├® les donn├®es de F├®vrier 2026 le 30 avril 2026 ├á 14:26:37.',0,'2026-04-30 13:26:37','information');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `objectifs`
--

DROP TABLE IF EXISTS `objectifs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `objectifs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `indicateur_id` int(11) NOT NULL,
  `annee` year(4) NOT NULL,
  `valeur` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_obj` (`indicateur_id`,`annee`),
  CONSTRAINT `fk_obj_ind` FOREIGN KEY (`indicateur_id`) REFERENCES `indicateurs` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=331 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `objectifs`
--

LOCK TABLES `objectifs` WRITE;
/*!40000 ALTER TABLE `objectifs` DISABLE KEYS */;
INSERT INTO `objectifs` (`id`, `indicateur_id`, `annee`, `valeur`) VALUES (1,1,2025,20),(2,2,2025,3),(3,3,2025,1),(4,4,2025,3),(5,5,2025,4),(6,6,2025,4),(7,7,2025,23),(8,8,2025,5),(9,9,2025,39),(10,10,2025,6),(11,11,2025,14),(12,12,2025,10),(13,13,2025,9),(14,14,2025,8),(15,15,2025,8),(16,16,2025,23),(17,17,2025,32),(18,18,2025,23),(19,19,2025,11),(20,20,2025,11),(21,21,2025,12),(22,22,2025,17),(23,23,2025,14),(24,24,2025,11),(25,25,2025,10),(26,26,2025,10),(27,27,2025,14),(59,1,2024,33),(60,2,2026,0),(61,3,2026,0),(62,1,2026,0),(66,4,2026,0),(67,5,2026,0),(68,6,2026,0),(69,7,2026,0),(70,8,2026,0),(71,9,2026,0),(72,10,2026,0),(73,11,2026,0),(74,12,2026,0),(75,13,2026,0),(76,14,2026,0),(77,15,2026,0),(78,16,2026,0),(79,17,2026,0),(80,18,2026,0),(81,19,2026,0),(82,20,2026,0),(83,21,2026,0),(84,22,2026,0),(85,23,2026,0),(86,24,2026,0),(87,25,2026,0),(88,26,2026,0),(89,27,2026,0);
/*!40000 ALTER TABLE `objectifs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `realisations`
--

DROP TABLE IF EXISTS `realisations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `realisations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `indicateur_id` int(11) NOT NULL,
  `annee` year(4) NOT NULL,
  `mois` tinyint(4) NOT NULL CHECK (`mois` between 1 and 12),
  `valeur_cumul` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `saisi_par` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_real_user` (`saisi_par`),
  KEY `idx_fk_indicateur` (`indicateur_id`),
  CONSTRAINT `fk_real_ind` FOREIGN KEY (`indicateur_id`) REFERENCES `indicateurs` (`id`),
  CONSTRAINT `fk_real_user` FOREIGN KEY (`saisi_par`) REFERENCES `utilisateurs` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=478 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `realisations`
--

LOCK TABLES `realisations` WRITE;
/*!40000 ALTER TABLE `realisations` DISABLE KEYS */;
INSERT INTO `realisations` (`id`, `indicateur_id`, `annee`, `mois`, `valeur_cumul`, `created_at`, `updated_at`, `saisi_par`) VALUES (1,1,2025,3,511,'2026-04-09 11:54:56','2026-04-09 11:54:56',NULL),(2,2,2025,3,863,'2026-04-09 11:54:56','2026-04-09 11:54:56',NULL),(3,3,2025,3,753,'2026-04-09 11:54:56','2026-04-09 11:54:56',NULL),(4,4,2025,3,322,'2026-04-09 11:54:56','2026-04-09 11:54:56',NULL),(5,5,2025,3,197,'2026-04-09 11:54:56','2026-04-09 11:54:56',NULL),(6,6,2025,3,79,'2026-04-09 11:54:56','2026-04-09 11:54:56',NULL),(7,7,2025,3,69,'2026-04-09 11:54:56','2026-04-09 11:54:56',NULL),(8,8,2025,3,34,'2026-04-09 11:54:56','2026-04-09 11:54:56',NULL),(9,9,2025,3,51,'2026-04-09 11:54:56','2026-04-09 11:54:56',NULL),(10,10,2025,3,7,'2026-04-09 11:54:56','2026-04-09 11:54:56',NULL),(11,11,2025,3,36,'2026-04-09 11:54:56','2026-04-09 11:54:56',NULL),(12,12,2025,3,14,'2026-04-09 11:54:56','2026-04-09 11:54:56',NULL),(13,13,2025,3,13,'2026-04-09 11:54:56','2026-04-09 11:54:56',NULL),(14,14,2025,3,1,'2026-04-09 11:54:56','2026-04-09 11:54:56',NULL),(15,15,2025,3,3,'2026-04-09 11:54:56','2026-04-09 11:54:56',NULL),(16,16,2025,3,49,'2026-04-09 11:54:56','2026-04-09 11:54:56',NULL),(17,17,2025,3,49,'2026-04-09 11:54:56','2026-04-09 11:54:56',NULL),(18,18,2025,3,116,'2026-04-09 11:54:56','2026-04-09 11:54:56',NULL),(19,19,2025,3,36,'2026-04-09 11:54:56','2026-04-09 11:54:56',NULL),(20,20,2025,3,0,'2026-04-09 11:54:56','2026-04-09 11:54:56',NULL),(21,21,2025,3,0,'2026-04-09 11:54:56','2026-04-09 11:54:56',NULL),(22,22,2025,3,0,'2026-04-09 11:54:56','2026-04-09 11:54:56',NULL),(23,23,2025,3,0,'2026-04-09 11:54:56','2026-04-09 11:54:56',NULL),(24,24,2025,3,531,'2026-04-09 11:54:56','2026-04-09 11:54:56',NULL),(25,25,2025,3,973,'2026-04-09 11:54:56','2026-04-09 11:54:56',NULL),(26,26,2025,3,21,'2026-04-09 11:54:56','2026-04-09 11:54:56',NULL),(27,27,2025,3,341,'2026-04-09 11:54:56','2026-04-09 11:54:56',NULL),(32,1,2025,4,15,'2026-04-09 12:16:31','2026-04-09 12:36:12',NULL),(33,2,2025,4,2,'2026-04-09 12:16:31','2026-04-09 12:16:31',NULL),(34,3,2025,4,1,'2026-04-09 12:16:31','2026-04-09 12:16:31',NULL),(35,4,2025,4,4,'2026-04-09 12:16:31','2026-04-09 12:16:31',NULL),(36,5,2025,4,3,'2026-04-09 12:16:31','2026-04-09 12:16:31',NULL),(37,6,2025,4,4,'2026-04-09 12:16:31','2026-04-09 12:16:31',NULL),(38,7,2025,4,9,'2026-04-09 12:16:31','2026-04-09 12:16:31',NULL),(39,8,2025,4,4,'2026-04-09 12:16:31','2026-04-09 12:16:31',NULL),(40,9,2025,4,44,'2026-04-09 12:16:31','2026-04-09 12:16:31',NULL),(41,10,2025,4,8,'2026-04-09 12:16:31','2026-04-09 12:16:31',NULL),(42,11,2025,4,13,'2026-04-09 12:16:31','2026-04-09 12:16:31',NULL),(43,12,2025,4,8,'2026-04-09 12:16:31','2026-04-09 12:16:31',NULL),(44,13,2025,4,9,'2026-04-09 12:16:31','2026-04-09 12:16:31',NULL),(45,14,2025,4,11,'2026-04-09 12:16:31','2026-04-09 12:16:31',NULL),(46,15,2025,4,9,'2026-04-09 12:16:31','2026-04-09 12:16:31',NULL),(47,16,2025,4,14,'2026-04-09 12:16:31','2026-04-09 12:16:31',NULL),(48,17,2025,4,21,'2026-04-09 12:16:31','2026-04-09 12:16:31',NULL),(49,18,2025,4,7,'2026-04-09 12:16:31','2026-04-09 12:16:31',NULL),(50,19,2025,4,10,'2026-04-09 12:16:31','2026-04-09 12:16:31',NULL),(51,20,2025,4,12,'2026-04-09 12:16:31','2026-04-09 12:16:31',NULL),(52,21,2025,4,11,'2026-04-09 12:16:31','2026-04-09 12:16:31',NULL),(53,22,2025,4,11,'2026-04-09 12:16:31','2026-04-09 12:16:31',NULL),(54,23,2025,4,10,'2026-04-09 12:16:31','2026-04-09 12:16:31',NULL),(55,24,2025,4,10,'2026-04-09 12:16:31','2026-04-09 12:16:31',NULL),(56,25,2025,4,10,'2026-04-09 12:16:31','2026-04-09 12:16:31',NULL),(57,26,2025,4,9,'2026-04-09 12:16:31','2026-04-09 12:16:31',NULL),(58,27,2025,4,12,'2026-04-09 12:16:31','2026-04-09 12:16:31',NULL),(59,1,2024,5,7,'2026-04-09 12:19:46','2026-04-09 12:19:46',NULL),(60,2,2026,1,19,'2026-04-09 12:20:42','2026-04-09 12:34:45',NULL),(61,3,2026,1,14,'2026-04-09 12:20:42','2026-04-09 12:34:45',NULL),(62,1,2026,1,12,'2026-04-09 12:23:19','2026-04-09 12:34:45',NULL),(66,4,2026,1,14,'2026-04-09 12:34:45','2026-04-09 12:34:45',NULL),(67,5,2026,1,19,'2026-04-09 12:34:45','2026-04-09 12:34:45',NULL),(68,6,2026,1,27,'2026-04-09 12:34:45','2026-04-09 12:34:45',NULL),(69,7,2026,1,24,'2026-04-09 12:34:45','2026-04-09 12:34:45',NULL),(70,8,2026,1,22,'2026-04-09 12:34:45','2026-04-09 12:34:45',NULL),(71,9,2026,1,23,'2026-04-09 12:34:45','2026-04-09 12:34:45',NULL),(72,10,2026,1,31,'2026-04-09 12:34:45','2026-04-09 12:34:45',NULL),(73,11,2026,1,14,'2026-04-09 12:34:45','2026-04-09 12:34:45',NULL),(74,12,2026,1,28,'2026-04-09 12:34:45','2026-04-09 12:34:45',NULL),(75,13,2026,1,20,'2026-04-09 12:34:45','2026-04-09 12:34:45',NULL),(76,14,2026,1,25,'2026-04-09 12:34:45','2026-04-09 12:34:45',NULL),(77,15,2026,1,18,'2026-04-09 12:34:45','2026-04-09 12:34:45',NULL),(86,24,2026,1,21,'2026-04-09 12:34:45','2026-04-09 12:34:45',NULL),(87,25,2026,1,19,'2026-04-09 12:34:45','2026-04-09 12:34:45',NULL),(88,26,2026,1,20,'2026-04-09 12:34:45','2026-04-09 12:34:45',NULL),(89,27,2026,1,17,'2026-04-09 12:34:45','2026-04-09 12:34:45',NULL),(91,1,2024,10,22,'2026-04-10 07:41:35','2026-04-10 07:41:35',NULL),(99,8,2026,4,2,'2026-04-20 13:24:26','2026-04-30 11:24:57',3),(100,9,2026,4,0,'2026-04-20 13:24:26','2026-04-30 09:53:24',3),(101,11,2026,4,0,'2026-04-20 13:24:26','2026-04-30 09:53:24',3),(102,12,2026,4,0,'2026-04-20 13:24:26','2026-04-30 09:53:24',3),(104,21,2026,4,0,'2026-04-20 13:24:26','2026-04-20 13:24:26',NULL),(105,22,2026,4,0,'2026-04-20 13:24:26','2026-04-20 13:24:26',NULL),(106,23,2026,4,0,'2026-04-20 13:24:26','2026-04-20 13:24:26',NULL),(107,24,2026,4,40,'2026-04-20 13:24:26','2026-04-20 13:24:26',NULL),(109,26,2026,4,2,'2026-04-20 13:24:26','2026-04-20 13:24:26',NULL),(110,27,2026,4,1,'2026-04-20 13:24:26','2026-04-20 13:24:26',NULL),(120,10,2026,4,0,'2026-04-26 00:35:42','2026-04-30 09:53:24',3),(262,1,2026,4,0,'2026-04-27 10:36:34','2026-04-30 09:53:24',3),(263,2,2026,4,20,'2026-04-27 10:36:34','2026-04-30 11:24:57',3),(264,3,2026,4,8,'2026-04-27 10:36:34','2026-04-30 11:24:57',3),(265,4,2026,4,18,'2026-04-27 10:36:34','2026-04-30 11:24:57',3),(266,5,2026,4,12,'2026-04-27 10:36:34','2026-04-30 12:11:59',3),(267,6,2026,4,10,'2026-04-27 10:36:34','2026-04-30 11:50:32',3),(268,7,2026,4,4,'2026-04-27 10:36:34','2026-04-30 11:24:57',3),(269,14,2026,4,0,'2026-04-27 10:36:34','2026-04-30 09:53:24',3),(275,1,2026,4,140,'2026-04-27 11:02:43','2026-04-30 09:15:56',1),(276,2,2026,4,20,'2026-04-27 11:02:43','2026-04-30 09:15:56',1),(277,3,2026,4,60,'2026-04-27 11:02:43','2026-04-30 09:15:56',1),(278,5,2026,4,12,'2026-04-27 11:02:43','2026-04-30 09:15:56',1),(279,6,2026,4,11,'2026-04-27 11:02:43','2026-04-30 09:15:56',1),(280,7,2026,4,16,'2026-04-27 11:02:43','2026-04-30 09:15:56',1),(281,8,2026,4,8,'2026-04-27 11:02:43','2026-04-30 09:15:56',1),(282,9,2026,4,12,'2026-04-27 11:02:43','2026-04-30 09:15:56',1),(283,10,2026,4,62,'2026-04-27 11:02:43','2026-04-30 09:15:56',1),(284,11,2026,4,55,'2026-04-27 11:02:43','2026-04-30 09:15:56',1),(285,12,2026,4,55,'2026-04-27 11:02:43','2026-04-30 09:15:56',1),(286,14,2026,4,55,'2026-04-27 11:02:43','2026-04-30 09:15:56',1),(287,25,2026,4,15,'2026-04-27 11:02:43','2026-04-30 09:15:56',1),(288,4,2026,4,39,'2026-04-27 11:02:43','2026-04-30 09:15:56',1),(289,21,2026,4,0,'2026-04-27 12:33:39','2026-04-30 09:53:24',3),(290,22,2026,4,0,'2026-04-27 12:33:39','2026-04-30 09:53:24',3),(291,23,2026,4,0,'2026-04-27 12:33:39','2026-04-30 09:53:24',3),(292,1,2026,4,70,'2026-04-28 06:34:43','2026-04-29 21:37:41',5),(293,2,2026,4,10,'2026-04-28 06:34:43','2026-04-29 21:28:30',5),(294,3,2026,4,30,'2026-04-28 06:34:43','2026-04-29 21:37:41',5),(295,4,2026,4,8,'2026-04-28 06:34:43','2026-04-29 09:37:09',5),(296,5,2026,4,8,'2026-04-28 06:34:43','2026-04-29 09:37:09',5),(297,6,2026,4,6,'2026-04-28 06:34:43','2026-04-28 06:34:43',5),(298,7,2026,4,10,'2026-04-28 06:34:43','2026-04-28 06:34:43',5),(299,8,2026,4,6,'2026-04-28 06:34:43','2026-04-28 06:34:43',5),(300,9,2026,4,10,'2026-04-28 06:34:43','2026-04-28 06:34:43',5),(301,10,2026,4,60,'2026-04-28 06:34:43','2026-04-28 06:34:43',5),(302,24,2026,4,11,'2026-04-29 09:08:31','2026-04-30 11:24:57',3),(303,25,2026,4,10,'2026-04-29 09:08:31','2026-04-30 11:24:57',3),(304,26,2026,4,1,'2026-04-29 09:08:31','2026-04-30 09:53:24',3),(305,27,2026,4,2,'2026-04-29 09:08:31','2026-04-30 12:11:59',3),(306,21,2026,4,6,'2026-04-30 09:15:56','2026-04-30 09:15:56',1),(307,22,2026,4,2,'2026-04-30 09:15:56','2026-04-30 09:15:56',1),(308,23,2026,4,7,'2026-04-30 09:15:56','2026-04-30 09:15:56',1),(309,24,2026,4,10,'2026-04-30 09:15:56','2026-04-30 09:15:56',1),(310,26,2026,4,33,'2026-04-30 09:15:56','2026-04-30 09:15:56',1),(311,27,2026,4,10,'2026-04-30 09:15:56','2026-04-30 09:15:56',1),(312,1,2026,1,0,'2026-04-30 10:01:54','2026-04-30 10:01:54',5),(313,2,2026,1,20,'2026-04-30 10:01:54','2026-04-30 10:30:32',5),(314,3,2026,1,8,'2026-04-30 10:01:54','2026-04-30 10:30:32',5),(315,5,2026,1,12,'2026-04-30 10:01:54','2026-04-30 10:30:32',5),(316,6,2026,1,0,'2026-04-30 10:01:54','2026-04-30 10:01:54',5),(317,7,2026,1,5,'2026-04-30 10:01:54','2026-04-30 11:23:29',5),(318,8,2026,1,2,'2026-04-30 10:01:54','2026-04-30 10:30:32',5),(319,9,2026,1,0,'2026-04-30 10:01:54','2026-04-30 10:01:54',5),(320,10,2026,1,0,'2026-04-30 10:01:54','2026-04-30 10:01:54',5),(321,11,2026,1,0,'2026-04-30 10:01:54','2026-04-30 10:01:54',5),(322,12,2026,1,0,'2026-04-30 10:01:54','2026-04-30 12:48:59',5),(323,14,2026,1,0,'2026-04-30 10:01:54','2026-04-30 10:01:54',5),(327,24,2026,1,11,'2026-04-30 10:01:54','2026-04-30 11:10:51',5),(328,25,2026,1,10,'2026-04-30 10:01:54','2026-04-30 11:10:51',5),(329,26,2026,1,1,'2026-04-30 10:01:54','2026-04-30 11:10:51',5),(330,27,2026,1,3,'2026-04-30 10:01:54','2026-04-30 12:11:11',5),(331,4,2026,1,19,'2026-04-30 10:01:54','2026-04-30 11:23:29',5),(332,2,2026,1,20,'2026-04-30 10:04:05','2026-04-30 10:21:44',3),(333,3,2026,1,8,'2026-04-30 10:04:05','2026-04-30 10:21:44',3),(334,5,2026,1,12,'2026-04-30 10:04:05','2026-04-30 10:21:44',3),(335,7,2026,1,4,'2026-04-30 10:04:05','2026-04-30 12:12:56',3),(336,8,2026,1,2,'2026-04-30 10:04:05','2026-04-30 10:21:44',3),(337,24,2026,1,11,'2026-04-30 10:04:05','2026-04-30 10:40:07',3),(338,25,2026,1,10,'2026-04-30 10:04:05','2026-04-30 10:40:07',3),(339,26,2026,1,1,'2026-04-30 10:04:05','2026-04-30 10:40:07',3),(340,27,2026,1,2,'2026-04-30 10:04:05','2026-04-30 12:12:56',3),(341,4,2026,1,18,'2026-04-30 10:04:05','2026-04-30 12:12:56',3),(342,2,2026,2,40,'2026-04-30 10:12:14','2026-04-30 13:24:01',5),(343,3,2026,2,24,'2026-04-30 10:12:14','2026-04-30 13:24:01',5),(344,5,2026,2,20,'2026-04-30 10:12:14','2026-04-30 13:25:47',5),(345,6,2026,2,0,'2026-04-30 10:12:14','2026-04-30 10:12:14',5),(346,7,2026,2,6,'2026-04-30 10:12:14','2026-04-30 13:24:01',5),(347,8,2026,2,0,'2026-04-30 10:12:14','2026-04-30 13:24:01',5),(348,24,2026,2,18,'2026-04-30 10:12:14','2026-04-30 13:24:01',5),(349,25,2026,2,14,'2026-04-30 10:12:14','2026-04-30 13:24:01',5),(350,26,2026,2,2,'2026-04-30 10:12:14','2026-04-30 13:24:01',5),(351,27,2026,2,17,'2026-04-30 10:12:14','2026-04-30 13:24:01',5),(352,4,2026,2,26,'2026-04-30 10:12:14','2026-04-30 13:25:47',5),(353,2,2026,2,41,'2026-04-30 10:17:10','2026-04-30 10:17:10',3),(354,3,2026,2,24,'2026-04-30 10:17:10','2026-04-30 10:17:10',3),(355,5,2026,2,19,'2026-04-30 10:17:10','2026-04-30 13:20:18',3),(356,6,2026,2,0,'2026-04-30 10:17:10','2026-04-30 10:17:10',3),(357,7,2026,2,6,'2026-04-30 10:17:10','2026-04-30 10:17:10',3),(358,8,2026,2,1,'2026-04-30 10:17:10','2026-04-30 13:20:18',3),(359,9,2026,2,0,'2026-04-30 10:17:10','2026-04-30 10:17:10',3),(360,10,2026,2,0,'2026-04-30 10:17:10','2026-04-30 10:17:10',3),(361,24,2026,2,18,'2026-04-30 10:17:10','2026-04-30 10:17:10',3),(362,25,2026,2,14,'2026-04-30 10:17:10','2026-04-30 10:17:10',3),(363,26,2026,2,1,'2026-04-30 10:17:10','2026-04-30 10:17:10',3),(364,27,2026,2,16,'2026-04-30 10:17:10','2026-04-30 13:20:18',3),(365,4,2026,2,26,'2026-04-30 10:17:10','2026-04-30 13:20:18',3),(366,1,2026,1,0,'2026-04-30 10:21:44','2026-04-30 10:21:44',3),(367,6,2026,1,0,'2026-04-30 10:21:44','2026-04-30 10:21:44',3),(368,9,2026,1,0,'2026-04-30 10:21:44','2026-04-30 10:21:44',3),(369,10,2026,1,0,'2026-04-30 10:21:44','2026-04-30 10:21:44',3),(370,1,2026,2,0,'2026-04-30 10:24:02','2026-04-30 10:24:02',5),(372,18,2026,1,3,'2026-04-30 11:09:16','2026-04-30 11:09:16',5),(373,11,2026,1,0,'2026-04-30 12:45:08','2026-04-30 12:45:08',3),(374,12,2026,1,0,'2026-04-30 12:45:08','2026-04-30 12:45:08',3),(375,13,2026,1,0,'2026-04-30 12:45:08','2026-04-30 12:45:08',3),(376,14,2026,1,0,'2026-04-30 12:45:08','2026-04-30 12:45:08',3),(377,15,2026,1,0,'2026-04-30 12:45:08','2026-04-30 12:45:08',3),(378,16,2026,1,0,'2026-04-30 12:45:08','2026-04-30 12:45:08',3),(379,17,2026,1,0,'2026-04-30 12:45:08','2026-04-30 12:45:08',3),(380,18,2026,1,0,'2026-04-30 12:45:08','2026-04-30 12:45:08',3),(381,19,2026,1,0,'2026-04-30 12:45:08','2026-04-30 12:45:08',3),(382,20,2026,1,0,'2026-04-30 12:45:08','2026-04-30 12:45:08',3),(383,21,2026,1,0,'2026-04-30 12:45:08','2026-04-30 12:45:08',3),(384,22,2026,1,0,'2026-04-30 12:45:08','2026-04-30 12:45:08',3),(385,23,2026,1,0,'2026-04-30 12:45:08','2026-04-30 12:45:08',3),(386,13,2026,1,0,'2026-04-30 12:48:59','2026-04-30 12:48:59',5),(387,15,2026,1,0,'2026-04-30 12:48:59','2026-04-30 12:48:59',5),(388,16,2026,1,0,'2026-04-30 12:48:59','2026-04-30 12:48:59',5),(389,17,2026,1,0,'2026-04-30 12:48:59','2026-04-30 12:48:59',5),(390,19,2026,1,0,'2026-04-30 12:48:59','2026-04-30 12:48:59',5),(391,20,2026,1,0,'2026-04-30 12:48:59','2026-04-30 12:48:59',5),(392,21,2026,1,0,'2026-04-30 12:48:59','2026-04-30 12:48:59',5),(393,22,2026,1,0,'2026-04-30 12:48:59','2026-04-30 12:48:59',5),(394,23,2026,1,0,'2026-04-30 12:48:59','2026-04-30 12:48:59',5),(395,1,2026,1,0,'2026-04-30 12:50:07','2026-04-30 12:50:07',1),(396,2,2026,1,40,'2026-04-30 12:50:07','2026-04-30 12:50:07',1),(397,3,2026,1,16,'2026-04-30 12:50:07','2026-04-30 12:50:07',1),(398,4,2026,1,37,'2026-04-30 12:50:07','2026-04-30 12:50:07',1),(399,5,2026,1,24,'2026-04-30 12:50:07','2026-04-30 12:50:07',1),(400,6,2026,1,0,'2026-04-30 12:50:07','2026-04-30 12:50:07',1),(401,7,2026,1,9,'2026-04-30 12:50:07','2026-04-30 12:50:07',1),(402,8,2026,1,4,'2026-04-30 12:50:07','2026-04-30 12:50:07',1),(403,9,2026,1,0,'2026-04-30 12:50:07','2026-04-30 12:50:07',1),(404,10,2026,1,0,'2026-04-30 12:50:07','2026-04-30 12:50:07',1),(405,11,2026,1,0,'2026-04-30 12:50:07','2026-04-30 12:50:07',1),(406,12,2026,1,0,'2026-04-30 12:50:07','2026-04-30 12:50:07',1),(407,13,2026,1,0,'2026-04-30 12:50:07','2026-04-30 12:50:07',1),(408,14,2026,1,0,'2026-04-30 12:50:07','2026-04-30 12:50:07',1),(409,15,2026,1,0,'2026-04-30 12:50:07','2026-04-30 12:50:07',1),(410,16,2026,1,0,'2026-04-30 12:50:07','2026-04-30 12:50:07',1),(411,17,2026,1,0,'2026-04-30 12:50:07','2026-04-30 12:50:07',1),(412,18,2026,1,3,'2026-04-30 12:50:07','2026-04-30 12:50:07',1),(413,19,2026,1,0,'2026-04-30 12:50:07','2026-04-30 12:50:07',1),(414,20,2026,1,0,'2026-04-30 12:50:07','2026-04-30 12:50:07',1),(415,21,2026,1,0,'2026-04-30 12:50:07','2026-04-30 12:50:07',1),(416,22,2026,1,0,'2026-04-30 12:50:07','2026-04-30 12:50:07',1),(417,23,2026,1,0,'2026-04-30 12:50:07','2026-04-30 12:50:07',1),(418,24,2026,1,22,'2026-04-30 12:50:07','2026-04-30 12:50:07',1),(419,25,2026,1,20,'2026-04-30 12:50:07','2026-04-30 12:50:07',1),(420,26,2026,1,2,'2026-04-30 12:50:07','2026-04-30 12:50:07',1),(421,27,2026,1,5,'2026-04-30 12:50:07','2026-04-30 12:50:07',1),(422,1,2026,2,0,'2026-04-30 13:20:18','2026-04-30 13:20:18',3),(423,11,2026,2,4,'2026-04-30 13:20:18','2026-04-30 13:20:18',3),(424,12,2026,2,0,'2026-04-30 13:20:18','2026-04-30 13:20:18',3),(425,13,2026,2,0,'2026-04-30 13:20:18','2026-04-30 13:20:18',3),(426,14,2026,2,0,'2026-04-30 13:20:18','2026-04-30 13:20:18',3),(427,15,2026,2,0,'2026-04-30 13:20:18','2026-04-30 13:20:18',3),(428,16,2026,2,0,'2026-04-30 13:20:18','2026-04-30 13:20:18',3),(429,17,2026,2,0,'2026-04-30 13:20:18','2026-04-30 13:20:18',3),(430,18,2026,2,0,'2026-04-30 13:20:18','2026-04-30 13:20:18',3),(431,19,2026,2,0,'2026-04-30 13:20:18','2026-04-30 13:20:18',3),(432,20,2026,2,0,'2026-04-30 13:20:18','2026-04-30 13:20:18',3),(433,21,2026,2,0,'2026-04-30 13:20:18','2026-04-30 13:20:18',3),(434,22,2026,2,0,'2026-04-30 13:20:18','2026-04-30 13:20:18',3),(435,23,2026,2,0,'2026-04-30 13:20:18','2026-04-30 13:20:18',3),(436,9,2026,2,0,'2026-04-30 13:24:01','2026-04-30 13:24:01',5),(437,10,2026,2,0,'2026-04-30 13:24:01','2026-04-30 13:24:01',5),(438,11,2026,2,0,'2026-04-30 13:24:01','2026-04-30 13:24:01',5),(439,12,2026,2,0,'2026-04-30 13:24:01','2026-04-30 13:24:01',5),(440,13,2026,2,0,'2026-04-30 13:24:01','2026-04-30 13:24:01',5),(441,14,2026,2,0,'2026-04-30 13:24:01','2026-04-30 13:24:01',5),(442,15,2026,2,0,'2026-04-30 13:24:01','2026-04-30 13:24:01',5),(443,16,2026,2,0,'2026-04-30 13:24:01','2026-04-30 13:24:01',5),(444,17,2026,2,11,'2026-04-30 13:24:01','2026-04-30 13:24:01',5),(445,18,2026,2,2,'2026-04-30 13:24:01','2026-04-30 13:24:01',5),(446,19,2026,2,0,'2026-04-30 13:24:01','2026-04-30 13:24:01',5),(447,20,2026,2,0,'2026-04-30 13:24:01','2026-04-30 13:24:01',5),(448,21,2026,2,0,'2026-04-30 13:24:01','2026-04-30 13:24:01',5),(449,22,2026,2,0,'2026-04-30 13:24:01','2026-04-30 13:24:01',5),(450,23,2026,2,0,'2026-04-30 13:24:01','2026-04-30 13:24:01',5),(451,1,2026,2,0,'2026-04-30 13:26:37','2026-04-30 13:26:37',1),(452,2,2026,2,81,'2026-04-30 13:26:37','2026-04-30 13:26:37',1),(453,3,2026,2,48,'2026-04-30 13:26:37','2026-04-30 13:26:37',1),(454,4,2026,2,52,'2026-04-30 13:26:37','2026-04-30 13:26:37',1),(455,5,2026,2,39,'2026-04-30 13:26:37','2026-04-30 13:26:37',1),(456,6,2026,2,0,'2026-04-30 13:26:37','2026-04-30 13:26:37',1),(457,7,2026,2,12,'2026-04-30 13:26:37','2026-04-30 13:26:37',1),(458,8,2026,2,1,'2026-04-30 13:26:37','2026-04-30 13:26:37',1),(459,9,2026,2,0,'2026-04-30 13:26:37','2026-04-30 13:26:37',1),(460,10,2026,2,0,'2026-04-30 13:26:37','2026-04-30 13:26:37',1),(461,11,2026,2,4,'2026-04-30 13:26:37','2026-04-30 13:26:37',1),(462,12,2026,2,0,'2026-04-30 13:26:37','2026-04-30 13:26:37',1),(463,13,2026,2,0,'2026-04-30 13:26:37','2026-04-30 13:26:37',1),(464,14,2026,2,0,'2026-04-30 13:26:37','2026-04-30 13:26:37',1),(465,15,2026,2,0,'2026-04-30 13:26:37','2026-04-30 13:26:37',1),(466,16,2026,2,0,'2026-04-30 13:26:37','2026-04-30 13:26:37',1),(467,17,2026,2,11,'2026-04-30 13:26:37','2026-04-30 13:26:37',1),(468,18,2026,2,2,'2026-04-30 13:26:37','2026-04-30 13:26:37',1),(469,19,2026,2,0,'2026-04-30 13:26:37','2026-04-30 13:26:37',1),(470,20,2026,2,0,'2026-04-30 13:26:37','2026-04-30 13:26:37',1),(471,21,2026,2,0,'2026-04-30 13:26:37','2026-04-30 13:26:37',1),(472,22,2026,2,0,'2026-04-30 13:26:37','2026-04-30 13:26:37',1),(473,23,2026,2,0,'2026-04-30 13:26:37','2026-04-30 13:26:37',1),(474,24,2026,2,36,'2026-04-30 13:26:37','2026-04-30 13:26:37',1),(475,25,2026,2,28,'2026-04-30 13:26:37','2026-04-30 13:26:37',1),(476,26,2026,2,3,'2026-04-30 13:26:37','2026-04-30 13:26:37',1),(477,27,2026,2,33,'2026-04-30 13:26:37','2026-04-30 13:26:37',1);
/*!40000 ALTER TABLE `realisations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateurs`
--

DROP TABLE IF EXISTS `utilisateurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `utilisateurs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `role` enum('directeur','conseiller') NOT NULL DEFAULT 'conseiller',
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `actif` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateurs`
--

LOCK TABLES `utilisateurs` WRITE;
/*!40000 ALTER TABLE `utilisateurs` DISABLE KEYS */;
INSERT INTO `utilisateurs` (`id`, `nom`, `prenom`, `email`, `mot_de_passe`, `role`, `date_creation`, `actif`) VALUES (1,'El ghzale','Soufiane','soufiane@anapec.ma','soufiane123','directeur','2026-04-20 13:09:51',1),(3,'folane','yassine','yassine@gmail.com','yassine123','conseiller','2026-04-22 12:14:05',1),(5,'Imrane','salma','salma@gmail.com','salma123','conseiller','2026-04-28 06:32:21',1);
/*!40000 ALTER TABLE `utilisateurs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `v_realisations_detail`
--

DROP TABLE IF EXISTS `v_realisations_detail`;
/*!50001 DROP VIEW IF EXISTS `v_realisations_detail`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `v_realisations_detail` AS SELECT
 1 AS `annee`,
  1 AS `mois`,
  1 AS `indicateur_nom`,
  1 AS `categorie`,
  1 AS `valeur_cumul`,
  1 AS `valeur_mois`,
  1 AS `objectif_annuel`,
  1 AS `taux_pct` */;
SET character_set_client = @saved_cs_client;

--
-- Dumping routines for database 'anapec_tdb'
--

--
-- Final view structure for view `v_realisations_detail`
--

/*!50001 DROP VIEW IF EXISTS `v_realisations_detail`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_realisations_detail` AS select `r`.`annee` AS `annee`,`r`.`mois` AS `mois`,`i`.`nom` AS `indicateur_nom`,`c`.`label` AS `categorie`,`r`.`valeur_cumul` AS `valeur_cumul`,coalesce(`r`.`valeur_cumul` - lag(`r`.`valeur_cumul`,1) over ( partition by `r`.`indicateur_id`,`r`.`annee` order by `r`.`mois`),`r`.`valeur_cumul`) AS `valeur_mois`,`o`.`valeur` AS `objectif_annuel`,round(`r`.`valeur_cumul` * 100.0 / nullif(`o`.`valeur`,0),1) AS `taux_pct` from (((`realisations` `r` join `indicateurs` `i` on(`i`.`id` = `r`.`indicateur_id`)) join `categories` `c` on(`c`.`id` = `i`.`categorie_id`)) left join `objectifs` `o` on(`o`.`indicateur_id` = `r`.`indicateur_id` and `o`.`annee` = `r`.`annee`)) order by `r`.`annee`,`r`.`mois`,`c`.`id`,`i`.`id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-02  1:47:18

-- Create alertes table (referenced by server.js but not in original schema)
CREATE TABLE IF NOT EXISTS alertes (
  id INT NOT NULL AUTO_INCREMENT,
  indicateur_id INT NOT NULL,
  annee YEAR NOT NULL,
  mois TINYINT NOT NULL,
  type_alerte VARCHAR(50) NOT NULL,
  taux_realisation DECIMAL(5,1) DEFAULT 0,
  seuil INT DEFAULT 60,
  message VARCHAR(500) NULL,
  lu TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_alerte_ind (indicateur_id),
  CONSTRAINT fk_alerte_ind FOREIGN KEY (indicateur_id) REFERENCES indicateurs(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
