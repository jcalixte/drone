-- phpMyAdmin SQL Dump
-- version 4.0.4
-- http://www.phpmyadmin.net
--
-- Client: localhost
-- Généré le: Mer 24 Juin 2015 à 20:49
-- Version du serveur: 5.6.12-log
-- Version de PHP: 5.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données: `drone`
--
CREATE DATABASE IF NOT EXISTS `drone` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `drone`;

-- --------------------------------------------------------

--
-- Structure de la table `drone`
--

CREATE TABLE IF NOT EXISTS `drone` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `serial_number` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `current_action` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `altitude` double NOT NULL,
  `activated` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_2F4A3E60A76ED395` (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=14 ;

--
-- Contenu de la table `drone`
--

INSERT INTO `drone` (`id`, `product`, `latitude`, `longitude`, `serial_number`, `user_id`, `current_action`, `altitude`, `activated`) VALUES
(9, 'Beeble', 43.11530949940678, 6.117476892446718, 'VCQMDQA7VH3P9IRSUCDQ', 2, NULL, 10, 1),
(10, 'Parrot', 48.82466195675635, 2.279694657677722, 'H3HO2RE2FNIO959MT2NH', 6, NULL, 10, 1),
(11, '3DR', 48.82408323676875, 2.2801936947978296, '11AIC0N33GRJQGTN9NJS', 6, NULL, 1, 1),
(12, 'Parrot', 43.435317, 6.73511, 'P7PZA1AWXMFDYE7L8D7B', 9, NULL, 0, 1),
(13, '3DR', 43.43686356842209, 6.736699655439589, 'VLD5TV2AAFSHOONXSM8D', 9, NULL, 1, 1);

-- --------------------------------------------------------

--
-- Structure de la table `field`
--

CREATE TABLE IF NOT EXISTS `field` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `image_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_9A346A5CA76ED395` (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=44 ;

--
-- Contenu de la table `field`
--

INSERT INTO `field` (`id`, `user_id`, `image_name`, `updatedAt`) VALUES
(20, 2, NULL, NULL),
(42, 6, NULL, NULL),
(43, 9, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `fos_user`
--

CREATE TABLE IF NOT EXISTS `fos_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `username_canonical` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `email_canonical` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `salt` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `last_login` datetime DEFAULT NULL,
  `locked` tinyint(1) NOT NULL,
  `expired` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL,
  `confirmation_token` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `password_requested_at` datetime DEFAULT NULL,
  `roles` longtext COLLATE utf8_unicode_ci NOT NULL COMMENT '(DC2Type:array)',
  `credentials_expired` tinyint(1) NOT NULL,
  `credentials_expire_at` datetime DEFAULT NULL,
  `address` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `zipcode` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `country` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `user_image` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `city` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `firstname` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `lastname` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_957A647992FC23A8` (`username_canonical`),
  UNIQUE KEY `UNIQ_957A6479A0D96FBF` (`email_canonical`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=10 ;

--
-- Contenu de la table `fos_user`
--

INSERT INTO `fos_user` (`id`, `username`, `username_canonical`, `email`, `email_canonical`, `enabled`, `salt`, `password`, `last_login`, `locked`, `expired`, `expires_at`, `confirmation_token`, `password_requested_at`, `roles`, `credentials_expired`, `credentials_expire_at`, `address`, `zipcode`, `country`, `user_image`, `updatedAt`, `city`, `firstname`, `lastname`) VALUES
(2, 'test', 'test', 'juliencalixte@hotmail.fr', 'juliencalixte@hotmail.fr', 1, 'm8nwi5l9ptcswsk0c0gw8ow8woo4k4g', 'zJbKVK6bG6I3H0MBO/NP5Gc2GKo9LPEDQr8hyNEMyIyobQ4RjHmL4kFRryMtIwvA+X1zdGOey11HL7sb4GC+Lg==', '2015-03-27 12:05:04', 0, 0, NULL, NULL, NULL, 'a:0:{}', 0, NULL, '11, avenue des Iles d''or', '83400', 'FR', '551457d6d05de.jpg', '2015-03-26 20:02:46', 'Hyères', 'Julien', 'Calixte'),
(3, 'sabdul', 'sabdul', 'sattar.abdul@laposte.net', 'sattar.abdul@laposte.net', 1, 'nmzczlv62bkwgk8c408cgkokwo04ggo', 'xyEyciApQi8apKKfBH2CwZ83Wgl/9UjZ2NGtoPCPOlohHCP+sWjYWip51boJg1xKDYpoRZLmkwnXJHqZdILHTw==', '2015-03-21 11:49:28', 0, 0, NULL, NULL, NULL, 'a:0:{}', 0, NULL, '72 rue Claude Decaen', '75012', 'FR', '550d4cb8a779d.jpg', '2015-03-21 11:49:28', 'Paris', 'Sattar', 'Abdul'),
(4, 'gcalixte', 'gcalixte', 'gilles.calixte@gmail.com', 'gilles.calixte@gmail.com', 0, '2dbk2b44ug5cc4kwcocc88o0gs04wo0', 'K/WB4RMQKWqBgelrsqt24bZG+B/XXMu+ulU1so8MjIZcv1Kd8NqLP51TUmoUECX/2TUIamWuath/HA7JD+ZBsA==', NULL, 0, 0, NULL, 'rYRe8XYQiir-WH6shNapLbLbmpSAx9CSVDmGsiesy0o', NULL, 'a:0:{}', 0, NULL, '72 rue Claude Decaen', '75012', 'FR', NULL, NULL, 'Paris', 'Gilles', 'Calixte'),
(5, 'vbessa', 'vbessa', 'verabessa@hotmail.fr', 'verabessa@hotmail.fr', 1, 'olr1oy1hw5c0gk8g4co4og044sogwk0', 'rNP32aNEl9yCKjfnHT6ay7B3FDATWVqHkhU8/U2w+Y6OD/WcJbdAkGRkWgIJhWShBk5PHBiSxMAgQp1NM2uf1w==', '2015-03-26 23:13:16', 0, 0, NULL, '6t6acALdti5HS94QjSQKgzaeQuo9esHM2H4sMgzzONA', NULL, 'a:0:{}', 0, NULL, '11, avenue des Iles d''or', '83400', 'FR', '551485796164b.jpg', '2015-03-26 23:17:29', 'Hyères', 'Vera', 'Bessa dos Santos'),
(6, 'isep', 'isep', 'contact@isep.fr', 'contact@isep.fr', 1, 'nb5hbbhjdb4g08sogooggss4wogk8g4', '28ZXF+PgAn/oHhs/u/+OJchtBDbgNuGTgBCVU099zFLFjfCYT3Z/ppVDyd03wPA8rdNeLc2Ose2nKjJuLLE0OA==', '2015-06-24 21:06:52', 0, 0, NULL, NULL, NULL, 'a:1:{i:0;s:10:"ROLE_ADMIN";}', 0, NULL, 'Rue Voltaire', '92130', 'FR', '5515449af0f27.jpg', '2015-03-27 12:52:58', 'Issy-les-Moulineaux', 'Institut', 'Supérieur'),
(7, 'finaltest', 'finaltest', 'test@hotmail.fr', 'test@hotmail.fr', 1, 'bzyrd8a14i88wg88c4goockos8s8k8w', 'wyv+mPoS2jUt5SZITFgxCKgLpTRyAehlSW1gK855DjMgINxOtXsqUvNZsYW9LZ4k7I1tFnJ+mzvjfMAMPn704w==', '2015-06-24 20:08:28', 0, 0, NULL, NULL, NULL, 'a:0:{}', 0, NULL, '48', '75012', 'FR', '558af21c95bc1.png', '2015-06-24 20:08:28', 'Paris', 'Test', 'Test'),
(9, 'jdoe', 'jdoe', 'johndoe@beeeye.com', 'johndoe@beeeye.com', 1, '75r2nlzms1kwkkgk0wsok8ckkk0sw0w', 'keTfdiciuo74ipuUJwUhFD41rx/38gAKTmx50cu9hwPpqJg61Pwv4aJmXISy+R17yQ5wPrXyKvkjLoK9GhhFWA==', '2015-06-24 21:24:41', 0, 0, NULL, NULL, NULL, 'a:0:{}', 0, NULL, '10, rue du Pauvadou', '83600', 'FR', '558af7649bb3f.png', '2015-06-24 20:31:00', 'Fréjus', 'John', 'Doe');

-- --------------------------------------------------------

--
-- Structure de la table `map`
--

CREATE TABLE IF NOT EXISTS `map` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `image_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_ABE0EC5BA76ED395` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `point`
--

CREATE TABLE IF NOT EXISTS `point` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `field_id` int(11) DEFAULT NULL,
  `action` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_7664DC20A76ED395` (`user_id`),
  KEY `IDX_7664DC20443707B0` (`field_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=479 ;

--
-- Contenu de la table `point`
--

INSERT INTO `point` (`id`, `user_id`, `latitude`, `longitude`, `field_id`, `action`) VALUES
(128, NULL, 43, 6, 20, NULL),
(129, NULL, 43, 6, 20, NULL),
(130, NULL, 43, 6, 20, NULL),
(131, NULL, 43, 6, 20, NULL),
(132, NULL, 43, 6, 20, NULL),
(133, NULL, 43, 6, 20, NULL),
(134, NULL, 43, 6, 20, NULL),
(135, NULL, 43, 6, 20, NULL),
(136, NULL, 43, 6, 20, NULL),
(137, NULL, 43, 6, 20, NULL),
(138, NULL, 43, 6, 20, NULL),
(139, NULL, 43, 6, 20, NULL),
(140, NULL, 43, 6, 20, NULL),
(141, 2, 43, 6, NULL, 'photo'),
(142, 2, 43, 6, NULL, 'video'),
(143, 2, 43, 6, NULL, 'photo'),
(144, 2, 43, 6, NULL, 'sound'),
(145, 2, 43, 6, NULL, 'photo'),
(146, 2, 43, 6, NULL, 'video'),
(147, 2, 43, 6, NULL, 'photo'),
(155, 2, 43, 6, NULL, 'sound'),
(373, 6, 48.825172973364126, 2.279182749450075, NULL, 'photo'),
(374, 6, 48.82441718131083, 2.2789145285485857, NULL, 'video'),
(375, 6, 48.824558451719646, 2.280459480941164, NULL, 'sound'),
(376, 6, 48.82454432469668, 2.2783459002374284, NULL, 'video'),
(387, 6, 48.82420046309389, 2.280616073265991, NULL, 'photo'),
(388, 6, 48.824059191675936, 2.2798435970697017, NULL, 'photo'),
(389, 6, 48.82421812199313, 2.2794949098977657, NULL, 'photo'),
(439, NULL, 48.825546063122, 2.278392518479, 42, NULL),
(440, NULL, 48.825122259053, 2.2783066877905, 42, NULL),
(441, NULL, 48.824550117874, 2.2780599245611, 42, NULL),
(442, NULL, 48.824232258842, 2.2779204496924, 42, NULL),
(443, NULL, 48.823681298409, 2.2809888968054, 42, NULL),
(444, NULL, 48.824613689439, 2.2808386931006, 42, NULL),
(445, NULL, 48.825037497809, 2.2801627764288, 42, NULL),
(446, NULL, 48.825334161535, 2.2796692499701, 42, NULL),
(447, NULL, 48.825496619499, 2.2794975885931, 42, NULL),
(448, NULL, 48.825546063122, 2.278392518479, 42, NULL),
(449, NULL, 48.825546063122, 2.278392518479, 42, NULL),
(450, NULL, 48.825546063122, 2.278392518479, 42, NULL),
(451, NULL, 48.825546063122, 2.278392518479, 42, NULL),
(452, NULL, 48.825546063122, 2.278392518479, 42, NULL),
(453, NULL, 43.43602607784941, 6.734591439153883, 43, NULL),
(454, NULL, 43.43506781860365, 6.735557034399244, 43, NULL),
(455, NULL, 43.43520026184214, 6.735889628317091, 43, NULL),
(456, NULL, 43.43517688952701, 6.7365011719724865, 43, NULL),
(457, NULL, 43.43563654340114, 6.737434580709669, 43, NULL),
(458, NULL, 43.436142937694925, 6.737262919332716, 43, NULL),
(459, NULL, 43.436921997564376, 6.737616970922682, 43, NULL),
(460, NULL, 43.437607561952596, 6.736994698431227, 43, NULL),
(461, NULL, 43.43757640010346, 6.736479714300367, 43, NULL),
(462, NULL, 43.436750605253685, 6.735299542333815, 43, NULL),
(463, NULL, 43.43637665670892, 6.735031321432325, 43, NULL),
(464, NULL, 43.43602607784941, 6.734591439153883, 43, NULL),
(465, 9, 43.437288152238125, 6.736511900808546, NULL, 'photo'),
(466, 9, 43.436851882586865, 6.735986187841627, NULL, 'photo'),
(467, 9, 43.43616630963694, 6.736683562185499, NULL, 'photo'),
(468, 9, 43.435496310385915, 6.735685780431959, NULL, 'video'),
(469, 9, 43.436602584231046, 6.737059071447584, NULL, 'sound'),
(470, 9, 43.436649327751, 6.736297324087355, NULL, 'sound'),
(471, 9, 43.43577677609138, 6.735213711645338, NULL, 'sound'),
(472, 9, 43.436033868512794, 6.7360291031858655, NULL, 'video'),
(473, 9, 43.435768985394894, 6.736308052923414, NULL, 'video'),
(474, 9, 43.436135147045576, 6.735471203710768, NULL, 'video'),
(475, 9, 43.43540282152856, 6.736061289694044, NULL, 'video'),
(476, 9, 43.435846892314636, 6.735642865087721, NULL, 'photo'),
(477, 9, 43.43586247368655, 6.735760882284376, NULL, 'photo'),
(478, 9, 43.4357534039989, 6.735739424612257, NULL, 'photo');

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `drone`
--
ALTER TABLE `drone`
  ADD CONSTRAINT `FK_2F4A3E60A76ED395` FOREIGN KEY (`user_id`) REFERENCES `fos_user` (`id`);

--
-- Contraintes pour la table `field`
--
ALTER TABLE `field`
  ADD CONSTRAINT `FK_9A346A5CA76ED395` FOREIGN KEY (`user_id`) REFERENCES `fos_user` (`id`);

--
-- Contraintes pour la table `map`
--
ALTER TABLE `map`
  ADD CONSTRAINT `FK_ABE0EC5BA76ED395` FOREIGN KEY (`user_id`) REFERENCES `fos_user` (`id`);

--
-- Contraintes pour la table `point`
--
ALTER TABLE `point`
  ADD CONSTRAINT `FK_7664DC20443707B0` FOREIGN KEY (`field_id`) REFERENCES `field` (`id`),
  ADD CONSTRAINT `FK_7664DC20A76ED395` FOREIGN KEY (`user_id`) REFERENCES `fos_user` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
