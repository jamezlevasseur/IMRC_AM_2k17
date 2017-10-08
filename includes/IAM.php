<?php

/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    IAM
 * @subpackage IAM/includes
 */

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      1.0.0
 * @package    IAM
 * @subpackage IAM/includes
 * @author     Your Name <email@example.com>
 */
class IAM {

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      IAM_Loader    $loader    Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $iam    The string used to uniquely identify this plugin.
	 */
	protected $iam;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected $version;

	public static $status_message = '';

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {

		$this->iam = 'plugin-name';
		$this->version = '1.0.0';

		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
		$this->define_public_hooks();

		//register hooks for non-specific parts
		$this->loader->add_action( 'delete_user', $this, 'on_delete_user' );
		$this->loader->add_action( 'wp_mail_failed', $this, 'on_mail_failed' );

		$plugin_login = new IAM_Login();

		$this->loader->add_shortcode( 'imrc-login', $plugin_login, 'render_login_form' );
     	$this->loader->add_shortcode( 'imrc-register', $plugin_login, 'render_register_form' );

	}

	public function on_mail_failed($error)
	{

		add_user_meta(1, 'failed_email_'.uniqid(), $error);
		print_r($error);exit;
	}

	/**
	 * Function deletes users in the iam table if also deleted from wp_users
	 *
	 * @since 	1.0.0
	 *
	 * @return void
	 */
	public function on_delete_user($user_id)
	{
		global $wpdb;
		//res, charge, user certs
		$iam_id = $wpdb->get_results($wpdb->prepare("SELECT IAM_ID FROM ".IAM_USERS_TABLE." WHERE WP_ID=%d",$user_id))[0]->IAM_ID;
		$wpdb->query($wpdb->prepare("DELETE FROM ".IAM_RESERVATION_TABLE." WHERE IAM_ID=%d",$iam_id));
		$wpdb->query($wpdb->prepare("DELETE FROM ".IAM_USER_CERTIFICATIONS_TABLE." WHERE IAM_ID=%d",$iam_id));
		$wpdb->query($wpdb->prepare("DELETE FROM ".IAM_USERS_TABLE." WHERE WP_ID=%d",$user_id));
	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - IAM_Loader. Orchestrates the hooks of the plugin.
	 * - IAM_i18n. Defines internationalization functionality.
	 * - IAM_Admin. Defines all hooks for the admin area.
	 * - IAM_Public. Defines all hooks for the public side of the site.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function load_dependencies() {

		include_files_in('admin/render');

		include_files_in('public/render');

		include_files_in('includes/classes');

		require_once iam_dir() . 'includes/IAM-sec.php';

		require_once iam_dir() . 'admin/debug.php';

		/**
		 * The class responsible for orchestrating the actions and filters of the
		 * core plugin.
		 */
		require_once iam_dir() . 'includes/IAM-loader.php';

		/**
		 * The class responsible for defining internationalization functionality
		 * of the plugin.
		 */
		require_once iam_dir() . 'includes/IAM-i18n.php';

		/**
		 * The class responsible for defining all actions that occur in the admin area.
		 */
		require_once iam_dir() . 'admin/IAM-admin.php';

		/**
		 * The class responsible for defining all actions that occur in the public-facing
		 * side of the site.
		 */
		require_once iam_dir() . 'public/IAM-public.php';

		require_once iam_dir() . 'includes/IAM-login.php';

		$this->loader = new IAM_Loader();

	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the IAM_i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function set_locale() {

		$plugin_i18n = new IAM_i18n();
		$plugin_i18n->set_domain( $this->get_plugin_name() );

		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );

	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_admin_hooks() {

		$plugin_admin = new IAM_Admin( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );
		$this->loader->add_action('admin_menu', $plugin_admin, 'admin_setup_menu');

		$this->loader->add_action('wp_ajax_debug_make_res', 'Debug_Page', 'make_dummy_res');

		$this->loader->add_action('wp_ajax_add_charge_to_user', 'Users_Page', 'add_charge_to_user');
		$this->loader->add_action('wp_ajax_get_user_charge_table', 'Users_Page', 'get_user_charge_table');
		$this->loader->add_action('wp_ajax_get_user_info_html', 'Users_Page', 'get_user_info_html');
		$this->loader->add_action('wp_ajax_user_update_account_info', 'IAM_User', 'user_update_account_info');

		$this->loader->add_action('wp_ajax_admin_delete_supporting_file', 'Certifications_Page', 'admin_delete_supporting_file');
		$this->loader->add_action('wp_ajax_admin_update_existing_file_list', 'Certifications_Page', 'admin_update_existing_file_list');
		$this->loader->add_action('wp_ajax_admin_certification_action', 'Certifications_Page', 'admin_certification_callback');

		$this->loader->add_action('wp_ajax_admin_get_charge_table_json', 'Charge_Sheet_Page', 'admin_get_charge_table_json');
		$this->loader->add_action('wp_ajax_admin_update_charge_row', 'Charge_Sheet_Page', 'admin_update_charge_row');
		$this->loader->add_action('wp_ajax_admin_get_pagination_max', 'Charge_Sheet_Page', 'admin_get_pagination_max');
		$this->loader->add_action('wp_ajax_admin_switch_charge_status', 'Charge_Sheet_Page', 'admin_switch_charge_status');
		$this->loader->add_action('wp_ajax_approve_charge', 'Charge_Sheet_Page', 'approve_charge_callback');
		$this->loader->add_action('wp_ajax_admin_get_charge_table_json', 'Charge_Sheet_Page', 'admin_get_charge_table_json');
		$this->loader->add_action('wp_ajax_admin_get_pagination_max', 'Charge_Sheet_Page', 'admin_get_pagination_max');
		$this->loader->add_action('wp_ajax_admin_get_all_charges_as_csv', 'Charge_Sheet_Page', 'get_all_charges_as_csv');

		$this->loader->add_action('wp_ajax_admin_equipment_action', 'Equipment_Page', 'admin_equipment_callback');
		$this->loader->add_action('wp_ajax_admin_get_tags', 'Equipment_Page', 'admin_get_tags_callback');
		$this->loader->add_action('wp_ajax_admin_bind_rental', 'Equipment_Page', 'admin_bind_rental');
		$this->loader->add_action('wp_ajax_admin_end_rental', 'Equipment_Page', 'admin_end_rental');
		$this->loader->add_action('wp_ajax_admin_equipment_csv', 'Equipment_Page', 'equipment_csv');
		$this->loader->add_action('wp_ajax_duplicate_equipment', 'Equipment_Page', 'duplicate_equipment');

		$this->loader->add_action('wp_ajax_get_admin_forms', 'Item_Mgmt', 'get_admin_forms_callback');
		$this->loader->add_action('wp_ajax_admin_delete_form', 'Item_Mgmt', 'admin_delete_form');

		$this->loader->add_action('wp_ajax_admin_pricing', 'Pricing_Page', 'admin_pricing_callback');
		$this->loader->add_action('wp_ajax_admin_get_pricing_dropdowns', 'Pricing_Page', 'admin_get_pricing_dropdowns_callback');
		$this->loader->add_action('wp_ajax_admin_delete_material', 'Pricing_Page', 'admin_delete_material_callback');
		$this->loader->add_action('wp_ajax_admin_get_new_mat_row', 'Pricing_Page', 'admin_get_new_mat_row_callback');
		$this->loader->add_action('wp_ajax_admin_pricing_csv', 'Pricing_Page', 'pricing_csv');

		$this->loader->add_action('wp_ajax_admin_approve_new_user', 'Registration_Page', 'admin_approve_new_user_callback');
		$this->loader->add_action('wp_ajax_admin_deny_new_user', 'Registration_Page', 'admin_deny_new_user_callback');
		$this->loader->add_action('wp_ajax_admin_make_registration_key', 'Registration_Page', 'admin_make_registration_key_callback');
		$this->loader->add_action('wp_ajax_admin_delete_registration_key', 'Registration_Page', 'admin_delete_registration_key_callback');

		$this->loader->add_action('wp_ajax_admin_update_reservations', 'Reservations_Page', 'admin_update_reservations_callback');
		$this->loader->add_action('wp_ajax_load_all_events_admin_res_cal', 'Reservations_Page', 'load_all_events_admin_res_cal');

		$this->loader->add_action('wp_ajax_admin_get_appointment_info_template', 'Scheduling_Page', 'admin_get_appointment_info_template_callback');
		$this->loader->add_action('wp_ajax_admin_get_rental_info_template', 'Scheduling_Page', 'admin_get_rental_info_template_callback');

		$this->loader->add_action('wp_ajax_admin_get_irregular_hours', 'Scheduling_Page', 'admin_get_irregular_hours_callback');
		$this->loader->add_action('wp_ajax_admin_update_irregular_hours', 'Scheduling_Page', 'admin_update_irregular_hours_callback');
		$this->loader->add_action('wp_ajax_admin_delete_irregular_hours', 'Scheduling_Page', 'admin_delete_irregular_hours_callback');
		$this->loader->add_action('wp_ajax_admin_update_approval_hours', 'Scheduling_Page', 'admin_update_approval_hours');
		$this->loader->add_action('wp_ajax_admin_get_approval_hours', 'Scheduling_Page', 'admin_get_approval_hours');

		$this->loader->add_action('wp_ajax_admin_update_settings', 'Settings_Page', 'admin_update_settings_callback');
		$this->loader->add_action('wp_ajax_admin_update_account_type', 'Settings_Page', 'admin_update_account_type_callback');
		$this->loader->add_action('wp_ajax_admin_delete_account_type', 'Settings_Page', 'admin_delete_account_type_callback');
		$this->loader->add_action('wp_ajax_admin_update_rental_type', 'Settings_Page', 'admin_update_rental_type_callback');
		$this->loader->add_action('wp_ajax_admin_delete_rental_type', 'Settings_Page', 'admin_delete_rental_type_callback');
		$this->loader->add_action('wp_ajax_facility_name_change', 'Settings_Page', 'facility_name_change');
		$this->loader->add_action('wp_ajax_facility_email_change', 'Settings_Page', 'facility_email_change');
		$this->loader->add_action('wp_ajax_new_res_email_change', 'Settings_Page', 'new_res_email_change');
		$this->loader->add_action('wp_ajax_late_res_admin_email_change', 'Settings_Page', 'late_res_admin_email_change');
		$this->loader->add_action('wp_ajax_late_res_user_email_change', 'Settings_Page', 'late_res_user_email_change');
		$this->loader->add_action('wp_ajax_test_email', 'Settings_Page', 'test_email');
		$this->loader->add_action('wp_ajax_update_facility_schedule', 'Settings_Page', 'update_facility_schedule');


		$this->loader->add_action('wp_ajax_admin_get_user_certifications', 'User_Certifications_Page', 'admin_get_user_certifications_callback');
		$this->loader->add_action('wp_ajax_admin_add_certifications_to_users', 'User_Certifications_Page', 'admin_add_certifications_to_users_callback');
		$this->loader->add_action('wp_ajax_admin_remove_certifications_to_users', 'User_Certifications_Page', 'admin_remove_certifications_to_users_callback');

		$this->loader->add_action('wp_ajax_admin_user_privileges', 'User_Privileges_Page', 'admin_user_privileges_callback');


		//$this->loader->add_action('wp_ajax_admin_get_equipment_calendar', 'Reservations_Page', 'admin_get_equipment_calendar_callback');
		//$this->loader->add_action('wp_ajax_admin_room_action', $plugin_admin, 'admin_room_callback');
	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_public_hooks() {

		$plugin_public = new IAM_Public( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );
		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts' );

		$this->loader->add_shortcode( 'imrc-reservations', 'Public_Content', 'render_reservation_page' );
		$this->loader->add_shortcode( 'imrc-certifications', 'Public_Content', 'render_certification_page' );
		$this->loader->add_shortcode( 'imrc-account-balances', 'Public_Content', 'render_account_balances_page' );
		$this->loader->add_shortcode( 'imrc-training', 'Public_Content', 'render_training_page' );
		$this->loader->add_shortcode( 'imrc-checkout', 'Public_Content', 'render_checkout_page' );

		$this->loader->add_action('wp_ajax_nopriv_iam_register_user', 'Utils_Public', 'register_user_callback');
		$this->loader->add_action('wp_ajax_report_bug', 'Utils_Public', 'report_bug_callback');
		$this->loader->add_action('wp_ajax_nopriv_public_login', 'Utils_Public', 'public_login_callback');
		$this->loader->add_action('wp_ajax_public_login', 'Utils_Public', 'public_login_callback');
		$this->loader->add_action('wp_ajax_nopriv_iam_login', 'Utils_Public', 'iam_login_callback');
		$this->loader->add_filter('show_admin_bar', 'Utils_Public', 'allow_admin_bar');

		$this->loader->add_action('wp_ajax_reservation_popup', 'Reservation_Public', 'reservation_popup_callback');
		$this->loader->add_action('wp_ajax_nopriv_reservation_popup', 'Reservation_Public', 'reservation_popup_callback');
		$this->loader->add_action('wp_ajax_nopriv_get_equipment_calendar', 'Reservation_Public', 'get_equipment_calendar_callback');
		$this->loader->add_action('wp_ajax_get_equipment_calendar', 'Reservation_Public', 'get_equipment_calendar_callback');
		$this->loader->add_action('wp_ajax_nopriv_get_irregular_hours_calendar', 'Reservation_Public', 'get_irregular_hours_calendar_callback');
		$this->loader->add_action('wp_ajax_get_irregular_hours_calendar', 'Reservation_Public', 'get_irregular_hours_calendar_callback');
		$this->loader->add_action('wp_ajax_nopriv_submit_reservation', 'Reservation_Public', 'submit_reservation_callback');
		$this->loader->add_action('wp_ajax_submit_reservation', 'Reservation_Public', 'submit_reservation_callback');
		$this->loader->add_action('wp_ajax_get_child_tags', 'Reservation_Public', 'get_child_tags_callback');
		$this->loader->add_action('wp_ajax_get_equipment_for_tags', 'Reservation_Public', 'get_equipment_for_tags_callback');
		$this->loader->add_action('wp_ajax_get_child_tags', 'Reservation_Public', 'get_child_tags_callback');
		$this->loader->add_action('wp_ajax_get_user_reservations', 'Reservation_Public', 'get_user_reservations_callback');
		$this->loader->add_action('wp_ajax_delete_user_reservation', 'Reservation_Public', 'delete_user_reservation_callback');
		$this->loader->add_action('wp_ajax_nopriv_get_business_hours', 'Reservation_Public', 'get_business_hours_callback');
		$this->loader->add_action('wp_ajax_get_business_hours', 'Reservation_Public', 'get_business_hours_callback');
		$this->loader->add_action('wp_ajax_nopriv_get_equipment_for_tag', 'Reservation_Public', 'get_equipment_for_tag_callback');
		$this->loader->add_action('wp_ajax_nopriv_get_approval_hours', 'Reservation_Public', 'get_approval_hours');
		$this->loader->add_action('wp_ajax_get_approval_hours', 'Reservation_Public', 'get_approval_hours');

		$this->loader->add_action('wp_ajax_training_email', 'Training_Public', 'training_email_callback');

		$this->loader->add_action('wp_ajax_nopriv_update_checkout_table', 'Checkout_Public', 'update_checkout_table_callback');
		$this->loader->add_action('wp_ajax_nopriv_get_checkout_popup', 'Checkout_Public', 'get_checkout_popup_callback');
		$this->loader->add_action('wp_ajax_nopriv_update_appointment', 'Checkout_Public', 'update_appointment_callback');
		$this->loader->add_action('wp_ajax_nopriv_checkout_submit', 'Checkout_Public', 'checkout_submit_callback');
		$this->loader->add_action('wp_ajax_nopriv_checkout_unlock', 'Checkout_Public', 'checkout_unlock_callback');
		$this->loader->add_action('wp_ajax_nopriv_checkout_content', 'Checkout_Public', 'checkout_content_callback');
		$this->loader->add_action('wp_ajax_update_checkout_table', 'Checkout_Public', 'update_checkout_table_callback');
		$this->loader->add_action('wp_ajax_get_checkout_popup', 'Checkout_Public', 'get_checkout_popup_callback');
		$this->loader->add_action('wp_ajax_update_appointment', 'Checkout_Public', 'update_appointment_callback');
		$this->loader->add_action('wp_ajax_checkout_submit', 'Checkout_Public', 'checkout_submit_callback');
		$this->loader->add_action('wp_ajax_checkout_unlock', 'Checkout_Public', 'checkout_unlock_callback');
		$this->loader->add_action('wp_ajax_checkout_content', 'Checkout_Public', 'checkout_content_callback');

		$this->loader->add_action('wp_ajax_user_update_account_info', 'IAM_User', 'user_update_account_info');

	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    1.0.0
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.0.0
	 * @return    string    The name of the plugin.
	 */
	public function get_plugin_name() {
		return $this->iam;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     1.0.0
	 * @return    IAM_Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
	}

}
