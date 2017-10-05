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

}
