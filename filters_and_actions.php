<?php

//declare any actions or filters that are outside the plugin loader
function iam_wp_mail_from($content_type) {
  return 'noreply@'.$_SERVER['HTTP_HOST'];
}
add_filter('wp_mail_from','iam_wp_mail_from');

function iam_wp_mail_from_name($name) {
  return 'The IMRC';
}
add_filter('wp_mail_from_name','iam_wp_mail_from_name');

function iam_login_scripts() {
    wp_enqueue_style( 'iam-login-style', plugin_dir_url( __FILE__ ) . 'public/css/imrc-account-manager-public.css', array() );
    wp_enqueue_script( 'iam-login-script', plugin_dir_url( __FILE__ ) . 'public/js/imrc-account-manager-public.js', array( 'jquery' ) );
}
add_action( 'login_enqueue_scripts', 'iam_login_scripts' );

function prevent_other_registration( $errors, $sanitized_user_login, $user_email ) {

    $errors->add( 'registration error', '<strong>ERROR</strong>: Please register through the main page.' );

    return $errors;
}
add_filter( 'registration_errors', 'prevent_other_registration', 10, 3 );

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

add_filter('authenticate', 'iam_check_for_approval', 30, 3);

function iam_remove_dashboard()
{
	global $current_user, $menu, $submenu;
    get_currentuserinfo();

    if( ! in_array( 'administrator', $current_user->roles ) ) {
    	wp_redirect( home_url() ); exit;
    }
}

add_action('admin_menu', 'iam_remove_dashboard');
