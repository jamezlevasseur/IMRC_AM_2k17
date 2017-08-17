<?php

/**
*
*/
class IAM_Checkout_Page
{

	public static function update_checkout_table () {
		global $wpdb;
		//appointment constants
		define(APPOINTMENT_EXPIRED, 'expired');
		define(APPOINTMENT_EXPIRING_SOON, 'expiring');
		define(APPOINTMENT_EARLY, 'early');
		define(APPOINTMENT_CAN_CHECK_IN, 'cancheckin');
		define(APPOINTMENT_CHECKED_IN, 'checkedin');

		date_default_timezone_set(IMRC_TIME_ZONE);
		$today = date("Y-m-d 00:00:00");
		$tomorrow = new DateTime('tomorrow');
		$tomorrow = $tomorrow->format('Y-m-d 00:00:00');
		$validReservationsEchoed = false;
		$reservation_results = $wpdb->get_results("SELECT * FROM ".IAM_RESERVATION_TABLE." WHERE Start_Time >= '$today' AND Start_Time <= '$tomorrow' AND Checked_Out IS NULL");
		$reservation_not_checked_out_results = $wpdb->get_results("SELECT * FROM ".IAM_RESERVATION_TABLE." WHERE Start_Time < '$today' AND Checked_Out IS NULL AND Checked_In IS NOT NULL ");
		$no_shows = [];
		$html = '';
		foreach ($reservation_results as $row) {
			$iam_id = $row->IAM_ID;
			$equip_id = $row->Equipment_ID;
			if ($row->Is_Room) {
				continue;
			}
			$equip_results = $wpdb->get_results("SELECT Name,Root_Tag FROM ".IAM_EQUIPMENT_TABLE." WHERE Equipment_ID='$equip_id'");
			if ($equip_results[0]->Root_Tag!='Fab Lab') {
				continue;
			}
			$username = $wpdb->get_results("SELECT WP_Username FROM ".IAM_USERS_TABLE." WHERE IAM_ID='$iam_id'")[0]->WP_Username;
			$equip_name = $equip_results[0]->Name;
			$date = explode(' ', $row->Start_Time)[0];
			$time1 = DateTime::createFromFormat('H:i:s',explode(' ', $row->Start_Time)[1]);
			$time2 = DateTime::createFromFormat('H:i:s',explode(' ', $row->End_Time)[1]);
			$time = $time1->format('g:i a').' - '.$time2->format('g:i a');
			$dtz = new DateTimeZone(IMRC_TIME_ZONE);
			$rightnow = new DateTime("now", $dtz);
			$time_of_appointment = new DateTime($row->Start_Time, $dtz);
			//if the appointment has already started
			$appointment_status = APPOINTMENT_EARLY;
			$appointment_lateness = 0;

			if ($row->Status==ACTIVE) {

				$options = '<button type="button" class="iam-check-out-button" data-nid="'.iam_output($row->NI_ID).'"></button>';

			} else if ($row->Status==NO_SHOW) {

				$appointment_status = APPOINTMENT_EXPIRED;

			} else if ($row->Status==UPCOMING) {
				$minutes_after_limit = 15;

				if ($rightnow>$time_of_appointment) {
					$diff = $rightnow->diff($time_of_appointment);
					if (($diff->h>0 || $diff->i>=$minutes_after_limit) && $time_of_appointment<$rightnow) {
						$appointment_status = APPOINTMENT_EXPIRED;
					} else if ($diff->i<$minutes_after_limit) {
						$appointment_status = APPOINTMENT_EXPIRING_SOON;
						$appointment_lateness = $diff->i;
						$options = '<button type="button" class="iam-check-in-button" data-nid="'.iam_output($row->NI_ID).'"></button>';
					}
				} else {
					$diff = $rightnow->diff($time_of_appointment);
					$appointment_status = APPOINTMENT_CAN_CHECK_IN;
					$options = '<button type="button" class="iam-check-in-button" data-nid="'.iam_output($row->NI_ID).'"></button>';
				}

			}
			if ($appointment_status==APPOINTMENT_EXPIRED) {
				$no_shows[] = $row->Reservation_ID;
			} else {
				$validReservationsEchoed = true;
				$html.='<tr><td class="iam-checkout-username">'.iam_output($username).'</td><td>'.iam_output($equip_name).'</td><td>'.iam_output($date).'</td><td>'.iam_output($time).'</td><td>'.$options.'</td></tr>';
			}
		}
		for ($i=0; $i < count($no_shows); $i++) {

			$wpdb->query($wpdb->prepare("UPDATE ".IAM_RESERVATION_TABLE." SET Status=".NO_SHOW." WHERE Reservation_ID=%d",$no_shows[$i]));
		}
		if (!$validReservationsEchoed) {
			return '<tr><td>NO</td><td>RESULTS</td><td>WERE</td><td>FOUND</td><td>:(</td></tr>';
		} else {
			return $html;
			exit;
		}
	}

