<?php


/**
*
*/
class Utils_Public
{

  public static function late_reservations_check()
  {
    global $wpdb;
    date_default_timezone_set(IMRC_TIME_ZONE);
    $rightnow = date('U');

    send_to_debug_file('CHECK START '.date(DATE_FORMAT).' BEFORE 8 HOUR CHECK');

    $do_check = false;

    if (get_setting_iam('late_er_check')===false || get_setting_iam('force_email_check')=='yes')
      $do_check = true;
    else if ((int)$rightnow-(int)get_setting_iam('late_er_check')>(SECONDS_IN_DAY/3))
      $do_check = true;

    if (!$do_check)
      return;

    send_to_debug_file('CHECKED AT '.date(DATE_FORMAT).' PAST 8 HOUR CHECK');

    $hours = $wpdb->get_results("SELECT Rental_Hours_Description FROM ".IAM_FACILITY_TABLE." WHERE Schedule_Type='Rental'")[0]->Rental_Hours_Description;

    $active = $wpdb->get_results("SELECT * FROM ".IAM_RESERVATION_TABLE." WHERE Checked_In IS NULL AND Checked_Out IS NOT NULL");


    foreach ($active as $entry) {
      $d = date_create_from_format(DATE_FORMAT, $entry->End_Time);

      if ((int) $rightnow > (int) $d->format('U')-37800) {// is late

        $last_attempt = $wpdb->get_results($wpdb->prepare("SELECT Meta_Value FROM ".IAM_META_TABLE." WHERE Meta_Key=%s",LAST_ER_CHECK_PREFIX.$entry->Reservation_ID));

        send_to_debug_file('FOR RES: '.$entry->Reservation_ID);
        send_to_debug_file('LAST ATTEMPT COUNT '.count($last_attempt));

        if (count($last_attempt)==0) {
          $wpdb->query($wpdb->prepare("INSERT INTO ".IAM_META_TABLE." (Meta_Key,Meta_Value) VALUES (%s,%s)",LAST_ER_CHECK_PREFIX.$entry->Reservation_ID,$rightnow));
        } else if (get_setting_iam('force_email_check_all_emails')=='yes') {
          send_to_debug_file('force_email_check_all_emails is set. Ignoring check and sending all emails.');
          send_to_debug_file((int)$rightnow.' - '.(int)$last_attempt[0]->Meta_Value.' < '.SECONDS_IN_DAY);
          send_to_debug_file((int)$rightnow-(int)$last_attempt[0]->Meta_Value);
        } else if ((int)$rightnow-(int)$last_attempt[0]->Meta_Value<SECONDS_IN_DAY) {
          send_to_debug_file((int)$rightnow.' - '.(int)$last_attempt[0]->Meta_Value.' < '.SECONDS_IN_DAY.' IS TRUE');
          send_to_debug_file((int)$rightnow-(int)$last_attempt[0]->Meta_Value);
          continue;
        }

        send_to_debug_file((int)$rightnow.' - '.(int)$last_attempt[0]->Meta_Value.' < '.SECONDS_IN_DAY.' IS FALSE, EMAIL SENT');
        send_to_debug_file((int)$rightnow-(int)$last_attempt[0]->Meta_Value);

        $wpdb->query($wpdb->prepare("UPDATE ".IAM_META_TABLE." SET Meta_Value=%s WHERE Meta_Key=%s",$rightnow,LAST_ER_CHECK_PREFIX.$entry->Reservation_ID));

        $eq = $wpdb->get_results($wpdb->prepare("SELECT * FROM ".IAM_EQUIPMENT_TABLE." WHERE Checked_Out=%d",$entry->Reservation_ID))[0];
        $user = $wpdb->get_results("SELECT * FROM ".IAM_USERS_TABLE." WHERE IAM_ID=".$entry->IAM_ID)[0];

        $fee = get_setting_iam(LATE_CHARGE_FEE_KEY);

        $notifcation_num = $entry->Late_Notification_Sent+1;

        $wpdb->query($wpdb->prepare("UPDATE ".IAM_RESERVATION_TABLE." SET Late_Notification_Sent=%d WHERE Reservation_ID=%d",$notifcation_num,$entry->Reservation_ID));

        $tech_email_body = 'User: '.$user->WP_Username.' was due to check in the '.$eq->Name.' yesterday. <br /> An automatic late charge of '.cash_format($fee).' has been applied and an email has been sent. This is their '.ordinal_format($notifcation_num).' notification.';

        $user_email_body = 'Greetings, <br /><br /> You were due to return the '.$eq->Name.' yesterday. An automatic late charge of '.cash_format($fee).' has been applied and an email has been sent to an equipment room tech. Please return the equipment to the IMRC Equipment Room as soon as possible.<br /><br /> The hours of operations are "'.$hours.'". <br /><br /> Thank you, <br /><br /> - The IMRC Team';

        send_to_debug_file( $tech_email_body );
        send_to_debug_file( get_email($user->IAM_ID) );
        send_to_debug_file( $user_email_body );

        iam_mail(get_setting_iam('equipment_room_email'),
                'Reservation: '.$user->WP_Username.' renting '.$eq->Name.' is late',
                $tech_email_body);

        iam_mail(get_email($user->IAM_ID),
                'Your rental of '.$eq->Name.' is late',
                $user_email_body);

        if ($entry->Status!=IS_LATE)
          $wpdb->query($wpdb->prepare("UPDATE ".IAM_RESERVATION_TABLE." SET Status=%s WHERE Reservation_ID=%d",IS_LATE,$entry->Reservation_ID));

        $charge_desc = 'Automatic late charge for not returning '.$eq->Name.' in on time. This is the '.ordinal_format($notifcation_num).' in this series.';

        $wpdb->query($wpdb->prepare("INSERT INTO ".IAM_CHARGE_TABLE." (NI_ID,Equipment_ID,WP_Username,Charge_Description,Status,Date,Approver,Amount) VALUES (%s,%d,%s,%s,%d,%s,%s,%f)",make_nid(),$eq->Equipment_ID,$user->WP_Username,$charge_desc,CHARGE_APPROVED,date(DATE_FORMAT),'automatic',(-1*(int)$fee) ));

        IAM_Funds_Handler::update($user->WP_Username);
      }
    }

    update_settings_iam('late_er_check',$rightnow);
  }

