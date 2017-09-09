<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              http://example.com
 * @since             1.0.0
 * @package           IAM
 *
 * @wordpress-plugin
 * Plugin Name:       IMRC Account Manager
 * Description:       A custom plugin made for the UMO IMRC to help automate the fabrication labs and equipment room. Please read the associated readme at yoursite.com/wp-content/plugins/imrc-account-manager/readme.txt
 * Version:           0.3.0
 * Author:            James LeVasseur
 * Author URI:        jameslevasseur.com
 * License:           All rights reserved
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

function wp_prefix()
{
	global $wpdb;
	return $wpdb->prefix;
}

//constants for plugin

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

define('IAM_ROOM_TABLE', IAM_PREFIX.'room');

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

define('RENTAL_PREFIX', 'rental_type_');

define('LAST_ER_CHECK_PREFIX', 'last_er_check_');


define('RENTAL_ALL_QUERY', "SELECT Meta_Value FROM ".IAM_META_TABLE." WHERE Meta_Key LIKE '".RENTAL_PREFIX."%'");

define('LATE_CHARGE_FEE_KEY', 'late_charge_fee');

define('SECONDS_IN_DAY', 86400);


define('DEFAULT_LATE_CHARGE_FEE_QUERY', "INSERT INTO ".IAM_META_TABLE." (Meta_Key,Meta_Value) VALUES ('".LATE_CHARGE_FEE_KEY."',10)");

//global functions

function get_client_ip() {
    $ipaddress = '';
    if (getenv('HTTP_CLIENT_IP'))
        $ipaddress = getenv('HTTP_CLIENT_IP');
    else if(getenv('HTTP_X_FORWARDED_FOR'))
        $ipaddress = getenv('HTTP_X_FORWARDED_FOR');
    else if(getenv('HTTP_X_FORWARDED'))
        $ipaddress = getenv('HTTP_X_FORWARDED');
    else if(getenv('HTTP_FORWARDED_FOR'))
        $ipaddress = getenv('HTTP_FORWARDED_FOR');
    else if(getenv('HTTP_FORWARDED'))
       $ipaddress = getenv('HTTP_FORWARDED');
    else if(getenv('REMOTE_ADDR'))
        $ipaddress = getenv('REMOTE_ADDR');
    else
        $ipaddress = null;
    return $ipaddress;
}

function iam_mail($to,$subject,$message,$failure_message="Failed to send email.")
{
    if (strpos( $_SERVER['HTTP_HOST'], 'localhost' )!==false)
        return;
	try {
		if (!wp_mail($to, $subject, $message, array('Content-Type: text/html; charset=UTF-8'))) {
			throw new Exception($failure_message);
		}
	}
	catch(Exception $e) {
	   IAM::$status_message = $e->getMessage();
	}
}

function ordinal_format($number) {
    $ends = array('th','st','nd','rd','th','th','th','th','th','th');
    if ((($number % 100) >= 11) && (($number%100) <= 13))
        return $number. 'th';
    else
        return $number. $ends[$number % 10];
}

function validateAndMoveImg($file)
{
	if (IAM_Sec::verifyImageFile($file['tmp_name'])) {
			$movefile = wp_handle_upload($file,array( 'test_form' => false ));
			if ( $movefile && !isset( $movefile['error'] ) ) {
					return $movefile['url'];
			} else {
					/**
					 * Error generated by _wp_handle_upload()
					 * @see _wp_handle_upload() in wp-admin/includes/file.php
					 */
					iam_throw_error( "MOVE FILE ERROR: ".$movefile['error'] );
					exit;
			}
	} else {
		iam_throw_error ( 'Error - Invalid Image File');
		exit;
	}
}

function cash_format($number)
{
	setlocale(LC_MONETARY, 'en_US.UTF-8');
	return money_format('%.2n', $number);
}

add_filter('wp_mail_from','iam_wp_mail_from');
function iam_wp_mail_from($content_type) {
  return 'noreply@'.$_SERVER['HTTP_HOST'];
}
add_filter('wp_mail_from_name','iam_wp_mail_from_name');
function iam_wp_mail_from_name($name) {
  return 'The IMRC';
}

function iam_respond($status='success',$content='',$message='',$redirect='')
{
	echo json_encode(['status'=>$status,'content'=>$content,'message'=>$message,'redirect'=>$redirect]);
	exit;
}

function get_rental_period($id)
{
	global $wpdb;
	$json = $wpdb->get_results($wpdb->prepare("SELECT Meta_Value FROM ".IAM_META_TABLE." WHERE Meta_Key=%s",RENTAL_PREFIX.$id));
	if (count($json)==0) {
		return 0;
	}
	return json_decode($json[0]->Meta_Value)->duration;
}

function iam_throw_error($message,$code='400')
{
	header('HTTP/1.1 '.$code.' '.$message);
	exit;
}

