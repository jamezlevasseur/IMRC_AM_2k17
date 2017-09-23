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

		require_once iam_dir() . 'templates/account_balance_page.php';

		require_once iam_dir() . 'public/content.php';
	}


	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {
		wp_enqueue_style($this->plugin_name.'-slick', iam_url().'static/' . 'css/slick.css', $this->version, 'all' );

		wp_enqueue_style($this->plugin_name.'-bootstrap-pub', iam_url().'static/' . 'css/bootstrap-pub.min.css', $this->version, 'all' );

		wp_enqueue_style($this->plugin_name.'-slick-theme', iam_url().'static/' . 'css/slick-theme.css', $this->version, 'all' );

		wp_enqueue_style($this->plugin_name.'-fullcalendar-css', iam_url().'static/' . 'css/fullcalendar.min.css', $this->version, 'all' );

		wp_enqueue_style( $this->plugin_name, iam_url().'src/css/public.css', array(), $this->version, 'all' );
	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		wp_enqueue_script($this->plugin_name.'-jquery-ui', iam_url().'static/' . 'js/jquery-ui.custom.min.js', array('jquery'),$this->version, false);

		wp_enqueue_script($this->plugin_name.'slick-js', iam_url().'static/' . 'js/slick.min.js',array('jquery'), $this->version, false);

		wp_enqueue_script($this->plugin_name.'-moment', iam_url().'static/' . 'js/moment.min.js', array(),$this->version, false);

		wp_enqueue_script($this->plugin_name.'fullcalendar-js', iam_url().'static/' . 'js/fullcalendar.min.js',array('jquery'), $this->version, false);

		wp_enqueue_script( $this->plugin_name.'-captcha', 'https://www.google.com/recaptcha/api.js', array( ), $this->version, false );

		wp_enqueue_script( $this->plugin_name, iam_url() . 'build/js/public.js', array( 'jquery' ), $this->version, false );

		wp_localize_script( $this->plugin_name, 'ajaxurl', admin_url( 'admin-ajax.php' ) );
	}

}
