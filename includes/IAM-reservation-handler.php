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
		$equip_name = str_replace('_', ' ', IAM_Sec::textfield_cleaner($_POST['equipment']));
		$root_tag = '';

		$equip_results = $wpdb->get_results($wpdb->prepare("SELECT Equipment_ID,Root_Tag FROM ".IAM_EQUIPMENT_TABLE." WHERE Name=%s",$equip_name));
		$root_tag = $equip_results[0]->Root_Tag;
		$equip_id = $equip_results[0]->Equipment_ID;

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

			$wpdb->query($wpdb->prepare("INSERT INTO ".IAM_RESERVATION_TABLE." (IAM_ID,NI_ID,Equipment_ID,Start_Time,End_Time,Comment) VALUES (%d,%s,%d,%s,%s,%s) ",$iam_id,$ni_id,$equip_id,$start,$end,$comment));

			Facility::send_facility_new_res_email($root_tag,
																						[ 'equipment'=>$equip_name,
																							'username'=>$user,
																							'start'=>$format_start,
																							'end'=>$format_end
																						]);

		}
		iam_respond(SUCCESS,'',IAM::$status_message);
	}
}
