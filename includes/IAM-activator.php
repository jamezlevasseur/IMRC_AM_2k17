<?php

/**
 * Fired during plugin activation
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    IAM
 * @subpackage IAM/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    IAM
 * @subpackage IAM/includes
 * @author     Your Name <email@example.com>
 */
class IAM_Activator {

	/**
	 * Sets up the database for the plugin.
	 *
	 * Creates tables needed by the plugin, imports tables with pre-filled data
	 * and inserts other values into the database that are expected upon plugin activation
	 *
	 * @since    1.0.0
	 */
	public static function activate() {
		global $wpdb;

		$wp_users = $wpdb->prefix.'users';

		$charset_collate = $wpdb->get_charset_collate();
		//TODO: update database for deletions from wp_users
		$queries = [];

		$ni_leng = SMALL_DB_MODE === 1 ? 120 : IAM_NI_LENGTH ;

		$queries[] = "CREATE TABLE IF NOT EXISTS ".IAM_USERS_TABLE." (
			IAM_ID bigint(20) NOT NULL AUTO_INCREMENT,
			NI_ID varchar(".$ni_leng.") NOT NULL,
			WP_ID bigint(20) NOT NULL,
			WP_Username varchar(60) NOT NULL,
			Account_Type bigint(20) NOT NULL,
			Balance decimal(6,2) NOT NULL,
			PRIMARY KEY(IAM_ID),
			UNIQUE(NI_ID),
			UNIQUE(WP_Username)
			) $charset_collate";