	public static function get_old_reservations()
	{
		global $wpdb;
		date_default_timezone_set(IMRC_TIME_ZONE);
		$today = date("Y-m-d 00:00:00");
		$validReservationsEchoed = false;
		$reservation_not_checked_out_results = $wpdb->get_results("SELECT * FROM ".IAM_RESERVATION_TABLE." WHERE Start_Time < '$today' AND Checked_Out IS NULL AND Checked_In IS NOT NULL ORDER BY Reservation_ID DESC");
		$html = '';
		foreach ($reservation_not_checked_out_results as $row) {
			$iam_id = $row->IAM_ID;
			$equip_id = $row->Equipment_ID;
			if ($row->Is_Room) {
				continue;
			}
			$equip_results = $wpdb->get_results("SELECT Name,Root_Tag FROM ".IAM_EQUIPMENT_TABLE." WHERE Equipment_ID='$equip_id'");
			if ($equip_results[0]->Root_Tag!='Fab Lab') {
				continue;
			}
			$username = $wpdb->get_results("SELECT WP_Username FROM ".IAM_USERS_TABLE." WHERE IAM_ID='$iam_id'")[0]->WP_Username;
			$equip_name = $equip_results[0]->Name;
			$date = explode(' ', $row->Start_Time)[0];
			$time1 = DateTime::createFromFormat('H:i:s',explode(' ', $row->Start_Time)[1]);
			$time2 = DateTime::createFromFormat('H:i:s',explode(' ', $row->End_Time)[1]);
			$time = $time1->format('g:i a').' - '.$time2->format('g:i a');
			$options = '<button type="button" class="iam-check-out-button" data-nid="'.iam_output($row->NI_ID).'"></button>';
			$html.= '<tr><td class="iam-checkout-username">'.iam_output($username).'</td><td>'.iam_output($equip_name).'</td><td>'.iam_output($date).'</td><td>'.iam_output($time).'</td><td>'.$options.'</td></tr>';
			if ($row->Late_Notification_Sent==0) {
				$res_id = $row->Reservation_ID;
				$wpdb->query("UPDATE ".IAM_RESERVATION_TABLE." SET Late_Notification_Sent='1', Status=".NO_PAY." WHERE Reservation_ID='$res_id'");
				$user_email = $wpdb->get_results("SELECT user_email FROM ".$wpdb->prefix."users WHERE user_login='$username'")[0]->user_email;
				iam_mail(get_setting_iam('late_reservations_email'),$username.' didn\'t check out','User '.$username.' did not check out for their reservation on '.$date.' '.$time.' for the '.$equip_name.'. An email has been sent to them alerting them of the issue.');
				iam_mail($user_email,'You didn\'t check out!','Greetings, User '.$username.' did not check out for their reservation on '.$date.' '.$time.' for the '.$equip_name.'. An email has been sent to a lab tech alerting them of the issue. Please resolve this as soon as possible.');
			}
		}
		return $html;
	}

	public function update_appointment()
	{
		global $wpdb;
		if ($_POST['status']==ACTIVE && is_numeric($_POST['status'])) {
			date_default_timezone_set(IMRC_TIME_ZONE);
			$rightnow = date('Y-m-d H:i:s');
			$q = $wpdb->query($wpdb->prepare("UPDATE ".IAM_RESERVATION_TABLE." SET Status=%d,Checked_In=%s WHERE NI_ID=%s",$_POST['status'],$rightnow,IAM_Sec::textfield_cleaner($_POST['nid'])));
			iam_validate_query($q);
			iam_respond(SUCCESS);
		}
		iam_throw_error(INVALID_INPUT_EXCEPTION.' ch-upa-1');
	}

