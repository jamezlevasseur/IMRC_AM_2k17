<?php

/**
*
*/
class Reservations_Page
{
    public static function admin_update_reservations_callback()
    {
      global $wpdb;

  		if (isset($_POST['modified'])) {
  			foreach ($_POST['modified'] as $key => $value) {
          if (isset($_POST['to_delete']))
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

  		iam_respond(SUCCESS, Reservations_Page::get_updated_events($_POST['facility'], $_POST['load_all']), IAM::$status_message);
    }

    public static function load_all_events_admin_res_cal ()
    {
      global $wpdb;
      $facility = $_GET['facility'];
      $equip_results = $wpdb->get_results("SELECT * FROM ".IAM_EQUIPMENT_TABLE." WHERE Root_Tag='$facility' ORDER BY Name ASC");
      $results = [];
      foreach ($equip_results as $row) {
          if (trim($row->Name)=='')
            continue;
          $events = IAM_Cal::get_cal_for_equipment($row->Name, ['is'=>'y','all'=>'y']);
          $results[$row->NI_ID] = $events;
      }
      iam_respond(SUCCESS, $results);
    }

    public static function get_updated_events ($facility, $load_all)
    {
      global $wpdb;
      $cal_args = $load_all==true ? ['is'=>'y','all'=>'y'] : ['is'=>'y'];
      $equip_results = $wpdb->get_results("SELECT * FROM ".IAM_EQUIPMENT_TABLE." WHERE Root_Tag='$facility' ORDER BY Name ASC");

      $results = [];
      foreach ($equip_results as $row) {
          if (trim($row->Name)=='')
            continue;
          $events = IAM_Cal::get_cal_for_equipment($row->Name, $cal_args);
          $results[$row->NI_ID] = $events;
      }
      return $results;
    }
}
