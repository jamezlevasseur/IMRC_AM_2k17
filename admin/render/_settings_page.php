<?php

/**
*
*/
class Settings_Page
{

    public static function admin_update_settings_callback()
    {
        foreach ($_POST as $key => $value) {
            if ( $key == 'action')
                continue;
            $v = IAM_Sec::textfield_cleaner($value);
            if ($key=='ipad_code') {
                if (get_setting_iam('ipad_code')!=$v) {
                    update_settings_iam('ipad_code_updated',time());
                }
            }
            update_settings_iam($key, $v);
        }
        iam_respond(SUCCESS);
    }

    public static function admin_update_rental_type_callback()
    {
        global $wpdb;
        $updated_vals = $_POST['updated_rental_types'];
        $new_vals = $_POST['new_rental_types'];
        foreach ($updated_vals as $key => $value) {

            if (!is_numeric($value['duration'])) {
                iam_throw_error(INVALID_INPUT_EXCEPTION);
            }
            $new_json = json_encode(['id'=>$key, 'duration'=>$value['duration'], 'label'=>IAM_Sec::textfield_cleaner($value['label']) ]);
            $wpdb->query($wpdb->prepare("UPDATE ".IAM_META_TABLE." SET Meta_Value=%s WHERE Meta_Key=%s",$new_json,RENTAL_PREFIX.$key));
        }
        foreach ($new_vals as $entry) {
            if (!is_numeric($entry['duration'])) {
                iam_throw_error(INVALID_INPUT_EXCEPTION);
            }
            $id = make_nid();
            $val = json_encode(['id'=>$id, 'duration'=>$entry['duration'], 'label'=>IAM_Sec::textfield_cleaner($entry['label']) ]);
            $wpdb->query($wpdb->prepare("INSERT INTO ".IAM_META_TABLE." (Meta_Key,Meta_Value) VALUES (%s,%s)",RENTAL_PREFIX.$id,$val));
        }
        iam_respond(SUCCESS);
    }

    public static function admin_delete_rental_type_callback()
    {
        global $wpdb;
        $replacement = IAM_Sec::textfield_cleaner($_POST['replacement']);
        $to_delete = IAM_Sec::textfield_cleaner($_POST['toDelete']);

        $wpdb->query($wpdb->prepare("UPDATE ".IAM_EQUIPMENT_TABLE." SET Rental_Type=%s WHERE Rental_Type=%s",$replacement,$to_delete));

        $wpdb->query($wpdb->prepare("DELETE FROM ".IAM_META_TABLE." WHERE Meta_Key=%s",RENTAL_PREFIX.$to_delete));
        iam_respond(SUCCESS);
    }

    public static function admin_update_account_type_callback()
    {
        global $wpdb;
        $updated_vals = $_POST['updated_account_types'];
        $new_vals = $_POST['new_account_types'];
        foreach ($updated_vals as $key => $value) {
            $id = IAM_Sec::iamDecrypt($key);
            if (!is_numeric($value['discount'])) {
                iam_throw_error(INVALID_INPUT_EXCEPTION);
            }
            $wpdb->query($wpdb->prepare("UPDATE ".IAM_ACCOUNT_TYPES_TABLE." SET Name=%s, Discount=%d WHERE Account_Type_ID=%d",IAM_Sec::textfield_cleaner($value['type']),$value['discount'],$id));
        }
        foreach ($new_vals as $entry) {
            if (!is_numeric($entry['discount'])) {
                iam_throw_error(INVALID_INPUT_EXCEPTION);
            }
            $wpdb->query($wpdb->prepare("INSERT INTO ".IAM_ACCOUNT_TYPES_TABLE." (Name,Discount) VALUES (%s,%d)",IAM_Sec::textfield_cleaner($entry['type']),$entry['discount']));
        }
        iam_respond(SUCCESS);
    }

    public static function admin_delete_account_type_callback()
    {
        global $wpdb;
        $replacement_results = $wpdb->get_results($wpdb->prepare("SELECT Account_Type_ID FROM ".IAM_ACCOUNT_TYPES_TABLE." WHERE Name=%s",IAM_Sec::textfield_cleaner($_POST['replacement']) ));
        $replacement_id = $replacement_results[0]->Account_Type_ID;
        $id = IAM_Sec::iamDecrypt($_POST['nid']);
        $wpdb->query($wpdb->prepare("UPDATE ".IAM_USERS_TABLE." SET Account_Type=%d WHERE Account_Type=%d",$replacement_id,$id));
        $wpdb->query($wpdb->prepare("DELETE FROM ".IAM_ACCOUNT_TYPES_TABLE." WHERE Account_Type_ID=%d",$id));
        iam_respond(SUCCESS);
    }

