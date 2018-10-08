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
		$all_day = isset($param_array['allDay']);

		global $wpdb;

		$equip_result = $wpdb->get_results("SELECT Equipment_ID,Rental_Type,Root_Tag FROM ".IAM_EQUIPMENT_TABLE." WHERE Name='$item_name'");

		if (empty($equip_result)) {
			//it might be an ID
			$equip_result = $wpdb->get_results("SELECT Equipment_ID,Rental_Type,Root_Tag FROM ".IAM_EQUIPMENT_TABLE." WHERE Equipment_ID='$item_name'");
		}

		if ($equip_result) {
			$equip_id = $equip_result[0]->Equipment_ID;
			date_default_timezone_set(IMRC_TIME_ZONE);
			$monthago = short_res_period();
			$date_condition = $get_all_reservations ? " " : " AND Start_Time > '$monthago' ";
			$noshow_condition = $is_admin ? "" : " AND Status!=".NO_SHOW;
			$res_result = $wpdb->get_results($wpdb->prepare("SELECT * FROM ".IAM_RESERVATION_TABLE." WHERE Equipment_ID=%d AND Is_Room='0'".$date_condition.$noshow_condition, $equip_id));
			$formatted_events = [];
			if($res_result===null && gettype($res_result)!='array') {
				iam_throw_error('BAD QUERY');
			} else {
				foreach ($res_result as $row) {
					$title;
					if ($is_admin) {
						$uinfo = $wpdb->get_results($wpdb->prepare("SELECT WP_ID,WP_Username FROM ".IAM_USERS_TABLE." WHERE IAM_ID=%d",$row->IAM_ID));
						if (empty($uinfo)) {
							continue;
						}
						$title = $uinfo[0]->WP_Username;
						$wp_id = $uinfo[0]->WP_ID;
						$email = $wpdb->get_results($wpdb->prepare("SELECT user_email FROM ".$wpdb->prefix."users WHERE user_login=%s",$title))[0]->user_email;
					} else {
						$title = 'Existing Reservation';
					}
					if ($is_admin) {
						$RES_STATUS_CLASS_DICT = [0=>'upcoming',1=>'active',2=>'no-show',3=>'completed',4=>'no-pay',5=>'is-late',6=>'was-late'];
						$in = make_human_readable_date($row->Checked_In);
						$out = make_human_readable_date($row->Checked_Out);

						$start_time = $row->Start_Time;
						$end_time = $row->End_Time;

						if ($out!=RESERVATION_NOT_ENDED_YET && $in!=RESERVATION_NOT_ENDED_YET) {
							if ($equip_result[0]->Root_Tag=='Equipment Room') {
								$checkin_date = date_create($row->Checked_In);
								//add a day so the calendar will render it properly
								date_add($checkin_date, date_interval_create_from_date_string('1 day'));
								$start_time = $row->Checked_Out;
								$end_time = date_format($checkin_date, DATE_FORMAT);
							}
						}

						$comment = empty(trim($row->Comment)) ? 'None.' : $row->Comment;
						$new_event = [	'nid'=>$row->NI_ID,
														'fullname'=> get_full_name($wp_id),
														'title'=>$title,
														'start'=>$start_time,
														'end'=>$end_time,
														'in'=>$in,
														'out'=>$out,
														'email'=>$email,
														'equipment'=>$item_name,
														'status'=>$RES_STATUS_CLASS_DICT[$row->Status],
														'period'=>get_rental_period($equip_result[0]->Rental_Type),
														'comment'=>$comment
													];
						$optional_event_args = [];
						if ($row->Status==3 || $row->Status==6) {
							$optional_event_args['editable'] = false;
						} else if ($row->Status==1 || $row->Status==4 || $row->Status==5) {
							$optional_event_args['startEditable'] = false;
						}
						$formatted_events[] = array_merge($optional_event_args, $new_event);
						if ($all_day && empty($row->Checked_In)) {
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

	public static function get_equipment_cal()
	{
		if (isset($_GET['name'])) {
			$item_name = str_replace('_', ' ', IAM_Sec::textfield_cleaner( $_GET['name'] ));
			echo json_encode(IAM_Cal::get_cal_for_equipment($item_name, $_GET));
			exit;
		} else if (isset($_GET['id'])) {
			echo json_encode(IAM_Cal::get_cal_for_equipment($_GET['id'], $_GET));
			exit;
		}
	}

}
