<?php

/**
 *
 */
class Admin_Content
{

	/**
	 * Function that creates the manage equipment view
	 *
	 * @since v.0.2
	 *
	 * @return string
	 */

	 public static function er_equipment_content()
	 {
	 	Admin_Content::equipment_content('e');
	 }

	 public static function fl_equipment_content()
	 {
	 	Admin_Content::equipment_content('f');
	 }

	public static function equipment_content($dept)
	{
		global $wpdb;
		$c = $dept=='e' ? 'iam-er' : 'iam-fl';

		$users = $wpdb->get_results("SELECT WP_ID FROM ".IAM_USERS_TABLE);
		$emails = [];
		foreach ($users as $row) {
			$emails[] = strtolower( get_userdata($row->WP_ID)->user_email );
		}
		asort($emails);
		?>
		<div class="wrap iam-equipment-wrap <?php echo $c; ?>">
			<div class="iam-ninja iam-on-load-data" data-users="<?php echo iam_output(implode(',', $emails)) ?>"></div>
			<h1 class="iam-admin-header">Equipment</h1>
			<div id="iam-admin-col-left">
				<h3>Existing Equipment</h3>
				<div class="iam-search-container">
					<input class="iam-search iam-equipment-search" type="search" placeholder="search...">
				</div>
				<ul id="iam-equipment-list" class="iam-existing-list">
					<?php

						$dept_cond = $dept=='e' ? "WHERE Root_Tag!='Fab Lab'" : "WHERE Root_Tag!='Equipment Room'" ;
						$equipment_query = "SELECT Name,Checked_Out FROM ".IAM_EQUIPMENT_TABLE." ".$dept_cond;
						$equipment_results = $wpdb->get_results($equipment_query);
						$empty = true;
						$selected_name = "";

						$sorted = [];
						foreach ($equipment_results as $row) {
							$sorted[$row->Name] = $row;
						}
						ksort($sorted);

						foreach ($sorted as $row) {
							$available = $row->Checked_Out==0 ? 0 : get_email($wpdb->get_results("SELECT IAM_ID FROM ".IAM_RESERVATION_TABLE." WHERE Reservation_ID=".$row->Checked_Out)[0]->IAM_ID);

							if ($empty) { //determines whether there is equipment & sets initial selected item
								$empty = false;
								$selected_name = $row->Name;
								echo "<li data-rented-to=\"".$available."\" selected>".iam_output($row->Name)."</li>";
							} else {
								echo "<li data-rented-to=\"".$available."\">".iam_output($row->Name)."</li>";
							}
						}
						if ($empty) {
							echo "<li>No equipment found! :(</li>";
						}
					 ?>
				</ul>
			</div>
			<div id="iam-admin-col-right">
				<?php

				if (!$empty)
					echo IAM_Admin_Forms::update_equipment_form($selected_name);
				echo IAM_Admin_Forms::new_equipment_form();

				?>
			</div>
			<div id="iam-admin-col-far-right">
				<div class="rent-box">
					<h3 style="margin:0 0 10px 0;color:#666;">Equipment Management</h3>
					<button id="iam-duplicate-equipment-button" class="iam-secondary-button">Duplicate Current Equipment</button>
					<br />
					<button id="iam-new-equipment-button" class="iam-secondary-button">New Equipment</button>
				</div>
				<div class="rent-box">
					<h3 style="margin:0;color:#666;">Rental</h3>
					<input type="text" class="iam-er-user-emails" placeholder="user email">
					<br />
					<button class="iam-secondary-button iam-er-action-button"></button>
				</div>
			</div>
		</div>

		<?php
	}



	/**
	 * Function that creates the manage certications page
	 *
	 * @since v.0.2
	 *
	 * @return string
	 */

	public static function certification_content()
	{
	 	?>
	 	<div class="wrap iam-certification-wrap">
	 		<h1 class="iam-admin-header">Certifications</h1>
	 		<div id="iam-admin-col-left">
	 			<h3>Existing Certifications</h3>
	 			<div class="iam-search-container">
					<input class="iam-search iam-certification-search" type="search" placeholder="search...">
				</div>
				<ul id="iam-certifcation-list" class="iam-existing-list">
					<?php
						global $wpdb;
						$cert_query = "SELECT Name FROM ".IAM_CERTIFICATION_TABLE." ";
						$cert_results = $wpdb->get_results($cert_query);
						$empty = true;
						$selected_name = "";
						foreach ($cert_results as $row) {
							if ($empty) { //determines whether the field is empty & sets initial selected item
								$empty = false;
								$selected_name = $row->Name;
								echo "<li selected>".iam_output($row->Name)."</li>";
							} else {
								echo "<li>".iam_output($row->Name)."</li>";
							}
						}
						if ($empty) {
							echo "<li>No Certifications found! :(</li>";
						}
					 ?>
				</ul>
				<button id="iam-new-certification-button" class="iam-secondary-button">New Certifcation</button>
			</div>

			<div id="iam-admin-col-right">
				<?php

				if (!$empty)
					echo IAM_Admin_Forms::update_certification_form($selected_name);
				echo IAM_Admin_Forms::new_certification_form();

				?>
			</div>

	 	</div>

		<?php
	 }

