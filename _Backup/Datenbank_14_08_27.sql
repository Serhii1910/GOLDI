-- phpMyAdmin SQL Dump
-- version 4.0.9
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Erstellungszeit: 27. Aug 2014 um 23:31
-- Server Version: 5.6.14
-- PHP-Version: 5.5.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Datenbank: `new_remotelab`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `bookings`
--

CREATE TABLE IF NOT EXISTS `bookings` (
  `booking_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `bpu_id` int(11) NOT NULL,
  `pspu_id` int(11) NOT NULL,
  `start_time` int(11) NOT NULL,
  `end_time` int(11) NOT NULL,
  `session_id` varchar(64) NOT NULL,
  PRIMARY KEY (`booking_id`),
  KEY `fk_bookings_devices2_idx` (`pspu_id`),
  KEY `fk_bookings_devices1_idx` (`bpu_id`),
  KEY `fk_bookings_user1_idx` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `devices`
--

CREATE TABLE IF NOT EXISTS `devices` (
  `device_id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(64) NOT NULL,
  `service_dest_id` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `bcu_channel` int(11) NOT NULL,
  `bcu_id` int(11) NOT NULL,
  `virtual` tinyint(1) NOT NULL,
  PRIMARY KEY (`device_id`),
  KEY `fk_devices_device_types1_idx` (`type`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=13 ;

--
-- Daten für Tabelle `devices`
--

INSERT INTO `devices` (`device_id`, `type`, `service_dest_id`, `name`, `bcu_channel`, `bcu_id`, `virtual`) VALUES
(1, 'Microcontroller', 1793, 'GOLDI BPU UC', 3, 7, 0),
(2, 'FPGA', 1795, 'GOLDI BPU FPGA', 2, 7, 0),
(3, 'RPB BPU', 1797, 'GOLDI BPU RPB', 1, 7, 0),
(4, 'Lift 3 floors', 1856, 'GOLDI PSPU LIFT 3 FLOORS', 6, 7, 0),
(5, 'SIDAC', 1858, 'GOLDI PSPU SIDAC', 5, 7, 0),
(6, '3-Axis Crane', 1860, 'GOLDI PSPU 3-AXIS', 4, 7, 0),
(7, 'BCU', 0, 'GOLDI BCU', 0, 0, 0),
(8, 'FiniteStateMachine', 0, 'GOLDI BPU FSM', 0, 7, 1),
(9, 'Lift 3 floors', 0, 'GOLDI PSPU LIFT 3 FLOORS', 0, 7, 1),
(10, 'SIDAC', 0, 'GOLDI PSPU SIDAC', 0, 7, 1),
(11, '3-Axis Crane', 0, 'GOLDI PSPU 3-AXIS', 0, 7, 1),
(12, 'RPB PSPU', 0, 'GOLDI PSPU RPB', 0, 7, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `device_category`
--

CREATE TABLE IF NOT EXISTS `device_category` (
  `category` varchar(64) NOT NULL,
  PRIMARY KEY (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `device_category`
--

INSERT INTO `device_category` (`category`) VALUES
('BCU'),
('BPU'),
('PSPU');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `device_types`
--

CREATE TABLE IF NOT EXISTS `device_types` (
  `type` varchar(64) NOT NULL,
  `category` varchar(64) NOT NULL,
  PRIMARY KEY (`type`),
  KEY `fk_device_types_device_category1_idx` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `device_types`
--

INSERT INTO `device_types` (`type`, `category`) VALUES
('BCU', 'BCU'),
('FiniteStateMachine', 'BPU'),
('FPGA', 'BPU'),
('Microcontroller', 'BPU'),
('RPB BPU', 'BPU'),
('3-Axis Crane', 'PSPU'),
('Lift 3 floors', 'PSPU'),
('Lift 4 floors', 'PSPU'),
('Maze', 'PSPU'),
('Pump', 'PSPU'),
('RPB PSPU', 'PSPU'),
('SIDAC', 'PSPU'),
('Warehouse', 'PSPU');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `groups`
--

CREATE TABLE IF NOT EXISTS `groups` (
  `group_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `joinable` tinyint(4) DEFAULT '1',
  `join_key` varchar(64) DEFAULT '',
  PRIMARY KEY (`group_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Daten für Tabelle `groups`
--

INSERT INTO `groups` (`group_id`, `name`, `joinable`, `join_key`) VALUES
(0, 'User', 0, ''),
(1, 'Admin', 0, '');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `groups_has_restrictions`
--

CREATE TABLE IF NOT EXISTS `groups_has_restrictions` (
  `group_id` int(11) NOT NULL,
  `restriction` varchar(64) NOT NULL,
  `value` int(11) DEFAULT NULL,
  PRIMARY KEY (`group_id`,`restriction`),
  KEY `fk_groups_has_restrictions_restrictions1_idx` (`restriction`),
  KEY `fk_groups_has_restrictions_groups1_idx` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `groups_has_restrictions`
--

INSERT INTO `groups_has_restrictions` (`group_id`, `restriction`, `value`) VALUES
(0, 'max_duration_minutes', 240),
(1, 'max-group_size', 5);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `locale_modules`
--

CREATE TABLE IF NOT EXISTS `locale_modules` (
  `module` varchar(64) NOT NULL,
  PRIMARY KEY (`module`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `locale_modules`
--

INSERT INTO `locale_modules` (`module`) VALUES
('Module AuthentificationModule'),
('Module RichCalendar'),
('PSPU 3-Axis Crane'),
('PSPU all devices'),
('PSPU Lift 3 floors'),
('PSPU Lift 4 floors'),
('PSPU Maze'),
('PSPU Pump'),
('PSPU RPB PSPU'),
('PSPU SIDAC'),
('PSPU Warehouse'),
('Site admin'),
('Site develop'),
('Site guest'),
('Site home'),
('Site languageadmin'),
('Site main'),
('Site reservations'),
('Site user'),
('Site virtualria');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `locale_tags`
--

CREATE TABLE IF NOT EXISTS `locale_tags` (
  `language_module` varchar(64) NOT NULL,
  `phrase` varchar(64) NOT NULL,
  `de_DE` varchar(2048) NOT NULL DEFAULT '',
  `en_US` varchar(2048) NOT NULL DEFAULT '',
  `bg_BG` varchar(2048) CHARACTER SET utf8mb4 NOT NULL DEFAULT '',
  `es_ES` varchar(2048) NOT NULL DEFAULT '',
  `uk_UA` varchar(2048) NOT NULL DEFAULT '',
  `ru_RU` varchar(2048) NOT NULL DEFAULT '',
  PRIMARY KEY (`phrase`),
  KEY `fk_language_modules_module_idx` (`language_module`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `locale_tags`
--

INSERT INTO `locale_tags` (`language_module`, `phrase`, `de_DE`, `en_US`, `bg_BG`, `es_ES`, `uk_UA`, `ru_RU`) VALUES
('Site reservations', '3-Axis Crane', '3-Achs-Portal', '3-Axis Portal', '', '', '', ''),
('Site admin', 'add', 'Hinzufügen', 'Add', '', '', '', ''),
('Site admin', 'add_new_locale', 'Neues Land hinzufügen', 'Add new country', '', '', '', ''),
('Site admin', 'add_new_user', 'Neuen Nutzer zur Gruppe hinzufügen', 'Add new user to group', '', '', '', ''),
('Site admin', 'admin', 'Adminbereich', 'Admin', '', '', '', ''),
('Site admin', 'admin_booking_description', 'Überblick über alle aktuell gebuchten Experimente. Admin kann beliebige Experimente abbrechen.', 'Overview about actually running experiments. The admin has the right to cancel any experiment immediately.', '', '', '', ''),
('Site admin', 'admin_devicelist_description', 'Liste der aktuell in GOLDI angeschlossenen Steuereinheiten und physikalischen Systeme, unabhängig von deren aktueller Nutzung.', 'List of all actual connected control units and physical systems independent of their actual usage.', '', '', '', ''),
('Site admin', 'admin_groupmembers_description', 'Registrierte Nutzer können über eine Auswahlliste den unter Punkt "Gruppen" angelegten Nutzergruppen zugeordnet werden. Darüber hinaus kann das Recht "Gruppenadministrator" zugeordnet werden ...?', 'Registered user can be assigned to defined groups. Additional a group admin can be defined.', '', '', '', ''),
('Site admin', 'admin_grouprestrictions_description', 'Zuordnung von unter "Restriktionen" definierten Restriktionsarten zu Gruppen mit bestimmten Werten (Maßeinheit beachten!)', 'Assign of restictions to groups. Restrictions can be defined on topic "Restrictions", but there must also an algorithm implemented that controls the restriction.', '', '', '', ''),
('Site admin', 'admin_groups_description', 'Nutzergruppen können hier angelegt, geändert oder gelöscht werden. Die drei Gruppen User, Admin und Lecturer können nicht gelöscht werden.', 'User groups can be created, edited and deleted. Additionally you can  define a keyword for those, who want to join the group. The group ID is generated automatically and cannot be changed.(exception: user, admin and lecturer). ', '', '', '', ''),
('Site admin', 'admin_language_description', 'Alle Texte und Beschriftungen (einschließlich dieses Textes) können hier geändert bzw. in neuen Sprachen ergänzt werden. Vorsicht: Alle Änderungen werden unmittelbar im Netz sichtbar!', 'All texts (including this one) can be changed and new languages can be added at this page. Be careful, all changes are visible immediately!', '', '', '', ''),
('Site admin', 'admin_reservation_description', 'Überblick über alle Reservierungen. Admin kann Reservierungen löschen.', 'Overview about all reservations. The admin has the right to cancel any reservation.', '', '', '', ''),
('Site admin', 'admin_restrictions_description', 'Hier kann man sich beliebige Restriktionen ausdenken, die aber erst wirksam werden, wenn der zugehörige Algorithmus im System implementiert ist ;-(', 'Define restictions that can be assigned to groups influencing the properties of groups (e.g. max number of participants) or their rights (e.g. max. duration of an experiment).', '', '', '', ''),
('Site admin', 'admin_user_management_description', 'Hier können Nutzer gelöscht, blockiert bzw. aus Gruppen gelöscht werden.', 'Here you can delete or block users or remove them from different groups.', '', '', '', ''),
('Module AuthentificationModule', 'alert_registration_successfull', 'Registrierung erfolgreich', 'Registration successfull', '', '', '', ''),
('Site admin', 'blocked', 'Blockiert', 'Blocked', '', '', '', ''),
('Site admin', 'bookings', 'Buchungen', 'Bookings', '', '', '', ''),
('Site reservations', 'BPU', 'Steuereinheit', 'Control Unit', '', '', '', ''),
('Site admin', 'category', 'Kategorie', 'Category', '', '', '', ''),
('Module RichCalendar', 'clear_date', 'Datum löschen', 'Clear date', '', '', '', ''),
('Module RichCalendar', 'close', 'Schließen', 'Close', '', '', '', ''),
('Module RichCalendar', 'close_calendar', 'Möchten Sie den Kalender wirklich schließen?', 'Are you sure to close the calendar?', '', '', '', ''),
('Site user', 'confirm_delete_from_group', 'Wollen Sie von der Gruppe %s gelöscht werden?', 'Would you be removed from group %s?', '', '', '', ''),
('Site admin', 'confirm_delete_group', 'Soll die Gruppe %s gelöscht werden?', 'Delete the group %s?', '', '', '', ''),
('Site admin', 'confirm_delete_locale', 'Soll die Lokalisierung %s gelöscht werden?', 'Delete the locale %s?', '', '', '', ''),
('Site admin', 'confirm_delete_phrase', 'Soll die Phrase %s gelöscht werden?', 'Delete the phrase %s?', '', '', '', ''),
('Site reservations', 'confirm_delete_reservation', 'Soll die Reservierung mit der ID %d gelöscht werden?', 'Delete the reservation with ID %d?', '', '', '', ''),
('Site admin', 'confirm_delete_restriction', 'Soll die Restriktion %s gelöscht werden?', 'Delete the restriction %s?', '', '', '', ''),
('Site admin', 'confirm_delete_restriction_from_group', 'Soll die Restriktion %s von der Gruppe %s gelöscht werden?', 'Delete the restriction %s from group %s?', '', '', '', ''),
('Site admin', 'confirm_delete_user', 'Soll der Nutzer %s gelöscht werden?', 'Delete user %s?', '', '', '', ''),
('Site admin', 'confirm_delete_user_from_group', 'Soll der Nutzer %s von der Gruppe %s gelöscht werden?', 'Delete user %s from group %s?', '', '', '', ''),
('Site admin', 'confirm_end_booking', 'Soll die aktive Buchung mit der ID %d beendet werden?', 'End active booking with ID %d?', '', '', '', ''),
('Site reservations', 'confirm_final_booking', '%d Minuten am %s buchen?', 'Book %d minutes at the %s?', '', '', '', ''),
('Site admin', 'country', 'Land', 'Country', '', '', '', ''),
('Site reservations', 'date', 'Datum', 'Date', '', '', '', ''),
('Site admin', 'delete', 'Löschen', 'Delete', '', '', '', ''),
('Site user', 'delete_from', 'Lösche von', 'Delete from', '', '', '', ''),
('Site develop', 'develop', 'Entwicklung', 'Development', '', '', '', ''),
('Site admin', 'devices', 'Geräteliste', 'Device list', '', '', '', ''),
('Site reservations', 'duration', 'Dauer', 'Duration', '', '', '', ''),
('Module AuthentificationModule', 'email', 'E-Mail-Adresse', 'E-mail address', '', '', '', ''),
('Module AuthentificationModule', 'email_repeat', 'E-Mail-Adresse wiederholen', 'Repeate e-mail address ', '', '', '', ''),
('Site admin', 'end_booking', 'Experiment beenden', 'Interrupt experiment', '', '', '', ''),
('Site reservations', 'end_time', 'Endzeitpunkt', 'End time', '', '', '', ''),
('Site reservations', 'error_booking_in_the_past', 'Buchungen müssen in der Zukunft liegen', 'Bookings must be in the future', '', '', '', ''),
('Site reservations', 'error_BPU_not_selected', 'Steuereinheit ist nicht ausgewählt', 'Control unit is not selected', '', '', '', ''),
('Site reservations', 'error_date_not_set', 'Datum ist nicht gesetzt', 'Date must be set', '', '', '', ''),
('Module AuthentificationModule', 'error_email_empty', 'Keine E-Mail-Adresse angegeben', 'E-mail address is missing', '', '', '', ''),
('Module AuthentificationModule', 'error_email_exists', 'Die E-Mail-Adresse ist bereits vorhanden', 'E-mail exists', '', '', '', ''),
('Module AuthentificationModule', 'error_email_not_equal', 'Die angegebenen E-Mail-Adressen sind nicht gleich', 'E-mail addresses are not equal', '', '', '', ''),
('Module AuthentificationModule', 'error_email_not_valid', 'Die E-Mail-Adresse hat ein falsches Format', 'E-mail address is not valid', '', '', '', ''),
('Module AuthentificationModule', 'error_email_repeat_empty', 'Die E-Mail-Adresse muss wiederholt eingegeben werden', 'E-mail address must be repeated', '', '', '', ''),
('Site reservations', 'error_experiment_not_start', 'Das Experiment konnte wegen fehlerhafter Buchung nicht gestartet werden.', 'Experiment could not be started because of a booking error', '', '', '', ''),
('Module AuthentificationModule', 'error_first_name_empty', 'Der Vorname wurde nicht angegeben', 'First name is missing', '', '', '', ''),
('Module AuthentificationModule', 'error_last_name_empty', 'Der Nachname wurde nicht angegeben', 'Last name is missing', '', '', '', ''),
('Module AuthentificationModule', 'error_new_password_empty', 'Das Passwort wurde nicht angegeben', 'Password is missing', '', '', '', ''),
('Module AuthentificationModule', 'error_new_username_empty', 'Der Benutzername wurde nicht angegeben', 'Username is missing', '', '', '', ''),
('Site reservations', 'error_no_real_device', 'Reine Simulationen können ohne vorherige Reservierung ausgeführt werden. Starten jederzeit im Menü "Gastnutzer" möglich.', 'Simulations-only-mode can be used without reservation. To start the experiment, use the guest menue.', '', '', '', ''),
('Site reservations', 'error_no_time_left', 'Heute keine freien Reservierungszeiten  mehr', 'There is no time left for reservations today', '', '', '', ''),
('Module AuthentificationModule', 'error_password_length', 'Das Passwort muss mindestens 6 Zeichen lang sein', 'Password must be larger than 6 characters', '', '', '', ''),
('Module AuthentificationModule', 'error_password_not_equal', 'Die eingegebenen Passwörter müssen überein stimmen', 'Entered passwords must be equal', '', '', '', ''),
('Module AuthentificationModule', 'error_password_repeat_empty', 'Das Passwort muss wiederholt eingegeben werden', 'Password must be repeated', '', '', '', ''),
('Site admin', 'error_phrase_exists', 'Diese Phrase existiert bereits. Bitte eine andere wählen.', 'The phrase already exists. Please choose another.', '', '', '', ''),
('Site reservations', 'error_PSPU_not_selected', 'Physisches System ist nicht ausgewählt', 'No physical system selected', '', '', '', ''),
('Site main', 'error_pspu_type_not_set', 'Keine PSPU gesetzt, von denen die Übersetzungen bereitgestellt werden sollen.', 'There is no PSPU set for getting the translations.', '', '', '', ''),
('Site reservations', 'error_reservation_failed', 'Reservierung fehlgeschlagen', 'Reservation failed', '', '', '', ''),
('Site main', 'error_ria_device_busy', 'Ein anderer Nutzer war leider Schneller. Eines der gebuchten Geräte ist bereits in Verwendung. Versuchen Sie es bitte später noch einmal.', 'Another user was faster than you. At least one of the devices is busy. Please try again later.', '', '', '', ''),
('Site main', 'error_ria_wrong_settings', 'Das Applet kann nur mit korrekten Einstellungen gestartet werden. Bitte versuchen Sie es später erneut oder wenden Sie sich an einen Administrator.', 'The applet can only be startet with correct parameters. Please try again later or contact an admin.', '', '', '', ''),
('Module AuthentificationModule', 'error_username_exists', 'Der Benutzername existiert bereits', 'Username exists', '', '', '', ''),
('Site reservations', 'FiniteStateMachine', 'Automatengraph', 'FiniteStateMachine', '', '', '', ''),
('Module AuthentificationModule', 'first_name', 'Vorname', 'First name', '', '', '', ''),
('Site main', 'footer', 'Copyright by TU Ilmenau, IKS, 2014', 'Copyright by TU Ilmenau, ICS, 2014', '', '', '', ''),
('Module RichCalendar', 'footerDefaultText', 'Datum auswählen', 'Select date', '', '', '', ''),
('Module RichCalendar', 'format_calendar_date', '%d.%m.%y', '%m/%d/%y', '', '', '', ''),
('Site main', 'format_date', '%d.%m.%g', '%m/%d/%g', '', '', '', ''),
('Site main', 'format_datetime', '%d.%m.%g %H:%M:%S', '%m/%d/%g %H:%M:%S', '', '', '', ''),
('Site reservations', 'FPGA', 'FPGA', 'FPGA', '', '', '', ''),
('Site user', 'group', 'Gruppe', 'Group', '', '', '', ''),
('Site admin', 'groupadmin', 'Gruppenadministrator', 'Group admin', '', '', '', ''),
('Site admin', 'groupmembers', 'Gruppenmitglieder', 'Group members', '', '', '', ''),
('Site admin', 'grouprestrictions', 'Gruppenrestriktionen', 'Group restrictions', '', '', '', ''),
('Site user', 'groups', 'Gruppenverwaltung', 'Group management', '', '', '', ''),
('Site user', 'group_id', 'Gruppen ID', 'Group ID', '', '', '', ''),
('Site user', 'group_join_key', 'Geheimer Gruppen-Schlüssel', 'Secret join key', '', '', '', ''),
('Site user', 'group_name', 'Gruppen Name', 'Gruppen Name', '', '', '', ''),
('Site guest', 'guest', '', 'Guest user', '', '', '', ''),
('Site guest', 'guest_description', 'Gastnutzer können jederzeit virtuelle Experimente ausführen. Dazu sind je eine virtuelle Steuerung (Automatengraph) und eine Simulation (virtuelles physikalisches System) auszuwählen. Laborexperimente mit realen Steuereinheiten / physikalischen Systemen können nur zu freien Zeiten durchgeführt werden. Reservierungen beenden diese Experimente umgehend, sobald sich der entsprechende Nutzer eingeloggt hat. Reservierungen werden im Menü "Reservierungen"  (sichtbar nach einloggen) verwaltet.', 'Guest users can make virtual experiments at any time. Therefor they have to choose a combination of a virtual control unit (FiniteStateMachine) and a virtual physical system (simulation). Experiments  accessing real control and/or physical systems in the remote lab can only made during times with no reservations. As soon as the appropriate user logs in, the guest''s  experiment will be interrupted.', '', '', '', ''),
('Site virtualria', 'guest_experiments', 'Gast-Experimente', 'Guest experiments', '', '', '', ''),
('Site main', 'header', 'Willkommen beim Remotelab der TU-Ilmenau', 'Welcome to Ilmenau University of Technology Remote Laboratory', '', '', '', ''),
('Site home', 'home', 'Start', 'Home', '', '', '', ''),
('Site reservations', 'ID', 'ID', 'ID', '', '', '', ''),
('Module AuthentificationModule', 'info_optional_values', 'Angaben mit * sind Optional', 'Values with * are optional', '', '', '', ''),
('Site admin', 'in_groups', 'In Gruppen', 'In groups', '', '', '', ''),
('Site user', 'join', 'Beitreten', 'Join', '', '', '', ''),
('Site admin', 'joinable', 'Beitretbar', 'Joinable', '', '', '', ''),
('Site user', 'join_group_with_secrect_key', 'Tritt einer Gruppe mit Geheiminformationen bei', 'Join group with secret information', '', '', '', ''),
('Site admin', 'join_key', 'Beitrittsschlüssel', 'Join key', '', '', '', ''),
('Site admin', 'language', 'Sprache', 'Language', '', '', '', ''),
('Site languageadmin', 'languageadmin', 'Sprachadmin', 'Language Admin', '', '', '', ''),
('Site admin', 'language_management', 'Sprachverwaltung', 'Language management', '', '', '', ''),
('Site admin', 'language_tags', 'Platzhalter für Sprachen', 'Language tags', '', '', '', ''),
('Site admin', 'last_login', 'Letzer Login', 'Last login', '', '', '', ''),
('Module AuthentificationModule', 'last_name', 'Nachname', 'Last name', '', '', '', ''),
('Module AuthentificationModule', 'ldap_name', 'LDAP TU-Ilmenau', 'LDAP TU-Ilmenau', '', '', '', ''),
('Module AuthentificationModule', 'ldb_name', 'GOLDI-Datenbank', 'GOLDI-database', '', '', '', ''),
('Site reservations', 'Lift 3 floors', 'Aufzug 3 Etagen', 'Elevator 3 floors', '', '', '', ''),
('Site reservations', 'Lift 4 floors', 'Aufzug 4 Etagen', 'Elevator 4 floors', '', '', '', ''),
('Module AuthentificationModule', 'login', 'Einloggen', 'Login', '', '', '', ''),
('Module AuthentificationModule', 'login_description', 'Folgende Autorisierungsmethoden sind verfügbar', 'Following authentication methods are available', '', '', '', ''),
('Module AuthentificationModule', 'login_failed', 'Login ist fehlgeschlagen, bitte erneut versuchen', 'Login failed, please try again', '', '', '', ''),
('Module AuthentificationModule', 'logout', 'Ausloggen', 'Logout', '', '', '', ''),
('Module RichCalendar', 'make_first', 'Beginne mit', 'Start with', '', '', '', ''),
('Site reservations', 'Maze', 'Labyrinth', 'Maze', '', '', '', ''),
('Site reservations', 'Microcontroller', 'Mikrocontroller', 'Microcontroller', '', '', '', ''),
('Site develop', 'missing_lang', 'Fehlende Übersetzungen ausgeben', 'Print missing translations', '', '', '', ''),
('Site reservations', 'mode', 'Modus', 'Mode', '', '', '', ''),
('Site admin', 'new', 'Neu', 'New', '', '', '', ''),
('Site reservations', 'new_reservation', 'Neue Reservierung', 'New reservation', '', '', '', ''),
('Site reservations', 'new_reservation_description', 'Reservierungen für Experimente können hier erfolgen. Dabei ist stets eine Kombination aus Steuereinheit und physischem System auszuwählen. Die aktuell ausgewählte Kombination ist rot umrandet. Zusätzlich kann zwischen realen und virtuellen Systemen (Simulationen) durch Klicken der entsprechenden Checkbox gewechselt werden. Experimente mit einer Kombination aus virtueller Steuereinheit (Automatengraph) und einer Simulation können jederzeit ohne Reservierung ausgewählt und im Gast-Login-Modus durchgeführt werden. Bei der Auswahl von realen Geräten im Labor weisen schwarze Bezeichner auf verfügbare Einheiten hin, nicht verfügbare sind grau und können zu der gewünschten Zeit nicht ausgewählt werden. ', 'To reserve an experiment, you have to choose a combination of one control unit and one physical system. The actual combination is marked by a red frame. Additionally you can choose between real and virtual systems (Simulations) by clicking the appropriate check box. Experiments, using a virtual controller (FSM) in combination with a simulation, can be executed at any time without reservations by using the guest login. If you choose real devices in the lab, you can see which combinations are available at a certain time. Only black labelled devices can be reserved, others are grey. ', '', '', '', ''),
('Module RichCalendar', 'next_month', 'Nächster Monat', 'Next month', '', '', '', ''),
('Module RichCalendar', 'next_year', 'Nächstes Jahr', 'Next year', '', '', '', ''),
('Site reservations', 'notification_reservation_successfull', 'Reservierung erfolgreich eingetragen', 'Reservation successfull', '', '', '', ''),
('Site admin', 'notification_value_low', 'Der eingetragene Wert muss größer als 0 sein.', 'The value must be more than 0.', '', '', '', ''),
('Site reservations', 'options', 'Optionen', 'Options', '', '', '', ''),
('Module AuthentificationModule', 'password', 'Passwort', 'Password', '', '', '', ''),
('Module AuthentificationModule', 'password_repeat', 'Passwort wiederholen', 'Repeat password ', '', '', '', ''),
('Module RichCalendar', 'prev_month', 'Vorheriger Monat', 'Previous month', '', '', '', ''),
('Module RichCalendar', 'prev_year', 'Vorheriges Jahr', 'Previous year', '', '', '', ''),
('Site develop', 'print_session', 'print_r($_SESSION);', 'print_r($_SESSION);', '', '', '', ''),
('Site reservations', 'PSPU', 'Physisches System', 'Physical System', '', '', '', ''),
('Site reservations', 'Pump', 'Füllstands- Regelung', 'Water Level Control', '', '', '', ''),
('Site reservations', 'real', 'Real', 'Real', '', '', '', ''),
('Module AuthentificationModule', 'register', 'Registrieren', 'Register', '', '', '', ''),
('Site reservations', 'reservate', 'Reservieren', 'Reserve', '', '', '', ''),
('Site reservations', 'reservations', 'Reservierungen', 'Reservations', '', '', '', ''),
('Site reservations', 'reservation_description', 'Hier werden alle aktuellen Reservierungen angezeigt. Mit Klicken auf das Kreuz kann der jeweilige Termin gelöscht werden', 'Here you can see all your reservations. By clicking the cross you can delete a reservation.', '', '', '', ''),
('Site reservations', 'reservation_instruction', 'Zur Reservierung bitte auf die Zeitleiste klicken', 'To make reservations, please click on the timeline below', '', '', '', ''),
('Site develop', 'reset_session', 'Sessionvariable zurücksetzen', 'Reset session', '', '', '', ''),
('Site admin', 'restriction', 'Restriktion', 'Restriction', '', '', '', ''),
('Site admin', 'restrictions', 'Restriktionen', 'Restrictions', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_ADDMACHINE', 'Automat hinzufügen', 'Add machine', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_ADDMACHINEDIALOGUEINFORMATION', 'Bitte eine Beschreibung für den Automaten eingeben:', 'Please enter a description for the machine:', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_CANCELBUTTON', 'Abbrechen', 'Cancel', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_CLEARLOG', 'Log löschen', 'Clear log', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_CLOCKSPERSECONDUNIT', 'Hz', 'Hz', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_CLOSEBUTTON', 'Schließen', 'Close', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_CONNECT', 'Verbinden', 'Connect', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_CONNECTING', 'Verbinde', 'Connecting', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_CONNECTIONREMAININGTIME', 'Verbleibende Zeit', 'Time remaining', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_CONNECTIONTOTALTIME', 'Verbindungsdauer', 'Connection duration', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_CONTROLHEADER', 'Bedienelemente', 'Controls', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_CURRENTINPUTVALUE', 'Momentane Eingangsbelegung', 'Current input value', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_CURRENTSTATE', 'Momentaner Zustand', 'Current state', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_DELETEALLBUTTON', 'Alles löschen', 'Delete all', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_DELETEMACHINE', 'Automat löschen', 'Delete machine', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_DELETEMACHINEDIALOGUEINFORMATION', 'Sind sie sicher?', 'Are you sure?', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_DISCONNECT', 'Trennen', 'Disconnect', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_DISCONNECTED', 'Getrennt', 'Disconnected', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_DISCONNECTEDMESSAGE', 'Verbindung wurde getrennt. Bitte schließen Sie das Browserfenster!', 'Connection terminated. Please close your browser window!', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_EQUATIONDEFINER', ':=', ':=', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_EQUATIONSTABSINPUTS', '', '', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_EQUATIONTABSHEADER', 'Eingabe von Steuergleichungen', 'Input Equations', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_EQUATIONTABSHSTAR', 'h*', 'h*', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_EQUATIONTABSMACHINES', 'Automaten', 'Machines', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_EQUATIONTABSOUTPUTS', 'Ausgänge y', 'Outputs y', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_ERRORLOG', 'Fehlerlog', 'Error log', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_EXAMPLEBUTTON', 'Beispiel', 'Example', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_FILETRANSFERCOMPLETE', 'Datentransfer abgeschlossen', 'File transfer complete', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_INITIALIZE', 'Initialisieren', 'Initialize', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_INITIALMODELSTATE', 'Modellzustand', 'Model state', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_INITSTATE', 'Initialzustand', 'Initial state', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_INPUTDESCRIPTION', 'Beschreibung der IOs', 'IO description', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_LANGUAGES', 'Sprachen', 'Languages', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_NAME', 'Deutsch', 'English', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_NOFILESELECTED', 'Keine Datei ausgewählt', 'No file selected', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_OKBUTTON', 'OK', 'OK', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_ONLYSIMULATE', 'Nur simulieren', 'Simulation only', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_OPENBUTTON', 'Öffnen', 'Open', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_OPTIONSBUTTON', 'Optionen', 'Options', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_RESETSIMULATION', 'Reset', 'Reset', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_SAVEBUTTON', 'Speichern', 'Save', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_SAVEBUTTONLABEL', 'Speichern', 'Save', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_SCENARIOEDITORDESCRIPTION', 'Initialzustand des Modells:', 'Initial state of the model:', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_SENSORDISTANCEUNIT', 'Takte', 'Clocks', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_SIMULATIONCLOCKSLIDER', 'Frequenz', 'Frequency', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_SIMULATIONSENSORSLIDER', 'Sensorabstand', 'Sensor distance', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_START', 'Start', 'Start', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_STOP', 'Stopp', 'Stop', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_WEBCAMENABLED', 'Webcam aktivieren', 'Enable webcam', '', '', '', ''),
('PSPU all devices', 'RIA_ALL_ZEQUATIONS', 'z-Gleichungen', 'z equations', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_ANIMATION_ALERT', 'Alarm', 'Alert', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_ANIMATION_E_STOP', 'Nothalt', 'Emergency stop', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_ANIMATION_FLOOR1', 'Etage 1', 'Floor 1', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_ANIMATION_FLOOR2', 'Etage 2', 'Floor 2', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_ANIMATION_FLOOR3', 'Etage 3', 'Floor 3', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_ANIMATION_H2_LIFT_CONTROL', 'Fahrstuhl-Steuerung', 'Elevator control', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_ANIMATION_H2_LIFT_MOVE', 'Fahrstuhl-Fahrt', 'Elevator is moving', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_ANIMATION_MOVING_DIRECTION', 'Richtung', 'Direction', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_ANIMATION_OVERLOAD', 'Überlast', 'Overload', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_ANIMATION_SPEED_SLOW', 'Langsam', 'Drive slowly', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_ERROR_200', 'Ungültige Simulationsfrequenz gewählt', 'Invalid simulation frequency selected', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_error_201', 'Sensordistanz kann nicht unter 1 betragen', 'Sensor distance can''t be less then 1', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_error_202', 'Undefinierter Ausgabewert', 'Undefined output value', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_error_3', 'Fahrstuhl hätte gestoppt werden müssen!', 'Elevator should have been stopped!', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_error_4', 'Die Tür hätte gestoppt werden müssen!', 'Door should have been stopped!', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_error_5', 'Tür kann nicht geöffnet werden!', 'Unable to close the door!', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_error_6', 'Tür kann nicht geschlossen werden!', 'Unable to open the door!', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_exception_NOT_ON_FLOOR_1', 'Fahrstuhl ist nicht auf Etage 1.', 'Elevator is not on stage 1.', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_exception_NOT_ON_FLOOR_2', 'Fahrstuhl ist nicht auf Etage 2.', 'Elevator is not on stage 2.', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_exception_NOT_ON_FLOOR_3', 'Fahrstuhl ist nicht auf Etage 3.', 'Elevator is not on stage 3.', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_inputs_x0', 'Fahrstuhl auf Etage 1', 'Elevator on floor 1', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_inputs_x1', 'Fahrstuhl auf Etage 2', 'Elevator on floor 2', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_inputs_x10', 'Tür (Etage 2) geschlossen)', 'Floor 2 - Door closed', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_inputs_x11', 'Tür (Etage 3) geöffnet', 'Floor 3 - Door open', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_inputs_x12', 'Tür (Etage 3) geschlossen)', 'Floor 3 - Door closed', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_inputs_x13', 'Lichtschranke Etage 1', 'Light barrier floor 1', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_inputs_x14', 'Lichtschranke Etage 2', 'Light barrier floor 2', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_inputs_x15', 'Lichtschranke Etage 3', 'Light barrier floor 3', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_inputs_x16', 'Ruftaste Etage 1', 'Call button floor 1', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_inputs_x17', 'Ruftaste Etage 2 nach unten', 'Call button floor 2 up', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_inputs_x18', 'Ruftaste Etage 2 nach oben', 'Call button floor 2 down', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_inputs_x19', 'Ruftaste Etage 3', 'Call button floor 3', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_inputs_x2', 'Fahrstuhl auf Etage 3', 'Elevator on floor 3', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_inputs_x20', 'Fahrstuhl-Steuerung Etage 1', 'Elevator control - floor 1', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_inputs_x21', 'Fahrstuhl-Steuerung Etage 2', 'Elevator control - floor 2', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_inputs_x22', 'Fahrstuhl-Steuerung Etage 3', 'Elevator control - floor 3', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_inputs_x23', 'Fahrstuhl-Steuerung Alarm', 'Elevator control - alert', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_inputs_x24', 'Fahrstuhl-Steuerung Nothalt', 'Elevator control - emergency stop', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_inputs_x25', 'Simulation Überlast', 'Simulation overload', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_inputs_x3', 'Fahrstuhl über Etage 1', 'Elevator above floor 1', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_inputs_x4', 'Fahrstuhl unter Etage 2', 'Elevator below floor 2', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_inputs_x5', 'Fahrstuhl über Etage 2', 'Elevator above floor 2', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_inputs_x6', 'Fahrstuhl unter Etage 3', 'Elevator below floor 3', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_inputs_x7', 'Tür (Etage 1) geöffnet', 'Floor 1 - Door open', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_inputs_x8', 'Tï¿½r (Etage 1) geschlossen', 'Floor 1 - Door closed', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_inputs_x9', 'Tür (Etage 2) geöffnet', 'Floor 2 - Door open', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_outputs_y0', 'Fahren - aufwärts', 'Drive upwards', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_outputs_y1', 'Fahren - abwärts', 'Drive downwards', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_outputs_y10', 'Rufanzeige Etage 2 - aufwärts', 'Call display floor 2 - upward', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_outputs_y11', 'Rufanzeige Etage 2 - abwärts', 'Call display floor 2 - downward', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_outputs_y12', 'Rufanzeige Etage 3', 'Call display floor 3', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_outputs_y13', 'Meldeanzeige Etage 1', 'Indicator display floor 1', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_outputs_y14', 'Meldeanzeige Etage 2', 'Indicator display floor 2', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_outputs_y15', 'Meldeanzeige Etage 3', 'Indicator display floor 3', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_outputs_y16', 'Fahrtrichtungsanzeige - nach unten', 'Drive direction display - downward', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_outputs_y17', 'Fahrtrichtungsanzeige - nach oben', 'Drive direction display - upward', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_outputs_y18', 'Fahrstuhlsteuerung - Rufanzeige Etage 1', 'Elevator control - Indicator display floor 1', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_outputs_y19', 'Fahrstuhlsteuerung - Rufanzeige Etage 2', 'Elevator control - Indicator display floor 2', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_outputs_y2', 'Fahren - langsam', 'Drive slowly', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_outputs_y20', 'Fahrstuhlsteuerung - Rufanzeige Etage 3', 'Elevator control - Indicator display floor 3', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_outputs_y21', 'Meldeleuchte Alarm', 'Elevator control -  alert', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_outputs_y22', 'Meldeleuchte Nothalt', 'Elevator control -  emergency stop', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_outputs_y23', 'Meldeleuchte Überlast', 'Elevator control -  overload', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_outputs_y3', 'Tür Etage 1 - öffnen', 'Door floor 1 - open', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_outputs_y4', 'Tür Etage 1 - schließen', 'Door floor 1 - close', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_outputs_y5', 'Tür Etage 2 - öffnen', 'Door floor 2 - open', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_outputs_y6', 'Tür Etage 2 - schließen', 'Door floor 2 - close', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_outputs_y7', 'Tür Etage 3 - öffnen', 'Door floor 3 - open', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_outputs_y8', 'Tür Etage 3 - schließen', 'Door floor 3 - close', '', '', '', ''),
('PSPU Lift 3 floors', 'RIA_ELEVATOR3_outputs_y9', 'Rufanzeige Etage 1', 'Call display floor 1', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_animation_ALERT', 'Alarm', 'Alert', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_animation_E_STOP', 'Nothalt', 'Emergency Stop', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_animation_FLOOR1', 'Etage 1', 'Floor 1', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_animation_FLOOR2', 'Etage 2', 'Floor 2', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_animation_FLOOR3', 'Etage 3', 'Floor 3', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_animation_FLOOR4', 'Etage 4', 'Floor 4', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_animation_H2_LIFT_CONTROL', 'Fahrstuhl-Steuerung', 'Elevator control', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_animation_H2_LIFT_MOVE', 'Fahrstuhl-Fahrt', 'Elevator drive', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_animation_MOVING_DIRECTION', 'Richtung', 'Direction', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_animation_OVERLOAD', 'Überlast', 'Overload', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_animation_SPEED_SLOW', 'Langsam', 'Drive slowly', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_error_0', 'Ungültige Simulationsfrequenz gewählt', 'Invalid simulation frequency selected', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_error_1', 'Sensordistanz kann nicht unter 1 betragen', 'Sensor distance can''t be less then 1', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_ERROR_10', 'Tür kann nicht geschlossen werden!', 'Door cannot be closed!', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_error_2', 'Undefinierter Ausgabewert', 'Undefined output value', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_ERROR_3', 'Fahrstuhl hätte gestoppt werden müssen!', 'Elevator should have been stopped!', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_ERROR_4', 'Fahrstuhl ist nicht auf Etage 1.', 'Elevator is not on floor 1.', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_ERROR_5', 'Fahrstuhl ist nicht auf Etage 2.', 'Elevator is not on floor 2.', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_ERROR_6', 'Fahrstuhl ist nicht auf Etage 4.', 'Elevator is not on floor 4.', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_ERROR_7', 'Fahrstuhl ist nicht auf Etage 3.', 'Elevator is not on floor 3.', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_ERROR_8', 'Tür hätte gestoppt werden müssen!', 'Door should have been stopped!', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_ERROR_9', 'Tür kann nicht geöffnet werden!', 'Door cannot be opened!', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_inputs_x0', 'Tür (Etage 1) geöffnet', 'Door (floor 1) open', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_inputs_x1', 'Tür (Etage 2) geöffnet', 'Door (floor 2) open', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_inputs_x10', 'Knopf aufwärts (Etage 3)', 'Button up (floor 3)', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_inputs_x11', 'Knopf abwärts (Etage 2)', 'Button down (floor 2)', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_inputs_x12', 'Knopf abwärts (Etage 3)', 'Button down (floor 3)', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_inputs_x13', 'Knopf abwärts (Etage 4)', 'Button down (floor 4)', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_inputs_x14', 'Fahrstuhl-Steuerung Etage 1', 'Elevator control floor 1', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_inputs_x15', 'Fahrstuhl-Steuerung Etage 2', 'Elevator control floor 2', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_inputs_x16', 'Fahrstuhl-Steuerung Etage 3', 'Elevator control floor 3', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_inputs_x17', 'Fahrstuhl-Steuerung Etage 4', 'Elevator control floor 4', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_inputs_x18', 'Überlast', 'Overloaded', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_inputs_x19', 'Fahrstuhl auf Etage 1', 'Elevator on floor 1', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_inputs_x2', 'Tür (Etage 3) geöffnet', 'Door (floor 3) open', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_inputs_x20', 'Fahrstuhl auf Etage 2', 'Elevator on floor 2', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_inputs_x21', 'Fahrstuhl auf Etage 3', 'Elevator on floor 3', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_inputs_x22', 'Fahrstuhl auf Etage 4', 'Elevator on floor 4', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_inputs_x23', 'Fahrstuhl über Etage 1', 'Elevator above floor 1', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_inputs_x24', 'Fahrstuhl über Etage 2', 'Elevator above floor 2', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_inputs_x25', 'Fahrstuhl über Etage 3', 'Elevator above floor 3', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_inputs_x26', 'Fahrstuhl unter Etage 2', 'Elevator below floor 2', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_inputs_x27', 'Fahrstuhl unter Etage 3', 'Elevator below floor 3', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_inputs_x28', 'Fahrstuhl unter Etage 4', 'Elevator below floor 4', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_inputs_x29', 'Fahrstuhl-Steuerung - Alarm (Low-Aktiv)', 'Elevator control - Alert (active low)', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_inputs_x3', 'Tür (Etage 4) geöffnet', 'Door (floor 4) opened', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_inputs_x30', 'Fahrstuhl-Steuerung - Nothalt (Low-Aktiv)', 'Elevator control - Emergency Stop (active low)', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_inputs_x4', 'Tür (Etage 1) geschlossen', 'Door (floor 1) closed', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_inputs_x5', 'Tür (Etage 2) geschlossen', 'Door (floor 2) closed', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_inputs_x6', 'Tür (Etage 3) geschlossen', 'Door (floor 3) closed', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_inputs_x7', 'Tür (Etage 4) geschlossen', 'Door (floor 4) closed', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_inputs_x8', 'Knopf aufwärts (Etage 1)', 'Button up (floor 1)', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_inputs_x9', 'Knopf aufwärts (Etage 2)', 'Button up (floor 2)', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_outputs_y0', 'Fahren - aufwärts', 'Move upwards', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_outputs_y1', 'Fahren - abwärts', 'Move downwards', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_outputs_y10', 'Tür Etage 4 - schließen', 'Door floor 4 - close', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_outputs_y11', 'Etage 1 - LED (rot)', 'Floor 1 - LED (red)', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_outputs_y12', 'Etage 2 - LED (rot)', 'Floor 2 - LED (red)', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_outputs_y13', 'Etage 3 - LED (rot)', 'Floor 3 - LED (red)', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_outputs_y14', 'Etage 2 - LED (grün)', 'Floor 2 - LED (green)', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_outputs_y15', 'Etage 3 - LED (grün)', 'Floor 3 - LED (green)', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_outputs_y16', 'Etage 4 - LED (grün)', 'Floor 4 - LED (green)', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_outputs_y17', 'Etage 1 - LED (gelb, aufwärts)', 'Floor 1 - LED (yellow, upward)', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_outputs_y18', 'Etage 2 - LED (gelb, aufwärts)', 'Floor 2 - LED (yellow, upward)', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_outputs_y19', 'Etage 3 - LED (gelb, aufwärts)', 'Floor 3 - LED (yellow, upward)', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_outputs_y2', 'Fahren - langsam', 'Move slowly', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_outputs_y20', 'Etage 2 - LED (gelb, abwärts)', 'Floor 2 - LED (yellow, downward)', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_outputs_y21', 'Etage 3 - LED (gelb, abwärts)', 'Floor 3 - LED (yellow, downward)', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_outputs_y22', 'Etage 4 - LED (gelb, abwärts)', 'Floor 4 - LED (yellow, downward)', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_outputs_y23', 'Fahrstuhl-Steuerung - LED (Etage 1)', 'Elevator control - LED (floor 1)', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_outputs_y24', 'Fahrstuhl-Steuerung - LED (Etage 2)', 'Elevator control - LED (floor 2)', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_outputs_y25', 'Fahrstuhl-Steuerung - LED (Etage 3)', 'Elevator control - LED (floor 3)', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_outputs_y26', 'Fahrstuhl-Steuerung - LED (Etage 4)', 'Elevator control - LED (floor 4)', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_outputs_y27', 'Fahrstuhl-Steuerung - LED (überladen)', 'Elevator control - LED (overload)', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_outputs_y28', 'Fahrstuhl-Steuerung - LED (Nothalt)', 'Elevator control - LED (emergency stop)', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_outputs_y3', 'Tür Etage 1 - öffnen', 'Door floor 1 - open', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_outputs_y4', 'Tür Etage 2 - öffnen', 'Door floor 2 - open', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_outputs_y5', 'Tür Etage 3 - öffnen', 'Door floor 3 - open', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_outputs_y6', 'Tür Etage 4 - öffnen', 'Door floor 4 - open', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_outputs_y7', 'Tür Etage 1 - schließen', 'Door floor 1 - close', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_outputs_y8', 'Tür Etage 2 - schließen', 'Door floor 2 - close', '', '', '', ''),
('PSPU Lift 4 floors', 'RIA_ELEVATOR4_outputs_y9', 'Tür Etage 3 - schließen', 'Door floor 3 - close', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_LAB_0', 'Falsche Session ID.', 'Wrong Session ID', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_LAB_1', 'GoldiAPI ist nicht verbunden.', 'GoldiAPI not connected', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_LAB_10', 'BPU konnte nicht resetet werden.', 'BPU could not be reset', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_LAB_11', 'BPU Zieladresse setzen für PSPU nicht erfolgreich.', '', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_LAB_12', 'BPU Programming: Dateiformat nicht unterstützt', '', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_LAB_13', 'BPU Programming: Dateiformat Parse-Fehler', '', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_LAB_14', 'BPU Programming: Fehler', '', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_LAB_15', 'PSPU ist nicht erreichbar.', '', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_LAB_16', 'PSPU konnte nicht resetet werden.', '', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_LAB_17', 'PSPU Zieladresse setzen für PSPU nicht erfolgreich.', '', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_LAB_18', 'PSPU Experiment starten ist fehlgeschlagen.', '', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_LAB_19', 'PSPU Experiment initialisieren ist fehlgeschlagen.', '', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_LAB_2', 'GoldiAPI: kein gültiges Kommando.', 'GoldiAPI: Invalid Command', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_LAB_20', 'PSPU Experiment initialisieren ist fehlgeschlagen.', '', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_LAB_21', 'PSPU Experiment initialisieren ist fehlgeschlagen.', '', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_LAB_22', 'Zeitüberschreitung bei letztem Kommando.', '', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_LAB_3', 'BCU für BPU wurde nicht in der Datenbank gefunden.', '', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_LAB_4', 'BCU für BPU ist nicht erreichbar.', '', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_LAB_5', 'BCU Kanal für BPU konnte nicht gesetzt werden. Manueller Modus aktiviert?', '', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_LAB_6', 'BCU für PSPU wurde nicht in der Datenbank gefunden.', '', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_LAB_7', 'BCU für PSPU ist nicht erreichbar.', '', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_LAB_8', 'BCU Kanal für PSPU konnte nicht gesetzt werden. Manueller Modus aktiviert?', '', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_LAB_9', 'BPU ist nicht erreichbar.', '', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_PARSE_0', 'Undefinierte Variable', 'Undefined variable', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_PARSE_1', 'Syntaxfehler in Gleichung', 'Syntax error in equation', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_PARSE_10', 'Undefinierter Zustand in Automat', '', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_PARSE_11', 'Die Anzahl der Zustandsvariablen pro Automat muss mindestens 1 betragen', '', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_PARSE_12', 'Unbekannte Y-Variable', '', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_PARSE_2', 'Fehler in der Variablenauswertung', '', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_PARSE_23', 'Automat nicht definiert', '', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_PARSE_24', 'Unbekannter Automat', '', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_PARSE_25', 'Nur ein Zeichen für Variablennamen erlaubt', '', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_PARSE_26', 'Fehlerhafte Datei', 'Corrupt file', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_PARSE_3', 'Klammerfehler in Gleichung', '', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_PARSE_4', 'Unbekanntes Zeichen in Gleichung', 'Unknown character in equation', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_PARSE_5', 'Zu viele Eingabevariablen übergeben', '', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_PARSE_6', 'Zu wenige Eingabevariablen übergeben', '', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_PARSE_7', 'H* ist wahr', '', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_PARSE_8', 'Undefinierte Gleichung y:', '', '', '', '', ''),
('PSPU all devices', 'RIA_ERROR_PARSE_9', 'Zustandsvariable existiert nicht:', '', '', '', '', ''),
('PSPU 3-Axis Crane', 'RIA_ERROR_PORTAL_0', 'Falsche Initialwerte', 'Wrong initial values', '', '', '', ''),
('PSPU 3-Axis Crane', 'RIA_ERROR_PORTAL_10', 'Y-Achse: Motor wird in beide Richtungen gleichzeitig betrieben', 'Y-Axis: Motor is driven in both directions simultaneously', '', '', '', ''),
('PSPU 3-Axis Crane', 'RIA_ERROR_PORTAL_11', 'Z-Achse: Motor wird in beide Richtungen gleichzeitig betrieben', 'Y-Axis: Motor is driven in both directions simultaneously', '', '', '', ''),
('PSPU 3-Axis Crane', 'RIA_ERROR_PORTAL_2', 'Undefinierter Ausgabewert', 'Undefined output value', '', '', '', ''),
('PSPU 3-Axis Crane', 'RIA_ERROR_PORTAL_3', 'X-Achse: Kran ist an der äußersten Position', 'X-Axis: Crane is at the outermost position', '', '', '', ''),
('PSPU 3-Axis Crane', 'RIA_ERROR_PORTAL_4', 'X-Achse: Kran ist an der äußersten Position', 'X-Axis: Crane is at the outermost position', '', '', '', ''),
('PSPU 3-Axis Crane', 'RIA_ERROR_PORTAL_5', 'Y-Achse: Kran ist an der äußersten Position', 'Y-Axis: Crane is at the outermost position', '', '', '', ''),
('PSPU 3-Axis Crane', 'RIA_ERROR_PORTAL_6', 'Y-Achse: Kran ist an der äußersten Position', 'Y-Axis: Crane is at the outermost position', '', '', '', ''),
('PSPU 3-Axis Crane', 'RIA_ERROR_PORTAL_7', 'Z-Achse: Kran ist an der äußersten Position', 'Z-Axis: Crane is at the outermost position', '', '', '', ''),
('PSPU 3-Axis Crane', 'RIA_ERROR_PORTAL_8', 'Z-Achse: Kran ist an der äußersten Position', 'Z-Axis: Crane is at the outermost position', '', '', '', ''),
('PSPU 3-Axis Crane', 'RIA_ERROR_PORTAL_9', 'X-Achse: Motor wird in beide Richtungen gleichzeitig betrieben', 'X-Axis: Motor is driven in both directions simultaneously', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_0', 'Ungültige Simulationsfrequenz gewählt', 'Invalid simulation frequency selected', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_1', 'Sensordistanz kann nicht unter 1 betragen', 'Sensordistance can''t be less then 1', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_10', 'Förderband 1 schon belegt', 'Conveyorbelt 1 already occupied', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_11', 'Förderband 1 aktiv und Drehtisch 1 nicht nach Förderband 1 ausgerichtet', 'Cannot drive conveyorbelt 1, rotationtable 1 is not in the right position', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_12', 'Drehtisch 1 schon belegt', 'Rotationtable 1 already occupied', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_13', 'Kann Drehtisch 1 nicht fördern lassen, da sonst ein Werkstück herunter fällt', 'Cannot drive rotationtable 1, a workpiece would fall off', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_14', 'Kann Drehtisch 1 nicht drehen, da sich ein Werkstück zwischen Förderband 1 und Drehtisch 1 befindet', 'Cannot rotate rotationtable 1 because there is a workpiece between conveyorbelt 1 and rotationtable 1', '', '', '', '');
INSERT INTO `locale_tags` (`language_module`, `phrase`, `de_DE`, `en_US`, `bg_BG`, `es_ES`, `uk_UA`, `ru_RU`) VALUES
('PSPU SIDAC', 'RIA_ERROR_SIDAC_15', 'Kann Drehtisch 1 nicht nach Förderband 2 drehen, da er schon nach Förderband 2 ausgerichtet ist', 'Cannot rotate rotationtable 1 to conveyorbelt 2, because it is already at conveyorbelt 2', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_16', 'Kann Drehtisch 1 nicht nach Förderband 1 drehen, da er schon nach Förderband 1 ausgerichtet ist', 'Cannot rotate rotationtable 1 to conveyorbelt 1, because it is already at conveyorbelt 1', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_17', 'Kann Drehtisch 1 nicht drehen, da sich ein Werkstück zwischen Drehtisch 1 und Förderband 2 befindet', 'Cannot rotate rotationtable 1 because there is a workpiece between rotationtable 1 and conveyorbelt 2', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_18', 'Kann Drehtisch 1 nicht in beide Richtungen gleichzeitig drehen', 'Cannot rotate rotationtable 1 in both directions simultaneously', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_19', 'Förderband 2 schon belegt', 'Conveyorbelt 2 already occupied', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_2', 'Undefinierter Ausgabewert', 'Undefined Outputvalue', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_20', 'Förderband 2 aktiv und Drehtisch 2 nicht nach Förderband 2 ausgerichtet', 'Cannot drive conveyorbelt 2, rotationtable 2 is not in the right position', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_21', 'Drehtisch 2 schon belegt', 'Rotationtable 2 already ocupied', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_22', 'Kann Drehtisch 2 nicht fördern lassen, da sonst ein Werkstück herunter fällt', 'Cannot drive rotationtable 2, a workpiece would fall off', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_23', 'Kann Drehtisch 2 nicht drehen, da sich ein Werkstück zwischen Förderband 2 und Drehtisch 2 befindet', 'Cannot rotate rotationtable 2 because there is a workpiece between conveyorbelt 2 and rotationtable 2', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_24', 'Kann Drehtisch 2 nicht nach Förderband 3 drehen, da er schon nach Förderband 3 ausgerichtet ist', 'Cannot rotate rotationtable 2 to conveyorbelt 3, because it is already at conveyorbelt 3', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_25', 'Kann Drehtisch 2 nicht drehen, da sich ein Werkstück zwischen Drehtisch 2 und Förderband 3 befindet', 'Cannot rotate rotationtable 2 because there is a workpiece between rotationtable 2 and conveyorbelt 3', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_26', 'Kann Drehtisch 2 nicht nach Förderband 2 drehen, da er schon nach Förderband 2 ausgerichtet ist', 'Cannot rotate rotationtable 2 to conveyorbelt 3, because it is already at conveyorbelt 3', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_27', 'Kann Drehtisch 2 nicht in beide Richtungen gleichzeitig drehen', 'Cannot rotate rotationtable 2 in both directions simultaneously', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_28', 'Förderband 3 schon belegt', 'Conveyorbelt 3 already occupied', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_29', 'Kann Förderband 3 nicht fördern lassen, da sonst ein Werkstück herunter fällt', 'Cannot drive conveyorbelt 3, a workpiece would fall off', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_3', 'Transporttisch schon an Förderband 3', 'Transporttable is already at conveyorbelt 1', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_30', 'Transporttisch schon belegt', 'Transporttable already occupied', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_31', 'Kann Fräsmaschine nicht zu Förderband 2 fahren, da diese schon an Förderband 2 ist', 'Cannot move the milling machine to conveyorbelt 2, because it is already at conveyorbelt 2', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_32', 'Kann Fräsmaschine nicht in beide Richtungen gleichzeitig fahren', 'Cannot move the milling machine in both directions simultaneously', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_33', 'Kann Fräsmaschine nicht weiter von Förderband 2 entfernen', 'Cannot move the milling machine further away from conveyorbelt 2', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_34', 'Kann Fräskopf nicht weiter heben', 'Cannot raise the milling head any further', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_35', 'Kann Fräskopf nicht in beide Richtungen gleichzeitig bewegen', 'Cannot move the milling head in both directions simultaneously', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_36', 'Kann Fräskopf nicht weiter senken', 'Cannot lower the milling head any further', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_4', 'Kann Transporttisch nicht nach Förderband 3 bewegen da sich ein Werkstück zwischen dem Transporttisch und Förderband 1 befindet', 'Cannot move the transporttable to conveyorbelt 3, because there is a workpiece between the transporttable and conveyorbelt 1', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_5', 'Transporttisch kann nicht gleichzeitig in beide Richtungen bewegen', 'Cannot move the transporttable in both directions simultaneously', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_6', 'Transporttisch schon an Förderband 1', 'Transporttable is already at conveyorbelt 1', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_7', 'Kann Transporttisch nicht nach Förderband 1 bewegen da sich ein Werkstück zwischen dem Transporttisch und Förderband 3 befindet', 'Cannot move the transporttable to conveyorbelt 1, because there is a workpiece between the transporttable and conveyorbelt 3', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_8', 'Kann Förderband auf Transporttisch nicht betreiben, da sonst ein Werkstück herunter fällt', 'Cannot drive the transporttable, a workpiece would fall off', '', '', '', ''),
('PSPU SIDAC', 'RIA_ERROR_SIDAC_9', 'Kann Transporttisch nicht nach Förderband 1 fördern lassen, da er sich nicht an Förderband 1 befindet', 'Cannot drive the transporttable in direction of conveyorbelt 1, because it isn''t at conveyorbelt 1', '', '', '', ''),
('PSPU Warehouse', 'RIA_HRS_errors_1', 'Kritischer Fehler', 'Critical error', '', 'Critical error', '', ''),
('PSPU Warehouse', 'RIA_HRS_errors_100', 'Undefinierte Variable', 'Undefined variable', '', 'Undefined variable', '', ''),
('PSPU Warehouse', 'RIA_HRS_errors_101', 'Syntaxfehler in Gleichung', 'Syntax error in expression', '', 'Syntax error in equation', '', ''),
('PSPU Warehouse', 'RIA_HRS_errors_102', 'Fehler in der Variablenauswertung', 'Error in variable evaluation', '', 'Error in variable evaluation', '', ''),
('PSPU Warehouse', 'RIA_HRS_errors_103', 'Klammerfehler in Gleichung', 'Parenthesis missmatch in equation', '', 'Parenthesis missmatch in equation', '', ''),
('PSPU 3-Axis Crane', 'ria_portal_inputs_x0', 'X-Achse: Kran ist rechts (Low-aktiv)', 'X-Axis: Crane position right(low-active)', '', '', '', ''),
('PSPU 3-Axis Crane', 'ria_portal_inputs_x1', 'X-Achse: Kran ist links (Low-Aktiv)', 'X-Axis: Crane position left (low-active)', '', '', '', ''),
('PSPU 3-Axis Crane', 'ria_portal_inputs_x2', 'X-Achse: Kran am Referenzpunkt (Low-Aktiv)', 'X-Axis: Crane at reference position (low-active)', '', '', '', ''),
('PSPU 3-Axis Crane', 'ria_portal_inputs_x3', 'Y-Achse: Kran ist hinten (Low-Aktiv)', 'Y-Axis: Crane position back (low-active)', '', '', '', ''),
('PSPU 3-Axis Crane', 'ria_portal_inputs_x4', 'Y-Achse: Kran ist vorn  (Low-Aktiv)', 'Y-Axis: Crane postition front (low-active)', '', '', '', ''),
('PSPU 3-Axis Crane', 'ria_portal_inputs_x5', 'Y-Achse: Kran am Referenzpunkt (Low-Aktiv)', 'Y-Axis: Crane at reference position (low-active)', '', '', '', ''),
('PSPU 3-Axis Crane', 'ria_portal_inputs_x6', 'Z-Achse: Kran ist oben (Low-Aktiv)', 'Z-Axis: Crane at position up (low-active)', '', '', '', ''),
('PSPU 3-Axis Crane', 'ria_portal_inputs_x7', 'Z-Achse: Kran ist unten (Low-Aktiv)', 'Z-Axis: Crane at position down (low-active)', '', '', '', ''),
('PSPU 3-Axis Crane', 'ria_portal_outputs_y0', 'Kran nach +X (rechts) fahren ', 'Crane drive +X (right)', '', '', '', ''),
('PSPU 3-Axis Crane', 'ria_portal_outputs_y1', 'Kran nach -X (links) fahren', 'Crane drive -X (left)', '', '', '', ''),
('PSPU 3-Axis Crane', 'ria_portal_outputs_y2', 'Kran nach +Y (hinten) fahren', 'Crane drive +Y (back)', '', '', '', ''),
('PSPU 3-Axis Crane', 'ria_portal_outputs_y3', 'Kran nach -Y (vorn) fahren', 'Crane drive -Y (front)', '', '', '', ''),
('PSPU 3-Axis Crane', 'ria_portal_outputs_y4', 'Kran nach +Z (oben) fahren', 'Crane drive +Z (up)', '', '', '', ''),
('PSPU 3-Axis Crane', 'ria_portal_outputs_y5', 'Kran nach -Z (unten) fahren', 'Crane drive -Z (down)', '', '', '', ''),
('PSPU 3-Axis Crane', 'ria_portal_outputs_y6', 'Elektromagneten ein-/ausschalten ', 'Electromagnet on/off', '', '', '', ''),
('PSPU Pump', 'ria_pump_animation_BLOCKINGVALVE', 'Sperrventil', 'Blocking valve', '', '', '', ''),
('PSPU Pump', 'ria_pump_animation_OFF', 'aus', 'off', '', '', '', ''),
('PSPU Pump', 'ria_pump_animation_ON', 'an', 'on', '', '', '', ''),
('PSPU Pump', 'ria_pump_animation_PUMP1', 'Pumpe 1: ', 'Pump 1: ', '', '', '', ''),
('PSPU Pump', 'ria_pump_animation_PUMP2', 'Pumpe 2: ', 'Pump 2: ', '', '', '', ''),
('PSPU Pump', 'ria_pump_inputs_x0', 'Sensor 1 (tiefster Wasserstand)', 'Sensor 1 (lowest water level)', '', '', '', ''),
('PSPU Pump', 'ria_pump_inputs_x1', 'Sensor 2', 'Sensor 2', '', '', '', ''),
('PSPU Pump', 'ria_pump_inputs_x2', 'Sensor 3', 'Sensor 3', '', '', '', ''),
('PSPU Pump', 'ria_pump_inputs_x3', 'Sensor 4 (höchster Wasserstand)', 'Sensor 4 (highest water level)', '', '', '', ''),
('PSPU Pump', 'ria_pump_outputs_y0', 'Pumpe 1', 'Pump 1', '', '', '', ''),
('PSPU Pump', 'ria_pump_outputs_y1', 'Pumpe 2', 'Pump 2', '', '', '', ''),
('PSPU RPB PSPU', 'RIA_RPB_INPUTS_X0', '', '', '', '', '', ''),
('PSPU RPB PSPU', 'RIA_RPB_OUTSPUTS_Y0', '', '', '', '', '', ''),
('PSPU RPB PSPU', 'RIA_RPB_UART', 'UART', 'UART', '', '', '', ''),
('PSPU RPB PSPU', 'RIA_RPB_UARTRECEIVED', 'Empfangen', 'Received', '', '', '', ''),
('PSPU RPB PSPU', 'RIA_RPB_UARTSENT', 'Gesendet', 'Sent', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_animation_CB1', 'FB1', 'CB1', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_animation_CB2', 'FB2', 'CB2', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_animation_CB3', 'FB3', 'CB3', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_animation_RT1', 'DT1', 'RT1', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_animation_RT2', 'DT2', 'RT2', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_animation_TT', 'TT', 'TT', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_inputs_x0', 'Transprottisch in Richtung Förderband 3 (Low-Aktiv)', 'Transport table in line with conveyor belt 3 (low-active)', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_inputs_x1', 'Transporttisch in Richtung Förderband 1 (Low-Aktiv)', 'Transport table in line with conveyor belt 1 (low-active)', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_inputs_x10', 'Drehtisch 2 - Werkstück vorhanden', 'Turntable 2 - workpiece available', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_inputs_x11', 'Förderband 3 - Werkstück vorhanden', 'Conveyor belt 3 - workpiece available', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_inputs_x12', 'Werkzeugmaschine von Förderband 2 entfernt (Low-Aktiv)', 'Milling machine away from conveyor belt 2 (low-active)', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_inputs_x13', 'Werkzeugmaschine an Förderband 2 (Low-Aktiv)', 'Milling machine at conveyor belt 2 (low-active)', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_inputs_x14', 'Fräse ist oben (Low-Aktiv)', 'Milling head is up (low-active)', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_inputs_x15', 'Fräse ist unten (Low-Aktiv)', 'Milling head is down (low-active)', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_inputs_x16', 'Notaus', 'Emergency Stop', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_inputs_x2', 'Transporttisch 1 - Werkstück vorhanden', 'Transport table - workpiece available', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_inputs_x3', 'Förderband 1 - Werkstück vorhanden', 'Conveyor belt 1 - workpiece available', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_inputs_x4', 'Drehtisch 1 in Richtung Förderband 1 (Low-Aktiv)', 'Turntable 1 in line with conveyor belt 1 (low-active)', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_inputs_x5', 'Drehtisch 1 in Richtung Förderband 2 (Low-Aktiv)', 'Turntable 1 in line with conveyor belt 2 (low-active)', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_inputs_x6', 'Drehtisch 1 - Werkstück vorhanden', 'Turntable 1 - workpiece available', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_inputs_x7', 'Förderband 2 - Werkstück vorhanden', 'Conveyor belt 2 - workpiece available', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_inputs_x8', 'Drehtisch 2 in Richtung Förderband 2 (Low-Aktiv)', 'Turntable 2 in line with conveyor belt 2 (low-active)', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_inputs_x9', 'Drehtisch 2 in Richtung Förderband 3 (Low-Aktiv)', 'Turntable 2 in line with conveyor belt 3 (low-active)', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_log_0', '', '', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_log_1', '', '', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_outputs_y0', 'Transporttisch - fahren in Richtung Förderband 3', 'Transport table - move to conveyor belt 3', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_outputs_y1', 'Transporttisch - fahren in Richtung Förderband 1', 'Transport table - move to conveyor belt 1', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_outputs_y10', 'Drehtisch 2 - Nach Förderband 3 drehen', 'Turntable 2 - rotate to conveyor belt 3', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_outputs_y11', 'Drehtisch 2 - Fördern', 'Turntable 2 - drive belt', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_outputs_y12', 'Förderband 3 - Fördern', 'Conveyor belt 3 - drive belt', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_outputs_y13', 'Werkzeugmaschine - entfernen von Förderband 2', 'Milling machine - approach conveyor belt 2', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_outputs_y14', 'Werkzeugmaschine - nach Förderband 2 fahren', 'Milling machine - retreat from conveyor belt 2', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_outputs_y15', 'Werkzeugmaschine - heben', 'Milling head - rise', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_outputs_y16', 'Werkzeugmaschine - senken', 'Milling head -lower', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_outputs_y17', 'Werkzeugmaschine - fräsen', 'Milling head - drive head', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_outputs_y2', 'Transporttisch - fördern in Laufrichtung wie Förderband 1', 'Transport table - drive conveyor belt similar to conveyor belt 1', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_outputs_y3', 'Transporttisch - fördern in Laufrichtung wie Förderband 3 ', 'Transport table - drive conveyor belt similar to conveyor belt 3', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_outputs_y4', 'Förderband 1 - fördern', 'Conveyor belt 1 - drive belt', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_outputs_y5', 'Drehtisch 1 - nach Förderband 1 drehen', 'Turntable 1 - rotate to conveyor belt 1', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_outputs_y6', 'Drehtisch 1 - nach Förderband 2 drehen', 'Turntable 1 - rotate to conveyor belt 2', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_outputs_y7', 'Drehtisch 1 - fördern', 'Turntable 1 - drive belt', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_outputs_y8', 'Föerderband 2 - fördern', 'Conveyor belt 2 - drive belt', '', '', '', ''),
('PSPU SIDAC', 'ria_sidac_outputs_y9', 'Drehtisch 2 - Nach Förderband 2 drehen', 'Turntable 2 - rotate to conveyor belt 2', '', '', '', ''),
('PSPU Warehouse', 'ria_warehouse_errors_104', 'Unbekanntes Zeichen in Gleichung', 'Unknown char in equation', '', 'Unknown char in equation', '', ''),
('PSPU Warehouse', 'ria_warehouse_errors_105', 'Zu viele Eingabevariablen übergeben', 'Received too many input variables', '', 'Received too many input variables', '', ''),
('PSPU Warehouse', 'ria_warehouse_errors_106', 'Zu wenige Eingabevariablen übergeben', 'Received not enough input variables', '', 'Received not enough input variables', '', ''),
('PSPU Warehouse', 'ria_warehouse_errors_107', 'H* ist wahr', 'H* is evaluated to true', '', 'H* is evaluated to true', '', ''),
('PSPU Warehouse', 'ria_warehouse_errors_108', 'Undefinierte Gleichung y:', 'Undefined Equation y:', '', 'Undefined Equation y:', '', ''),
('PSPU Warehouse', 'ria_warehouse_errors_109', 'Zustandsvariable existiert nicht:', 'Statevariable not existent:', '', 'Statevariable not existent:', '', ''),
('PSPU Warehouse', 'ria_warehouse_errors_110', 'Undefinierter Zustand in Automat', 'Undefined state in machine', '', 'Undefined state in machine', '', ''),
('PSPU Warehouse', 'ria_warehouse_errors_111', 'Die Anzahl der Zustandsvariablen pro Automat muss mindestens 1 betragen', 'Each machine must have at least one statevariable', '', 'Each machine must have at least one statevariable', '', ''),
('PSPU Warehouse', 'ria_warehouse_errors_112', 'Unbekannte Y-Variable', 'Unknown Y-variable', '', 'Unknown Y-variable', '', ''),
('PSPU Warehouse', 'ria_warehouse_errors_2', 'Ticket Ungültig', 'Invalid', '', 'Invalid', '', ''),
('PSPU Warehouse', 'ria_warehouse_errors_200', 'Ungültige Simulationsfrequenz gewählt', 'Invalid simulation frequency selected', '', 'Invalid simulation frequency selected', '', ''),
('PSPU Warehouse', 'ria_warehouse_errors_201', 'Sensordistanz kann nicht unter 1 betragen', 'Sensordistance can''t be less then 1', '', 'Sensordistance can''t be less then 1', '', ''),
('PSPU Warehouse', 'ria_warehouse_errors_202', 'Undefinierter Ausgabewert', 'Undefined Outputvalue', '', 'Undefined Outputvalue', '', ''),
('PSPU Warehouse', 'ria_warehouse_errors_203', 'Hochregallager - Endlage rechts erreicht', 'Transporttable is already at conveyorbelt 1', '', 'Transporttable is already at conveyorbelt 1', '', ''),
('PSPU Warehouse', 'ria_warehouse_errors_204', 'Hochregallager - Endlage links erreicht', 'Cannot move the transporttable to conveyorbelt 3, because there is a workpiece between the transporttable and conveyorbelt 1', '', 'Cannot move the transporttable to conveyorbelt 3, because there is a workpiece between the transporttable and conveyorbelt 1', '', ''),
('PSPU Warehouse', 'ria_warehouse_errors_205', 'Aufzug - Endlage oben erreicht', 'Cannot move the transporttable in both directions simultaneously', '', 'Cannot move the transporttable in both directions simultaneously', '', ''),
('PSPU Warehouse', 'ria_warehouse_errors_206', 'Aufzug - Endlage unten erreicht', 'Transporttable is already at conveyorbelt 1', '', 'Transporttable is already at conveyorbelt 1', '', ''),
('PSPU Warehouse', 'ria_warehouse_errors_207', 'Regalbediengerät - Endlage hinten erreicht', 'Cannot move the transporttable to conveyorbelt 1, because there is a workpiece between the transporttable and conveyorbelt 3', '', 'Cannot move the transporttable to conveyorbelt 1, because there is a workpiece between the transporttable and conveyorbelt 3', '', ''),
('PSPU Warehouse', 'ria_warehouse_errors_208', 'Regalbediengerät - Endlage vorne erreicht', 'Cannot drive the transporttable, a workpiece would fall off', '', 'Cannot drive the transporttable, a workpiece would fall off', '', ''),
('PSPU Warehouse', 'ria_warehouse_errors_3', 'Host nicht erreichbar', 'Host unreachable', '', 'Host unreachable', '', ''),
('PSPU Warehouse', 'ria_warehouse_errors_4', 'Operatoren dürfen nur ein Zeichen lang sein', 'Operators may only be one character long', '', 'Operators may only be one character long', '', ''),
('PSPU Warehouse', 'ria_warehouse_errors_6', 'Kein Ticket in Nachricht', 'No ticket in message', '', 'No ticket in message', '', ''),
('PSPU Warehouse', 'ria_warehouse_errors_7', 'Automat nicht spezifiziert', 'Machine not specified', '', 'Machine not specified', '', ''),
('PSPU Warehouse', 'ria_warehouse_errors_8', 'Automat nicht bekannt', 'Unknown machine', '', 'Unknown machine', '', ''),
('PSPU Warehouse', 'ria_warehouse_errors_9', 'Fehlerhafte Datei', 'Corrupt file', '', 'Corrupt file', '', ''),
('PSPU Warehouse', 'ria_warehouse_inputs_x0', 'E/A 1 - Lichtschranke: Paket vorhanden', 'I/O 1 - light barrier: package available', '', 'todo:Transport table in line with conveyor belt 3 (low-active)', '', ''),
('PSPU Warehouse', 'ria_warehouse_inputs_x1', 'E/A 2 - Lichtschranke: Paket vorhanden', 'I/O 2 - light barrier: package available', '', 'todo:Transport table in line with conveyor belt 1 (low-active)', '', ''),
('PSPU Warehouse', 'ria_warehouse_inputs_x10', 'Aufzug - Taster: Z3 unten', 'Lift - button: Z3 below', '', 'todo:Turntable 2 - workpiece available', '', ''),
('PSPU Warehouse', 'ria_warehouse_inputs_x11', 'Aufzug - Taster: Z3 oben', 'Lift - button: Z3 above', '', 'todo:Conveyor belt 3 - workpiece available', '', ''),
('PSPU Warehouse', 'ria_warehouse_inputs_x12', 'Aufzug - Taster: Z4 unten', 'Lift - button: Z4 below', '', 'todo:Milling machine away from conveyor belt 2 (low-active)', '', ''),
('PSPU Warehouse', 'ria_warehouse_inputs_x13', 'Aufzug - Taster: Z4 oben', 'Lift - button: Z4 above', '', 'todo:Milling machine at conveyor belt 2 (low-active)', '', ''),
('PSPU Warehouse', 'ria_warehouse_inputs_x14', 'Aufzug - Taster: Z5 unten', 'Lift - button: Z5 below', '', 'todo:Milling head is up (low-active)', '', ''),
('PSPU Warehouse', 'ria_warehouse_inputs_x15', 'Aufzug - Taster: Z5 oben', 'Lift - button: Z5 above', '', 'todo:Milling head is down (low-active)', '', ''),
('PSPU Warehouse', 'ria_warehouse_inputs_x16', 'Hochregallager - Taster: X1', 'High rack storage - button: X1', '', 'Todo: Emergency Stop', '', ''),
('PSPU Warehouse', 'ria_warehouse_inputs_x17', 'Hochregallager - Taster: X2', 'High rack storage - button: X2', '', '', '', ''),
('PSPU Warehouse', 'ria_warehouse_inputs_x18', 'Hochregallager - Taster: X3', 'High rack storage - button: X3', '', '', '', ''),
('PSPU Warehouse', 'ria_warehouse_inputs_x19', 'Hochregallager - Taster: X4', 'High rack storage - button: X4', '', '', '', ''),
('PSPU Warehouse', 'ria_warehouse_inputs_x2', 'Regalbediengerät - Lichtschranke: Paket vorhanden', 'Stacker crane - light barrier: package available', '', 'todo:Transport table - workpiece available', '', ''),
('PSPU Warehouse', 'ria_warehouse_inputs_x20', 'Hochregallager - Taster: X5', 'High rack storage - button: X5', '', '', '', ''),
('PSPU Warehouse', 'ria_warehouse_inputs_x21', 'Hochregallager - Taster: X6', 'High rack storage - button: X6', '', '', '', ''),
('PSPU Warehouse', 'ria_warehouse_inputs_x22', 'Hochregallager - Taster: X7', 'High rack storage - button: X7', '', '', '', ''),
('PSPU Warehouse', 'ria_warehouse_inputs_x23', 'Hochregallager - Taster: X8', 'High rack storage - button: X8', '', '', '', ''),
('PSPU Warehouse', 'ria_warehouse_inputs_x24', 'Hochregallager - Taster: X9', 'High rack storage - button: X9', '', '', '', ''),
('PSPU Warehouse', 'ria_warehouse_inputs_x25', 'Hochregallager - Taster: X10', 'High rack storage - button: X10', '', '', '', ''),
('PSPU Warehouse', 'ria_warehouse_inputs_x3', 'Regalbediengerät - Taster: Träger vorne', 'Stacker crane - button: carrier front', '', 'todo:Conveyor belt 1 - workpiece available', '', ''),
('PSPU Warehouse', 'ria_warehouse_inputs_x4', 'Regalbediengerät - Taster: Träger mitte', 'Stacker crane - button: carrier center', '', 'todo:Turntable 1 in line with conveyor belt 1 (low-active)', '', ''),
('PSPU Warehouse', 'ria_warehouse_inputs_x5', 'Regalbediengerät - Taster: Träger hinten', 'Stacker crane - button: carrier back', '', 'todo:Turntable 1 in line with conveyor belt 2 (low-active)', '', ''),
('PSPU Warehouse', 'ria_warehouse_inputs_x6', 'Aufzug - Taster: Z1 unten', 'Lift - button: Z1 below', '', 'todo:Turntable 1 - workpiece available', '', ''),
('PSPU Warehouse', 'ria_warehouse_inputs_x7', 'Aufzug - Taster: Z1 oben', 'Lift - button: Z1 above', '', 'todo:Conveyor belt 2 - workpiece available', '', ''),
('PSPU Warehouse', 'ria_warehouse_inputs_x8', 'Aufzug - Taster: Z2 unten', 'Lift - button: Z2 below', '', 'todo:Turntable 2 in line with conveyor belt 2 (low-active)', '', ''),
('PSPU Warehouse', 'ria_warehouse_inputs_x9', 'Aufzug - Taster: Z2 oben', 'Lift - button: Z2 above', '', 'todo:Turntable 2 in line with conveyor belt 3 (low-active)', '', ''),
('PSPU Warehouse', 'ria_warehouse_outputs_y0', 'E/A 1 - Motor: vorwärts (Y+)', 'I/O 1 - engine: forward (Y+)', '', 'todo: Transport table - move to conveyor belt 3', '', ''),
('PSPU Warehouse', 'ria_warehouse_outputs_y1', 'E/A 1 - Motor: rückwärts (Y-)', 'I/O 1 - engine: backward (Y-)', '', 'todo: Transport table - move to conveyor belt 1', '', ''),
('PSPU Warehouse', 'ria_warehouse_outputs_y2', 'E/A 2 - Motor: vorwärts (Y+)', 'I/O 2 - engine: forward (Y+)', '', 'todo: Transport table - drive conveyor belt similar to conveyor belt 3', '', ''),
('PSPU Warehouse', 'ria_warehouse_outputs_y3', 'E/A 2 - Motor: rückwärts (Y-)', 'I/O 2 - engine: backward (Y-)', '', 'todo: Transport table - drive conveyor belt similar to conveyor belt 1', '', ''),
('PSPU Warehouse', 'ria_warehouse_outputs_y4', 'Regalbediengerät - Motor: vorwärts (Y+)', 'Stacker crane - engine: forward (Y+)', '', 'todo: Conveyor belt 1 - drive belt', '', ''),
('PSPU Warehouse', 'ria_warehouse_outputs_y5', 'Regalbediengerät - Motor: rückwärts (Y-)', 'Stacker crane - engine: backward (Y-)', '', 'todo: Turntable 1 - rotate to conveyor belt 1', '', ''),
('PSPU Warehouse', 'ria_warehouse_outputs_y6', 'Aufzug - Motor: runter (Z+)', 'Lift - engine: down (Z+)', '', 'todo: Turntable 1 - rotate to conveyor belt 2', '', ''),
('PSPU Warehouse', 'ria_warehouse_outputs_y7', 'Aufzug - Motor: hoch (Z-)', 'Lift - engine: up (Z-)', '', 'todo: Turntable 1 - drive belt', '', ''),
('PSPU Warehouse', 'ria_warehouse_outputs_y8', 'Hochregallager - Motor: links (X+)', 'High rack storage - engine: left (X+)', '', 'todo: Conveyor belt 2 - drive belt', '', ''),
('PSPU Warehouse', 'ria_warehouse_outputs_y9', 'Hochregallager - Motor: rechts (X-)', 'High rack storage - engine: right (X-)', '', 'todo: Turntable 2 - rotate to conveyor belt 2', '', ''),
('Site reservations', 'RPB BPU', 'Programmierbare Logik', 'CPLD', '', '', '', ''),
('Site reservations', 'RPB PSPU', 'Digital-Demo-Platine', 'Digital Demo Board', '', '', '', ''),
('Site reservations', 'search', 'Suchen', 'Search', '', '', '', ''),
('Site reservations', 'search_options', 'Suchoptionen', 'Search options', '', '', '', ''),
('Site reservations', 'SIDAC', 'Bearbeitungs-einheit', 'Production Cell', '', '', '', ''),
('Site reservations', 'start', 'Starten', 'Start', '', '', '', ''),
('Site reservations', 'start_time', 'Anfangszeit', 'Start time', '', '', '', ''),
('Module AuthentificationModule', 'student_number', 'Matrikelnummer (optional)', 'Student number (optional)', '', '', '', ''),
('Module RichCalendar', 'time', 'Uhrzeit', 'Time', '', '', '', ''),
('Site main', 'title', 'GOLDI', 'GOLDI', '', '', '', ''),
('Module RichCalendar', 'today', 'Heute', 'Today', '', '', '', ''),
('Site admin', 'toggle_all', 'Alle', 'All', '', '', '', ''),
('Site admin', 'type', 'Typ', 'Type', '', '', '', ''),
('Site user', 'user', 'Benutzerverwaltung', 'User management', '', '', '', ''),
('Module AuthentificationModule', 'username', 'Benutzername', 'Username', '', '', '', ''),
('Site admin', 'users', 'Benutzerverwaltung', 'User management', '', '', '', ''),
('Module AuthentificationModule', 'user_blocked', 'Der Benutzer ist zur Zeit nicht freigegeben. Bitte versuchen Sie es zu einem späteren Zeitpunkt erneut oder wenden Sie sich an einen Administrator.', 'The user is temporary not enabled. Please try again later or contact an administrator.', '', '', '', ''),
('Site user', 'user_group_management_desrciption', 'Aktuelle Gruppenmitgliedschaft. Bei bekannter Gruppen-ID und Zutrittsschlüssel kann weiteren Gruppen beigetreten werden.', 'Here you see all your groups. To join a new group you must use the group ID and keyword.', '', '', '', ''),
('Site admin', 'user_id', 'BenutzerID', 'UserID', '', '', '', ''),
('Site admin', 'value', 'Wert', 'Value', '', '', '', ''),
('Site reservations', 'virtual', 'Virtuell', 'Virtual', '', '', '', ''),
('Site virtualria', 'virtualria', 'Gast', 'Guest', '', '', '', ''),
('Site reservations', 'Warehouse', 'Hochregallager', 'Storage Warehouse', '', '', '', ''),
('Site home', 'welcome', 'Willkommen', 'Welcome', '', '', '', ''),
('Site main', 'welcome_text', '<h2>Herzlich willkommen auf den Seiten des Labornetzwerkes der TU Ilmenau.</h2> <p> Das online Labornetzwerk  <b> Grid of Online Laboratory Devices Ilmenau (GOLDI)</b> ermöglicht das selbständige Entwerfen und Simulieren von Steueralgorithmen auf virtuellen und realen Versuchsobjekten wie z.B. ein Fahrstuhl, ein Hochregallager und weitere physikalische Aufbauten.Die Steueralgorithmen können als Automatengleichungen (sog. finite state machines FSM) entworfen und interpretiert werden oder mittels Hardware-Beschreibungssprachen (VHDL) und Programmiersprachen für Mikrocontroller (z.B. C, Assembler) beschrieben und auf FPGAs bzw. Mikrocontrollern implementiert und getestet werden.', '<h2>The Grid of Online Laboratory Devices Ilmenau (GOLDI) welcomes you. </h2> <p> Here you can design and test your own control algorithms to control virtual and real physical systems such as an elevator, a warehouse and the like.\nControl algorithms can be implemented in the form of Boolean equations based on finite state machines or in real hardware (FPGA, CPLD) or software (e.g. Assembler, C) running on a microcontroller  in the remote lab.\n\n', '', '', '', '');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `login_types`
--

CREATE TABLE IF NOT EXISTS `login_types` (
  `login_type` varchar(64) NOT NULL,
  PRIMARY KEY (`login_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `login_types`
--

INSERT INTO `login_types` (`login_type`) VALUES
('LDAP_TUI'),
('LDB');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `reservations`
--

CREATE TABLE IF NOT EXISTS `reservations` (
  `reservation_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `bpu_id` int(11) NOT NULL,
  `pspu_id` int(11) NOT NULL,
  `start_time` int(11) NOT NULL,
  `end_time` int(11) NOT NULL,
  `entry_time` int(11) NOT NULL,
  `blocked` tinyint(1) NOT NULL DEFAULT '0',
  `permitted` tinyint(1) NOT NULL DEFAULT '1',
  `mode` varchar(1) NOT NULL,
  PRIMARY KEY (`reservation_id`),
  KEY `fk_reservations_user1_idx` (`user_id`),
  KEY `fk_reservations_devices1_idx` (`bpu_id`),
  KEY `fk_reservations_devices2_idx` (`pspu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `restrictions`
--

CREATE TABLE IF NOT EXISTS `restrictions` (
  `restriction` varchar(64) NOT NULL,
  PRIMARY KEY (`restriction`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `restrictions`
--

INSERT INTO `restrictions` (`restriction`) VALUES
('max-group_size'),
('max_duration_minutes');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `student_number` int(11) DEFAULT NULL,
  `first_name` varchar(64) DEFAULT NULL,
  `last_name` varchar(64) DEFAULT NULL,
  `username` varchar(64) NOT NULL,
  `password` varchar(64) NOT NULL,
  `email` varchar(64) DEFAULT NULL,
  `last_login` timestamp NULL DEFAULT NULL,
  `blocked` tinyint(1) NOT NULL DEFAULT '0',
  `login_type` varchar(64) DEFAULT NULL,
  `institution` int(11) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  KEY `fk_login_types_login_type1_idx` (`login_type`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Daten für Tabelle `user`
--

INSERT INTO `user` (`user_id`, `student_number`, `first_name`, `last_name`, `username`, `password`, `email`, `last_login`, `blocked`, `login_type`, `institution`) VALUES
(0, NULL, NULL, NULL, 'Guest', '', NULL, '2014-06-03 14:39:33', 0, 'LDB', NULL),
(1, NULL, NULL, NULL, 'admin', '1a877bd9cc86a7a2fe3abfbaa77ed24c', NULL, '2014-08-27 12:37:41', 0, 'LDB', NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user_has_groups`
--

CREATE TABLE IF NOT EXISTS `user_has_groups` (
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`,`group_id`),
  KEY `fk_user_has_groups_groups1_idx` (`group_id`),
  KEY `fk_user_has_groups_user1_idx` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `user_has_groups`
--

INSERT INTO `user_has_groups` (`user_id`, `group_id`, `is_admin`) VALUES
(0, 0, 0),
(1, 0, 1),
(1, 1, 0);

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`bpu_id`) REFERENCES `devices` (`device_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `bookings_ibfk_3` FOREIGN KEY (`pspu_id`) REFERENCES `devices` (`device_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints der Tabelle `devices`
--
ALTER TABLE `devices`
  ADD CONSTRAINT `devices_ibfk_2` FOREIGN KEY (`type`) REFERENCES `device_types` (`type`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `device_types`
--
ALTER TABLE `device_types`
  ADD CONSTRAINT `device_types_ibfk_2` FOREIGN KEY (`category`) REFERENCES `device_category` (`category`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `groups_has_restrictions`
--
ALTER TABLE `groups_has_restrictions`
  ADD CONSTRAINT `groups_has_restrictions_ibfk_3` FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `groups_has_restrictions_ibfk_4` FOREIGN KEY (`restriction`) REFERENCES `restrictions` (`restriction`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `locale_tags`
--
ALTER TABLE `locale_tags`
  ADD CONSTRAINT `locale_tags_ibfk_1` FOREIGN KEY (`language_module`) REFERENCES `locale_modules` (`module`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`bpu_id`) REFERENCES `devices` (`device_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `reservations_ibfk_3` FOREIGN KEY (`pspu_id`) REFERENCES `devices` (`device_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints der Tabelle `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`login_type`) REFERENCES `login_types` (`login_type`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints der Tabelle `user_has_groups`
--
ALTER TABLE `user_has_groups`
  ADD CONSTRAINT `user_has_groups_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `user_has_groups_ibfk_6` FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
