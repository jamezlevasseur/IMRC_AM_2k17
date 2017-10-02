<?php

/**
*
*/
class Scheduling_Page
{

    public static function admin_facility_schedule_callback()
    {
        global $wpdb;

        $tag_id = $wpdb->get_results($wpdb->prepare("SELECT Tag_ID FROM ".IAM_TAGS_TABLE." WHERE Tag=%s",IAM_Sec::textfield_cleaner($_POST['tag'])))[0]->Tag_ID;

        if ($_POST['type']==='Rental') {
            if (count($wpdb->get_results($wpdb->prepare("SELECT Facility_ID FROM ".IAM_FACILITY_TABLE." WHERE Tag_ID=%d",$tag_id)))>0) {
                $wpdb->query($wpdb->prepare("UPDATE ".IAM_FACILITY_TABLE." SET Schedule_Type='Rental', Rental_Days=%d, Rental_Hours_Description=%s WHERE Tag_ID=%d",$_POST['info']['rental_period'],IAM_Sec::textfield_cleaner($_POST['info']['rental_hours_description']),$tag_id));
            } else {
                $wpdb->query($wpdb->prepare("INSERT INTO ".IAM_FACILITY_TABLE." (Tag_ID,Rental_Days, Rental_Hours_Description,Schedule_Type) VALUES (%d,%d,%s,'Rental')",$tag_id,$_POST['info']['rental_period'],IAM_Sec::textfield_cleaner($_POST['info']['rental_hours_description'])));
            }
        } else if ($_POST['type']==='Appointment') {
            $business_hours = IAM_Sec::textfield_cleaner( json_encode($_POST['info']['businessHours']) );
            if (count($wpdb->get_results($wpdb->prepare("SELECT Facility_ID FROM ".IAM_FACILITY_TABLE." WHERE Tag_ID=%d",$tag_id)))>0) {
                $wpdb->query($wpdb->prepare("UPDATE ".IAM_FACILITY_TABLE." SET Schedule_Type='Appointment', Appointment_Business_Hours=%s WHERE Tag_ID=%d",$business_hours,$tag_id));
            } else {
                $wpdb->query($wpdb->prepare("INSERT INTO ".IAM_FACILITY_TABLE." (Tag_ID,Appointment_Business_Hours,Schedule_Type) VALUES (%d,%s,'Appointment')",$tag_id,$business_hours));
            }
        } else if ($_POST['type']==='Not a Facility') {
            $wpdb->query($wpdb->prepare("DELETE FROM ".IAM_FACILITY_TABLE." WHERE Tag_ID=%d",$tag_id));
        }
        iam_respond(SUCCESS);
    }

    public static function admin_get_irregular_hours_callback()
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

    public static function admin_delete_irregular_hours_callback()
    {
        global $wpdb;
        $id = IAM_Sec::iamDecrypt($_POST['nid']);
        if (!is_numeric($id))
            iam_throw_error(INVALID_INPUT_EXCEPTION);
        $wpdb->query($wpdb->prepare("DELETE FROM ".IAM_META_TABLE." WHERE Meta_ID=%d",$id));
        iam_respond(SUCCESS);
    }

    public static function admin_update_irregular_hours_callback()
    {
        global $wpdb;
        $events = $_POST['events'];
        $key = IAM_Sec::textfield_cleaner($_POST['facility']).'_irregular_hours_event';
        $key = str_replace(' ', '_', $key);
        foreach ($events as $k => $value) {
            $wpdb->query($wpdb->prepare("INSERT INTO ".IAM_META_TABLE." (Meta_Key,Meta_Value) VALUES (%s,%s)",$key,json_encode($value)));
        }
        iam_respond(SUCCESS);
    }

    public static function make_rental_block($period, $hours_description)
    {
        return '<br />
        <label>Rental period (in days): <input class="iam-rental-period" type="number" value="'.iam_output($period).'"></label><br /><br />
        <label>Tell your users when you are open:</label><br /><textarea class="iam-rental-hours-description" cols="30">'.iam_output($hours_description).'</textarea>';
    }