	/**
	 * Function that creates the view balances page
	 *
	 * @since v.0.1
	 *
	 * @return string
	 */

	public static function balance_content() {
	?>
		<div class="wrap iam-balances-wrap">
			<h1 class="iam-admin-header">Balances<div class="iam-button iam-add-funds-button" >Add Funds</div></h1>
			<div class="iam-search-container">
				<input type="search" placeholder="search..." class="iam-search iam-balances-search">
			</div>
			<table class="iam-table" id="iam-balances-table" style="display:inline-block;vertical-align:top;">
				<colgroup>
					<col width="100px">
					<col width="125px">
					<col width="50px">
				</colgroup>
				<thead>
					<tr id="iam-title-row">
						<th class="iam-balances-table-col1">Username</th>
						<th class="iam-balances-table-col2" id="">Account Type</th>
						<th class="iam-balances-table-col3">Balance (Pending Balance)</th>
					</tr>
				</thead>
				<tbody>
				<?php

				global $wpdb;
				$results = $wpdb->get_results("SELECT NI_ID,WP_Username,Balance,Account_Type FROM ".IAM_USERS_TABLE." ORDER BY WP_Username ASC");
				foreach($results as $row) {
					$account_type = $wpdb->get_results($wpdb->prepare("SELECT Name FROM ".IAM_ACCOUNT_TYPES_TABLE." WHERE Account_Type_ID=%d",$row->Account_Type))[0]->Name;
					echo '
					<tr class="iam-bal-user-row" data-nid="'.iam_output($row->NI_ID).'">
						<td class="iam-bal-user-row-username iam-balances-table-col1">'.iam_output($row->WP_Username).'</td><td class="iam-bal-user-row-account-type iam-balances-table-col2">'.iam_output($account_type).'</td><td class="iam-bal-user-row-balance iam-balances-table-col3">'.IAM_Funds_Handler::update($row->WP_Username,true).'</td>
					</tr>
					';
				}

				?>
				</tbody>
			</table>
			<div id="iam-admin-funds" style="display:inline-block;padding-left: 30px; vertical-align:top;">
				<div class="iam-ninja iam-add-funds">
					<p class="iam-form-row">
						<label for="username">Username: </label>
						<select name="username" id="username">
							<?php
							foreach($results as $row) {
								echo '<option value="'.iam_output($row->WP_Username).'">'.iam_output($row->WP_Username).'</option>';
							}
							 ?>
						</select>
					</p>
					<p class="iam-form-row">
						<label for="amount">Amount: </label>
						<input name="amount" id="amount" type="number" step="any">
					</p>
					<p class="iam-form-row">
						<label for="description">Description: </label>
						<textarea name="description" id="description" rows="5" cols="40"></textarea>
					</p>
					<p class="iam-form-row">
						<button class="iam-button iam-balances-button" type="button">Submit</button>
					</p>
				</div>
			</div>
			<div id="iam-bal-charges-table-container">
				<table id="iam-user-charges-table" cellspacing="0">
					<?php
					require_once iam_dir() . 'templates/account_balance_page.php';
					echo IAM_Account_Balance_Page::get_charge_table_head();
					?>
					<tbody>
						<tr>
							<td>no</td><td>activity</td><td>currently</td><td>found.</td>
						</tr>
					</tbody>
				</table>
			</div>

		</div>

		<?php

	}

