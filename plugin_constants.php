<?php

define('IAM_PREFIX', wp_prefix().'iam_');

define('IAM_USERS_TABLE', IAM_PREFIX.'users');

define('IAM_EQUIPMENT_TABLE', IAM_PREFIX.'equipment');

define('IAM_RESERVATION_TABLE', IAM_PREFIX.'reservation');

define('IAM_TRAINING_TABLE', IAM_PREFIX.'training');

define('IAM_TRAINEE_TABLE', IAM_PREFIX.'trainee');

define('IAM_MATERIAL_TABLE', IAM_PREFIX.'material');

define('IAM_CHARGE_TABLE', IAM_PREFIX.'charge');

define('IAM_CERTIFICATION_TABLE', IAM_PREFIX.'certification');

define('IAM_TAGS_TABLE', IAM_PREFIX.'tags');

define('IAM_TAGS_EQUIPMENT_TABLE', IAM_PREFIX.'tags_equipment');

define('IAM_FILES_TABLE', IAM_PREFIX.'files');

define('IAM_SUPPORTING_FILES_TABLE', IAM_PREFIX.'supporting_files');

define('IAM_USER_CERTIFICATIONS_TABLE', IAM_PREFIX.'user_certifications');

define('IAM_FACILITY_TABLE', IAM_PREFIX.'facility');

define('IAM_MATERIAL_EQUIPMENT_TABLE', IAM_PREFIX.'material_equipment');

define('IAM_MATERIAL_TAGS_TABLE', IAM_PREFIX.'material_tags');

define('IAM_META_TABLE', IAM_PREFIX.'meta');

define('IAM_ACCOUNT_TYPES_TABLE', IAM_PREFIX.'account_types');

define('IAM_NI_LENGTH', 200);

define('IAM_RESERVATIONS_PRIVILEGE_META', 'iam_reservations_privilege_denied');

define('IAM_DEFAULT_LARGE_PICTURE',  plugins_url( 'assets/default_large.png', __FILE__ ));

define('UPCOMING', 0);

define('ACTIVE', 1);

define('NO_SHOW', 2);

define('COMPLETED', 3);

define('NO_PAY', 4);

define('IS_LATE', 5);

define('WAS_LATE', 6);

define('CHARGE_CANCELLED', -1);

define('CHARGE_PENDING', 0);

define('CHARGE_APPROVED', 1);

define('IAM_DIR', plugin_dir_path(__FILE__));

define('IAM_IP_LOGS','iplogs');

define('IAM_LOGIN_LOGS','loginlogs');

define('REGISTRATION_KEY', 'user_registration_key');

define('IMRC_TIME_ZONE', 'America/New_York');

define('SUCCESS', 'success');

define('ERROR', 'error');

define('DATABASE_ERROR', 'Error: Database error.');

define('INVALID_INPUT_EXCEPTION', 'Error: Invalid input recevied.');

define('INVALID_REQUEST_EXCEPTION', 'Error: Invalid Request.');

define('DEBUG_FILE', plugin_dir_path( dirname( __FILE__ ) ).'imrc-account-manager/logs/iam_debug.txt');

define('BUG_REPORTING', json_decode( file_get_contents(iam_dir().'config/operations.json') )->dev);

define('DEV_MODE', json_decode( file_get_contents(iam_dir().'config/operations.json') )->dev);

define('SMALL_DB_MODE', json_decode( file_get_contents(iam_dir().'config/operations.json') )->small_db);

define('DATE_FORMAT', 'Y-m-d H:i:s');

define('HOUR_FORMAT', 'G:i');

define('RENTAL_PREFIX', 'rental_type_');

define('LAST_ER_CHECK_PREFIX', 'last_er_check_');

define('RENTAL_ALL_QUERY', "SELECT Meta_Value FROM ".IAM_META_TABLE." WHERE Meta_Key LIKE '".RENTAL_PREFIX."%'");

define('LATE_CHARGE_FEE_KEY', 'late_charge_fee');

define('SECONDS_IN_DAY', 86400);

define('DEFAULT_LATE_CHARGE_FEE_QUERY', "INSERT INTO ".IAM_META_TABLE." (Meta_Key,Meta_Value) VALUES ('".LATE_CHARGE_FEE_KEY."',10)");
