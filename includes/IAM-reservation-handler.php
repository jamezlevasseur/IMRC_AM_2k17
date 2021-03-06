<?php 

/**
* 
*/
class IAM_Reservation_Handler
{
	
	public static function run()
	{
		global $wpdb;
		$_POST['room'] = isset($_POST['room']) ? $_POST['room'] : 0;
		if (!is_numeric($_POST['room'])) {
			iam_throw_error(INVALID_INPUT_EXCEPTION.' rh1');
		}
		$events = $_POST['events'];
		$equip_name = str_replace('_', ' ', IAM_Sec::textfield_cleaner($_POST['equipment'])); 
		$root_tag = '';
		if ($_POST['room']) {
			$equip_results = $wpdb->get_results($wpdb->prepare("SELECT Room_ID FROM ".IAM_ROOM_TABLE." WHERE Name=%s",$equip_name));
			iam_validate_get_results($equip_results);
			$equip_id = $equip_results[0]->Room_ID;
		} else {
			$equip_results = $wpdb->get_results($wpdb->prepare("SELECT Equipment_ID,Root_Tag FROM ".IAM_EQUIPMENT_TABLE." WHERE Name=%s",$equip_name));
			$root_tag = $equip_results[0]->Root_Tag;
			$equip_id = $equip_results[0]->Equipment_ID;
		}
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

			if ($_POST['room']) {
				$wpdb->query($wpdb->prepare("INSERT INTO ".IAM_RESERVATION_TABLE." (IAM_ID,NI_ID,Equipment_ID,Start_Time,End_Time,Is_Room,Comment) VALUES (%d,%s,%d,%s,%s,1,%s) ",$iam_id,$ni_id,$equip_id,$start,$end,$comment));
				
				iam_mail(get_setting_iam('rooms_email'),'A New IMRC Rooms Reservation','A new reservation for the '.$equip_name.' has been made for '.$format_start.' to '.$format_end.' by user: '.$user,'Failed to send notification.');
			} else {
				$wpdb->query($wpdb->prepare("INSERT INTO ".IAM_RESERVATION_TABLE." (IAM_ID,NI_ID,Equipment_ID,Start_Time,End_Time,Comment) VALUES (%d,%s,%d,%s,%s,%s) ",$iam_id,$ni_id,$equip_id,$start,$end,$comment));
				if ($root_tag=='Equipment Room') {
					iam_mail(get_setting_iam('equipment_room_email'),'A New IMRC Equipment Room Reservation','A new reservation for the '.$equip_name.' has been made for '.$format_start.' to '.$format_end.' by user: '.$user,'Failed to send notification.');
				} else if ($root_tag=='Fab Lab') {
					iam_mail(get_setting_iam('fab_lab_email'),'A New IMRC Fab Lab Reservation','A new reservation for the '.$equip_name.' has been made for '.$format_start.' to '.$format_end.' by user: '.$user,'Failed to send notification.');
				}
			}
		}
		iam_respond(SUCCESS,'',IAM::$status_message);
	}
}
