<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    IAM
 * @subpackage IAM/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    IAM
 * @subpackage IAM/admin
 * @author     Your Name <email@example.com>
 */
class IAM_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

		$this->load_dependencies();
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

		/**
		 * The class responsible for orchestrating the actions and filters of the
		 * core plugin.
		 */

		require_once iam_dir() . 'includes/IAM-cal.php';

		require_once iam_dir() . 'admin/IAM-admin-forms.php';

		require_once iam_dir() . 'includes/IAM-funds-handler.php';

		require_once iam_dir() . 'includes/IAM-tags.php';

		require_once iam_dir() . 'includes/IAM-sec.php';

		require_once iam_dir() . 'admin/content.php';

        require_once iam_dir() . 'admin/debug.php';

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {
		wp_enqueue_style($this->plugin_name.'-jquery-ui-css', plugin_dir_url( __FILE__ ) . 'css/jquery-ui.min.css');
		wp_enqueue_style($this->plugin_name.'-jquery-ui-css-structure', plugin_dir_url( __FILE__ ) . 'css/jquery-ui.structure.min.css');
		wp_enqueue_style($this->plugin_name.'-jquery-ui-css-theme', plugin_dir_url( __FILE__ ) . 'css/jquery-ui.theme.min.css');
		wp_enqueue_style($this->plugin_name.'-fullcalendar-css', plugin_dir_url( __FILE__ ) . 'css/fullcalendar.min.css', $this->version, 'all' );
		wp_enqueue_style( $this->plugin_name.'font-awesome', plugin_dir_url( __FILE__ ) . 'css/font-awesome.min.css', array(), $this->version, 'all' );
		wp_enqueue_style( $this->plugin_name.'context-menu-css', plugin_dir_url( __FILE__ ) . 'css/contextMenu.css', array(), $this->version, 'all' );
		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/imrc-account-manager-admin.css', array(), $this->version, 'all' );
	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {
		wp_enqueue_script($this->plugin_name.'context-menu', plugin_dir_url( __FILE__ ) . 'js/contextMenu.min.js', array('jquery'),$this->version, false);
		wp_enqueue_script($this->plugin_name.'-jquery-ui', plugin_dir_url( __FILE__ ) . 'js/jquery-ui.min.js', array('jquery'),$this->version, false);
		wp_enqueue_script($this->plugin_name.'-moment', plugin_dir_url( __FILE__ ) . 'js/moment.min.js', array(),$this->version, false);

		wp_enqueue_script($this->plugin_name.'fullcalendar-js', plugin_dir_url( __FILE__ ) . 'js/fullcalendar.min.js',array('jquery'), $this->version, false);

		if (DEV_MODE == 1)
			$script_name = 'js/imrc-account-manager-admin.js';
		else
			$script_name = 'js/imrc-account-manager-admin.min.js';
		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . $script_name, array( 'jquery' ), $this->version, false );

	}

    public function admin_setup_menu() {


        add_menu_page ( 'Fab Labs', 'Fab Labs', 'manage_options', 'imrc-fab-lab', array('Admin_Content','fab_lab_content'), 'http://jameslevasseur.com/imr-icon.png');
        add_submenu_page ('imrc-fab-lab', 'Balances', 'Balances', 'manage_options', 'fl_balances', array('Admin_Content', 'balance_content') );
        add_submenu_page ('imrc-fab-lab', 'Equipment', 'Equipment', 'manage_options', 'fl_equipment', array('Admin_Content', 'equipment_content') );
        add_submenu_page ('imrc-fab-lab', 'Certifications', 'Certifications', 'manage_options', 'fl_certifications', array('Admin_Content', 'certification_content') );
        add_submenu_page ('imrc-fab-lab', 'Reservations', 'Reservations', 'manage_options', 'fl_reservations', array('Admin_Content', 'fab_lab_reservation_content') );
        add_submenu_page ('imrc-fab-lab', 'User Certifications', 'User Certifications', 'manage_options', 'fl_user_certifications', array('Admin_Content', 'user_certification_content') );
        add_submenu_page ('imrc-fab-lab', 'Charge Sheet', 'Charge Sheet', 'manage_options', 'fl_charge_sheet', array('Admin_Content', 'charge_sheet_content') );
        add_submenu_page ('imrc-fab-lab', 'Registration', 'Registration', 'manage_options', 'fl_registration', array('Admin_Content', 'registration_content') );
        add_submenu_page ('imrc-fab-lab', 'Scheduling', 'Scheduling', 'manage_options', 'fl_scheduling', array('Admin_Content', 'scheduling_content') );
        add_submenu_page ('imrc-fab-lab', 'User Privileges', 'User Privileges', 'manage_options', 'fl_user_privileges', array('Admin_Content', 'user_privileges_content') );
        add_submenu_page ('imrc-fab-lab', 'Pricing', 'Pricing', 'manage_options', 'fl_pricing', array('Admin_Content', 'pricing_content') );


        add_menu_page ( 'Equipment Room', 'Equipment Room', 'manage_options', 'imrc-equipment-room', array('Admin_Content','equipment_room_content'), 'http://jameslevasseur.com/imr-icon.png');
        add_submenu_page ('imrc-equipment-room', 'Balances', 'Balances', 'manage_options', 'er_balances', array('Admin_Content', 'balance_content') );
        add_submenu_page ('imrc-equipment-room', 'Equipment', 'Equipment', 'manage_options', 'er_equipment', array('Admin_Content', 'equipment_content') );
        add_submenu_page ('imrc-equipment-room', 'Certifications', 'Certifications', 'manage_options', 'er_certifications', array('Admin_Content', 'certification_content') );
        add_submenu_page ('imrc-equipment-room', 'Reservations', 'Reservations', 'manage_options', 'er_reservations', array('Admin_Content', 'equipment_room_reservation_content') );
        add_submenu_page ('imrc-equipment-room', 'User Certifications', 'User Certifications', 'manage_options', 'er_user_certifications', array('Admin_Content', 'user_certification_content') );
        add_submenu_page ('imrc-equipment-room', 'Charge Sheet', 'Charge Sheet', 'manage_options', 'er_charge_sheet', array('Admin_Content', 'charge_sheet_content') );
        add_submenu_page ('imrc-equipment-room', 'Registration', 'Registration', 'manage_options', 'er_registration', array('Admin_Content', 'registration_content') );
        add_submenu_page ('imrc-equipment-room', 'Scheduling', 'Scheduling', 'manage_options', 'er_scheduling', array('Admin_Content', 'scheduling_content') );
        add_submenu_page ('imrc-equipment-room', 'User Privileges', 'User Privileges', 'manage_options', 'er_user_privileges', array('Admin_Content', 'user_privileges_content') );

        if (DEV_MODE === 1)
            add_menu_page ( 'Debug', 'Debug', 'manage_options', 'imrc-debug', array('Debug_Page','debug_content'), plugins_url( 'assets/bug.png', dirname(__FILE__) ));
    }

}
