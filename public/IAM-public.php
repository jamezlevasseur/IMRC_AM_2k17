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

		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/IAM-cal.php';

		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/IAM-reservation-handler.php';

		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'templates/reservation_page.php';

		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'templates/reservation_popup.php';

		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'templates/certification_page.php';

		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'templates/training_page.php';

		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'templates/checkout_page.php';

		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'templates/faq_page.php';

		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'templates/account_balance_page.php';
	}

	public static function render_user_logout_bar()
	{
		$html = '
		<div id="iam-user-logout-bar"><span class="iam-report-bug" style="display:none;">report a bug</span><a href="'.wp_logout_url( home_url() ).'"></a></div>
		';
		echo $html;
	}

	public function report_bug_callback()
	{
		if (!BUG_REPORTING)
			exit;
		$current_user = wp_get_current_user();
		$message = "From Public Side \n User: ".$current_user->user_login." Name Given: ".$_POST["from"]."\n Subject: ".$_POST["subject"]."\n Message: ".$_POST["message"];
		if (strrpos(strtolower($current_user), 'mcenery')!=false) {
			//wp_mail('nicolette.hashey@maine.edu', 'THE OTHER ONE', $message);
			exit;
		}
		//wp_mail('james.levasseur@maine.edu', 'Bug Report', $message);
		exit;
	}

	public function submit_reservation_callback()
	{
		return IAM_Reservation_Handler::run();
	}

	public function get_equipment_calendar_callback()
	{
		IAM_Cal::get_equipment_cal();
	}

	public function get_irregular_hours_calendar_callback()
	{
		IAM_Cal::get_irregular_hours_cal();
	}

	public function checkout_unlock_callback()
	{
		$user_code = $_GET['code'];
		if ($user_code==get_setting_iam('ipad_code'))
			iam_respond(SUCCESS);
		iam_throw_error('INVALID CODE');
	}

	public function checkout_content_callback()
	{
		iam_respond(SUCCESS, IAM_Checkout_Page::getUnlocked());
	}

	public function training_email_callback()
	{
		$message = IAM_Sec::textfield_cleaner($_POST['message']);
		$current_user = wp_get_current_user();
		iam_mail(get_setting_iam('training_email'),'IMRC Training',$message.' <br /><br /> Sent from user: '.$current_user->user_login,'Failed to send training email.');
		iam_respond(SUCCESS,'',IAM::$status_message);
	}

	public function get_approval_hours()
	{
		IAM_Cal::get_approval_hours();
	}

	public function iam_login_callback()
	{
		$captcha_request = json_decode( iam_make_post('https://www.google.com/recaptcha/api/siteverify',['secret'=>'6Lf95icTAAAAAAqyd0HCy7kwZPKkH7EeGyfUP3wL','response'=>$_POST['captcha']]) );
		$first_attempt = intval($_POST['first']);

		if ($captcha_request->success==true && $captcha_request->hostname==$_SERVER['HTTP_HOST'] || $first_attempt===1) {
			$user = IAM_Sec::textfield_cleaner($_POST['user']);
			$password = IAM_Sec::textfield_cleaner($_POST['password']);
			$attempt = wp_signon(['user_login'=>$user,'user_password'=>$password], false);
			if ( !is_wp_error($attempt) ) {
				iam_update_value(IAM_LOGIN_LOGS,$user,json_encode(array('time'=>time(),'fail_count'=>0)));
				if (is_admin()) {
					iam_respond(SUCCESS,'','',site_url().'/wp-admin/');
				} else {
					iam_respond(SUCCESS,'','',site_url());
				}
			}
			date_default_timezone_set(IMRC_TIME_ZONE);
			$now = date("Y-m-d H:i:s");
			iam_update_value(IAM_IP_LOGS,$user.'['.$now.']',get_client_ip(),true);
			$log = iam_get_value(IAM_LOGIN_LOGS,$user,true);
			if ($log===false) {
				iam_update_value(IAM_LOGIN_LOGS,$user,json_encode(array('time'=>time(),'fail_count'=>1)));
			} else {
				$log_obj = json_decode($log);
				if (time()-$log_obj->time<60 && $log_obj->fail_count>3) {
					iam_update_value(IAM_LOGIN_LOGS,$user,json_encode(array('time'=>time(),'fail_count'=>$log_obj->fail_count+1)));
					iam_throw_error(''.$log_obj->fail_count-3,'401');
				} else if (time()-$log_obj->time<60 && $log_obj->fail_count<=3) {
					iam_update_value(IAM_LOGIN_LOGS,$user,json_encode(array('time'=>time(),'fail_count'=>$log_obj->fail_count+1)));
				} else {//more than 60 second difference, reset
					iam_update_value(IAM_LOGIN_LOGS,$user,json_encode(array('time'=>time(),'fail_count'=>1)));
				}
			}
			iam_throw_error('INVALID LOGIN CREDENTIALS');
		} else {
			/*
			var_dump($captcha_request);
			var_dump($captcha_request->success);
			var_dump($captcha_request->hostname==$_SERVER['HTTP_HOST']);
			exit;*/
			iam_throw_error('INVALID CAPTCHA');
		}
		iam_throw_error('INVALID LOGIN CREDENTIALS');
	}

	public function register_user_callback()
	{

		if ( !get_option('users_can_register') ) {
			iam_throw_error('Registration is disabled please talk to a system admin.');
		}

		$captcha_request = json_decode( iam_make_post('https://www.google.com/recaptcha/api/siteverify',['secret'=>'6Lfx8ScTAAAAADJYqGEUMnV4ENmwgRyrUWEuMf5x','response'=>$_POST['captcha']]) );
		if ($captcha_request->success==true && $captcha_request->hostname==$_SERVER['HTTP_HOST']) {
			$user_login = IAM_Sec::textfield_cleaner($_POST['first-name']).'.'.IAM_Sec::textfield_cleaner($_POST['last-name']);
			$user_email = IAM_Sec::textfield_cleaner(filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL));
			if ($user_email===false) {
				iam_throw_error('INVALID EMAIL');
			}
			$user_password = IAM_Sec::textfield_cleaner($_POST['password']);

			$errors = wp_create_user($user_login, $user_password, $user_email);
			if ( is_wp_error($errors) ) {
				if ( in_array( "existing_user_login", $errors->get_error_codes()) ) {
					$username_number = 0;
					while ( in_array( "existing_user_login", $errors->get_error_codes()) ) {
						$username_number++;
						$errors = wp_create_user($user_login.$username_number, $user_password, $user_email);
						if (!is_wp_error($errors)) {
							break;
						}
					}
					$user_login = $user_login.$username_number;
				}
			}

			if ( !is_wp_error($errors) ) {
				global $wpdb;
				//get id to link the tables
				$wp_id = $wpdb->get_results($wpdb->prepare("SELECT ID FROM ".$wpdb->prefix."users WHERE user_login=%s",$user_login))[0]->ID;
				$ni_id = uniqid();
				$account_type = IAM_Sec::iamDecrypt($_POST['account_type']);
				$starting_balance = 0.0;
				$key = IAM_Sec::textfield_cleaner($_POST['key']);
				$is_approved = false;
				if (strlen($key)>0) {
					$reg_key_results = $wpdb->get_results("SELECT Meta_Value FROM ".IAM_META_TABLE." WHERE Meta_Key='".REGISTRATION_KEY."'");
					foreach ($reg_key_results as $row) {
						$data = json_decode($row->Meta_Value);
						if ($data->expiration!='') {
							date_default_timezone_set(IMRC_TIME_ZONE);
							$expiration_date = DateTime::createFromFormat('m-d-Y',$data->expiration);
							$now = new DateTime();
							//delete old keys
							if ($now>$expiration_date) {
								$id = $row->Meta_ID;
								$wpdb->query("DELETE FROM ".IAM_META_TABLE." WHERE Meta_ID='$id'");
								continue;
							}
						}
						if ($data->key==trim($key)) {
							$is_approved = true;
							break;
						}
					}
				}
				update_user_meta($wp_id,'first_name',IAM_Sec::textfield_cleaner($_POST['first-name']));
				update_user_meta($wp_id,'last_name',IAM_Sec::textfield_cleaner($_POST['last-name']));
				$sql_query = $wpdb->prepare("INSERT INTO ".IAM_USERS_TABLE." (WP_ID,NI_ID,WP_Username,Balance,Account_Type) VALUES (%d,%s,%s,%f,%s) ",$wp_id,$ni_id,$user_login,$starting_balance,$account_type);
				$result = $wpdb->query($sql_query);
				if (!$is_approved) {
					add_user_meta($wp_id, 'iam_need_admin_approval', 'yes');
					iam_mail($user_email,'Welcome to the IMRC','<div style="color:black;">Welcome to the IMRC, <br /><br /> Your account is pending approval by an admin. You will be emailed when your account has been activated. <br /><br /> Sincerely, <br /><br /> The IMRC Team','Failed to send welcome email.');
				}
				$message = '';
				if (!$is_approved) {
					$message = 'Your username is "'.$user_login.'". Your account is pending approval by a site admin.';
					if (IAM::$status_message!='') {
						$message.='\n\n '.IAM::$status_message;
					}
				} else {
					$message = 'Your username is "'.$user_login.'". Your account is approved.';
				}
				iam_respond(SUCCESS,'',$message,get_site_url());
			} else {
				$code = $errors->get_error_code();
				iam_throw_error($errors->get_error_message($code));
			}
		} else {
			iam_throw_error('INVALID CAPTCHA');
		}
		iam_throw_error('INVALID LOGIN CREDENTIALS');
	}

	public function public_login_callback()
	{
		global $wpdb;
		$u = filter_input(INPUT_GET, 'user', FILTER_VALIDATE_EMAIL);
		if ($u!=false) {
			iam_throw_error('Please input a username, not an email');
		}
		$user = wp_authenticate(IAM_Sec::textfield_cleaner($_GET['user']), IAM_Sec::textfield_cleaner($_GET['password']));
		if ( is_wp_error($user) ) {
			iam_throw_error('INVALID LOGIN');
		} else {
			$wp_id = $wpdb->get_results($wpdb->prepare("SELECT WP_ID FROM ".IAM_USERS_TABLE." WHERE WP_Username=%s",$user->user_login))[0]->WP_ID;
			$has_priv = get_user_meta($wp_id,IAM_RESERVATIONS_PRIVILEGE_META);
			if (count($has_priv)>0 && $has_priv!=false) {
				iam_throw_error("RESERVATIONS PRIVLEGE REVOKED");
			}
			if (isset($_GET['request'])) {
				if ($_GET['request']=='account_type') {
					$user = $user->user_login;
					$account_type = $wpdb->get_results("SELECT Account_Type FROM ".IAM_USERS_TABLE." WHERE WP_Username='$user'")[0]->Account_Type;
					$account_type_results = $wpdb->get_results("SELECT * FROM ".IAM_ACCOUNT_TYPES_TABLE." WHERE Account_Type_ID='$account_type'")[0];
					iam_respond(SUCCESS,['account_type'=>$account_type_results->Name,'discount'=>$account_type_results->Discount]);
				} else {
					iam_respond(SUCCESS,$wp_id);
				}
			} else {
				iam_respond(SUCCESS,$wp_id);
			}
		}
	}

	public function render_page_for_login_status($page_html)
	{

		if (is_user_logged_in()) {
			IAM_Public::render_user_logout_bar();
			echo $page_html;
		} else {
			require plugin_dir_path( dirname( __FILE__ ) ) . 'templates/login_form.php';
			exit;
		}
		return;
	}

	public function get_business_hours_callback()
	{
		return IAM_Cal::get_business_hours();
		exit;
	}

	public function allow_admin_bar()
	{
		return IAM_Public::iam_is_admin();
	}

	public static function iam_is_admin()
	{
		$current_user = wp_get_current_user();
		return in_array('administrator',  $current_user->roles);
	}

	public function reservation_popup_callback()
	{
		echo IAM_Reservation_Popup::get();
		exit;
	}

	public function render_reservation_page()
	{
		echo IAM_Reservation_Page::get();
	}

	public function render_certification_page()
	{
		echo IAM_Certification_Page::get();
	}

	public function render_faq_page()
	{
		echo IAM_FAQ_Page::get();
	}

	public function render_training_page()
	{
		echo IAM_Training_Page::get();
	}

	public function render_checkout_page()
	{
		echo IAM_Checkout_Page::get();
		exit;
	}

	public function update_checkout_table_callback()
	{
		iam_respond(SUCCESS, IAM_Checkout_Page::update_checkout_table());
	}

	public function checkout_submit_callback()
	{
		global $wpdb;
		date_default_timezone_set(IMRC_TIME_ZONE);
		$rightnow = date('Y-m-d H:i:s');
		$ni_id = IAM_Sec::textfield_cleaner($_POST['nid']);
		$wpdb->query($wpdb->prepare("UPDATE ".IAM_RESERVATION_TABLE." SET Checked_Out=%s WHERE NI_ID=%s",$rightnow,$ni_id));
		$reservation = $wpdb->get_results($wpdb->prepare("SELECT * FROM ".IAM_RESERVATION_TABLE." WHERE NI_ID=%s",$ni_id));
		$reservation = $reservation[0];
		$charge_ni_id = md5(uniqid());
		$equip_name = $wpdb->get_results($wpdb->prepare("SELECT Name FROM ".IAM_EQUIPMENT_TABLE." WHERE Equipment_ID=%d",$reservation->Equipment_ID))[0]->Name;
		$username = $wpdb->get_results($wpdb->prepare("SELECT WP_Username FROM ".IAM_USERS_TABLE." WHERE IAM_ID=%d",$reservation->IAM_ID))[0]->WP_Username;
		$mat_used = $_POST['mat'];
		$amount = $_POST['amount'];
		$total = $_POST['total'];
		if (!is_numeric($total)) {
			iam_throw_error(INVALID_INPUT_EXCEPTION);
		}
		if ($_POST['multiple_mats']) {
			$charge_description = $username.' used '.$equip_name.' with multiple materials: ';
			for ($i=0; $i < count($mat_used); $i++) {
				$charge_description .= ' material #'.($i+1).' - '.$mat_used[$i]['name'].' for '.$amount[$i].' '.$mat_used[$i]['unit_name'].' at '.$mat_used[$i]['price_per_unit'].' per '.$mat_used[$i]['unit_name'].'.';
			}
		} else {
			$charge_description = $username.' used '.$equip_name.' for '.$amount.' '.$mat_used['unit_name'].'. Item used: '.$mat_used['name'].' at '.$mat_used['price_per_unit'].' per '.$mat_used['unit_name'].'.';
		}

		$wpdb->query($wpdb->prepare("INSERT INTO ".IAM_CHARGE_TABLE." (NI_ID,Equipment_ID,WP_Username,Charge_Description,Status,Date,Amount) VALUES (%s,%d,%s,%s,%d,%s,%f)",$charge_ni_id,$reservation->Equipment_ID,$username,$charge_description,0,$rightnow,$total));
		iam_respond(SUCCESS);
	}

	public function get_checkout_popup_callback()
	{
		global $wpdb;
		$ni_id = IAM_Sec::textfield_cleaner($_GET['nid']);
		$reservation = $wpdb->get_results($wpdb->prepare("SELECT * FROM ".IAM_RESERVATION_TABLE." WHERE NI_ID=%s",$ni_id))[0];
		$equip_id = $reservation->Equipment_ID;
		$user_results = $wpdb->get_results($wpdb->prepare("SELECT WP_Username,Balance FROM ".IAM_USERS_TABLE." WHERE IAM_ID=%d",$reservation->IAM_ID));
		$username = $user_results[0]->WP_Username;

		$charge_results = $wpdb->get_results($wpdb->prepare("SELECT Amount FROM ".IAM_CHARGE_TABLE." WHERE WP_Username=%s AND Status='0' OR WP_Username=%s AND Status='1'",$username,$username));
		$balance = 0;
		foreach ($charge_results as $charge_row) {
			$balance+=$charge_row->Amount;
		}

		if ($balance<=0) {
			$balanceHTML = '<span style="color:red;">'.iam_output($balance).'</span>';
		} else {
			$balanceHTML = '<span style="color:green;">'.iam_output($balance).'</span>';
		}

		$equip_name = $wpdb->get_results($wpdb->prepare("SELECT Name FROM ".IAM_EQUIPMENT_TABLE." WHERE Equipment_ID=%d",$reservation->Equipment_ID))[0]->Name;
		$possible_mats = [];
		$tag_results = $wpdb->get_results("SELECT Tag_ID FROM ".IAM_TAGS_EQUIPMENT_TABLE." WHERE Equipment_ID='$equip_id'");
		foreach ($tag_results as $row) {
			$mat_tag_results = $wpdb->get_results($wpdb->prepare("SELECT Material_ID FROM ".IAM_MATERIAL_TAGS_TABLE." WHERE Tag_ID=%d",$row->Tag_ID));
			$current_tag_id = $row->Tag_ID;
			while (true) {

				$current_tag_results = $wpdb->get_results($wpdb->prepare("SELECT Parent FROM ".IAM_TAGS_TABLE." WHERE Tag_ID=%d",$current_tag_id));

				if ($current_tag_results[0]->Parent=='' || $current_tag_results[0]->Parent==null) {
					break;
				}
				$current_tag_id = $wpdb->get_results($wpdb->prepare("SELECT Tag_ID FROM ".IAM_TAGS_TABLE." WHERE Tag=%s",$current_tag_results[0]->Parent))[0]->Tag_ID;

				$mat_tag_results = array_merge($mat_tag_results, $wpdb->get_results($wpdb->prepare("SELECT Material_ID FROM ".IAM_MATERIAL_TAGS_TABLE." WHERE Tag_ID=%d",$current_tag_id)));
			}
			foreach ($mat_tag_results as $mat_tag_row) {
				$mat_results = $wpdb->get_results($wpdb->prepare("SELECT * FROM ".IAM_MATERIAL_TABLE." WHERE Material_ID=%d",$mat_tag_row->Material_ID));
				$possible_mats[$mat_results[0]->Name] = ['price_per_unit'=>$mat_results[0]->Price_Per_Unit, 'unit_name'=>$mat_results[0]->Unit_Name, 'base_price'=>$mat_results[0]->Base_Price];
			}
		}
		$mats_equip_results = $wpdb->get_results("SELECT Material_ID FROM ".IAM_MATERIAL_EQUIPMENT_TABLE." WHERE Equipment_ID='$equip_id'");
		foreach ($mats_equip_results as $row) {
			if ($mat_results[0]->Name=='' || $mat_results[0]->Name==null) {
				continue;
			}
			$mat_results = $wpdb->get_results($wpdb->prepare("SELECT * FROM ".IAM_MATERIAL_TABLE." WHERE Material_ID=%d",$row->Material_ID));
			$possible_mats[$mat_results[0]->Name] = ['price_per_unit'=>$mat_results[0]->Price_Per_Unit, 'unit_name'=>$mat_results[0]->Unit_Name, 'base_price'=>$mat_results[0]->Base_Price];
		}
		$possible_mats_list = '<select class="iam-checkout-possible-mats">';
		foreach ($possible_mats as $key => $val) {
			if ($key=='' || $key==null) {
				continue;
			}
			$possible_mats_list.='<option value="'.iam_output($key).'">'.iam_output($key).'</option>';
		}
		$possible_mats_list.='</select>';

		$html = '
		<div class="iam-popup">
			<div class="iam-popup-header">
				Submit Use
				<i class="fa fa-close fa-3 iam-x"></i>
			</div>
			<div class="iam-popup-body">
				<div>
					<label class="iam-checkout-name"> <b>Name: </b> '.iam_output($username).' </label>
					<label class="iam-checkout-equipment"> <b>Equipment: </b> '.iam_output($equip_name).' </label>
				</div>
				<div>
					<label class="iam-checkout-balance"> <b>Available Balance: </b> <span class="iam-checkout-bal">'.$balanceHTML.' </span></label>
				</div>
				<div>
					<label class="iam-checkout-discount"></label>
				</div>
				<div class="iam-mats-row">
					<label class="iam-checkout-material"><b>Material: </b> '.$possible_mats_list.'</label>
					<label><b>Min Price:</b> <span class="iam-checkout-base-price"></span></label>
					<input type="number" class="iam-checkout-amount"> <span><span class="iam-checkout-unit-name"></span> x $<span class="iam-checkout-price-per-unit"></span>/<span class="iam-checkout-unit-name"></span> = <b>Total: </b><span class="iam-checkout-total"></span></span>
				</div>

				<div>
					<button type="button" class="iam-checkout-add-mat iam-green-button">Add</button>
					<button type="button" class="iam-checkout-del-mat iam-red-button">Delete</button>
					<br />
					<button type="button" class="iam-checkout-submit">SUBMIT CHARGE</button>
				</div>
			</div>
		</div>';
		iam_respond(SUCCESS,['html'=>$html, 'mats'=>json_encode($possible_mats)]);
	}

	public function update_appointment_callback()
	{
		IAM_Checkout_Page::update_appointment();
		exit;
	}

	public function render_account_balances_page()
	{
		echo IAM_Account_Balance_Page::get();
	}

	public function get_child_tags_callback()
	{
		IAM_Reservation_Page::get_child_tags();
		exit;
	}

	public function get_equipment_for_tags_callback()
	{
		iam_respond(SUCCESS, IAM_Reservation_Page::get_equipment_for_tags());
	}

	public function get_user_reservations_callback()
	{
		iam_respond(SUCCESS,IAM_Reservation_Page::get_user_reservations());
	}

	public function delete_user_reservation_callback()
	{
		IAM_Reservation_Page::delete_user_reservation();
		exit;
	}

	public function get_equipment_for_tag_callback()
	{
		$tags = [IAM_Sec::textfield_cleaner($_GET['tag'])];

		if ($tags[0]=='All') {
			$tags = ['Equipment Room','Fab Lab'];
		}
		$all_equipment = [];
		global $wpdb;
		if ($tags[0]=='Rooms') {
			$all_rooms = $wpdb->get_results("SELECT Name,Description,Pricing_Description,Photo FROM ".IAM_ROOM_TABLE);
			foreach ($all_rooms as $row) {
				$row->Manufacturer_Info = '';
				$row->Root_Tag = 'Rooms';
			}
			iam_respond(SUCCESS,json_encode($all_rooms));
		}
		for ($i=0; $i < count($tags); $i++) {
			$tag_id = $wpdb->get_results($wpdb->prepare("SELECT Tag_ID FROM ".IAM_TAGS_TABLE." WHERE Tag=%s",$tags[$i]))[0]->Tag_ID;
			$equip_id_results = $wpdb->get_results($wpdb->prepare("SELECT Equipment_ID FROM ".IAM_TAGS_EQUIPMENT_TABLE." WHERE Tag_ID=%d",$tag_id));
			foreach ($equip_id_results as $e_row) {
				$equipment = $wpdb->get_results("SELECT Root_Tag,Name,Description,Pricing_Description,Photo,Manufacturer_Info FROM ".IAM_EQUIPMENT_TABLE." WHERE Equipment_ID='$e_row->Equipment_ID'")[0];
				$all_equipment[] = $equipment;
			}
			$child_tags = $wpdb->get_results($wpdb->prepare("SELECT Tag FROM ".IAM_TAGS_TABLE." WHERE Parent=%s",$tags[$i]));
			foreach ($child_tags as $t_row) {
				$tags[] = $t_row->Tag;
			}
		}
		iam_respond(SUCCESS,json_encode($all_equipment));
	}

	public function get_rooms()
	{
		$html = IAM_Reservation_Page::get_rooms();
		iam_respond(SUCCESS,$html);
	}

	public static function render_login_slide_show()
	{
		global $wpdb;
		$slide_show_results = $wpdb->get_results("SELECT Name,Description,Photo FROM ".IAM_EQUIPMENT_TABLE." WHERE On_Slide_Show=1 ");
		foreach ($slide_show_results as $row) {
			echo '<div class="iam-slide-show-img"><img class="iam-slideshow-equip-img" src="'.iam_output($row->Photo).'"><p class="iam-img-name">'.iam_output($row->Name).'</p><p class="iam-img-description">'.iam_output($row->Description).'</p></div>';
		}
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
