<?php

/**
*
*/
class Users_Page
{

    public static function admin_balances_callback()
    {
        global $wpdb;
        $ni_id = md5(uniqid());
        $username = IAM_Sec::textfield_cleaner($_POST['username']);
        $iam_id = $wpdb->get_results($wpdb->prepare("SELECT IAM_ID FROM ".IAM_USERS_TABLE." WHERE WP_Username=%s",$username))[0]->IAM_ID;
        $approver_username = wp_get_current_user()->user_login;
        date_default_timezone_set(IMRC_TIME_ZONE);
        $rightnowat = date('Y-m-d \a\t H:i:s');
        $rightnow = date('Y-m-d H:i:s');
        $charge_description = "Account funds for ".$username." adjusted on ".$rightnowat." by ".$approver_username;
        $wpdb->query($wpdb->prepare("INSERT INTO ".IAM_CHARGE_TABLE." (NI_ID,WP_Username,Charge_Description,Status,Date,Amount,Comment,Approver) VALUES (%s,%s,%s,'1',%s,%f,%s,%s)",$ni_id,$username,$charge_description,$rightnow,IAM_Sec::textfield_cleaner($_POST['amount']),IAM_Sec::textfield_cleaner($_POST['comment']),$approver_username));
        IAM_Funds_Handler::update($username);
        iam_respond(SUCCESS);
    }

    public static function admin_get_charge_table()
    {
        require_once iam_dir(). 'templates/user_account_page.php';
        global $wpdb;
        if (isset($_GET['nid'])) {
            $iam_id = $wpdb->get_results($wpdb->prepare("SELECT IAM_ID FROM ".IAM_USERS_TABLE." WHERE NI_ID=%s",IAM_Sec::textfield_cleaner($_GET['nid'])))[0]->IAM_ID;
        } else {
            $iam_id = 0;
        }
        $html = '<table id="iam-user-charges-table">' . IAM_User_Account_Page::get_charge_table_head() . '<tbody>'. IAM_User_Account_Page::get_table_rows_for_id($iam_id, true) . '</tbody></table><br><button type="button" class="iam-secondary-button iam-csv-button">generate csv</button>';
        iam_respond(SUCCESS,$html);
    }

    public static function get_user_info_html()
    {
      global $wpdb;
      $iam_id = IAM_Sec::iamDecrypt( $_GET['id'] );
      $user_results = $wpdb->get_results($wpdb->prepare("SELECT * FROM ".IAM_USERS_TABLE." WHERE IAM_ID=%d",$userid))[0];

      $username = $user_results->WP_Username;
      $account_bal = IAM_Funds_Handler::get_pending_bal($username);
      $at_results = $wpdb->get_results($wpdb->prepare("SELECT Name,Discount FROM ".IAM_ACCOUNT_TYPES_TABLE." WHERE Account_Type_ID=%d",$user_results->Account_Type))[0];
      $account_type = $at_results->Name;
      $discount = $at_results->Discount;
      $table_rows = IAM_User_Account_Page::get_table_rows_for_id($iam_id);

      $first_name = get_first_last_name($user_results->WP_ID);
      $last_name = $first_name['last'];
      $first_name = $first_name['first'];

      $html = '
			<div class="iam-form iam-user-info-form" data-link="'.IAM_Sec::iamEncrypt($user_results->IAM_ID).'">
				<h1>Account Info</h1>

				<p class="form-row">
				  <label>Username:</label>
				  <input type="text" value="'.$user_results->WP_Username.'" disabled />
				</p>
				<p class="form-row">
				  <label>Name:</label><br />
				  <input type="text" class="half" id="first-name" value="'.$first_name.'" />
				  <input type="text" class="half" id="last-name" value="'.$last_name.'" />
				</p>
				<p class="form-row">
				  <label>Email:</label>
				  <input type="text" value="'.get_email($user_results->IAM_ID).'" id="email" />
				</p>
				<p class="form-row">
				  <label>Balance:</label>
				  <input type="text" value="'.$user_results->Balance.'" disabled />
				</p>
				<p class="form-row">
				  <label>Account Type:</label>
				  <input type="text" value="'.$account_type.'" disabled />
				</p>
				<p class="form-row">
				  <label>Phone Number:</label>
				  '.make_phone_number_field_with($user_results->Phone).'
				</p>
				<p class="form-row">
				  <label>Student ID:</label>
				  <input type="text" value="'.$user_results->School_ID.'" id="school-id" />
				</p>
				<p class="form-row">
				  <button type="button" class="btn btn-success iam-submit">Save</button>
				</p>
			</div>';

      iam_respond(SUCCESS,$html);
    }

}
