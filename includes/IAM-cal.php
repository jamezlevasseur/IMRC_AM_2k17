<?php

/**
*
*/
class IAM_Cal
{
	public static function update_equipment_cal()
	{
		global $wpdb;
		/*
		if (isset($_POST['new_events'])) {
			foreach ($_POST['new_events'] as $key => $value) {

			}
		}*/
		if (isset($_POST['modified'])) {
			foreach ($_POST['modified'] as $key => $value) {
				if (in_array($key, $_POST['to_delete']))
					continue;
				$reservation_results = $wpdb->get_results($wpdb->prepare("SELECT IAM_ID, Equipment_ID, Start_Time FROM ".IAM_RESERVATION_TABLE." WHERE NI_ID=%s", IAM_Sec::textfield_cleaner($key)));
				$iam_id = $reservation_results[0]->IAM_ID;
				$equip_id = $reservation_results[0]->Equipment_ID;
				$wp_id = $wpdb->get_results($wpdb->prepare("SELECT WP_ID FROM ".IAM_USERS_TABLE." WHERE IAM_ID=%d",$iam_id))[0]->WP_ID;
				$equip_name = $wpdb->get_results($wpdb->prepare("SELECT Name FROM ".IAM_EQUIPMENT_TABLE." WHERE Equipment_ID=%d",$equip_id))[0]->Name;
				$wpdb->query($wpdb->prepare("UPDATE ".IAM_RESERVATION_TABLE." SET Start_Time=%s, End_Time=%s WHERE NI_ID=%s",$value['start'],$value['end'],$key));
				if ($_POST['sendEmails']=='true') {
					$reason = $_POST['reason']=='' ? '' : ' Reason given: '.$_POST['reason'];

					$old_time = DateTime::createFromFormat('Y-m-d H:i:s',$reservation_results[0]->Start_Time);
					$old_time = $old_time->format('M d, Y \a\t g:i a');

					$new_start = DateTime::createFromFormat('Y-m-d H:i:s',$value['start']);
					$new_start = $new_start->format('M d, Y \a\t g:i a');

					$new_end = DateTime::createFromFormat('Y-m-d H:i:s',$value['end']);
					$new_end = $new_end->format('M d, Y \a\t g:i a');
					iam_mail(get_userdata($wp_id)->user_email, 'Your IMRC reservation', 'Your reservation for '.$equip_name.' at '.$old_time.' has been changed. The new time is from '.$new_start.' to '.$new_end.'.'.$reason,'Failed to send update appointment email');
				}
			}
		}
		if (isset($_POST['to_delete'])) {
			for ($i=0; $i < count($_POST['to_delete']); $i++) {
				$ni_id = IAM_Sec::textfield_cleaner($_POST['to_delete'][$i]);
				$reservation_results = $wpdb->get_results($wpdb->prepare("SELECT IAM_ID, Equipment_ID, Start_Time FROM ".IAM_RESERVATION_TABLE." WHERE NI_ID=%s", $ni_id));
				$iam_id = $reservation_results[0]->IAM_ID;
				$equip_id = $reservation_results[0]->Equipment_ID;
				$wp_id = $wpdb->get_results($wpdb->prepare("SELECT WP_ID FROM ".IAM_USERS_TABLE." WHERE IAM_ID=%d",$iam_id))[0]->WP_ID;
				$equip_name = $wpdb->get_results($wpdb->prepare("SELECT Name FROM ".IAM_EQUIPMENT_TABLE." WHERE Equipment_ID=%d",$equip_id))[0]->Name;
				$start_time = $reservation_results[0]->Start_Time;
				$wpdb->query($wpdb->prepare("DELETE FROM ".IAM_RESERVATION_TABLE." WHERE NI_ID=%s", $ni_id));
				if ($_POST['sendEmails']=='true') {
					$reason = $_POST['reason']=='' ? '' : ' Reason given: '.$_POST['reason'];
					$old_time = DateTime::createFromFormat('Y-m-d H:i:s',$reservation_results[0]->Start_Time);
					$old_time = $old_time->format('M d, Y \a\t g:i a');
					iam_mail(get_userdata($wp_id)->user_email, 'Your IMRC reservation', 'Your reservation for '.$equip_name.' at '.$old_time.' has been cancelled by an IMRC administrator.'.$reason,'Failed to send delete appointment email');
				}
			}
		}

		iam_respond(SUCCESS,implode(",",$_POST['to_delete']),IAM::$status_message);
	}