    public static function facility_name_change ()
    {
      $new_name = IAM_Sec::textfield_cleaner($_POST['new_name']);

      ezquery("UPDATE ".IAM_FACILITY_TABLE." SET Name=%s WHERE Facility_ID=%d", $new_name, IAM_Sec::iamDecrypt($_POST['link']));

      iam_respond(SUCCESS);
    }

    public static function facility_email_change ()
    {
      $new_email = IAM_Sec::textfield_cleaner($_POST['new_email']);

      ezquery("UPDATE ".IAM_FACILITY_TABLE." SET Email=%s WHERE Facility_ID=%d", $new_email, IAM_Sec::iamDecrypt($_POST['link']));

      iam_respond(SUCCESS);
    }

    public static function test_email()
    {
      /*
      $facility = ezget("SELECT * FROM ".IAM_FACILITY_TABLE." WHERE Facility_ID=%d", IAM_Sec::iamDecrypt($_POST['link']))[0];
      $facility_name = $facility->Name;
      $schedule = $
      Facility::send_admin_late_res_email( $facility_name,
                                          [ 'equipment'=>'Test Equipment',
                                            'fee'=>cash_format($fee),
                                            'username'=>$user->WP_Username,
                                            'notification_num'=>ordinal_format($notifcation_num)
                                          ]);*/
    }

    public static function new_res_email_change ()
    {
      $subject = IAM_Sec::textfield_cleaner($_POST['subject']);
      $body = IAM_Sec::textfield_cleaner($_POST['body']);

      ezquery("UPDATE ".IAM_FACILITY_TABLE." SET New_Reservation_Email_Subject=%s, New_Reservation_Email_Body=%s WHERE Facility_ID=%d", $subject, $body, IAM_Sec::iamDecrypt($_POST['link']));

      iam_respond(SUCCESS);
    }

    public static function late_res_admin_email_change ()
    {
      $subject = IAM_Sec::textfield_cleaner($_POST['subject']);
      $body = IAM_Sec::textfield_cleaner($_POST['body']);

      ezquery("UPDATE ".IAM_FACILITY_TABLE." SET Late_Reservation_Admin_Email_Subject=%s, Late_Reservation_Admin_Email_Body=%s WHERE Facility_ID=%d", $subject, $body, IAM_Sec::iamDecrypt($_POST['link']));

      iam_respond(SUCCESS);
    }

    public static function late_res_user_email_change ()
    {
      $subject = IAM_Sec::textfield_cleaner($_POST['subject']);
      $body = IAM_Sec::textfield_cleaner($_POST['body']);

      ezquery("UPDATE ".IAM_FACILITY_TABLE." SET Late_Reservation_User_Email_Subject=%s, Late_Reservation_User_Email_Body=%s WHERE Facility_ID=%d", $subject, $body, IAM_Sec::iamDecrypt($_POST['link']));

      iam_respond(SUCCESS);
    }

    public static function email_tags_list()
    {
      ?>
      <p>%username% - The username of the user who made a reservation.</p>
      <p>%equipment% - The piece of equipment being reserved.</p>
      <p>%start_time% - The start data and time of the reservation.</p>
      <p>%end_time% - The end data and time of the reservation.</p>
      <p>%time_of_reservation% - The start data and time of the reservation.</p>
      <p>%notification_number% - The number of times this person has been notified. Comes in ordinal format (1st, 2nd, 3rd).</p>
      <p>%fee% - The late fee applied to a users account. For rentals only.</p>
      <?php
    }

    public static function email_guidelines()
    {
      ?>
      You can use HTML to style the email.
      <?php
    }

    public static function make_scheduling_ui($facility)
    {
      $scheduling = json_decode($facility->Schedule);
      if ($scheduling->type == 'rental') {
          $scheduling_type_options = '
              <option value="Not a Facility">Not a Facility</option>
              <option value="Rental" selected>Rental</option>
              <option value="Appointment">Appointment</option>';
      } else if ($scheduling->type == 'appointment') {
          $scheduling_type_options = '
              <option value="Not a Facility">Not a Facility</option>
              <option value="Rental">Rental</option>
              <option value="Appointment" selected>Appointment</option>
          ';
      }
      $hours_ui = self::make_hours_ui($scheduling->business_hours);
      echo '
      <div class="iam-scheduling-block">
          <div class="iam-scheduling-type">
              <label>Schedule Type: </label>
              <select class="scheduling-type" disabled>
                  '.$scheduling_type_options.'
              </select>
          </div><br />
          <div class="late-check-time">Late check time: '.self::make_timepicker($scheduling->late_check_time).' </div><br />
          <div><button type="button" class="btn btn-primary">Irregular Hours</button></div><br />
          '.$hours_ui.'<br />
          <div><textarea class="scheduling-description" cols="80" rows="5" placeholder="Scheduling description and additional information go here. Example: We\'re open 10-4 weekdays, please bring a deposit to rent your equipment.">'.$scheduling->description.'</textarea></div><br />
          <button type="button" class="btn btn-success">Save</button>
      </div>';
    }

