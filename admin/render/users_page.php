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

    public static function get_user_charge_table()
    {
        global $wpdb;
        $iam_id = IAM_Sec::iamDecrypt($_GET['link']);
        $total = $wpdb->get_results("SELECT Balance FROM ".IAM_USERS_TABLE." WHERE IAM_ID=$iam_id")[0]->Balance;
        $html = '<h3>Total Funds: $'.$total.'</h3><table class="iam-pretty-table" id="iam-user-charges-table">' . IAM_User::get_user_charge_table_head() . '<tbody>'. IAM_User::get_user_charge_table_rows_for($iam_id, true) . '</tbody></table>';
        iam_respond(SUCCESS,$html);
    }

    public static function get_user_info_html()
    {
      global $wpdb;
      $username = IAM_Sec::textfield_cleaner( $_GET['username'] );
      $user_results = $wpdb->get_results($wpdb->prepare("SELECT * FROM ".IAM_USERS_TABLE." WHERE WP_Username=%s",$username))[0];

      $iam_id = $user_results->IAM_ID;

      $first_name = get_first_last_name($user_results->WP_ID);
      $last_name = $first_name['last'];
      $first_name = $first_name['first'];

      $all_account_types = $wpdb->get_results("SELECT * FROM ".IAM_ACCOUNT_TYPES_TABLE);
      $account_type_list = '';
      foreach ($all_account_types as $row) {
        $selected = '';
        if ($row->Account_Type_ID==$user_results->Account_Type)
          $selected = 'selected';
        $account_type_list .= '<option '.$selected.' value="'.iam_output(IAM_Sec::iamEncrypt($row->Account_Type_ID)).'">'.iam_output($row->Name).'</option>';
      }

      $html = '
			<div class="iam-form iam-user-info-form" data-link="'.IAM_Sec::iamEncrypt($user_results->IAM_ID).'">
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
				  <label>Funds:</label>
          <br />
				  <input type="text" class="half" value="'.$user_results->Balance.'" disabled />
          <button type="button" class="half btn btn-primary manage-funds" data-toggle="modal" data-target="#myModal">Manage Funds</button>
				</p>
				<p class="form-row">
				  <label>Account Type:</label>
          <select id="account_type" >
            '.$account_type_list.'
          </select>
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
				  <button type="button" class="btn btn-success">Save</button>
				</p>
			</div>';

      iam_respond(SUCCESS,$html);
    }

}