	public static function get_business_hours()
	{
		global $wpdb;
		if (isset($_GET['facility'])) {
			$facility = IAM_Sec::textfield_cleaner(str_replace(' ', '_', $_GET['facility']));
		} else if (isset($_GET['equip_name'])) {
			$equip_name = str_replace('_', ' ', $_GET['equip_name']);
			$facility = $wpdb->get_results($wpdb->prepare("SELECT Root_Tag FROM ".IAM_EQUIPMENT_TABLE." WHERE Name=%s",IAM_Sec::textfield_cleaner($equip_name)))[0]->Root_Tag;
		} else {exit('insufficient data');}

		$tag_id = $wpdb->get_results($wpdb->prepare("SELECT Tag_ID FROM ".IAM_TAGS_TABLE." WHERE Tag=%s",$facility))[0]->Tag_ID;
		iam_respond(SUCCESS,$wpdb->get_results($wpdb->prepare("SELECT Appointment_Business_Hours FROM ".IAM_FACILITY_TABLE." WHERE Tag_ID=%d",$tag_id))[0]->Appointment_Business_Hours);
	}

	public static function get_irregular_hours_cal($equip_name) {
		global $wpdb;
		if (!isset($_GET['facility'])) {
			if (!isset($_GET['equip_name'])) {
				exit('insufficient data');
			}
			$equip_name = str_replace('_', ' ', $_GET['equip_name']);
			$facility = $wpdb->get_results($wpdb->prepare("SELECT Root_Tag FROM ".IAM_EQUIPMENT_TABLE." WHERE Name=%s",IAM_Sec::textfield_cleaner($equip_name)))[0]->Root_Tag;
			$facility = str_replace(' ', '_', $facility);
		} else {
			$facility = $_GET['facility'];
		}
		$meta_key = $facility.'_irregular_hours_event';
		$meta_results = $wpdb->get_results($wpdb->prepare("SELECT Meta_Value FROM ".IAM_META_TABLE." WHERE Meta_Key=%s",$meta_key));
		$events = [];
		foreach ($meta_results as $row) {
			$events[] = json_decode($row->Meta_Value);
		}
		//no respond
		echo json_encode($events);
		exit;
	}

	public static function get_irregular_hours_array($equip_name) {
		global $wpdb;
		if (!isset($_GET['facility'])) {
			if (!isset($_GET['equip_name'])) {
				exit('insufficient data');
			}
			$equip_name = str_replace('_', ' ', $_GET['equip_name']);
			$facility = $wpdb->get_results($wpdb->prepare("SELECT Root_Tag FROM ".IAM_EQUIPMENT_TABLE." WHERE Name=%s",IAM_Sec::textfield_cleaner($equip_name)))[0]->Root_Tag;
			$facility = str_replace(' ', '_', $facility);
		} else {
			$facility = $_GET['facility'];
		}
		$meta_key = $facility.'_irregular_hours_event';
		$meta_results = $wpdb->get_results($wpdb->prepare("SELECT Meta_Value FROM ".IAM_META_TABLE." WHERE Meta_Key=%s",$meta_key));
		$events = [];
		foreach ($meta_results as $row) {
			$events[] = json_decode($row->Meta_Value);
		}
		return $events;
	}

