<?php 


class IAM_Login {

	function __construct()
	{
		
	}

	/**
	 * Renders the contents of the given template to a string and returns it.
	 *
	 * @param string $template_name The name of the template to render (without .php)
	 * @param array  $attributes    The PHP variables for the template
	 *
	 * @return string               The contents of the template.
	 */
	private static function get_template_html( $template_name, $attributes = null ) {
	    if ( ! $attributes ) {
	        $attributes = array();
	    }
	 
	    ob_start();
	 
	    //do_action( 'iam_login_before_' . $template_name );
	 
	    require iam_dir() .'templates/'.$template_name.'.php';
	 
	    //do_action( 'iam_login_after_' . $template_name );
	 
	    $html = ob_get_contents();
	    ob_end_clean();
	 
	    return $html;
	}

    /**
	 * A shortcode for rendering the login form.
	 *
	 * @param  array   $attributes  Shortcode attributes.
	 * @param  string  $content     The text content for shortcode. Not used.
	 *
	 * @return string  The shortcode output
	 */
	public function render_login_form( $attributes, $content = null ) {
	    // Parse shortcode attributes
	    $default_attributes = array( 'show_title' => true );
	    $attributes = shortcode_atts( $default_attributes, $attributes );
	    $show_title = $attributes['show_title'];
	 
	    if ( is_user_logged_in() ) {
	        return __( '<a href="'.wp_logout_url($_SERVER['HTTP_HOST'].'/login').'"> Logout </a>', 'iam-login' );
	    }
	     
	    // Pass the redirect parameter to the WordPress login functionality: by default,
	    // don't specify a redirect, but if a valid redirect URL has been passed as
	    // request parameter, use it.
	    $attributes['redirect'] = '';
	    if ( isset( $_REQUEST['redirect_to'] ) ) {
	        $attributes['redirect'] = wp_validate_redirect( $_REQUEST['redirect_to'], $attributes['redirect'] );
	    }
	     
	    // Render the login form using an external template
	    return IAM_Login::get_template_html( 'login_form', $attributes );
	}

	/**
	 * A shortcode for rendering the new user registration form.
	 *
	 * @param  array   $attributes  Shortcode attributes.
	 * @param  string  $content     The text content for shortcode. Not used.
	 *
	 * @return string  The shortcode output
	 */
	public function render_register_form( $attributes, $content = null ) {
	    // Parse shortcode attributes
	    $default_attributes = array( 'show_title' => false );
	    $attributes = shortcode_atts( $default_attributes, $attributes );
	 	return IAM_Login::get_template_html( 'register_form', $attributes );

	    if ( is_user_logged_in() ) {
	        return __( 'You are already signed in.', 'iam-login' );
	    } elseif ( ! get_option( 'users_can_register' ) ) {
	        return __( 'Registering new users is currently not allowed.', 'iam-login' );
	    } else {
	        return IAM_Login::get_template_html( 'register_form', $attributes );
	    }
	}

}

 ?>