    public static function update_facility_schedule()
    {
        $facility = ezget("SELECT * FROM ".IAM_FACILITY_TABLE." WHERE Facility_ID=%d",IAM_Sec::iamDecrypt($_POST['link']))[0];
        $scheduling = json_decode($facility->Schedule);

        $new_scheduling = [ 'type' => $scheduling->type,
                            'business_hours' => $_POST['business_hours'],
                            'description' => IAM_Sec::textfield_cleaner( $_POST['description'] ),
                            'late_check_time' => IAM_Sec::textfield_cleaner( $_POST['late_check_time'] )
                          ];

        ezquery("UPDATE ".IAM_FACILITY_TABLE." SET Schedule=%s WHERE Facility_ID=%d", stripslashes_deep(json_encode($new_scheduling)), $facility->Facility_ID);

        iam_respond(SUCCESS);
    }

    public static function make_hours_ui($business_hours)
    {
        $td_days = self::make_hours_table($business_hours);
        $scheduling_info = '<table class="iam-appointment-table">
            <thead>
                <tr>
                    <th></th>
                    <th>Sunday</th>
                    <th>Monday</th>
                    <th>Tuesday</th>
                    <th>Wednesday</th>
                    <th>Thursday</th>
                    <th>Friday</th>
                    <th>Saturday</th>
                </tr>
            </thead>
            <tbody>
                <tr class="iam-opening-row">
                    <td class="heading-data">Open at</td>
                    '.$td_days[0].'
                </tr>
                <tr class="iam-closing-row">
                    <td class="heading-data">Close at</td>
                    '.$td_days[1].'
                </tr>
            </tbody>
        </table>';
        return $scheduling_info;
    }

    public static function make_hours_table($business_hours)
    {
        if (empty($business_hours)) {
            $business_hours = '{
                "sun": {
                    "start": "",
                    "end": ""
                },
                "mon": {
                    "start": "09:00:00 am",
                    "end": "05:00:00 pm"
                },
                "tue": {
                    "start": "09:00:00 am",
                    "end": "05:00:00 pm"
                },
                "wed": {
                    "start": "09:00:00 am",
                    "end": "05:00:00 pm"
                },
                "thu": {
                    "start": "09:00:00 am",
                    "end": "05:00:00 pm"
                },
                "fri": {
                    "start": "09:00:00 am",
                    "end": "05:00:00 pm"
                },
                "sat": {
                    "start": "",
                    "end": ""
                }
            }';
        }
        $html = ['',''];
        $json = gettype($business_hours)=='string' ? json_decode($business_hours) : $business_hours;

        foreach ($json as $key => $value) {
            $closed = false;
            if ($value->start == $value->end)
                $closed = true;
            $html[0] .= self::make_schedule_input($value->start,true,$closed);
            $html[1] .= self::make_schedule_input($value->end,false,$closed);
        }

        return $html;
    }

    public static function make_schedule_input($time_string, $start, $closed)
    {
        $class_type = $start ? 'open' : 'close';
        if ($time_string=='' && $start || $closed && $start) {
          $html_string = '<td><label>Closed: <input class="iam-closed-checkbox" type="checkbox" checked></label><br />';
        } else if ($start) {
          $html_string = '<td><label>Closed: <input class="iam-closed-checkbox" type="checkbox"></label><br />';
        } else {
          $html_string = '<td>';
        }

        $html_string.=self::make_timepicker($time_string);
        $html_string.="</td>";
        return $html_string;
    }

    public static function make_timepicker($time_string='12:00 am',$class='')
    {
      if (empty($time_string))
        $time_string = '12:00 am';

      $hour = empty($time_string) ? '' : (int) substr($time_string, 0,2);
      $min = empty($time_string) ? '' : (int) substr($time_string, 3,5);
      $m = substr($time_string, -2);

      $html_string = '<select class="iam-hour-select '.$class.'">';
      for ($i=1; $i < 13; $i++) {
        $hour_selected = '';
        if ($hour==$i)
          $hour_selected = 'selected';
        $html_string.='<option value="'.sprintf("%02d", $i).'" '.$hour_selected.'>'.sprintf("%02d", $i).'</option>';
      }
      $html_string.='</select><select class="iam-min-select '.$class.'">';
      for ($i=0; $i < 60; $i+=5) {
        $min_selected = '';
        if ($min==$i)
          $min_selected = 'selected';
        $html_string.='<option value="'.sprintf("%02d", $i).'" '.$min_selected.'>'.sprintf("%02d", $i).'</option>';
      }
      $html_string.='</select><select class="iam-am-pm-select '.$class.'">';
      if ($m=='pm')
        $html_string.='<option value="am">am</option><option value="pm" selected>pm</option>';
      else
        $html_string.='<option value="am" selected>am</option><option value="pm">pm</option></select>';

      return $html_string;
    }

}
