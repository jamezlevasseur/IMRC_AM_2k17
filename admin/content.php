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

	 function __construct($facility)
	 {
	 	$this->facility = $facility;
		$this->schedule = json_decode($this->facility->Schedule);
		$name = $this->facility->Name;
		$slug = 'imrc-'.iam_slugify($name);
		$_slug = iam_slugify($name,'_');

		add_menu_page ( $name, $name, 'manage_options', $slug, array($this, 'content'), 'http://jameslevasseur.com/imr-icon.png');
		add_submenu_page ($slug, 'Users', 'Users', 'manage_options', $_slug.'_users', array($this, 'users_content') );
		add_submenu_page ($slug, 'Equipment', 'Equipment', 'manage_options', $_slug.'_equipment', array($this, 'equipment_content') );
		add_submenu_page ($slug, 'Certifications', 'Certifications', 'manage_options', $_slug.'_certifications', array($this, 'certification_content') );
		add_submenu_page ($slug, 'Reservations', 'Reservations', 'manage_options', $_slug.'_reservations', array($this, 'reservation_content') );
		add_submenu_page ($slug, 'User Certifications', 'User Certifications', 'manage_options', $_slug.'_user_certifications', array($this, 'user_certification_content') );
		add_submenu_page ($slug, 'Charge Sheet', 'Charge Sheet', 'manage_options', $_slug.'_charge_sheet', array($this, 'charge_sheet_content') );
		add_submenu_page ($slug, 'Registration', 'Registration', 'manage_options', $_slug.'_registration', array($this, 'registration_content') );
		add_submenu_page ($slug, 'Scheduling', 'Scheduling', 'manage_options', $_slug.'_scheduling', array($this, 'scheduling_content') );
		add_submenu_page ($slug, 'User Privileges', 'User Privileges', 'manage_options', $_slug.'_user_privileges', array($this, 'user_privileges_content') );
		if ($this->schedule->type=='appointment')
			add_submenu_page ($slug, 'Pricing', 'Pricing', 'manage_options', $_slug.'_pricing', array($this, 'pricing_content') );
	 }

	 public function info_content()
	 {
		 ?>
		 <a href="<?php echo plugins_url( 'logs/iam_debug.txt', dirname(__FILE__) ); ?>">debug file</a>
	 <?php
	 }

	public function equipment_content()
	{
		global $wpdb;

		$c = 'iam-'.iam_slugify($this->facility->Name);

		$users = $wpdb->get_results("SELECT WP_ID,Balance FROM ".IAM_USERS_TABLE);
		$emails = [];
		$bal_dict = [];
		foreach ($users as $row) {
			$email = get_userdata($row->WP_ID)->user_email;
			$emails[] = strtolower( $email );
			$bal_dict[$email] = $row->Balance;
		}
		asort($emails);

		?>
		<div class="wrap iam-equipment-wrap <?php echo $c; ?>">
			<div class="iam-ninja iam-on-load-data" data-fee="<?php echo get_setting_iam(LATE_CHARGE_FEE_KEY); ?>" data-balances="<?php echo iam_output(json_encode($bal_dict)); ?>" data-users="<?php echo iam_output(implode(',', $emails)) ?>"></div>
			<h1 class="iam-admin-header">Equipment</h1>
			<div id="iam-admin-col-left">
				<h3>Existing Equipment</h3>
				<div class="iam-search-container">
					<input class="iam-search iam-equipment-search" type="search" placeholder="search...">
				</div>
				<ul id="iam-equipment-list" class="iam-existing-list">
					<?php

						$facility_cond = "WHERE Root_Tag='{$this->facility->Name}' OR Root_Tag=''";
						$equipment_query = "SELECT Name,Checked_Out FROM ".IAM_EQUIPMENT_TABLE." ".$facility_cond;
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
					echo IAM_Admin_Forms::update_equipment_form($selected_name, $this->schedule->type);
				echo IAM_Admin_Forms::new_equipment_form($this->schedule->type);

				?>
			</div>
			<div id="iam-admin-col-far-right">
				<div class="rent-box">
					<h3 style="margin:0 0 10px 0;color:#666;">Equipment Management</h3>
					<button id="iam-duplicate-equipment-button" class="iam-secondary-button">Duplicate Current Equipment</button>
					<br />
					<button id="iam-new-equipment-button" class="iam-secondary-button">New Equipment</button>
					<br />
					<button class="iam-secondary-button iam-csv-button">Generate CSV</button>
				</div>
				<?php if ($this->schedule->type=='rental') { ?>
				<div class="rent-box">
					<h3 style="margin:0;color:#666;">Rental</h3>
					<input type="text" class="iam-er-user-emails" placeholder="user email">
					<br />
					<button class="iam-secondary-button iam-er-action-button"></button>
				</div>
				<?php } ?>
			</div>
			<?php

			if ($this->schedule->type=='rental')
				echo '<div class="iam-ninja iam-facility-data" '.'data-facility="'.iam_output($facility->Schedule).'" ></div>';
			 ?>

			<div class="modal" id="myModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
			  <div class="modal-dialog modal-lg" style="max-width:65vw;" role="document">
			    <div class="modal-content">
			      <div class="modal-header" style="min-height:24px;">
			        <div class="fc-event" style="text-align:center; max-width:120px;">  drag me </div>
			        <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="position:absolute;right:10px;">
			          <span aria-hidden="true">&times;</span>
			        </button>
			      </div>
			      <div class="modal-body">
			      </div>
			      <div class="modal-footer">
			        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
			        <button type="button" class="btn btn-primary">Save changes</button>
			      </div>
			    </div>
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

	public function certification_content()
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

	public function users_content() {
	?>
		<div class="wrap iam-users-wrap">
			<h1 class="iam-admin-header">Users</h1>
			<div class="col-md-3">
				<div class="iam-search-container">
					<input type="search" placeholder="search..." class="iam-search iam-users-search">
				</div>
				<br>
				<ul class="iam-users-list iam-scroll-list">
					<?php
					global $wpdb;
					$results = $wpdb->get_results("SELECT WP_Username,Account_Type FROM ".IAM_USERS_TABLE." ORDER BY WP_Username ASC");
					foreach($results as $row) {
						echo '<li class="iam-no-select">'.iam_output( strtolower( $row->WP_Username ) ).'</li>';
					}
					?>
				</ul>
			</div>
			<div class="col-md-9 iam-user-info-col">

				<div class="iam-form-placeholder">

				</div>

			</div>

			</div>
			<div class="modal" id="myModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
				<div class="modal-dialog modal-lg" style="max-width:65vw;" role="document">
					<div class="modal-content">
						<div class="modal-header" style="min-height:24px;">
							Manage User Funds
							<button type="button" class="close" data-dismiss="modal" aria-label="Close" style="position:absolute;right:10px;">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body">
						</div>
						<div class="modal-footer">
							<input type="number" class="iam-add-funds-amount" placeholder="0.00" style="width:10%; display:inline-block; float: left; vertical-align: middle; padding: 3px 0; margin-right: 5px;">
							<input type="text" class="iam-add-funds-reason" placeholder="Reason for adjusting funds." style="width:60%; display:inline-block; float: left; vertical-align: middle; padding: 3px 0; margin-right: 5px;">
							<button type="button" class="btn btn-success iam-add-funds-btn" style="display:inline-block; float: left; vertical-align: middle;">Add Funds</button><button type="button" class="btn btn-primary iam-csv-button" style="display:inline-block; float: left; vertical-align: middle;">Generate CSV</button>
						</div>
					</div>
				</div>
			</div>
		<?php

	}

	public function reservation_content()
	{
		?>
			<div class="wrap iam-reservation-wrap" data-facility="<?php echo $this->facility->Name; ?>">
				<h1 class="iam-admin-header">Reservations</h1>
				<div class="res-col-left">
					<h3 style ="margin-top:0 !important;"> <?php echo $this->facility->Name; ?></h3>
					<div class="iam-res-search-container">
						<input type="search" placeholder="search..." class="iam-search">
					</div>
					<div class="iam-res-select-all">
						Select All
					</div>
					<div class="iam-reservation-list">
						<?php
                global $wpdb;
								$equip_results = $wpdb->get_results("SELECT * FROM ".IAM_EQUIPMENT_TABLE." WHERE Root_Tag='{$this->facility->Name}' ORDER BY Name ASC");

                foreach ($equip_results as $row) {
										if (trim($row->Name)=='')
											continue;
										$events = htmlentities( json_encode(IAM_Cal::get_cal_for_equipment($row->Name, ['is'=>'y','descriptive'=>'y'])) );
                    echo '<div class="iam-reservations-equipment-list-item"
										data-calevents="'.$events.'" data-nid="'.iam_output($row->NI_ID).'" title="'.iam_output($row->Name).'">'.iam_output($row->Name).'</div>';
                }
						 ?>
					</div>
				</div>

				<div id="iam-res-cal-wrap">
					<div class="res-toolbar">
						<div class="iam-secondary-button iam-load-all-reservations">Load more than a month</div>
						<div class="res-status-bar">
							<label class="iam-status-label iam-upcoming">upcoming: <input type="checkbox" name="upcoming"></label>
							<label class="iam-status-label iam-active">active: <input type="checkbox" name="active"></label>
							<label class="iam-status-label iam-completed">completed: <input type="checkbox" name="completed"></label>
							<label class="iam-status-label iam-no-show">no show: <input type="checkbox" name="no-show"></label>
							<?php
								if ($this->schedule->type=='rental') {
									?>
									<label class="iam-status-label iam-is-late">is late <input type="checkbox" name="is-late"></label>
									<label class="iam-status-label iam-was-late">returned late <input type="checkbox" name="was-late"></label>
									<?php
								} if ($this->schedule->type=='appointment') {
									?>
									<label class="iam-status-label iam-no-pay">didn't pay: <input type="checkbox" name="no-pay"></label>
									<?php
								}
							 ?>

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
		//TODO remove after cron is in place
		require_once iam_dir().'public/render/utils_public.php';
		Utils_Public::late_reservations_check();
	}

	public function user_certification_content()
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

	public function charge_sheet_content()
	{
		?>
			<div class="wrap iam-charge-sheet-wrap">
				<h1 class="iam-admin-header">Charge Sheet</h1>
				<div id="iam-table-container">
					<div class="iam-search-container">
						<form style="display:inline-block;"> <input type="search" placeholder="search..." class="iam-search iam-charge-sheet-search"> <input type="submit" value="search"> </form>
						<span style="background:none;" title="Fields with a red asterisk can be edited by clicking"><i style="font-size:20px;" class="fa fa-question-circle"></i></span>
					</div>
				</div>
				<button type="button" class="iam-csv-button iam-secondary-button" style="margin-top:15px;">Generate CSV</button>




				<style media="screen">

.paginationjs{line-height:1.6;font-family:Marmelad,"Lucida Grande",Arial,"Hiragino Sans GB",Georgia,sans-serif;font-size:14px;box-sizing:initial;display:inline-block;float:right;}.paginationjs:after{display:table;content:" ";clear:both}.paginationjs .paginationjs-pages{float:left}.paginationjs .paginationjs-pages ul{float:left;margin:0;padding:0}.paginationjs .paginationjs-go-button,.paginationjs .paginationjs-go-input,.paginationjs .paginationjs-nav{float:left;margin-left:10px;font-size:14px}.paginationjs .paginationjs-pages li{float:left;border:1px solid #aaa;border-right:none;list-style:none}.paginationjs .paginationjs-pages li>a{min-width:30px;height:28px;line-height:28px;display:block;background:#fff;font-size:14px;color:#333;text-decoration:none;text-align:center}.paginationjs .paginationjs-pages li>a:hover{background:#eee}.paginationjs .paginationjs-pages li.active{border:none}.paginationjs .paginationjs-pages li.active>a{height:30px;line-height:30px;background:#aaa;color:#fff}.paginationjs .paginationjs-pages li.disabled>a{opacity:.3}.paginationjs .paginationjs-pages li.disabled>a:hover{background:0 0}.paginationjs .paginationjs-pages li:first-child,.paginationjs .paginationjs-pages li:first-child>a{border-radius:3px 0 0 3px}.paginationjs .paginationjs-pages li:last-child{border-right:1px solid #aaa;border-radius:0 3px 3px 0}.paginationjs .paginationjs-pages li:last-child>a{border-radius:0 3px 3px 0}.paginationjs .paginationjs-go-input>input[type=text]{width:30px;height:28px;background:#fff;border-radius:3px;border:1px solid #aaa;padding:0;font-size:14px;text-align:center;vertical-align:baseline;outline:0;box-shadow:none;box-sizing:initial}.paginationjs .paginationjs-go-button>input[type=button]{min-width:40px;height:30px;line-height:28px;background:#fff;border-radius:3px;border:1px solid #aaa;text-align:center;padding:0 8px;font-size:14px;vertical-align:baseline;outline:0;box-shadow:none;color:#333;cursor:pointer;vertical-align:middle\9}.paginationjs.paginationjs-theme-blue .paginationjs-go-input>input[type=text],.paginationjs.paginationjs-theme-blue .paginationjs-pages li{border-color:#289de9}.paginationjs .paginationjs-go-button>input[type=button]:hover{background-color:#f8f8f8}.paginationjs .paginationjs-nav{height:30px;line-height:30px}.paginationjs .paginationjs-go-button,.paginationjs .paginationjs-go-input{margin-left:5px\9}.paginationjs.paginationjs-small{font-size:12px}.paginationjs.paginationjs-small .paginationjs-pages li>a{min-width:26px;height:24px;line-height:24px;font-size:12px}.paginationjs.paginationjs-small .paginationjs-pages li.active>a{height:26px;line-height:26px}.paginationjs.paginationjs-small .paginationjs-go-input{font-size:12px}.paginationjs.paginationjs-small .paginationjs-go-input>input[type=text]{width:26px;height:24px;font-size:12px}.paginationjs.paginationjs-small .paginationjs-go-button{font-size:12px}.paginationjs.paginationjs-small .paginationjs-go-button>input[type=button]{min-width:30px;height:26px;line-height:24px;padding:0 6px;font-size:12px}.paginationjs.paginationjs-small .paginationjs-nav{height:26px;line-height:26px;font-size:12px}.paginationjs.paginationjs-big{font-size:16px}.paginationjs.paginationjs-big .paginationjs-pages li>a{min-width:36px;height:34px;line-height:34px;font-size:16px}.paginationjs.paginationjs-big .paginationjs-pages li.active>a{height:36px;line-height:36px}.paginationjs.paginationjs-big .paginationjs-go-input{font-size:16px}.paginationjs.paginationjs-big .paginationjs-go-input>input[type=text]{width:36px;height:34px;font-size:16px}.paginationjs.paginationjs-big .paginationjs-go-button{font-size:16px}.paginationjs.paginationjs-big .paginationjs-go-button>input[type=button]{min-width:50px;height:36px;line-height:34px;padding:0 12px;font-size:16px}.paginationjs.paginationjs-big .paginationjs-nav{height:36px;line-height:36px;font-size:16px}.paginationjs.paginationjs-theme-blue .paginationjs-pages li>a{color:#289de9}.paginationjs.paginationjs-theme-blue .paginationjs-pages li>a:hover{background:#e9f4fc}.paginationjs.paginationjs-theme-blue .paginationjs-pages li.active>a{background:#289de9;color:#fff}.paginationjs.paginationjs-theme-blue .paginationjs-pages li.disabled>a:hover{background:0 0}.paginationjs.paginationjs-theme-blue .paginationjs-go-button>input[type=button]{background:#289de9;border-color:#289de9;color:#fff}.paginationjs.paginationjs-theme-green .paginationjs-go-input>input[type=text],.paginationjs.paginationjs-theme-green .paginationjs-pages li{border-color:#449d44}.paginationjs.paginationjs-theme-blue .paginationjs-go-button>input[type=button]:hover{background-color:#3ca5ea}.paginationjs.paginationjs-theme-green .paginationjs-pages li>a{color:#449d44}.paginationjs.paginationjs-theme-green .paginationjs-pages li>a:hover{background:#ebf4eb}.paginationjs.paginationjs-theme-green .paginationjs-pages li.active>a{background:#449d44;color:#fff}.paginationjs.paginationjs-theme-green .paginationjs-pages li.disabled>a:hover{background:0 0}.paginationjs.paginationjs-theme-green .paginationjs-go-button>input[type=button]{background:#449d44;border-color:#449d44;color:#fff}.paginationjs.paginationjs-theme-yellow .paginationjs-go-input>input[type=text],.paginationjs.paginationjs-theme-yellow .paginationjs-pages li{border-color:#ec971f}.paginationjs.paginationjs-theme-green .paginationjs-go-button>input[type=button]:hover{background-color:#55a555}.paginationjs.paginationjs-theme-yellow .paginationjs-pages li>a{color:#ec971f}.paginationjs.paginationjs-theme-yellow .paginationjs-pages li>a:hover{background:#fdf5e9}.paginationjs.paginationjs-theme-yellow .paginationjs-pages li.active>a{background:#ec971f;color:#fff}.paginationjs.paginationjs-theme-yellow .paginationjs-pages li.disabled>a:hover{background:0 0}.paginationjs.paginationjs-theme-yellow .paginationjs-go-button>input[type=button]{background:#ec971f;border-color:#ec971f;color:#fff}.paginationjs.paginationjs-theme-red .paginationjs-go-input>input[type=text],.paginationjs.paginationjs-theme-red .paginationjs-pages li{border-color:#c9302c}.paginationjs.paginationjs-theme-yellow .paginationjs-go-button>input[type=button]:hover{background-color:#eea135}.paginationjs.paginationjs-theme-red .paginationjs-pages li>a{color:#c9302c}.paginationjs.paginationjs-theme-red .paginationjs-pages li>a:hover{background:#faeaea}.paginationjs.paginationjs-theme-red .paginationjs-pages li.active>a{background:#c9302c;color:#fff}.paginationjs.paginationjs-theme-red .paginationjs-pages li.disabled>a:hover{background:0 0}.paginationjs.paginationjs-theme-red .paginationjs-go-button>input[type=button]{background:#c9302c;border-color:#c9302c;color:#fff}.paginationjs.paginationjs-theme-red .paginationjs-go-button>input[type=button]:hover{background-color:#ce4541}.paginationjs .paginationjs-pages li.paginationjs-next{border-right:1px solid #aaa\9}.paginationjs .paginationjs-go-input>input[type=text]{line-height:28px\9;vertical-align:middle\9}.paginationjs.paginationjs-big .paginationjs-pages li>a{line-height:36px\9}.paginationjs.paginationjs-big .paginationjs-go-input>input[type=text]{height:36px\9;line-height:36px\9}
				</style>
			</div>
		<?php
	}


	public function registration_content()
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

	public function scheduling_content()
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
		?>
		</div>
		<?php
	}

	public function user_privileges_content()
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

	public function pricing_content()
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
			<div class="iam-button iam-admin-submit-button">Save Changes</div><br />
			<div class="iam-csv-button iam-secondary-button">Generate CSV</div>
		</div>
		<?php
	}

	public function content()
	{
		global $wpdb;
		if ($this->schedule->type=='appointment') {
		?>
		<div class="wrap iam-main-menu-wrap">
			<h1 class="iam-admin-header">Settings</h1>

			<section class="iam-settings-container">
				<form accept-charset="utf-8" class="iam-settings-form">
					<table>
						<tbody>
							<tr>
								<td><h1>Misc Settings</h1><hr></td>
							</tr>
							<tr>
								<td><label>iPad Lock Code</label></td>
								<td><input type="number" class="iam-ipad-code" width="50" value="<?php echo get_setting_iam('ipad_code') ?>"></td>
							</tr>
							<tr>
								<td><h1>Email Notifications</h1></td>
							</tr>
							<tr>
								<td><label>Training Page Inquiry</label></td>
								<td><input type="text" class="iam-training-page-email" value="<?php echo get_setting_iam('training_email') ?>"></td>
							</tr>
							<tr>
								<td><label>Failure to Check Out</label></td>
								<td><input type="text" class="iam-late-reservations-email" value="<?php echo get_setting_iam('late_reservations_email') ?>"></td>
							</tr>
							<tr>
								<td><label>Reservations</label></td>
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
		} else if ($this->schedule->type=='rental') {
			if (get_setting_iam(LATE_CHARGE_FEE_KEY)===false)
				update_settings_iam(LATE_CHARGE_FEE_KEY,10);
			?>
			<div class="wrap iam-main-menu-wrap">
				<h1 class="iam-admin-header">Settings</h1>
				<section class="iam-settings-container">
					<form accept-charset="utf-8" class="iam-settings-form">
						<table>
							<tbody>
								<tr>
									<td><h1>Misc Settings</h1></td>
								</tr>
								<tr>
									<td><label>Late Charge Fee: <input value="<?php echo get_setting_iam(LATE_CHARGE_FEE_KEY); ?>" type="number" class="iam-late-charge-fee"></label></td>
								</tr>

								<tr>
									<td><h1>Email Notifications</h1></td>
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

					<h1>Rental Types</h1>
					<form accept-charset="utf-8" class="iam-rental-type-form">
						<table>
							<tbody>
									<?php
										$rental_types = $wpdb->get_results(RENTAL_ALL_QUERY);
										if (count($rental_types)==0) {
											echo '<tr class="iam-no-data-row"><td>No data found!</td></tr>';
										}
										foreach ($rental_types as $row) {
											$r = json_decode($row->Meta_Value);
											echo '<tr data-id="'.$r->id.'"><td><label>Label: <input type="text" class="rental-label" value="'.$r->label.'"></label></td><td><label>Duration (in days): <input type="number" class="rental-duration" value="'.$r->duration.'"></label></td><td><i class="iam-delete-rental-type fa fa-close fa-3"></i></td></tr>';
										}
										?>
							</tbody>
						</table>
						<div class="iam-secondary-button iam-add-rental-type">add new</div>
						<div class="iam-rental-types-submit iam-save iam-button"></div>
					</form>
				</section>
				<hr>
				<h3>Powered by &nbsp;&nbsp; <img width="250" src="<?php echo plugins_url( 'assets/qlogo.png', dirname(__FILE__) ); ?>" alt="Qiupura Logo"></h3>
			</div>
			<?php
		}
	}

}