    public static function admin_get_rental_info_template_callback()
    {
        iam_respond(SUCCESS,Scheduling_Page::make_rental_block('',''));
    }

    public static function admin_get_appointment_info_template_callback()
    {
        iam_respond(SUCCESS,Scheduling_Page::make_appointment_info_template());
    }

    public static function make_appointment_info_template($table_args='')
    {
        $scheduling_info = '<button type="button" class="iam-secondary-button iam-irregular-hours-button">set irregular hours</button><div class="iam-irregular-hours-instructions iam-ninja">Instructions: Drag the event where desired to indicate when you are closed on that date for that time. <b>Shift + Click to delete events</b></div><div class="iam-ninja" id="external-events"><h4>Drag to Calendar</h4><div class="fc-event">closed</div></div><div class="iam-irregular-hours-cal iam-cal iam-ninja"></div><button type="button" class="iam-button iam-irregular-hours-update-button iam-ninja">update irregular hours</button>';

        $td_days = Scheduling_Page::make_appointment_table($table_args);
        $scheduling_info.= '<table class="iam-appointment-table">
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

    public static function make_appointment_table($json)
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
            $html[0] .= Scheduling_Page::make_appointment_schedule_input($value->start,true,$closed);
            $html[1] .= Scheduling_Page::make_appointment_schedule_input($value->end,false,$closed);
        }

        return $html;
    }

    public static function make_appointment_schedule_input($time_obj, $start, $closed)
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


    public static function admin_get_approval_hours()
    {
        IAM_Cal::get_approval_hours();
    }

    public static function make_scheduling_block($row)
    {
        global $wpdb;
        $facility_results = $wpdb->get_results($wpdb->prepare("SELECT * FROM ".IAM_FACILITY_TABLE." WHERE Tag_ID=%d",$row->Tag_ID));
        if ($facility_results[0]->Schedule_Type=='' || $facility_results[0]->Schedule_Type==null) {
            $scheduling_options = '
                <option value="Not a Facility" selected>Not a Facility</option>
                <option value="Rental">Rental</option>
                <option value="Appointment">Appointment</option>';
                $scheduling_info = '';
        } else if ($facility_results[0]->Schedule_Type == 'Rental') {
            $scheduling_options = '
                <option value="Not a Facility">Not a Facility</option>
                <option value="Rental" selected>Rental</option>
                <option value="Appointment">Appointment</option>';
            $scheduling_info = Scheduling_Page::make_rental_block($facility_results[0]->Rental_Days, $facility_results[0]->Rental_Hours_Description);
        } else if ($facility_results[0]->Schedule_Type == 'Appointment') {
            $scheduling_options = '
                <option value="Not a Facility">Not a Facility</option>
                <option value="Rental">Rental</option>
                <option value="Appointment" selected>Appointment</option>
            ';
            $scheduling_info = Scheduling_Page::make_appointment_info_template($facility_results[0]->Appointment_Business_Hours);
        } else if ($facility_results[0]->Schedule_Type == 'Approval') {
            $scheduling_options = '
                <option value="Not a Facility">Not a Facility</option>
                <option value="Rental">Rental</option>
                <option value="Appointment">Appointment</option>
                <option value="Approval" selected>Approval</option>
            ';
            $scheduling_info = Scheduling_Page::make_approval_block();
        }
        echo '
        <div class="iam-scheduling-block">
            <span class="iam-scheduling-name"><h1>
                '.$row->Tag.'
            </h1></span>
            </label>
            <div class="iam-scheduling-type iam-ninja">
                <label for="scheduling-type">Schedule Type: </label>
                <select name="scheduling-type">
                    '.$scheduling_options.'
                </select>
            </div>
            <div class="iam-scheduling-info">
                '.$scheduling_info.'
            </div>
            <input type="submit" class="iam-button iam-schedule-submit-button" value="Save Changes">
        </div><br /><hr><br />';
    }

}