	public static function get_cal_for_equipment($item_name)
	{
		$is_admin = isset($_GET['is']);
		$equipment_in_title = isset($_GET['descriptive']);
		$get_all_reservations = isset($_GET['all']);
		$user = array_key_exists('user',$_GET) ? $_GET['user'] : null;
		global $wpdb;

		$equip_result = $wpdb->get_results("SELECT Equipment_ID FROM ".IAM_EQUIPMENT_TABLE." WHERE Name='$item_name'");

		if ($equip_result) {
			$equip_id = $equip_result[0]->Equipment_ID;

			date_default_timezone_set(IMRC_TIME_ZONE);
			$weekago = date("Y-m-d 00:00:00", strtotime('-1 week'));
			$date_condition = $get_all_reservations ? " " : " AND Start_Time > '$weekago' ";
			$noshow_condition = $is_admin ? "" : " AND Status!=".NO_SHOW;
			$res_result = $wpdb->get_results($wpdb->prepare("SELECT * FROM ".IAM_RESERVATION_TABLE." WHERE Equipment_ID=%d AND Is_Room='0'".$date_condition.$noshow_condition, $equip_id));

			$formatted_events = [];
			if(res_result===null && gettype($res_result)!='array') {
				iam_throw_error('BAD QUERY');
			} else {
				foreach ($res_result as $row) {
					$title;
					if ($is_admin) {
						$uinfo = $wpdb->get_results($wpdb->prepare("SELECT WP_ID,WP_Username FROM ".IAM_USERS_TABLE." WHERE IAM_ID=%d",$row->IAM_ID));
						$title = $uinfo[0]->WP_Username;
						$wp_id = $uinfo[0]->WP_ID;
						$email = $wpdb->get_results($wpdb->prepare("SELECT user_email FROM ".$wpdb->prefix."users WHERE user_login=%s",$title))[0]->user_email;
						if ($equipment_in_title) {
							$title = $title.' using '.$item_name;
						}
					} else {
						$title = 'Existing Reservation';
					}
					if ($is_admin) {
						$RES_STATUS_CLASS_DICT = [0=>'upcoming',1=>'active',2=>'no-show',3=>'completed',4=>'no-pay',5=>'is-late',6=>'was-late'];
						$formatted_events[] = ['nid'=>$row->NI_ID, 'fullname'=> get_full_name($wp_id), 'title'=>$title, 'start'=>$row->Start_Time, 'end'=>$row->End_Time,'email'=>$email,'equipment'=>$item_name,'status'=>$RES_STATUS_CLASS_DICT[$row->Status]];
						if (array_key_exists('allDay', $_GET)) {
							$formatted_events[count($formatted_events)-1]['allDay'] = true;
						}
					} else {
						$formatted_events[] = ['constraint'=> 'businessHours','allDay'=>false, 'nid'=>$row->NI_ID, 'title'=>$title, 'start'=>$row->Start_Time, 'end'=>$row->End_Time];
					}
				}
				if (isset($_GET['get_irregular_hours'])) {
					$_GET['equip_name'] = $item_name;
					$formatted_events = array_merge($formatted_events,IAM_Cal::get_irregular_hours_array());
				}
				//do not use respond for fullcal
				return $formatted_events;
			}
		}
	}

	public static function get_approval_hours()
	{
		global $wpdb;
		$name = IAM_Sec::textfield_cleaner($_GET['name']);
		$id = $wpdb->get_results($wpdb->prepare("SELECT Room_ID FROM ".IAM_ROOM_TABLE." WHERE Name=%s",$name))[0]->Room_ID;
		$id = $id.'_business_hours';
		$r = $wpdb->get_results($wpdb->prepare("SELECT Meta_Value FROM ".IAM_META_TABLE." WHERE Meta_Key=%s",$id));
		if (count($r)==0) {
			$wpdb->query($wpdb->prepare("INSERT INTO ".IAM_META_TABLE." (Meta_Key,Meta_Value) VALUES (%s,'[]')",$id));
			$json = '[]';
		} else {
			$json = $r[0]->Meta_Value;
		}
		echo $json;
		exit;
	}

	public static function get_equipment_cal()
	{

		if (isset($_GET['names'])) {
			$names = explode('~!~', $_GET['names']);
			//print_r($names);exit;
			if (gettype($names)!='array') {
				iam_throw_error(INVALID_INPUT_EXCEPTION);
			}
			$a = [];
			for ($i=0; $i < count($names); $i++) {
				if (trim($names[$i])=='') {
					continue;
				}
				$item_name = str_replace('_', ' ', IAM_Sec::textfield_cleaner( $names[$i] ));

				$item_events = IAM_Cal::get_cal_for_equipment($item_name);
				$item_events = $item_events===null ? [] : $item_events;
				$a = array_merge($a,$item_events);
			}

			echo json_encode($a);
			exit;
		} else if (isset($_GET['name'])) {
			$item_name = str_replace('_', ' ', IAM_Sec::textfield_cleaner( $_GET['name'] ));
			echo json_encode(IAM_Cal::get_cal_for_equipment($item_name));
			exit;
		}


	}

}
