<?php

/**
*
*/

class IAM_User_Account_Page
{

	public static function get_table_rows_for_id($id, $editable = false)
	{
		global $wpdb;
		$username = $wpdb->get_results($wpdb->prepare("SELECT WP_Username FROM ".IAM_USERS_TABLE." WHERE IAM_ID=%d",$id))[0]->WP_Username;
		$charge_results = $wpdb->get_results($wpdb->prepare("SELECT * FROM ".IAM_CHARGE_TABLE." WHERE WP_Username=%s ORDER BY Charge_ID DESC",$username));
		$table_rows = '';
		$edit_row = '';
		$c = $charge_results;
		$c = array_reverse($c);
		$after_charge = [];
		$t = 0;
		foreach($c as $row) {
			if ($row->Status==1 || $row->Status==0) {
				$t+=$row->Amount;
				$after_charge[] = $t;
			} else {
				$after_charge_count = count($after_charge);
				if ($after_charge_count>0) {
					$after_charge[] = $after_charge[$after_charge_count-1];
				} else {
					$after_charge[] = $t;
				}
			}

		}
		$count = 0;
		$length = count($after_charge)-1;
		foreach($charge_results as $row) {

			$status;
			if ($row->Status==1) {
				$status = 'Approved';
			} else if ($row->Status==0) {
				$status = 'Pending';
			} else if ($row->Status==-1) {
				$status = 'Canceled';
			}
			if($editable) {
				$edit_row = '<td><div class="iam-edit-charge-row" data-nid="'.iam_output($row->NI_ID).'"></div></td>';
			}
			$datetime = new DateTime($row->Date);
			$table_rows.='<tr><td>'.iam_output($datetime->format('m-d-Y')).'</td>'.'<td>'.iam_output($row->Charge_Description).'</td>'.'<td>$'.iam_output($row->Amount).'</td>'.'<td>$'.$after_charge[$length-$count].'</td>'.'<td class="iam-charge-status">'.iam_output($status).'</td>'.$edit_row.'</tr>';
			$count++;
		}
    	if ($table_rows=='') {
      		$table_rows = '<tr><td>no</td><td>activity</td><td>currently</td><td>found.</td><td>:(</td></tr>';
      	}
      	return $table_rows;
	}

	public static function get_charge_table_head()
	{
		return '<thead>
					<tr>
						<th>Date</th>
						<th>Description</th>
						<th>Amount</th>
						<th>Funds After Charge</th>
						<th>Status</th>
					</tr>
				</thead>';
	}

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
  	$table_rows = IAM_User_Account_Page::get_table_rows_for_id($iam_id);

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

					<div class="iam-form">

						<h1>Account Info</h1>

						<p class="form-row">
						  <label>Username:</label>
						  <input type="text" value="'.$user_results->WP_Username.'" disabled />
						</p>
						<p class="form-row">
						  <label>Name:</label>
						  <input type="text" id="first-name" value="'.$first_name.'" />
						  <input type="text" id="last-name" value="'.$last_name.'" />
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
						  <input type="text" value="'.$user_results->Student_ID.'" id="student-id" />
						</p>
					</div>
				</div>
		    <div role="tabpanel" class="tab-pane" id="transactions">

					<div id="iam-total-bal-left">
						<div class="iam-total-bal-amount" style="background-repeat:no-repeat; background-position:center; background-image:url('.site_url('/wp-content/plugins/imrc-account-manager/assets/circle.svg').');">
							'.iam_output($account_bal).'
						</div>
						<p id="iam-available-bal-title">Available Balance</p>
						<p id="iam-available-bal-title iam-discount">'.iam_output($discount).'% '.iam_output($account_type).' Discount</p>
					</div>
					<div id="iam-total-bal-right">
						<p class="iam-account-activity-title">Account Activity</p>
						<table class="iam-account-balance-table">
							'.IAM_User_Account_Page::get_charge_table_head().'
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

		Utils_Public::render_page_for_login_status($html);
	}

}
