<?php

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