function get_email($iam_id)
{
	global $wpdb;
	$wpid = $wpdb->get_results($wpdb->prepare("SELECT WP_ID FROM ".IAM_USERS_TABLE." WHERE IAM_ID=%d",$iam_id))[0]->WP_ID;
	return get_userdata($wpid)->user_email;
}

function get_user_for_email($email)
{
	global $wpdb;
	return $wpdb->get_results("SELECT * FROM ".IAM_USERS_TABLE." WHERE WP_ID=".get_user_by('email',$email)->ID)[0];
}

function get_full_name($wpid)
{
	$u = get_userdata($wpid);
	return ucwords($u->first_name.' '.$u->last_name);
}

function send_to_debug_file($s)
{
    if(!file_exists(DEBUG_FILE)) {
        $debugfile = fopen(DEBUG_FILE, "w+");
        fclose($debugfile);
    }
    date_default_timezone_set(IMRC_TIME_ZONE);
    $content = "================== ".date('M-j-y g:i:s a')." =================\n".$s;
    file_put_contents(DEBUG_FILE, $content.PHP_EOL , FILE_APPEND | LOCK_EX);
}

function include_files_in($dir)
{
	$files = glob(iam_dir(). $dir . '/*.php');
	foreach ($files as $file) {
	    require_once($file);
	}
}

function iam_dir()
{
    $dir = plugin_dir_path( dirname( __FILE__ ) );
    $dir = strpos($dir, 'imrc-account-manager')===false ? $dir.'imrc-account-manager/' : $dir;
    return $dir;
}

function iam_make_post($url,$data,$header="Content-type: application/x-www-form-urlencoded\r\n")
{
	// use key 'http' even if you send the request to https://...
	$options = array(
	    'http' => array(
	        'header'  => $header,
	        'method'  => 'POST',
	        'content' => http_build_query($data)
	    )
	);
	$context  = stream_context_create($options);
	$result = file_get_contents($url, false, $context);
	if ($result === FALSE) { iam_throw_error('BAD_REQUEST_MADE'); }

	return $result;
}

function iam_validate_get_results($results, $location='', $fail_on_empty=false)
{
	if ($results===null) {
		iam_throw_error(DATABASE_ERROR.' '.$location);
	}
	if ($fail_on_empty && count($results)===0) {
		iam_throw_error(DATABASE_ERROR.' '.$location);
	}
}

function make_nid()
{
	return md5(uniqid());
}

function iam_validate_query($results, $location='', $fail_on_zero=false)
{
	if ($results===false) {
		iam_throw_error(DATABASE_ERROR.' '.$location);
	}
	if ($fail_on_zero && $results===0) {
		iam_throw_error(DATABASE_ERROR.' '.$location);
	}
}

function iam_login_scripts() {
    wp_enqueue_style( 'iam-login-style', plugin_dir_url( __FILE__ ) . 'public/css/imrc-account-manager-public.css', array() );
    wp_enqueue_script( 'iam-login-script', plugin_dir_url( __FILE__ ) . 'public/js/imrc-account-manager-public.js', array( 'jquery' ) );
}
add_action( 'login_enqueue_scripts', 'iam_login_scripts' );

function iam_output($val)
{
	return htmlspecialchars($val);
}

function escape_CSV_quotes($str)
{
	return str_replace('"','""',$str);
}

add_filter( 'registration_errors', 'prevent_other_registration', 10, 3 );
function prevent_other_registration( $errors, $sanitized_user_login, $user_email ) {

    $errors->add( 'registration error', '<strong>ERROR</strong>: Please register through the main page.' );

    return $errors;
}


function iam_init_file($name,$default_vals='',$fresh=false)
{
	$file;
	if (!file_exists(plugin_dir_path( __FILE__ ) . "config")) {
		mkdir(plugin_dir_path( __FILE__ ) . "config", 0755);
	}
	if ($fresh) {
		$file = fopen( plugin_dir_path( __FILE__ ) . "config/$name", "w+");
	} else {
		$file = fopen( plugin_dir_path( __FILE__ ) . "config/$name", "w");
	}
	$current_gmt_timestamp = time();
	fwrite($file, $default_vals);
}

function iam_update_value($filename,$key,$value,$init_blank=false)
{
	if(!file_exists(plugin_dir_path( __FILE__ ) . 'config/'.$filename)) {
		if (!$init_blank) {
			return false;
		}
		iam_init_file($filename);
	}
	$content = file_get_contents(plugin_dir_path( __FILE__ ) . 'config/'.$filename);
	$start = strpos($content, $key);
	$file = fopen(plugin_dir_path( __FILE__ ) . 'config/'.$filename, 'w+');
	if ($start===false) {
		$start = count($content)-1;
		fwrite($file, $content.$key.':'.$value.';');
	} else {
		fwrite($file, substr($content, 0, strpos($content, ':', $start)+1).$value.substr($content, strpos($content, ';',$start+1)));
	}
}