		$queries[] = "CREATE TABLE IF NOT EXISTS ".IAM_EQUIPMENT_TABLE." (
			Equipment_ID int(9) NOT NULL AUTO_INCREMENT,
			NI_ID varchar(".$ni_leng.") NOT NULL,
			Certification_ID int(5) DEFAULT 0,
			Name varchar(100) NOT NULL,
			Description text DEFAULT NULL,
			Pricing_Description text DEFAULT NULL,
			Manufacturer_Info text DEFAULT NULL,
			Photo text DEFAULT NULL,
			On_Slide_Show tinyint(1) DEFAULT 0,
			Out_Of_Order tinyint(1) DEFAULT 0,
			Root_Tag varchar(120) NOT NULL,
			Checked_Out bigint(20) DEFAULT 0,
			Rental_Type varchar(32) DEFAULT 0,
			Comments text DEFAULT NULL,
			PRIMARY KEY(Equipment_ID),
			UNIQUE(NI_ID),
			UNIQUE(Name)
			) $charset_collate";

		$queries[] = "CREATE TABLE IF NOT EXISTS ".IAM_RESERVATION_TABLE." (
			Reservation_ID bigint(20) NOT NULL AUTO_INCREMENT,
			NI_ID varchar(".$ni_leng.") NOT NULL,
			IAM_ID bigint(20) NOT NULL,
			Equipment_ID int(9) NOT NULL,
			Start_Time datetime NOT NULL,
			End_Time datetime NOT NULL,
			Is_Room tinyint(1) DEFAULT 0,
			Status int(2) DEFAULT 0,
			Checked_In datetime DEFAULT NULL,
			Checked_Out datetime DEFAULT NULL,
			Late_Notification_Sent tinyint(1) DEFAULT 0,
			Reservation_Status int(2) DEFAULT 0,
			Comment text DEFAULT '',
			PRIMARY KEY(Reservation_ID),
			UNIQUE(NI_ID)
			) $charset_collate";

		$queries[] = "CREATE TABLE IF NOT EXISTS ".IAM_MATERIAL_TABLE." (
			Material_ID int(8) NOT NULL AUTO_INCREMENT,
			NI_ID varchar(".$ni_leng.") NOT NULL,
			Name varchar(120),
			Price_Per_Unit float(10,2),
			Base_Price float(10,2) DEFAULT 0,
			Unit_Name varchar(120),
			PRIMARY KEY(Material_ID),
			UNIQUE(NI_ID),
			UNIQUE(Name)
			) $charset_collate";

		$queries[] = "CREATE TABLE IF NOT EXISTS ".IAM_CHARGE_TABLE." (
			Charge_ID bigint(20) NOT NULL AUTO_INCREMENT,
			NI_ID varchar(".$ni_leng.") NOT NULL,
			Equipment_ID int(9) DEFAULT NULL,
			WP_Username varchar(60) NOT NULL,
			Charge_Description text DEFAULT NULL,
			Status tinyint(2) DEFAULT 0,
			Comment text DEFAULT '',
			Date varchar(60) NOT NULL,
			Approver text DEFAULT NULL,
			Amount float(10,2) NOT NULL,
			PRIMARY KEY(Charge_ID),
			UNIQUE(NI_ID)
			) $charset_collate";

		$queries[] = "CREATE TABLE IF NOT EXISTS ".IAM_CERTIFICATION_TABLE." (
			Certification_ID int(5) NOT NULL AUTO_INCREMENT,
			NI_ID varchar(".$ni_leng.") NOT NULL,
			Name varchar(100) NOT NULL,
			Photo text DEFAULT NULL,
			Required tinyint(1) DEFAULT 0,
			Description text DEFAULT NULL,
			Time varchar(120) DEFAULT NULL,
			Supporting_Materials text DEFAULT NULL,
			PRIMARY KEY(Certification_ID),
			UNIQUE(NI_ID),
			UNIQUE(Name)
			) $charset_collate";

		$queries[] = "CREATE TABLE IF NOT EXISTS ".IAM_TAGS_TABLE." (
			Tag_ID bigint(20) NOT NULL AUTO_INCREMENT,
			Tag varchar(120) NOT NULL,
			Parent varchar(120) DEFAULT NULL,
			PRIMARY KEY(Tag_ID),
			UNIQUE(Tag)
			) $charset_collate";

		$queries[] = "CREATE TABLE IF NOT EXISTS ".IAM_TAGS_EQUIPMENT_TABLE." (
			Tag_ID bigint(20) NOT NULL,
			Equipment_ID int(9) NOT NULL,
			Unique_ID bigint(20) NOT NULL,
			UNIQUE(Unique_ID)
			) $charset_collate";

		$queries[] = "CREATE TABLE IF NOT EXISTS ".IAM_FILES_TABLE." (
			File_ID bigint(20) NOT NULL AUTO_INCREMENT,
			Name varchar(200) NOT NULL,
			Path varchar(2048) NOT NULL,
			URL varchar(2048) NOT NULL,
			Size bigint(20) NOT NULL,
			Type varchar(120) NOT NULL,
			PRIMARY KEY(File_ID),
			UNIQUE(Name)
			) $charset_collate";

		$queries[] = "CREATE TABLE IF NOT EXISTS ".IAM_SUPPORTING_FILES_TABLE." (
			File_ID bigint(20) NOT NULL,
			Certification_ID int(5) NOT NULL
			) $charset_collate";

		$queries[] = "CREATE TABLE IF NOT EXISTS ".IAM_USER_CERTIFICATIONS_TABLE." (
			IAM_ID bigint(20) NOT NULL,
			Certification_ID int(5) NOT NULL
			) $charset_collate";

		$queries[] = "CREATE TABLE IF NOT EXISTS ".IAM_ROOM_TABLE." (
			Room_ID int(10) NOT NULL AUTO_INCREMENT,
			NI_ID varchar(200) NOT NULL,
			Name varchar(200) NOT NULL,
			Description text DEFAULT NULL,
			Pricing_Description text DEFAULT NULL,
			Photo text DEFAULT NULL,
			Out_Of_Order tinyint(1) DEFAULT 0,
			PRIMARY KEY(Room_ID),
			UNIQUE(Name)
			) $charset_collate";

		$queries[] = "CREATE TABLE IF NOT EXISTS ".IAM_FACILITY_TABLE." (
			Facility_ID bigint(20) NOT NULL AUTO_INCREMENT,
			Tag_ID bigint(20) NOT NULL,
			Schedule_Type varchar(60) NOT NULL,
			Rental_Days int (3) DEFAULT NULL,
			Rental_Hours_Description text DEFAULT NULL,
			Appointment_Business_Hours text DEFAULT '',
			PRIMARY KEY(Facility_ID),
			UNIQUE(Tag_ID)
			) $charset_collate";

		$queries[] = "CREATE TABLE IF NOT EXISTS ".IAM_MATERIAL_EQUIPMENT_TABLE." (
			Unique_ID bigint(20) NOT NULL,
			Material_ID bigint(20) NOT NULL,
			Equipment_ID bigint(20) NOT NULL,
			UNIQUE(Unique_ID)
			) $charset_collate";

		$queries[] = "CREATE TABLE IF NOT EXISTS ".IAM_MATERIAL_TAGS_TABLE." (
			Unique_ID bigint(20) NOT NULL,
			Material_ID bigint(20) NOT NULL,
			Tag_ID bigint(20) NOT NULL,
			UNIQUE(Unique_ID)
			) $charset_collate";

		$queries[] = "CREATE TABLE IF NOT EXISTS ".IAM_META_TABLE." (
			Meta_ID bigint(20) NOT NULL AUTO_INCREMENT,
			Meta_Key varchar(256) NOT NULL,
			Meta_Value text DEFAULT '',
			PRIMARY KEY(Meta_ID)
			) $charset_collate";

		$queries[] = "CREATE TABLE IF NOT EXISTS ".IAM_ACCOUNT_TYPES_TABLE." (
			Account_Type_ID bigint(20) NOT NULL AUTO_INCREMENT,
			Name varchar(120) NOT NULL,
			Discount int(3) NOT NULL,
			PRIMARY KEY(Account_Type_ID),
			UNIQUE(Name)
			) $charset_collate";

		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
		$d = '';
		for ($i=0; $i < count($queries); $i++) {
			$d .= implode( dbDelta( $queries[$i] ) )."\n\n";
			//dbDelta( $queries[$i] );
		}
		send_to_debug_file($d);

		if (get_setting_iam('init_tags')=='false') {

			//insert required tags
			$wpdb->query("INSERT INTO ".IAM_TAGS_TABLE." (Tag) VALUES ('Fab Lab')");
			$wpdb->query("INSERT INTO ".IAM_TAGS_TABLE." (Tag) VALUES ('Equipment Room')");

			$wpdb->query("INSERT INTO ".IAM_TAGS_TABLE." (Tag,Parent) VALUES ('3D Printer','Fab Lab')");
			$wpdb->query("INSERT INTO ".IAM_TAGS_TABLE." (Tag,Parent) VALUES ('Extrusion','3D Printer')");
			$wpdb->query("INSERT INTO ".IAM_TAGS_TABLE." (Tag,Parent) VALUES ('Powder','3D Printer')");
			$wpdb->query("INSERT INTO ".IAM_TAGS_TABLE." (Tag,Parent) VALUES ('Stereolithography','3D Printer')");

			$wpdb->query("INSERT INTO ".IAM_TAGS_TABLE." (Tag,Parent) VALUES ('2D Printer','Fab Lab')");
			$wpdb->query("INSERT INTO ".IAM_TAGS_TABLE." (Tag,Parent) VALUES ('Laser Cutter','Fab Lab')");
			$wpdb->query("INSERT INTO ".IAM_TAGS_TABLE." (Tag,Parent) VALUES ('Wood Shop','Fab Lab')");
			$wpdb->query("INSERT INTO ".IAM_TAGS_TABLE." (Tag,Parent) VALUES ('Electronics Lab','Fab Lab')");
			$wpdb->query("INSERT INTO ".IAM_TAGS_TABLE." (Tag,Parent) VALUES ('Textiles Lab','Fab Lab')");

			$wpdb->query("INSERT INTO ".IAM_TAGS_TABLE." (Tag,Parent) VALUES ('Audio','Equipment Room')");
			$wpdb->query("INSERT INTO ".IAM_TAGS_TABLE." (Tag,Parent) VALUES ('Recorders','Audio')");
			$wpdb->query("INSERT INTO ".IAM_TAGS_TABLE." (Tag,Parent) VALUES ('Mics','Audio')");
			$wpdb->query("INSERT INTO ".IAM_TAGS_TABLE." (Tag,Parent) VALUES ('Speakers','Audio')");
			$wpdb->query("INSERT INTO ".IAM_TAGS_TABLE." (Tag,Parent) VALUES ('Accessories','Audio')");

			$wpdb->query("INSERT INTO ".IAM_TAGS_TABLE." (Tag,Parent) VALUES ('Photo/Video','Equipment Room')");
			$wpdb->query("INSERT INTO ".IAM_TAGS_TABLE." (Tag,Parent) VALUES ('DSLR','Photo/Video')");
			$wpdb->query("INSERT INTO ".IAM_TAGS_TABLE." (Tag,Parent) VALUES ('Camera','DSLR')");
			$wpdb->query("INSERT INTO ".IAM_TAGS_TABLE." (Tag,Parent) VALUES ('Lense','DSLR')");
			$wpdb->query("INSERT INTO ".IAM_TAGS_TABLE." (Tag,Parent) VALUES ('Camera-Mounted Lighting','DSLR')");

			$wpdb->query("INSERT INTO ".IAM_TAGS_TABLE." (Tag,Parent) VALUES ('Video Camera','Photo/Video')");
			$wpdb->query("INSERT INTO ".IAM_TAGS_TABLE." (Tag,Parent) VALUES ('Lighting','Photo/Video')");
			$wpdb->query("INSERT INTO ".IAM_TAGS_TABLE." (Tag,Parent) VALUES ('Photo/Video Miscellaneous','Photo/Video')");

			$wpdb->query("INSERT INTO ".IAM_TAGS_TABLE." (Tag,Parent) VALUES ('Computer','Equipment Room')");
			$wpdb->query("INSERT INTO ".IAM_TAGS_TABLE." (Tag,Parent) VALUES ('Projector','Equipment Room')");
			$wpdb->query("INSERT INTO ".IAM_TAGS_TABLE." (Tag,Parent) VALUES ('Monitor/TVs','Equipment Room')");
			$wpdb->query("INSERT INTO ".IAM_TAGS_TABLE." (Tag,Parent) VALUES ('Equipment Room Miscellaneous','Equipment Room')");

			update_settings_iam('init_tags','true');
		}

		//for fresh install only
		if (get_setting_iam('fresh_install')=='true') {
			update_settings_iam('fresh_install','false');
			//insert rooms into facility table, kind of a hack since rooms has no tags will introduce proper solution later
			$wpdb->query("INSERT INTO ".IAM_FACILITY_TABLE." (Tag_ID,Schedule_Type) VALUES (0,'Appointment')");
			//default material
			$timenid = uniqid();
			$wpdb->query("INSERT INTO ".IAM_MATERIAL_TABLE." (Name,Price_Per_Unit,Unit_Name,NI_ID) VALUES ('Time',0.1,'minutes','$timenid')");

			require_once iam_dir() . 'tables/wp_iam_equipment.php';
			require_once iam_dir() . 'tables/wp_iam_certification.php';
			require_once iam_dir() . 'tables/wp_iam_room.php';
			require_once iam_dir() . 'tables/wp_iam_tags_equipment.php';
			$relational_array = [];
			$equip_dictionary = [];
			$cert_dictionary = [];
			foreach ($wp_iam_room as $row) {
				$wpdb->query($wpdb->prepare("INSERT INTO ".IAM_ROOM_TABLE." (NI_ID,Name,Description,Pricing_Description,Photo,Out_Of_Order) VALUES (%s,%s,%s,%s,%s,%d)",$row->NI_ID,$row->Name,$row->Description,$row->Pricing_Description,$row->Photo,$row->Out_Of_Order));
			}
			foreach ($wp_iam_certification as $row) {
				$cert_dictionary[$row['Certification_ID']] = $row['Name'];
			}
			foreach ($wp_iam_equipment as $row) {
				$relational_array[$row['Name']] = $cert_dictionary[$row['Certification_ID']];
				$wpdb->query($wpdb->prepare("INSERT INTO ".IAM_EQUIPMENT_TABLE." (NI_ID,Certification_ID,Name,Description,Pricing_Description,Photo,Manufacturer_Info,On_Slide_Show,Out_Of_Order,Root_Tag) VALUES (%s,%d,%s,%s,%s,%s,%s,%d,%d,%s)",
					$row['NI_ID'],0,$row['Name'],$row['Description'],$row['Pricing_Description'],$row['Photo'],$row['Manufacturer_Info'],$row['On_Slide_Show'],$row['Out_Of_Order'],$row['Root_Tag']));
				$equip_id = $wpdb->get_results($wpdb->prepare("SELECT Equipment_ID FROM ".IAM_EQUIPMENT_TABLE." WHERE Name=%s",$row['Name']))[0]->Equipment_ID;
				//relate new equip id to old
				$equip_dictionary[$row['Equipment_ID']] = $equip_id;
			}
			foreach ($wp_iam_certification as $row) {
				$wpdb->query($wpdb->prepare("INSERT INTO ".IAM_CERTIFICATION_TABLE." (NI_ID,Name,Description,Time,Supporting_Materials,Photo,Required) VALUES (%s,%s,%s,%s,%s,%s,%d)",
					$row['NI_ID'],$row['Name'],$row['Description'],$row['Time'],$row['Supporting_Materials'],$row['Photo'],$row['Required']));
			}
			foreach ($relational_array as $key => $value) {
				$cert_id = $wpdb->get_results("SELECT Certification_ID FROM ".IAM_CERTIFICATION_TABLE." WHERE Name='$value'")[0]->Certification_ID;
				$wpdb->query($wpdb->prepare("UPDATE ".IAM_EQUIPMENT_TABLE." SET Certification_ID=%d WHERE Name=%s",$cert_id,$key));
			}
			foreach ($wp_iam_tags_equipment as $row) {
				$wpdb->query($wpdb->prepare("INSERT INTO ".IAM_TAGS_EQUIPMENT_TABLE." (Tag_ID,Equipment_ID) VALUES (%d,%d)",$row['Tag_ID'],$equip_dictionary[$row['Equipment_ID']]));
			}

			//default values for account types
			$wpdb->query("INSERT INTO ".IAM_ACCOUNT_TYPES_TABLE." (Name,Discount) VALUES ('student',0)");
			$wpdb->query("INSERT INTO ".IAM_ACCOUNT_TYPES_TABLE." (Name,Discount) VALUES ('community',0)");
			$wpdb->query("INSERT INTO ".IAM_ACCOUNT_TYPES_TABLE." (Name,Discount) VALUES ('faculty',0)");
			$wpdb->query("INSERT INTO ".IAM_ACCOUNT_TYPES_TABLE." (Name,Discount) VALUES ('new media student',0)");
			$wpdb->query("INSERT INTO ".IAM_ACCOUNT_TYPES_TABLE." (Name,Discount) VALUES ('imfa student',0)");

			//make the pages
			$page = get_page_by_title('Reservations');

			if ($page==null) {

				wp_insert_post(['post_content'=>'[imrc-account-balances]','post_title'=>'Account Balance','post_status'=>'publish','post_type'=>'page']);
				wp_insert_post(['post_content'=>'[imrc-certifications]','post_title'=>'Certifications','post_status'=>'publish','post_type'=>'page']);
				wp_insert_post(['post_content'=>'[imrc-checkout]','post_title'=>'Checkout','post_status'=>'publish','post_type'=>'page']);
				wp_insert_post(['post_content'=>'[imrc-login]','post_title'=>'Login','post_status'=>'publish','post_type'=>'page']);
				wp_insert_post(['post_content'=>'[imrc-register]','post_title'=>'Register','post_status'=>'publish','post_type'=>'page']);
				wp_insert_post(['post_content'=>'[imrc-reservations]','post_title'=>'Reservations','post_status'=>'publish','post_type'=>'page']);
				wp_insert_post(['post_content'=>'[imrc-training]','post_title'=>'Training','post_status'=>'publish','post_type'=>'page']);
				wp_insert_post(['post_content'=>'[imrc-faq]','post_title'=>'FAQ','post_status'=>'publish','post_type'=>'page']);
			}
		}

	}

}
