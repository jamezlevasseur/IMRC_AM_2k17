<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    IAM
 * @subpackage IAM/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    IAM
 * @subpackage IAM/public
 * @author     Your Name <email@example.com>
 */
class IAM_Public {

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
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

		$this->load_dependencies();
	}

	private function load_dependencies() {

		/**
		 * The class responsible for orchestrating the actions and filters of the
		 * core plugin.
		 */
		


		require_once iam_dir() . 'includes/IAM-cal.php';

		require_once iam_dir() . 'includes/IAM-reservation-handler.php';

		require_once iam_dir() . 'templates/reservation_page.php';

		require_once iam_dir() . 'templates/reservation_popup.php';

		require_once iam_dir() . 'templates/certification_page.php';

		require_once iam_dir() . 'templates/training_page.php';

		require_once iam_dir() . 'templates/checkout_page.php';

		require_once iam_dir() . 'templates/faq_page.php';

		require_once iam_dir() . 'templates/account_balance_page.php';

		require_once iam_dir() . 'public/content.php';
	}


	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		wp_enqueue_style($this->plugin_name.'-slick', plugin_dir_url( __FILE__ ) . 'css/slick.css', $this->version, 'all' );

		wp_enqueue_style($this->plugin_name.'-slick-theme', plugin_dir_url( __FILE__ ) . 'css/slick-theme.css', $this->version, 'all' );

		wp_enqueue_style($this->plugin_name.'-fullcalendar-css', plugin_dir_url( __FILE__ ) . 'css/fullcalendar.min.css', $this->version, 'all' );

		wp_enqueue_style($this->plugin_name.'-fullcalendar-print', plugin_dir_url( __FILE__ ) . 'css/fullcalendar.print.css',array('iam_fullcalendar_css'),false,'media');

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/imrc-account-manager-public.css', array(), $this->version, 'all' );
	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		wp_enqueue_script($this->plugin_name.'-jquery-ui', plugin_dir_url( __FILE__ ) . 'js/jquery-ui.custom.min.js', array('jquery'),$this->version, false);

		wp_enqueue_script($this->plugin_name.'slick-js', plugin_dir_url( __FILE__ ) . 'js/slick.min.js',array('jquery'), $this->version, false);

		wp_enqueue_script($this->plugin_name.'-moment', plugin_dir_url( __FILE__ ) . 'js/moment.min.js', array(),$this->version, false);

		wp_enqueue_script($this->plugin_name.'fullcalendar-js', plugin_dir_url( __FILE__ ) . 'js/fullcalendar.min.js',array('jquery'), $this->version, false);

		wp_enqueue_script( $this->plugin_name.'-captcha', 'https://www.google.com/recaptcha/api.js', array( ), $this->version, false );

		if (DEV_MODE == 1)
			$script_name = 'js/imrc-account-manager-public.js';
		else
			$script_name = 'js/imrc-account-manager-public.min.js';

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . $script_name, array( 'jquery' ), $this->version, false );

		wp_localize_script( $this->plugin_name, 'ajaxurl', admin_url( 'admin-ajax.php' ) );
	}

}
