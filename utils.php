<?php

function cash_format($number)
{
	setlocale(LC_MONETARY, 'en_US.UTF-8');
	return money_format('%.2n', $number);
}

function escape_CSV_quotes($str)
{
	return str_replace('"','""',$str);
}

function ezget($string, ...$rest)
{
	global $wpdb;
	if (is_array($rest[0])=='array') {
		$rest = $rest[0];
	}
	return $wpdb->get_results($wpdb->prepare($string, $rest));
}

function ezquery($string, ...$rest)
{
	global $wpdb;
	if (is_array($rest[0])=='array') {
		$rest = $rest[0];
	}
	//print_r($rest);exit;
	//echo $wpdb->prepare($string, $rest).'<br>';exit;
	return $wpdb->query($wpdb->prepare($string, $rest));
}

function get_protocol_prefix()
{
	if (is_ssl())
		return 'https://';
	return 'http://';
}

function get_domain_url()
{
	return get_protocol_prefix().$_SERVER['HTTP_HOST'].'/';
}

function get_iam_prefix()
{
	global $wpdb;
	return $wpdb->prefix.'iam_';
}

function get_root_tag($equip_name) {
	return ezget("SELECT Root_Tag FROM ".IAM_EQUIPMENT_TABLE." WHERE Name=%s",$equip_name)[0]->Root_Tag;
}

function get_late_check_time($facility_name) {
	$s = json_decode(ezget("SELECT Schedule FROM ".IAM_FACILITY_TABLE." WHERE Name=%s",$facility_name)[0]->Schedule);
	return $s->late_check_time;
}

function get_rental_period($id)
{
	global $wpdb;
	$json = $wpdb->get_results($wpdb->prepare("SELECT Meta_Value FROM ".IAM_META_TABLE." WHERE Meta_Key=%s",RENTAL_PREFIX.$id));
	if (count($json)==0) {
		$default = ezget("SELECT Meta_Value FROM ".IAM_META_TABLE." WHERE Meta_Key=%s", DEFAULT_RENTAL_TYPE_KEY)[0]->Meta_Value;
		return json_decode($default)->duration;
	}
	return json_decode($json[0]->Meta_Value)->duration;
}

function get_rental_type_for($id)
{
	global $wpdb;
	$json = $wpdb->get_results($wpdb->prepare("SELECT Meta_Value FROM ".IAM_META_TABLE." WHERE Meta_Key=%s",RENTAL_PREFIX.$id));
	if (count($json)==0) {
		return 0;
	}
	return json_decode($json[0]->Meta_Value);
}

function get_tags_for_equipment($key,$val)
{
	global $wpdb;

	if ($key!='Equipment_ID')
		$e = ezget("SELECT Equipment_ID FROM ".IAM_EQUIPMENT_TABLE." WHERE $key=%s",$val)[0]->Equipment_ID;
	else
		$e = $val;

	$tags = [];
	$tag_results = ezget("SELECT Tag_ID FROM ".IAM_TAGS_EQUIPMENT_TABLE." WHERE Equipment_ID=%d",$e);

	foreach ($tag_results as $row) {
		$tags[] = ezget("SELECT * FROM ".IAM_TAGS_TABLE." WHERE Tag_ID=%d",$row->Tag_ID)[0];
	}

	return $tags;
}

