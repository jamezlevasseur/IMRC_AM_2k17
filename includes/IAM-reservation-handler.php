<?php

/**
*
*/
class IAM_Reservation_Handler
{

	public static function run()
	{
		global $wpdb;

		$events = $_POST['events'];
		$equip_name_or_id = str_replace('_', ' ', IAM_Sec::textfield_cleaner($_POST['equipment']));
		$root_tag = '';

		$query_start = "SELECT Equipment_ID,Name,Root_Tag FROM ".IAM_EQUIPMENT_TABLE;

		$equip_results = $wpdb->get_results($wpdb->prepare($query_start." WHERE Name=%s",$equip_name_or_id));

		if (empty($equip_results)) { //might be an id
			$equip_results = $wpdb->get_results($wpdb->prepare($query_start." WHERE Equipment_ID=%s",$equip_name_or_id));

			if (empty($equip_results))
				iam_throw_error("Could not checkout equipment, invalid name or id supplied.");
		}

		$equip_name = $equip_results[0]->Name;
		$root_tag = $equip_results[0]->Root_Tag;
		$equip_id = $equip_results[0]->Equipment_ID;

		$facility = ezget("SELECT Schedule FROM ".IAM_FACILITY_TABLE." WHERE Name=%s",$root_tag)[0];
		$scheduling = json_decode($facility->Schedule);
		if ($scheduling->type=='rental')
			$late_check_time = json_decode($facility->Schedule)->late_check_time;
		else
			$late_check_time = null;

		for ($i=0; $i < count($events); $i++) {
			$user = IAM_Sec::textfield_cleaner($events[$i]['user']);
			$comment = IAM_Sec::textfield_cleaner($events[$i]['comment']);
			$user_result = $wpdb->get_results($wpdb->prepare("SELECT IAM_ID FROM ".IAM_USERS_TABLE." WHERE WP_Username=%s",$user));
			$iam_id = $user_result[0]->IAM_ID;
			$start = IAM_Sec::is_date($events[$i]['start']);
			$end = IAM_Sec::is_date($events[$i]['end']);
			$ni_id = md5(uniqid());
			$ni_id = strlen($ni_id)>=200 ? substr($ni_id, 0, 195) : $ni_id;
			$format_start = DateTime::createFromFormat('Y-m-d H:i:s',$start);//m-d-Y g:i a
			$format_end = DateTime::createFromFormat('Y-m-d H:i:s',$end);
			$format_start = $format_start->format('M d, Y \a\t g:i a');
			$format_end = $format_end->format('M d, Y \a\t g:i a');

			if (empty($equip_id) || empty($iam_id) || empty($ni_id)) {
				send_to_debug_file("======== ERROR WHEN CHECKING OUT EQUIPMENT ========");
				send_to_debug_file("One of the follow is an invalid value:");
				send_to_debug_file("Equipment ID: $equip_id");
				send_to_debug_file("User ID: $iam_id");
				send_to_debug_file("NI ID: $ni_id");
				iam_throw_error("ERROR WHEN CHECKING OUT EQUIPMENT");
			}

			$res_prepared_statement = $wpdb->prepare("INSERT INTO ".IAM_RESERVATION_TABLE." (IAM_ID,NI_ID,Equipment_ID,Start_Time,End_Time,Comment) VALUES (%d,%s,%d,%s,%s,%s) ",$iam_id,$ni_id,$equip_id,$start,$end,$comment);

			send_to_log_file("======== Reservation Made ========");
			send_to_log_file("$user");
			send_to_log_file("$res_prepared_statement");

			$wpdb->query($res_prepared_statement);

			Facility::send_facility_new_res_email($root_tag,
																						[ 'equipment'=>$equip_name,
																							'username'=>$user,
																							'start'=>$format_start,
																							'end'=>$format_end,
																							'datetime'=>$format_start,
																							'comment'=>$comment
																						]);

		}
		iam_respond(SUCCESS,'',IAM::$status_message);
	}
}
