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

    public static function make_rental_seg($args=[])
    {
      $defaultArgs = ['id'=>'','label'=>'','duration'=>'','default'=>'','class'=>''];
      $args = array_merge($defaultArgs, $args);
      return '<div data-id="'.$args['id'].'" style="border-bottom:1px solid #ddd;padding:5px 0;margin-bottom:5px;" class="rental-period-container '.$args['class'].'"><span><label>Label: <input type="text" class="rental-label" value="'.$args['label'].'"></label></span><span><label>Duration (in days): <input type="number" class="rental-duration" value="'.$args['duration'].'"></label></span><span><i class="iam-delete-rental-type fa fa-close fa-3"></i><br /><label style="display:block;">Default Rental Type: <input type="radio" name="default-rental" class="default-rental-type" '.$args['default'].' ></label></span></div>';
    }

    public static function reset_rental_default()
    {
      $rental_types = ezget(RENTAL_ALL_QUERY);
      foreach ($rental_types as $row) {
        $val = json_decode($row->Meta_Value);
        $val->default = 0;
        ezquery("UPDATE ".IAM_META_TABLE." SET Meta_Value=%s WHERE Meta_Key=%s",json_encode($val),RENTAL_PREFIX.$val->id);
      }
    }

    public static function set_new_default_rental($vals)
    {
      $default = ezget("SELECT * FROM ".IAM_META_TABLE." WHERE Meta_Key=%s",DEFAULT_RENTAL_TYPE_KEY);
      if (empty($default)) {
        ezquery(" INSERT INTO ".IAM_META_TABLE." (Meta_Key,Meta_Value) VALUES (%s,%s)", DEFAULT_RENTAL_TYPE_KEY, json_encode($vals));
        return;
      }
      ezquery(" UPDATE ".IAM_META_TABLE." SET Meta_Value=%s WHERE Meta_Key=%s", json_encode($vals), DEFAULT_RENTAL_TYPE_KEY);
    }

    public static function admin_update_rental_type_callback()
    {
        global $wpdb;
        $updated_vals = isset($_POST['updated_rental_types']) ? $_POST['updated_rental_types'] : [] ;
        $new_vals = isset($_POST['new_rental_types']) ? $_POST['new_rental_types'] : [] ;
        foreach ($updated_vals as $key => $value) {

            if (!is_numeric($value['duration'])) {
                iam_throw_error(INVALID_INPUT_EXCEPTION);
            }
            if ($value['default']==1) {
              self::reset_rental_default();
              self::set_new_default_rental(['id'=>$key, 'duration'=>$value['duration']]);
            }
            $new_json = json_encode([ 'id'=>$key,
                                      'duration'=>$value['duration'],
                                      'label'=>IAM_Sec::textfield_cleaner($value['label']),
                                      'default'=>$value['default']
                                     ]);
            $wpdb->query($wpdb->prepare("UPDATE ".IAM_META_TABLE." SET Meta_Value=%s WHERE Meta_Key=%s",$new_json,RENTAL_PREFIX.$key));

        }
        foreach ($new_vals as $entry) {
            if (!is_numeric($entry['duration'])) {
                iam_throw_error(INVALID_INPUT_EXCEPTION);
            }
            if ($entry['default']==1) {
              self::reset_rental_default();
              self::set_new_default_rental(['id'=>$id, 'duration'=>$entry['duration']]);
            }
            $id = make_nid();
            $val = json_encode(['id'=>$id,
                                'duration'=>$entry['duration'],
                                'label'=>IAM_Sec::textfield_cleaner($entry['label']),
                                'default'=>$entry['default']
                              ]);
            $wpdb->query($wpdb->prepare("INSERT INTO ".IAM_META_TABLE." (Meta_Key,Meta_Value) VALUES (%s,%s)",RENTAL_PREFIX.$id,$val));
        }
        iam_respond(SUCCESS);
    }

    public static function admin_delete_rental_type_callback()
    {
        global $wpdb;
        $to_delete = IAM_Sec::textfield_cleaner($_POST['toDelete']);

        $gonna_delete = ezget("SELECT * FROM ".IAM_META_TABLE." WHERE Meta_Key=%s", RENTAL_PREFIX.$to_delete)[0];

        if (json_decode($gonna_delete)->default==1)
          iam_throw_error("Cannot delete the default rental type.");

        ezquery("UPDATE ".IAM_EQUIPMENT_TABLE." SET Rental_Type=0 WHERE Rental_Type=%s",$to_delete);

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

    public static function new_res_email_test ()
    {
      $components = ezget("SELECT Name,Email,Schedule FROM ".IAM_FACILITY_TABLE." WHERE Facility_ID=%d", IAM_Sec::iamDecrypt($_POST['link']))[0];

      $description = json_decode($components->Schedule)->description;

      date_default_timezone_set(IMRC_TIME_ZONE);

      $now = new DateTime();

      Facility::send_facility_new_res_email($components->Name,
																						[ 'equipment'=>'Test Equipment',
																							'username'=>'some.user',
																							'start'=>$now->format('M d, Y \a\t g:i a'),
																							'end'=>$now->format('M d, Y \a\t g:i a'),
                                              'datetime'=>$now->format('M d, Y \a\t g:i a'),
                                              'schedule_description'=>$description,
                                              'notification_num'=>ordinal_format(3),
                                              'fee'=>'9.99'
																						]);

      iam_respond(SUCCESS,'new');
    }

    public static function late_res_admin_email_test ()
    {
      $components = ezget("SELECT Name,Email,Schedule FROM ".IAM_FACILITY_TABLE." WHERE Facility_ID=%d", IAM_Sec::iamDecrypt($_POST['link']))[0];

      $description = json_decode($components->Schedule)->description;

      date_default_timezone_set(IMRC_TIME_ZONE);

      $now = new DateTime();

      Facility::send_admin_late_res_email( $components->Name,
                                          [ 'equipment'=>'Test Equipment',
                                            'username'=>'some.user',
                                            'start'=>$now->format('M d, Y \a\t g:i a'),
                                            'end'=>$now->format('M d, Y \a\t g:i a'),
                                            'datetime'=>$now->format('M d, Y \a\t g:i a'),
                                            'schedule_description'=>$description,
                                            'notification_num'=>ordinal_format(3),
                                            'fee'=>'9.99'
                                          ]);

      iam_respond(SUCCESS,'admin');
    }

    public static function late_res_user_email_test ()
    {
      $components = ezget("SELECT Name,Email,Schedule FROM ".IAM_FACILITY_TABLE." WHERE Facility_ID=%d", IAM_Sec::iamDecrypt($_POST['link']))[0];

      $description = json_decode($components->Schedule)->description;

      date_default_timezone_set(IMRC_TIME_ZONE);

      $now = new DateTime();

      Facility::send_user_late_res_email( $components->Name,
                                          [ 'equipment'=>'Test Equipment',
                                            'username'=>'some.user',
                                            'start'=>$now->format('M d, Y \a\t g:i a'),
                                            'end'=>$now->format('M d, Y \a\t g:i a'),
                                            'datetime'=>$now->format('M d, Y \a\t g:i a'),
                                            'schedule_description'=>$description,
                                            'notification_num'=>ordinal_format(3),
                                            'fee'=>'9.99'
                                          ]);

      iam_respond(SUCCESS,'user');
    }

  public static function new_res_email_change ()
  {
    $subject = $_POST['subject'];
    $body = $_POST['body'];

    ezquery("UPDATE ".IAM_FACILITY_TABLE." SET New_Reservation_Email_Subject=%s, New_Reservation_Email_Body=%s WHERE Facility_ID=%d", $subject, $body, IAM_Sec::iamDecrypt($_POST['link']));

    iam_respond(SUCCESS);
  }

  public static function late_res_admin_email_change ()
  {
    $subject = $_POST['subject'];
    $body = $_POST['body'];

    ezquery("UPDATE ".IAM_FACILITY_TABLE." SET Late_Reservation_Admin_Email_Subject=%s, Late_Reservation_Admin_Email_Body=%s WHERE Facility_ID=%d", $subject, $body, IAM_Sec::iamDecrypt($_POST['link']));

    iam_respond(SUCCESS);
  }

  public static function late_res_user_email_change ()
  {
    $subject = $_POST['subject'];
    $body = $_POST['body'];

    ezquery("UPDATE ".IAM_FACILITY_TABLE." SET Late_Reservation_User_Email_Subject=%s, Late_Reservation_User_Email_Body=%s WHERE Facility_ID=%d", $subject, $body, IAM_Sec::iamDecrypt($_POST['link']));

    iam_respond(SUCCESS);
  }

    public static function email_appointment_tags_list()
    {
      ?>
      <p>%username% - The username of the user who made a reservation.</p>
      <p>%equipment% - The piece of equipment being reserved.</p>
      <p>%start_time% - The start data and time of the reservation.</p>
      <p>%end_time% - The end data and time of the reservation.</p>
      <p>%time_of_reservation% - The start data and time of the reservation.</p>
      <p>%schedule_description% - The description of facility operating hours. Set in the facility settings menu.</p>
      <?php
    }

    public static function email_rental_tags_list()
    {
      ?>
      <p>%username% - The username of the user who made a reservation.</p>
      <p>%equipment% - The piece of equipment being reserved.</p>
      <p>%start_time% - The start data and time of the reservation.</p>
      <p>%end_time% - The end data and time of the reservation.</p>
      <p>%time_of_reservation% - The start data and time of the reservation.</p>
      <p>%schedule_description% - The description of facility operating hours. Set in the facility settings menu.</p>
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
          <div class="late-check-time">Late check time: '.self::make_timepicker($scheduling->late_check_time,'',true).' </div><br />
          '.$hours_ui.'<br />
          <div><textarea class="scheduling-description" cols="80" rows="5" placeholder="Scheduling description and additional information go here. Example: We\'re open 10-4 weekdays, please bring a deposit to rent your equipment.">'.$scheduling->description.'</textarea></div><br />
          <button type="button" class="btn btn-success">Save</button>
          <div><button type="button" class="btn btn-primary iam-irregular-hours-button" data-toggle="modal" data-target="#irregular-hours-modal">Irregular Hours</button></div>
      </div>
      <div id="irregular-hours-modal" class="modal" role="dialog">
        <div class="modal-dialog modal-lg">

          <!-- Modal content-->
          <div class="modal-content">
            <div class="modal-header iam-events">
              <div class="fc-event" style="text-align:center; max-width:120px;">  drag me </div>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="position:absolute;right:10px;">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">

            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-success" data-dismiss="modal">Save</button>
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
          </div>

        </div>
      </div>';
    }

    public static function update_facility_schedule()
    {
        $facility = ezget("SELECT * FROM ".IAM_FACILITY_TABLE." WHERE Facility_ID=%d",IAM_Sec::iamDecrypt($_POST['link']))[0];
        $scheduling = json_decode($facility->Schedule);

        $late_check_time = DateTime::createFromFormat( 'h:i a', IAM_Sec::textfield_cleaner( $_POST['late_check_time'] ) );

        $late_check_time = $late_check_time->format('H:i:s');

        $new_scheduling = [ 'type' => $scheduling->type,
                            'business_hours' => $_POST['business_hours'],
                            'description' => IAM_Sec::textfield_cleaner( $_POST['description'] ),
                            'late_check_time' => $late_check_time
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

    public static function admin_get_irregular_hours()
    {
        global $wpdb;
        $key = $_GET['facility'].'_irregular_hours_event';
        $key = str_replace(' ', '_', $key);
        $ih_results = $wpdb->get_results("SELECT * FROM ".IAM_META_TABLE." WHERE Meta_Key='$key'");
        $ret = [];
        foreach ($ih_results as $row) {
            $obj = json_decode($row->Meta_Value);
            $obj->nid = IAM_Sec::iamEncrypt($row->Meta_ID);
            $ret[] = $obj;
        }
        //no respond for fullcal
        echo json_encode($ret);
        exit;
    }

    public static function admin_update_irregular_hours()
    {
        global $wpdb;
        $events = $_POST['events'];
        $key = IAM_Sec::textfield_cleaner($_POST['facility']).'_irregular_hours_event';
        $key = str_replace(' ', '_', $key);
        foreach ($events as $k => $value) {
          $start_closed = DateTime::createFromFormat(DATE_FORMAT,$value['start'])->format('M j g:i a');
          $end_closed = DateTime::createFromFormat(DATE_FORMAT,$value['end'])->format('M j g:i a');
          $title = $value['title'].' '.$start_closed.'-'.$end_closed;
          $value['title'] = $title;
          $wpdb->query($wpdb->prepare("INSERT INTO ".IAM_META_TABLE." (Meta_Key,Meta_Value) VALUES (%s,%s)",$key,json_encode($value)));
        }

        foreach ($_POST['to_delete'] as $encryptedID) {
          $id = IAM_Sec::iamDecrypt($encryptedID);
          if (!is_numeric($id))
              iam_throw_error(INVALID_INPUT_EXCEPTION);
          $wpdb->query($wpdb->prepare("DELETE FROM ".IAM_META_TABLE." WHERE Meta_ID=%d",$id));
        }

        iam_respond(SUCCESS);
    }

    public static function make_timepicker($time_string='12:00 am',$class='',$disabled=false)
    {
      if (empty($time_string))
        $time_string = '12:00 am';
      $disabled_prop = $disabled ? 'disabled' : '';

      $hour = empty($time_string) ? '' : (int) substr($time_string, 0,2);
      $min = empty($time_string) ? '' : (int) substr($time_string, 3,5);
      $m = substr($time_string, -2);


      $html_string = '<select '.$disabled_prop.' class="iam-hour-select '.$class.'">';
      for ($i=1; $i < 13; $i++) {
        $hour_selected = '';
        if ($hour==$i)
          $hour_selected = 'selected';
        $html_string.='<option value="'.sprintf("%02d", $i).'" '.$hour_selected.'>'.sprintf("%02d", $i).'</option>';
      }
      $html_string.='</select><select '.$disabled_prop.' class="iam-min-select '.$class.'">';
      for ($i=0; $i < 60; $i+=5) {
        $min_selected = '';
        if ($min==$i)
          $min_selected = 'selected';
        $html_string.='<option value="'.sprintf("%02d", $i).'" '.$min_selected.'>'.sprintf("%02d", $i).'</option>';
      }
      $html_string.='</select><select '.$disabled_prop.' class="iam-am-pm-select '.$class.'">';
      if ($m=='pm' || $hour>12)
        $html_string.='<option value="am">am</option><option value="pm" selected>pm</option></select>';
      else
        $html_string.='<option value="am" selected>am</option><option value="pm">pm</option></select>';

      return $html_string;
    }

}
