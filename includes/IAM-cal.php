<?php

/**
*
*/
class IAM_Cal
{

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

	public static function get_irregular_hours_cal() {
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

	public static function get_cal_for_equipment($item_name, $param_array)
	{
		$is_admin = isset($param_array['is']);
		$get_all_reservations = isset($param_array['all']);

		global $wpdb;

		$equip_result = $wpdb->get_results("SELECT Equipment_ID FROM ".IAM_EQUIPMENT_TABLE." WHERE Name='$item_name'");

		if ($equip_result) {
			$equip_id = $equip_result[0]->Equipment_ID;

			date_default_timezone_set(IMRC_TIME_ZONE);
			$monthago = short_res_period();
			$date_condition = $get_all_reservations ? " " : " AND Start_Time > '$monthago' ";
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
		if (isset($_GET['name'])) {
			$item_name = str_replace('_', ' ', IAM_Sec::textfield_cleaner( $_GET['name'] ));
			echo json_encode(IAM_Cal::get_cal_for_equipment($item_name, $_GET));
			exit;
		}
	}

}