	public static function room_content()
	{
		?>
		<div class="wrap iam-room-wrap">
			<h1 class="iam-admin-header">Rooms</h1>
			<div id="iam-admin-col-left">
				<h3>Existing Rooms</h3>
				<div class="iam-search-container">
					<input type="search" placeholder="search..." class="iam-search iam-room-search">
				</div>
				<ul id="iam-room-list" class="iam-existing-list">
					<?php
						global $wpdb;
						$room_query = "SELECT Name FROM ".IAM_ROOM_TABLE." ";
						$room_results = $wpdb->get_results($room_query);
						$empty = true;
						$selected_name = "";
						foreach ($room_results as $row) {
							if ($empty) { //determines whether there is room & sets initial selected item
								$empty = false;
								$selected_name = $row->Name;
								echo "<li selected>".iam_output($row->Name)."</li>";
							} else {
								echo "<li>".iam_output($row->Name)."</li>";
							}
						}
						if ($empty) {
							echo "<li>No rooms found! :(</li>";
						}
					 ?>
				</ul>
				<button id="iam-new-room-button" class="iam-secondary-button">New Room</button>
			</div>
			<div id="iam-admin-col-right">
				<?php

				if (!$empty)
					echo IAM_Admin_Forms::update_room_form($selected_name);
				echo IAM_Admin_Forms::new_room_form();

				?>
			</div>
		</div>
		<?php
	}

	public static function equipment_room_reservation_content()
	{
		echo Admin_Content::reservation_content('e');
	}

	public static function fab_lab_reservation_content()
	{
		echo Admin_Content::reservation_content('f');
	}

	public static function reservation_content($dept)
	{
		?>
			<div class="wrap iam-reservation-wrap">
				<h1 class="iam-admin-header">Reservations</h1>
				<div class="res-col-left">
					<h3 style ="margin-top:0 !important;"> <?php if ($dept=='e') {echo 'Equpment Room';} else if ($dept=='f') {echo 'Fab Labs';} else {echo 'ERROR';} ?></h3>
					<div class="iam-res-search-container">
						<input type="search" placeholder="search..." class="iam-search">
					</div>
					<div class="iam-res-select-all">
						Select All
					</div>
					<div class="iam-reservation-list">
						<?php
                        global $wpdb;
                        $dept_tag = $dept == 'e' ? 'Equipment Room' : 'Fab Lab' ;
                        $dept_list = [];
                        $dept_tags = [$wpdb->get_results($wpdb->prepare("SELECT Tag_ID FROM ".IAM_TAGS_TABLE." WHERE Tag=%s", $dept_tag))[0]->Tag_ID];
                        $unchecked_tags = [$dept_tag];
                        while (count($unchecked_tags)) {
                            $fab_lab_results = $wpdb->get_results($wpdb->prepare("SELECT Tag_ID,Tag FROM ".IAM_TAGS_TABLE." WHERE Parent=%s",array_shift($unchecked_tags)));
                            foreach ($fab_lab_results as $row) {
                                $unchecked_tags[] = $row->Tag;
                                $dept_tags[] = $row->Tag_ID;
                            }
                        }
                        for ($i=0; $i < count($dept_tags); $i++) {
                            $equipment_tag_results = $wpdb->get_results($wpdb->prepare("SELECT Equipment_ID FROM ".IAM_TAGS_EQUIPMENT_TABLE." WHERE Tag_ID=%s",$dept_tags[$i]));
                            foreach ($equipment_tag_results as $row) {
                                $equip_results = $wpdb->get_results($wpdb->prepare("SELECT Name,NI_ID FROM ".IAM_EQUIPMENT_TABLE." WHERE Equipment_ID=%d",$row->Equipment_ID))[0];
                                $dept_list[$equip_results->Name] = '<div class="iam-reservations-equipment-list-item" data-nid="'.iam_output($equip_results->NI_ID).'">'.iam_output($equip_results->Name).'</div>';
                            }
                        }
                        ksort($dept_list);
                        foreach ($dept_list as $key => $value) {
                            echo $value;
                        }
						 ?>
					</div>
				</div>

				<div id="iam-res-cal-wrap">
					<div class="res-toolbar">
						<label>Load more than a week: <input class="iam-load-all-reservations" type="checkbox"></label>
						<div class="res-status-bar">
							<label class="iam-status-label iam-upcoming">upcoming: <input type="checkbox" name="upcoming"></label>
							<label class="iam-status-label iam-active">active: <input type="checkbox" name="active"></label>
							<label class="iam-status-label iam-completed">completed: <input type="checkbox" name="completed"></label>
							<label class="iam-status-label iam-no-show">no show: <input type="checkbox" name="no-show"></label>
							<label class="iam-status-label iam-no-pay">didn't pay: <input type="checkbox" name="no-pay"></label>
						</div>
					</div>
					<div class="iam-res-cal"><div class="iam-res-cal-placeholder">Select equipment</div></div>
					<div class="iam-res-cal-instructions">
						<label style="color:red;">Send email alerting users of reservation changes: <input type="checkbox" class="iam-res-cal-send-emails" checked></label><br />
						<textarea rows="6" cols="50" class="iam-res-cal-reason" placeholder="Reason changes were made to users reservation. This will be sent in an email to the users whose reservations have been altered. (Optional)"></textarea>
						<div class="iam-res-cal-button-wrap">
							<button class="iam-res-cal-cancel iam-delete-button" type="button">Cancel</button>
							<button class="iam-res-cal-submit iam-button" type="button">Save Changes</button>
						</div>
					</div>
				</div>
			</div>
		<?php
	}