function get_list_of_tags_for($equipment_id,$delimiter)
{
	$tags = get_tags_for_equipment('Equipment_ID',$equipment_id);

	$taglist = '';

	for ($i=0; $i < count($tags); $i++) {
		$taglist.=$tags[$i]->Tag.$delimiter;
	}

	return substr($taglist,0,-strlen($delimiter));
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

function get_first_last_name($wpid)
{
	$u = get_userdata($wpid);
	return ['first'=>ucwords($u->first_name), 'last'=>ucwords($u->last_name)];
}

function has_privileges($WPID=null)
{
	if ($WPID===null){
		$current_user = wp_get_current_user();
  	get_currentuserinfo();
  	$WPID = $current_user->ID;
	}
	$has_priv = get_user_meta($WPID,IAM_RESERVATIONS_PRIVILEGE_META);
	if (count($has_priv)>0 && $has_priv!=false) {
		return false;
	}
	return true;
}

function include_files_in($dir)
{
	$files = glob(iam_dir(). $dir . '/*.php');
	foreach ($files as $file) {
	    require_once($file);
	}
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

function iam_output($val)
{
	return htmlspecialchars($val);
}

function iam_dir()
{
    $dir = plugin_dir_path( dirname( __FILE__ ) );
    $dir = strpos($dir, 'imrc-account-manager')===false ? $dir.'imrc-account-manager/' : $dir;
    return $dir;
}

function iam_url()
{
	$dir = plugin_dir_url( dirname( __FILE__ ) );
	$dir = strpos($dir, 'imrc-account-manager')===false ? $dir.'imrc-account-manager/' : $dir;
	return $dir;
}

function iam_mail($to,$subject,$message,$failure_message="Failed to send email.")
{
  if (strpos( $_SERVER['HTTP_HOST'], 'localhost' )!==false)
      return;
	try {
		if (!wp_mail($to, $subject, $message, array('Content-Type: text/html; charset=UTF-8'))) {
			throw new Exception($failure_message);
		}
		send_to_email_log_file("to: $to");
		send_to_email_log_file("subject: $subject");
		send_to_email_log_file("message: $message");
	}
	catch(Exception $e) {
	   IAM::$status_message = $e->getMessage();
	}
}

function iam_respond($status='success',$content='',$message='',$redirect='')
{
	echo json_encode(['status'=>$status,'content'=>$content,'message'=>$message,'redirect'=>$redirect]);
	exit;
}

function make_human_readable_date($date)
{
	if (empty($date))
		return RESERVATION_NOT_ENDED_YET;
	$dt = DateTime::createFromFormat(DATE_FORMAT,$date);
	return $dt->format('M-d-y g:i a');
}

function make_nid()
{
	return md5(uniqid());
}

function make_tooltip($text)
{
	return '<span style="background:none;" title="'.$text.'"><i style="font-size:20px;" class="fa fa-question-circle"></i></span>';
}

function make_phone_number_field()
{
	return '
	<div class="iam-phone-num-grp">
	<span>(&nbsp;</span><input type="text" name="phone-num-1" id="phone-num-1" maxlength="3" size="3"><span>&nbsp;)&nbsp;</span>
	<input type="text" name="phone-num-2" id="phone-num-2" maxlength="3" size="3"><span>&nbsp;-&nbsp;</span>
	<input type="text" name="phone-num-3" id="phone-num-3" maxlength="4" size="4"></div>';
}

function make_phone_number_field_with($phonenum)
{
	if (empty($phonenum))
		return make_phone_number_field();

	$parts = explode('-',$phonenum);
	return '
	<div class="iam-phone-num-grp">
	<span>(&nbsp;</span><input type="text" value="'.$parts[0].'" name="phone-num-1" id="phone-num-1" maxlength="3" size="3"><span>&nbsp;)&nbsp;</span>
	<input type="text" value="'.$parts[1].'" name="phone-num-2" id="phone-num-2" maxlength="3" size="3"><span>&nbsp;-&nbsp;</span>
	<input type="text" value="'.$parts[2].'" name="phone-num-3" id="phone-num-3" maxlength="4" size="4"></div>';
}

function ordinal_format($number) {
    $ends = array('th','st','nd','rd','th','th','th','th','th','th');
    if ((($number % 100) >= 11) && (($number%100) <= 13))
        return $number. 'th';
    else
        return $number. $ends[$number % 10];
}

function iam_slugify($string,$delimiter='-')
{
	$s = strtolower(trim($string));
	$s = str_replace(' ',$delimiter,$s);
	$s = str_replace('_',$delimiter,$s);
	$s = str_replace('-',$delimiter,$s);
	return $s;
}

function show_all_errors()
{
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);
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

function send_to_log_file($s)
{
    if(!file_exists(LOG_FILE)) {
        $debugfile = fopen(LOG_FILE, "w+");
        fclose($debugfile);
    }
    date_default_timezone_set(IMRC_TIME_ZONE);
    $content = "================== ".date('M-j-y g:i:s a')." =================\n".$s;
    file_put_contents(LOG_FILE, $content.PHP_EOL , FILE_APPEND | LOCK_EX);
}

function send_to_email_log_file($s)
{
    if(!file_exists(EMAIL_LOG_FILE)) {
        $debugfile = fopen(EMAIL_LOG_FILE, "w+");
        fclose($debugfile);
    }
    date_default_timezone_set(IMRC_TIME_ZONE);
    $content = "================== ".date('M-j-y g:i:s a')." =================\n".$s;
    file_put_contents(EMAIL_LOG_FILE, $content.PHP_EOL , FILE_APPEND | LOCK_EX);
}
