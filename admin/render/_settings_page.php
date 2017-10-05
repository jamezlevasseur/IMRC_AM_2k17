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
        //print_r($_POST);exit;
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

    public static function admin_report_bug_callback()
    {
        if (!BUG_REPORTING)
            exit;
        $current_user = wp_get_current_user();
        $message = "From Admin Side \n User: ".$current_user->user_login." Name Given: ".$_POST["from"]."\n Subject: ".$_POST["subject"]."\n Message: ".$_POST["message"];
        wp_mail('james.levasseur@maine.edu', 'Bug Report', $message);
        exit;
    }

    public static function make_scheduling_ui($facility)
    {
      $scheduling = json_decode($facility->Schedule);
      if ($scheduling->type == 'Rental') {
          $scheduling_type_options = '
              <option value="Not a Facility">Not a Facility</option>
              <option value="Rental" selected>Rental</option>
              <option value="Appointment">Appointment</option>';
      } else if ($scheduling->type == 'Appointment') {
          $scheduling_type_options = '
              <option value="Not a Facility">Not a Facility</option>
              <option value="Rental">Rental</option>
              <option value="Appointment" selected>Appointment</option>
          ';
      }
      $hours_ui = self::make_hours_ui($facility, $scheduling);
      echo '
      <div class="iam-scheduling-block">
          <div class="iam-scheduling-type">
              <label>Schedule Type: </label>
              <select class="scheduling-type" disabled>
                  '.$scheduling_type_options.'
                  Late check time: <div class="timepicker late-check-time"></div>
                  <button type="button" class="btn btn-primary">Irregular Hours</button>
                  '.$hours_ui.'
                  <textarea class="scheduling-description"></textarea>
                  <button type="button" class="btn btn-success">Save</button>
              </select>
          </div>
          <div class="iam-scheduling-info">
              '.$scheduling_ui.'
          </div>
          <input type="submit" class="iam-button iam-schedule-submit-button" value="Save Changes">
      </div>';
    }

    public static function make_hours_ui($scheduling='')
    {
        $td_days = self::make_hours_table($scheduling);
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

    public static function make_hours_table($json)
    {
        if ($json=='') {
            $json = '{
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
        $json = json_decode($json);
        foreach ($json as $key => $value) {
            $closed = false;
            if ($value->start == $value->end)
                $closed = true;
            $html[0] .= self::make_schedule_input($value->start,true,$closed);
            $html[1] .= self::make_schedule_input($value->end,false,$closed);
        }

        return $html;
    }

    public static function make_schedule_input($time_obj, $start, $closed)
    {
        $class_type = $start ? 'open' : 'close';
        if ($time_obj=='' && $start || $closed && $start) {
            $html_string = '<td><label>Closed: <input class="iam-closed-checkbox" type="checkbox" checked></label><br />';
        } else if ($start) {
            $html_string = '<td><label>Closed: <input class="iam-closed-checkbox" type="checkbox"></label><br />';
        } else {
            $html_string = '<td>';
        }
        $html_string.= '<select class="iam-'.$class_type.'-hour">';
        if ($time_obj=='') {
            $time_hour = '';
        } else {
            $time_hour = (int)substr($time_obj, 0,2);
            if (substr($time_obj, -2)=='pm')
                $pm = true;
            else
                $pm = false;
        }

        for ($i=1; $i < 13; $i++) {
            if ($time_hour==$i)
                $html_string.='<option value="'.sprintf("%02d", $i).'" selected>'.sprintf("%02d", $i).'</option>';
            else
                $html_string.='<option value="'.sprintf("%02d", $i).'">'.sprintf("%02d", $i).'</option>';
        }
        $html_string.='</select><select class="iam-'.$class_type.'-min">';
        $time_min = $time_obj=='' ? '' : (int)substr($time_obj,3,5);
        for ($i=0; $i < 61; $i+=5) {
            if ($time_min==$i)
                $html_string.='<option value="'.sprintf("%02d", $i).'" selected>'.sprintf("%02d", $i).'</option>';
            else
                $html_string.='<option value="'.sprintf("%02d", $i).'">'.sprintf("%02d", $i).'</option>';
        }
        $html_string.='</select><select class="iam-'.$class_type.'-am-pm">';
        if ($pm)
            $html_string.='<option value="am">am</option><option value="pm" selected>pm</option>';
        else
            $html_string.='<option value="am" selected>am</option><option value="pm">pm</option>';
        $html_string.="</selected></td>";
        return $html_string;
    }
}
