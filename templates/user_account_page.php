<?php

/**
*
*/

class IAM_User_Account_Page
{

	public static function get()
	{
		global $wpdb;
		global $current_user;
  	get_currentuserinfo();
  	$user_results = $wpdb->get_results($wpdb->prepare("SELECT * FROM ".IAM_USERS_TABLE." WHERE WP_ID=%d",$current_user->ID))[0];
  	$iam_id = $user_results->IAM_ID;
  	$username = $user_results->WP_Username;
		$account_bal = IAM_Funds_Handler::get_pending_bal($username);
  	$at_results = $wpdb->get_results($wpdb->prepare("SELECT Name,Discount FROM ".IAM_ACCOUNT_TYPES_TABLE." WHERE Account_Type_ID=%d",$user_results->Account_Type))[0];
  	$account_type = $at_results->Name;
  	$discount = $at_results->Discount;
  	$table_rows = IAM_User::get_user_charge_table_rows_for($iam_id);

		$first_name = get_first_last_name($user_results->WP_ID);
		$last_name = $first_name['last'];
		$first_name = $first_name['first'];



		$html = '
		<div id="iam-user-account">


		  <!-- Nav tabs -->
		  <ul class="nav nav-tabs" role="tablist">
		    <li role="presentation" class="active"><a href="#account" aria-controls="account" role="tab" data-toggle="tab">Account</a></li>
		    <li role="presentation"><a href="#transactions" aria-controls="transactions" role="tab" data-toggle="tab">Transactions</a></li>
		  </ul>

		  <!-- Tab panes -->
		  <div class="tab-content">
		    <div role="tabpanel" class="tab-pane active" id="account">

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
					</div>
				</div>
		    <div role="tabpanel" class="tab-pane" id="transactions" >

					<div id="iam-total-bal-left">
						<div class="iam-total-bal-amount" style="background-repeat:no-repeat; background-position:center; background-image:url('.site_url('/wp-content/plugins/imrc-account-manager/assets/circle.svg').');">
							'.iam_output($account_bal).'
						</div>
						<p id="iam-available-bal-title">Available Balance</p>
						<p id="iam-available-bal-title iam-discount">'.iam_output($discount).'% '.iam_output($account_type).' Discount</p>
					</div>
					<div id="iam-total-bal-right" style="margin-top:15px;">
						<p class="iam-account-activity-title">Account Activity</p>
						<table class="iam-account-balance-table iam-pretty-table">
							'.IAM_User::get_user_charge_table_head().'
							<tbody>
								'.$table_rows.'
							</tbody>
						</table>
					</div>

				</div>
		  </div>


		</div>';

/*

*/

		return Utils_Public::render_page_for_login_status($html);
	}

}