    public static function render_user_logout_bar()
    {
        $html = '
        <div id="iam-user-logout-bar"><span class="iam-report-bug" style="display:none;">report a bug</span><a href="'.wp_logout_url( home_url() ).'"></a></div>
        ';
        echo $html;
    }

    public static function report_bug_callback()
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

    public static function iam_login_callback()
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


    public static function register_user_callback()
    {

        if ( !get_option('users_can_register') ) {
            iam_throw_error('Registration is disabled please talk to a system admin.');
        }

        $captcha_request = json_decode( iam_make_post('https://www.google.com/recaptcha/api/siteverify',['secret'=>'6Lfx8ScTAAAAADJYqGEUMnV4ENmwgRyrUWEuMf5x','response'=>$_POST['captcha']]) );
        if ($captcha_request->success==true && $captcha_request->hostname==$_SERVER['HTTP_HOST'] || DEV_MODE===1) {
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
                $phone = IAM_Sec::textfield_cleaner($_POST['phonenum']);
                $student_id = IAM_Sec::textfield_cleaner($_POST['student-id']);
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
                $sql_query = $wpdb->prepare("INSERT INTO ".IAM_USERS_TABLE." (WP_ID,NI_ID,WP_Username,Balance,Account_Type,Phone,School_ID) VALUES (%d,%s,%s,%f,%s,%s,%s) ",$wp_id,$ni_id,$user_login,$starting_balance,$account_type,$phone,$student_id);
                $result = $wpdb->query($sql_query);
                if (!$is_approved) {
                    add_user_meta($wp_id, 'iam_need_admin_approval', 'yes');
                    iam_mail($user_email,'Welcome to the IMRC','<div style="color:black;">Welcome to the IMRC, <br /><br /> Your account is pending approval by an admin. You will be emailed when your account has been activated. <br /><br /> Sincerely, <br /><br /> The IMRC Team','Failed to send welcome email.');
                }
                $message = '';

                if (empty($wpdb->get_results("SELECT * FROM ".IAM_USERS_TABLE." WHERE NI_ID='$ni_id'"))) {
                  iam_throw_error('Unsuccessful enrollment. Contact your administrator.');
                }

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

    public static function public_login_callback()
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

    public static function render_page_for_login_status($page_html)
    {

        if (is_user_logged_in()) {
            Utils_Public::render_user_logout_bar();
            echo $page_html;
        } else {
            require iam_dir() . 'templates/login_form.php';
            exit;
        }
        return;
    }

    public static function allow_admin_bar()
    {
        return Utils_Public::iam_is_admin();
    }

    public static function iam_is_admin()
    {
        $current_user = wp_get_current_user();
        return in_array('administrator',  $current_user->roles);
    }

    public static function render_login_slide_show()
    {
        global $wpdb;
        $slide_show_results = $wpdb->get_results("SELECT Name,Description,Photo FROM ".IAM_EQUIPMENT_TABLE." WHERE On_Slide_Show=1 ");
        foreach ($slide_show_results as $row) {
            echo '<div class="iam-slide-show-img"><img class="iam-slideshow-equip-img" src="'.iam_output($row->Photo).'"><p class="iam-img-name">'.iam_output($row->Name).'</p><p class="iam-img-description">'.iam_output($row->Description).'</p></div>';
        }
    }

}
