<?php

/**
*
*/
class Scheduling_Page
{

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
