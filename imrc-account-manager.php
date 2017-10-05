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

 use Monolog\Logger;
 use Monolog\Handler\StreamHandler;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

function wp_prefix()
{
	global $wpdb;
	return $wpdb->prefix;
}

//global functions
require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/utils.php';
require __DIR__ . '/plugin_constants.php';
require __DIR__ . '/error_utils.php';
require __DIR__ . '/filters_and_actions.php';
require __DIR__ . '/settings_util.php';
require __DIR__ . '/time_utils.php';

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
  show_all_errors();
	$plugin = new IAM();
	$plugin->run();

}
run_iam();