	public function makeEquipmentScheduleList()
	{
		global $wpdb;
		$fab_lab_tags = [$wpdb->get_results($wpdb->prepare("SELECT Tag_ID FROM ".IAM_TAGS_TABLE." WHERE Tag=%s",'Fab Lab'))[0]->Tag_ID];
		$unchecked_tags = ['Fab Lab'];
		while (count($unchecked_tags)) {
			$fab_lab_results = $wpdb->get_results($wpdb->prepare("SELECT Tag_ID,Tag FROM ".IAM_TAGS_TABLE." WHERE Parent=%s",array_shift($unchecked_tags)));
			foreach ($fab_lab_results as $row) {
				$unchecked_tags[] = $row->Tag;
				$fab_lab_tags[] = $row->Tag_ID;
			}
		}
		$equipment_to_show = [];
		for ($i=0; $i < count($fab_lab_tags); $i++) {
			$current_tag = $fab_lab_tags[$i];
			$equip_id_results = $wpdb->get_results("SELECT Equipment_ID FROM ".IAM_TAGS_EQUIPMENT_TABLE." WHERE Tag_ID='$current_tag'");
			foreach ($equip_id_results as $row) {
				$equip_results = $wpdb->get_results($wpdb->prepare("SELECT Name,NI_ID FROM ".IAM_EQUIPMENT_TABLE." WHERE Equipment_ID=%d",$row->Equipment_ID))[0];
				$equipment_to_show[$equip_results->Name] = $equip_results->NI_ID;
			}
		}
		ksort($equipment_to_show);
		$html = '';
		foreach ($equipment_to_show as $key => $value) {
			if (trim($key)!='') {
				$html.= '<li data-nid="'.iam_output($value).'">'.iam_output($key).'</li>';
			}
		}
		return $html;
	}

	public static function getUnlocked () {
		$html = '
		<div class="iam-checkout">

			<div class="iam-checkout-area">
				<img class="iam-res-note" src="'.plugins_url( 'assets/resnote.png', dirname(__FILE__) ).'" alt="reservation note">
				<div class="iam-secondary-button iam-checkout-refresh">Refresh</div>
				<h1>Todays Reservations</h1>
				<table>
					<thead>
						<tr>
							<th>Name</th>
							<th>Equipment</th>
							<th>Date</th>
							<th>Time</th>
							<th>Options</th>
						</tr>
					</thead>
					<tbody>
							'. IAM_Checkout_Page::update_checkout_table() .'
					</tbody>
				</table>
				<p style="color:red;">Note: Reservations not checked in after 15 minutes will be REMOVED to grant access to others.</p>
				<h1 class="iam-old-reservations">Past Reservations &nbsp; <i class="iam-caret fa fa-caret-right fa-3"></i></h1>
				<section class="iam-not-checked-out-container">
					<table>
						<thead>
							<tr>
								<th>Name</th>
								<th>Equipment</th>
								<th>Date</th>
								<th>Time</th>
								<th>Options</th>
							</tr>
						</thead>
						<tbody>
								'. IAM_Checkout_Page::get_old_reservations() .'
						</tbody>
					</table>
				</section>
			</div>
			<div class="iam-equipment-schedule iam-ninja">
				<div class="iam-make-res-container">
				<h1>Make a Reservation</h1>
				<label>Equipment:</label>
				<div class="iam-to-reserve">select from list</div>
				<label>Date:</label>
				<input
                    class="iam-datepicker"
                    type="date"
                    name="date"
                    >
                <label>Reservation Begin:</label>
                <input
                    class="iam-from-timepicker"
                    type="time"
                    name="time"
                    >
                <label>Reservation End:</label>
                <input
                    class="iam-to-timepicker"
                    type="time"
                    name="time"
                    >
                <button type="button" class="iam-button iam-reserve-new-equipment">reserve</button>
                </div>
				<ul class="iam-equipment-schedule-list">
					'. IAM_Checkout_Page::makeEquipmentScheduleList() .'
				</ul>
				<div class="iam-cal">

				</div>
			</div>
		</div>';
		return $html;
	}

	public static function get()
	{
		?>
		<div class="iam-checkout">
			<input class="iam-data iam-ninja" data-timestamp="<?php echo get_setting_iam('ipad_code_updated'); ?>">
			<input class="iam-checkout-lock" type="password" placeholder="Enter Admin Password">
			<input type="submit" class="iam-checkout-lock-submit">
		</div>
		<?php
	}

}