//returns the value for a setting in config/settings
function iam_get_value($filename,$key,$init_blank=false)
{
	if(!file_exists(plugin_dir_path( __FILE__ ) . 'config/'.$filename)) {
		if (!$init_blank) {
			return false;
		}
		iam_init_file($filename);
	}
	$content = file_get_contents(plugin_dir_path( __FILE__ ) .'config/'.$filename);
	$start = strpos($content, $key);
	if ($start===false) {
		return false;
	}
	return substr( $content, strpos($content, ':', $start)+1, strpos($content, ';', $start)-strpos($content, ':', $start)-1);
}

//initializes the settings file
//creates config/settings where plugin settings are stored
//if fresh is true then it makes a fresh settings file with default settings
function init_settings_iam($fresh = false)
{
	$settings;
	if (!file_exists(plugin_dir_path( __FILE__ ) . "config")) {
		mkdir(plugin_dir_path( __FILE__ ) . "config", 0755);
	}
	if ($fresh) {
		$settings = fopen( plugin_dir_path( __FILE__ ) . "config/settings", "w+");
	} else {
		$settings = fopen( plugin_dir_path( __FILE__ ) . "config/settings", "w");
	}
	$current_gmt_timestamp = time();
	fwrite($settings, "fresh_install:true;init_tags:false;ipad_code:0000;ipad_code_updated:$current_gmt_timestamp;training_email:admin@".$_SERVER['HTTP_HOST'].";late_reservations_email:admin@".$_SERVER['HTTP_HOST'].";equipment_room_email:admin@".$_SERVER['HTTP_HOST'].";fab_lab_email:admin@".$_SERVER['HTTP_HOST'].";rooms_email:admin@".$_SERVER['HTTP_HOST'].";".LATE_CHARGE_FEE_KEY.":10;debug_log:none;");
}

//updates a setting in config/settings to value
function update_settings_iam($setting, $value)
{
	if(!file_exists(plugin_dir_path( __FILE__ ) . 'config/settings')) {
		init_settings_iam();
	}
	$content = file_get_contents(plugin_dir_path( __FILE__ ) . 'config/settings');
	$start = strpos($content, $setting);
	if ($start===false) {
		$file = fopen(plugin_dir_path( __FILE__ ) . 'config/settings', 'w+');
		fwrite($file, $content.$setting.':'.$value.';');
		return;
	}
	$file = fopen(plugin_dir_path( __FILE__ ) . 'config/settings', 'w+');
	fwrite($file, substr($content, 0, strpos($content, ':', $start)+1).$value.substr($content, strpos($content, ';',$start+1)));
}

//returns the value for a setting in config/settings
function get_setting_iam($setting)
{
	if(!file_exists(plugin_dir_path( __FILE__ ) . 'config/settings')) {
		init_settings_iam();
	}
	$content = file_get_contents(plugin_dir_path( __FILE__ ) .'config/settings');
	$start = strpos($content, $setting);
	if ($start===false)
		return false;
	return substr( $content, strpos($content, ':', $start)+1, strpos($content, ';', $start)-strpos($content, ':', $start)-1);
}

//declare any actions or filters that are outside the plugin loader

add_filter('authenticate', 'iam_check_for_approval', 30, 3);

function iam_check_for_approval($user, $username, $password)
{
    $user_obj = get_user_by('login', $username );
    if (is_wp_error($user)) {
    	return $user;
    }
    if ($username!=''){
        $value = get_user_meta($user->ID, 'iam_need_admin_approval', true);
        if($value!=null){
        	iam_throw_error('DENIED: Your account is awaiting approval by an admin.');
            $user = new WP_Error( 'denied', __("<strong>ERROR</strong>: Your account needs approval by an admin.") );//create an error
            remove_action('authenticate', 'wp_authenticate_username_password', 20); //key found - don't proceed!
        }
    }
    return $user;
}

function iam_remove_dashboard()
{
	global $current_user, $menu, $submenu;
    get_currentuserinfo();

    if( ! in_array( 'administrator', $current_user->roles ) ) {
    	wp_redirect( home_url() ); exit;
    }
}

add_action('admin_menu', 'iam_remove_dashboard');

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/IAM-activator.php
 */
function activate_iam() {
	init_settings_iam();
	require_once plugin_dir_path( __FILE__ ) . 'includes/IAM-activator.php';
	IAM_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/IAM-deactivator.php
 */
function deactivate_iam() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/IAM-deactivator.php';
	IAM_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_iam' );
register_deactivation_hook( __FILE__, 'deactivate_iam' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/IAM.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_iam() {

	$plugin = new IAM();
	$plugin->run();

}
run_iam();