	public static function user_certification_content()
	{
		?>
			<div class="wrap iam-user-certification-wrap">
				<h1 class="iam-admin-header">User Certifications</h1>
				<div class="iam-search-container">
					<input type="search" placeholder="search..." class="iam-search iam-user-certifications-search">
				</div>
				<table class="iam-table" id="iam-user-certification-table" style="display:inline-block;vertical-align:top;" cellspacing="0">
					<thead>
						<tr id="iam-title-row">
							<th class="iam-user-certification-table-col1">Username</th>
							<th class="iam-user-certification-table-col2">Account Type</th>
							<th class="iam-user-certification-table-col3">Existing Certifications</th>
							<th class="iam-user-certification-table-col4">Select</th>
						</tr>
					</thead>
					<?php
					global $wpdb;
					$results = $wpdb->get_results("SELECT NI_ID,WP_Username,Balance,Account_Type,IAM_ID FROM ".IAM_USERS_TABLE." ORDER BY WP_Username ASC");
					foreach($results as $row) {
						$iam_id = $row->IAM_ID;
						$cert_results = $wpdb->get_results("SELECT Certification_ID FROM ".IAM_USER_CERTIFICATIONS_TABLE." WHERE IAM_ID='$iam_id'");
						$cert_html = '';
						foreach ($cert_results as $cert_row) {
							$cert_id = $cert_row->Certification_ID;
							$cert_name = $wpdb->get_results("SELECT Name FROM ".IAM_CERTIFICATION_TABLE." WHERE Certification_ID='$cert_id'")[0]->Name;
							$cert_html.='<p>'.iam_output($cert_name).'</p>';
						}
						if (count($cert_results)<1) {
							$cert_html = '<p>None.</p>';
						}
						$account_type = $wpdb->get_results($wpdb->prepare("SELECT Name FROM ".IAM_ACCOUNT_TYPES_TABLE." WHERE Account_Type_ID=%d",$row->Account_Type))[0]->Name;
						echo '
						<tr>
							<td class="iam-username iam-user-certification-table-col1">'.iam_output($row->WP_Username).'</td><td>'.iam_output($account_type).'</td><td>'.$cert_html.'</td><td><input type="checkbox" class="iam-cert-checkbox" data-user="'.iam_output($row->WP_Username).'"></td>
						</tr>
						';
					}
					?>
				</table>
				<br /><br />
				<select id="iam-cert-to-apply">
					<option value="Select a value">Select a value</option>}
				<?php
					$cert_results = $wpdb->get_results("SELECT Name FROM ".IAM_CERTIFICATION_TABLE." ");
					foreach ($cert_results as $row) {
						echo '<option value="'.iam_output($row->Name).'">'.iam_output($row->Name).'</option>';
					}
				?>
				</select><br><br>
				<button type="button" id="iam-add-cert-button" class="iam-button">Add Certification</button>
				<button type="button" id="iam-remove-cert-button" class="iam-delete-button">Remove Certification</button>
			</div>
		<?php
	}

	public static function charge_sheet_content()
	{
		?>
			<div class="wrap iam-charge-sheet-wrap">
				<h1 class="iam-admin-header">Charge Sheet</h1>
				<div class="iam-search-container">
					<input type="search" placeholder="search..." class="iam-search iam-charge-sheet-search"><i> by </i>
					<select class="iam-search-field">
						<option value=".iam-charge-table-username" selected>Username</option>
						<option value=".iam-charge-table-email">Email</option>
						<option value=".iam-charge-table-equipment_used">Equipment Used</option>
						<option value=".iam-charge-table-Charge_Description">Description</option>
						<option value=".iam-charge-table-approver">Employee Who Approved Charge</option>
					</select>
					<span style="background:none;" title="Fields with a red asterisk can be edited by clicking"><i style="font-size:20px;" class="fa fa-question-circle"></i></span>
					<div class="iam-pagination iam-charge-sheet-pagination" style="float:right;">
						<a href="#" class="iam-select-first"><?php echo iam_output('<<'); ?></a>
						<a href="#" class="iam-select-prev"><?php echo iam_output('<'); ?></a>
						<span><select class="iam-pagination-select"></select></span>
						<a href="#" class="iam-select-next"><?php echo iam_output('>'); ?></a>
						<a href="#" class="iam-select-last"><?php echo iam_output('>>'); ?></a>
					</div>
				</div>

				<div id="iam-table-container">

				</div>
				<button type="button" class="iam-csv-button iam-secondary-button" style="margin-top:15px;">Generate CSV</button>
			</div>
		<?php
	}


	public static function registration_content()
	{
		global $wpdb;
		$new_user_results = $wpdb->get_results("SELECT user_id FROM ".$wpdb->prefix."usermeta WHERE meta_key='iam_need_admin_approval'");
		?>
		<div class="wrap iam-registration-wrap">
			<div class="iam-registration-review-wrap">
				<h1 class="iam-admin-header">Review New Users</h1>
				<div class="iam-search-container iam-registration-search">
					<input type="search" placeholder="search..." class="iam-search iam-registration-search">
				</div>
				<table class="iam-registration-table" cellspacing="0">
					<thead>
						<tr id="iam-title-row">
							<th>Username</th>
							<th>Approve</th>
							<th>Deny</th>
						</tr>
					</thead>
					<tbody>
						<?php
						foreach ($new_user_results as $row) {
							$user_login = $wpdb->get_results("SELECT user_login FROM ".$wpdb->prefix."users WHERE ID='".$row->user_id."'")[0]->user_login;
							echo '<tr><td class="iam-username">'.iam_output($user_login).'</td><td><button data-user="'.iam_output($user_login).'" type="button" class="iam-approve-account iam-button iam-table-button">approve</button></td><td><button data-user="'.iam_output($user_login).'" type="button" class="iam-deny-account iam-delete-button iam-table-delete-button">deny</button></td></tr>';
						}
						?>
					</tbody>
				</table>
			</div>

			<div class="iam-registration-key-wrap">
				<h1 class="iam-admin-header">Registration Keys</h1>
				<table class="iam-registration-table" cellspacing="0">
					<thead>
						<tr id="iam-title-row">
							<th>Key</th>
							<th>Expires (MM/DD/YYYY) </th>
							<th>Delete Key</th>
						</tr>
					</thead>
					<tbody>
						<?php
						$meta_results = $wpdb->get_results("SELECT * FROM ".IAM_META_TABLE." WHERE Meta_Key='".REGISTRATION_KEY."'");
						if (count($meta_results)==0) {
							echo '<tr><td>No</td><td>Data</td><td>Found.</td></tr>';
						}
						foreach ($meta_results as $row) {
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
							$enc = IAM_Sec::iamEncrypt($row->Meta_ID);
							$expiration = $data->expiration == '' ? 'until canceled' : $data->expiration ;
							echo '<tr><td>'.$data->key.'</td><td class="i-am-registration-key-expiration">'.iam_output($expiration).'</td><td><button data-nid="'.iam_output($enc).'" type="button" class="iam-delete-key iam-delete-button iam-table-delete-button">delete</button></td></tr>';
						}
						?>
					</tbody>
				</table>
				<div class="iam-make-key-container">
					<h2>Add New Key</h2>
					<label>Key (Random key generated if left blank): </label><br>
					<input type="text" class="iam-reg-key"><br>
					<label>Expiration Date (Optional):</label><br>
					<input type="number" max-length="2" max="12" min="1" placeholder="MM" class="iam-reg-key-month" style="width:50px;"><label> / </label>
					<input type="number" max-length="2" min="1" max="31" placeholder="DD" class="iam-reg-key-day" style="width:50px;"><label> / </label>
					<input type="number" max-length="4" placeholder="YYYY" class="iam-reg-key-year" style="width:60px;">
					<br>
					<button type="button" class="iam-reg-key-button iam-button">Add Registration Key</button>
				</div>
			</div>
		</div>
		<?php
	}

	public static function scheduling_content()
	{
		global $wpdb;
		$root_tags = $wpdb->get_results("SELECT * FROM ".IAM_TAGS_TABLE." WHERE Parent IS NULL");

		?>
		<div class="wrap iam-scheduling-wrap">
			<h1 class = "iam-admin-header">Facility Scheduling</h1>
		<?php

		foreach ($root_tags as $row) {
			Scheduling_Page::make_scheduling_block($row);
		}
		//rooms has tag id of 0 since it doesn't have a tag
		/*
		$row = new StdClass;
		$row->Tag_ID = 0;
		$row->Tag = 'Rooms';
		Scheduling_Page::make_scheduling_block($row);*/
		 ?>
		</div>
		<?php
	}

	public static function user_privileges_content()
	{
		global $wpdb;
		$user_results = $wpdb->get_results("SELECT WP_ID,WP_Username From ".IAM_USERS_TABLE." ORDER BY WP_Username ASC");
		?>
		<div class="wrap iam-user-privileges-wrap">
			<h1 class="iam-admin-header">User Privileges</h1>
			<div class="iam-search-container">
				<input type="search" placeholder="search..." class="iam-search iam-user-privileges-search">
			</div>
			<div class="iam-user-privileges-container" style="max-height:600px;max-width:300px;overflow-y:scroll;">
				<table id="iam-privileges-table" cellspacing="0">
					<thead>
						<tr id="iam-title-row">
							<th>Username</th>
							<th>Can Place Reservations</th>
						</tr>
					</thead>
					<tbody>
						<?php
						foreach ($user_results as $row) {
							$can_reserve = 'checked';
							if (count(get_user_meta($row->WP_ID, IAM_RESERVATIONS_PRIVILEGE_META))>0) {
								$can_reserve = '';
							}
							echo '<tr><td class="iam-username">'.iam_output($row->WP_Username).'</td><td><input type="checkbox" '.iam_output($can_reserve).'></td></tr>';
						}
						 ?>
					</tbody>
				</table>
			</div>
		</div>
		<input type="submit" class="iam-button" style="margin-top: 15px;" value="Save Changes">
		<?php
	}

	public static function pricing_content()
	{
		?>

		<div class="wrap iam-pricing-wrap">
			<h1 class="iam-admin-header">Pricing</h1>
			<table id="iam-pricing-table" cellspacing="0">
				<thead>
					<tr id="iam-title-row">
						<th>Material Name</th>
						<th>Price Per Unit</th>
						<th>Minimum Price</th>
						<th>Unit Name</th>
						<th>Associated Tags</th>
						<th>Associated Equipment</th>
						<th>Delete</th>
					</tr>
				</thead>
				<tbody>
					<?php
					global $wpdb;
					$mat_results = $wpdb->get_results("SELECT * FROM ".IAM_MATERIAL_TABLE);
					foreach ($mat_results as $row) {
						$name = $row->Name;
						$price = $row->Price_Per_Unit;
						$base_price = $row->Base_Price;
						$unit_name = $row->Unit_Name;
						$mat_id = $row->Material_ID;
						$all_tag_results = $wpdb->get_results("SELECT Tag FROM ".IAM_TAGS_TABLE);
						$all_tags = [];
						$all_equip = [];
						foreach ($all_tag_results as $tag_row) {
							$all_tags[] = $tag_row->Tag;
						}
						$all_equip_results = $wpdb->get_results("SELECT Name FROM ".IAM_EQUIPMENT_TABLE);
						foreach ($all_equip_results as $equip_row) {
							$all_equip[] = $equip_row->Name;
						}
						$tag_results = $wpdb->get_results("SELECT Tag_ID FROM ".IAM_MATERIAL_TAGS_TABLE." WHERE Material_ID='$mat_id' ");
						$equip_results = $wpdb->get_results("SELECT Equipment_ID FROM ".IAM_MATERIAL_EQUIPMENT_TABLE." WHERE Material_ID='$mat_id' ");
						$associated_tags = '';
						$associated_equipment = '';
						foreach ($tag_results as $tag_row) {

							$tag_id = $tag_row->Tag_ID;
							$tag_name = $wpdb->get_results("SELECT Tag FROM ".IAM_TAGS_TABLE." WHERE Tag_ID='$tag_id'")[0]->Tag;
							$associated_tags.=Pricing_Page::make_pricing_drop_down($all_tags,$tag_name);
						}
						foreach ($equip_results as $equip_row) {
							$equip_id = $equip_row->Equipment_ID;
							$equip_name = $wpdb->get_results("SELECT Name FROM ".IAM_EQUIPMENT_TABLE." WHERE Equipment_ID='$equip_id'")[0]->Name;
							$associated_equipment.=Pricing_Page::make_pricing_drop_down($all_equip,$equip_name);
						}
						$associated_tags = $associated_tags.'<div class="iam-add-pricing-tags-drop-down-button iam-secondary-button">+</div>';
						$associated_equipment = $associated_equipment.'<div class="iam-add-pricing-equipment-drop-down-button iam-secondary-button">+</div>';
						echo Pricing_Page::make_mat_row($row->NI_ID,$name,$price,$base_price,$unit_name,$associated_tags,$associated_equipment);
					}
					?>
				</tbody>
			</table>
			<div class="iam-new-mat-button iam-secondary-button">Add New</div><br />
			<div class="iam-button iam-admin-submit-button">Save Changes</div>
		</div>
		<?php
	}

	public static function room_reservations_content()
	{
		global $wpdb;
		$room_results = $wpdb->get_results("SELECT Name FROM ".IAM_ROOM_TABLE);
		$list_html = '<ul class="iam-room-res-list iam-reservation-tab-list"><li class="iam-select-all-room-res"><input type="checkbox">Select All</li>';
		foreach ($room_results as $row) {
			$list_html.='<li><input type="checkbox">'.$row->Name.'</li>';
		}
		$list_html.='</ul>';
		?>
		<div class="wrap iam-room-res-wrap">
			<div class="iam-tabs iam-room-res-tabs">
				<span class="iam-tab iam-confirmed-tab">Confirmed</span><span class="iam-tab iam-pending-tab iam-selected-tab">Pending</span>
				<span style="background:none;" title="Right click events to get options"><i style="font-size:20px;" class="fa fa-question-circle"></i></span>
			</div>
			<div class="iam-list-container iam-room-res-list-container"><?php echo $list_html; ?></div>
			<div id="iam-res-cal-wrap">
				<div class="iam-cal iam-room-res-cal">
					<h1 class="iam-cal-placeholder">Select item(s)</h1>
				</div>
				<div class="iam-res-cal-instructions">
					- Events marked red will be deleted <br />
					- Events marked green will be confirmed <br />
					- Events marked yellow will be reset to pending
					<br />
					<br />
					<label style="color:red;">Send email alerting users of reservation changes: <input type="checkbox" class="iam-res-cal-send-emails" checked></label><br />
					<textarea rows="8" cols="60" class="iam-res-cal-reason" placeholder="Reason changes were made to users reservation. This will be sent in an email to the users whose reservations have been altered. (Optional)"></textarea>
					<div class="iam-res-cal-button-wrap">
						<button class="iam-res-cal-cancel iam-delete-button" type="button">Cancel</button>
						<button class="iam-res-cal-submit iam-button" type="button">Save Changes</button>
					</div>
				</div>
			</div>
		</div>

		<?php
	}

	/**
	 * Function that provides content for the admin plugin menu
	 *
	 * @since v.0.2
	 *
	 * @return void
	 */
	public static function fab_lab_content()
	{
		global $wpdb;
		?>
		<div class="wrap iam-main-menu-wrap">
			<h1 class="iam-admin-header">Settings</h1>
			<hr>
			<section class="iam-settings-container">
				<form accept-charset="utf-8" class="iam-settings-form">
					<table>
						<tbody>
							<tr>
								<td><label>iPad Lock Code</label></td>
								<td><input type="number" class="iam-ipad-code" width="50" value="<?php echo get_setting_iam('ipad_code') ?>"></td>
							</tr>
							<tr>
								<td><h2>Email Notifications</h2></td>
							</tr>
							<tr>
								<td><label>Training Page Inquiry</label></td>
								<td><input type="text" class="iam-training-page-email" value="<?php echo get_setting_iam('training_email') ?>"></td>
							</tr>
							<tr>
								<td><label>Failure to Check Out (Fab Lab)</label></td>
								<td><input type="text" class="iam-late-reservations-email" value="<?php echo get_setting_iam('late_reservations_email') ?>"></td>
							</tr>
							<tr>
								<td><label>Fab Lab Reservation</label></td>
								<td><input type="text" class="iam-fab-lab-email" value="<?php echo get_setting_iam('fab_lab_email') ?>"></td>
							</tr>
						</tbody>
					</table>
					<div class="iam-settings-submit iam-save iam-button"></div>
					<hr>
				</form>
				<h1>Account Types &amp; Discounts</h1>
				<form accept-charset="utf-8" class="iam-account-type-form">
					<table>
						<tbody>
								<?php
								$account_types_results = $wpdb->get_results("SELECT * FROM ".IAM_ACCOUNT_TYPES_TABLE);
								foreach ($account_types_results as $row) {
									echo '<tr data-nid="'.IAM_Sec::iamEncrypt($row->Account_Type_ID).'">
									<td class="iam-account-type-label"><label>Type</label>
									<br />
									<label>Discount (0-100%)</label></td>
									<td><input type="text" placeholder="example: student, faculty, alumni" class="iam-account-type" value="'.iam_output($row->Name).'">
									<br />
									<input type="number" class="iam-account-discount" value="'.iam_output($row->Discount).'"></td>
									<td><i class="iam-delete-account-type fa fa-close fa-3"></i></td></tr>';
								}
								if (count($account_types_results)<1) {
									echo '<tr class="iam-no-data-row"><td>No data found!</td></tr>';
								}
								?>
						</tbody>
					</table>
					<div class="iam-secondary-button iam-add-account-type">add new</div>
					<div class="iam-account-types-submit iam-save iam-button"></div>
				</form>
			</section>
			<hr>
			<h3>Powered by &nbsp;&nbsp; <img width="250" src="<?php echo plugins_url( 'assets/qlogo.png', dirname(__FILE__) ); ?>" alt="Qiupura Logo"></h3>
		</div>
		<?php
	}

	/**
	 * Function that provides content for the admin plugin menu
	 *
	 * @since v.0.2
	 *
	 * @return void
	 */
	public static function equipment_room_content()
	{
		global $wpdb;
		?>
		<div class="wrap iam-main-menu-wrap">
			<h1 class="iam-admin-header">Settings</h1>
			<hr>
			<section class="iam-settings-container">
				<form accept-charset="utf-8" class="iam-settings-form">
					<table>
						<tbody>
							<tr>
								<td><h2>Email Notifications</h2></td>
							</tr>
							<tr>
								<td><label>Training Page Inquiry</label></td>
								<td><input type="text" class="iam-training-page-email" value="<?php echo get_setting_iam('training_email') ?>"></td>
							</tr>
							<tr>
								<td><label>Equipment Room Reservation </label></td>
								<td><input type="text" class="iam-equipment-room-email" value="<?php echo get_setting_iam('equipment_room_email') ?>"></td>
							</tr>
						</tbody>
					</table>
					<div class="iam-settings-submit iam-save iam-button"></div>
					<hr>
				</form>
				<h1>Account Types &amp; Discounts</h1>
				<form accept-charset="utf-8" class="iam-account-type-form">
					<table>
						<tbody>
								<?php
								$account_types_results = $wpdb->get_results("SELECT * FROM ".IAM_ACCOUNT_TYPES_TABLE);
								foreach ($account_types_results as $row) {
									echo '<tr data-nid="'.IAM_Sec::iamEncrypt($row->Account_Type_ID).'">
									<td class="iam-account-type-label"><label>Type</label>
									<br />
									<label>Discount (0-100%)</label></td>
									<td><input type="text" placeholder="example: student, faculty, alumni" class="iam-account-type" value="'.iam_output($row->Name).'">
									<br />
									<input type="number" class="iam-account-discount" value="'.iam_output($row->Discount).'"></td>
									<td><i class="iam-delete-account-type fa fa-close fa-3"></i></td></tr>';
								}
								if (count($account_types_results)<1) {
									echo '<tr class="iam-no-data-row"><td>No data found!</td></tr>';
								}
								?>
						</tbody>
					</table>
					<div class="iam-secondary-button iam-add-account-type">add new</div>
					<div class="iam-account-types-submit iam-save iam-button"></div>
				</form>
			</section>
			<hr>
			<h3>Powered by &nbsp;&nbsp; <img width="250" src="<?php echo plugins_url( 'assets/qlogo.png', dirname(__FILE__) ); ?>" alt="Qiupura Logo"></h3>
		</div>
		<?php
	}

	public static function overview_content()
	{
		global $wpdb;
		$fab_lab_equipment = $wpdb->get_results("SELECT * FROM ".IAM_EQUIPMENT_TABLE." WHERE Root_Tag='Fab Lab' ORDER BY Name ASC");
		?>
		<div class="iam-overview-wrap wrap">
			<h1 class="iam-admin-header">Daily Overview</h1>
			<div class="iam-col-left">
				<h1>Fab Lab Equipment</h1>
				<div class="iam-search-container">
					<input type="search" placeholder="search..." class="iam-search iam-overview-search">
				</div>
				<ul class="iam-fab-lab-list">
					<li class="iam-select-all-overview iam-select-all iam-will-select"><input type="checkbox" class="iam-list-checkbox"><span>Select All</span></li>
				<?php
				foreach ($fab_lab_equipment as $row) {
					echo '<li class="iam-list-selectable iam-overview-selectable" data-nid="'.iam_output(IAM_Sec::iamEncrypt($row->ID)).'"><input type="checkbox" class="iam-list-checkbox"><span>'.iam_output($row->Name).'</span></li>';
				}
				?>

				</ul>
			</div>
			<div class="iam-col-right">
				<div class="iam-cal">
					<h1 class="iam-cal-placeholder">Select item(s)</h1>
				</div>
			</div>
		</div>
		<?php
	}

}
