<?php

/**
*
*/
class Reservation_Public
{

    public static function submit_reservation_callback()
    {
        return IAM_Reservation_Handler::run();
    }

    public static function get_equipment_calendar_callback()
    {
        IAM_Cal::get_equipment_cal();
    }

    public static function get_irregular_hours_calendar_callback()
    {
        IAM_Cal::get_irregular_hours_cal();
    }

    public static function get_approval_hours()
    {
        IAM_Cal::get_approval_hours();
    }

    public static function get_business_hours_callback()
    {
        return IAM_Cal::get_business_hours();
        exit;
    }

    public static function get_child_tags_callback()
    {
        IAM_Reservation_Page::get_child_tags();
        exit;
    }

    public static function get_equipment_for_tags_callback()
    {
        iam_respond(SUCCESS, IAM_Reservation_Page::get_equipment_for_tags());
    }

    public static function get_user_reservations_callback()
    {
        iam_respond(SUCCESS,IAM_Reservation_Page::get_user_reservations());
    }

    public static function delete_user_reservation_callback()
    {
        IAM_Reservation_Page::delete_user_reservation();
        exit;
    }

    public static function get_equipment_for_tag_callback()
    {
        $tags = [IAM_Sec::textfield_cleaner($_GET['tag'])];

        if ($tags[0]=='All') {
          $tags_get = ezget("SELECT Name FROM ".IAM_FACILITY_TABLE);
          $tags = [];
          foreach ($tags_get as $row) {
            $tags[] = $row->Name;
          }
        }
        $all_equipment = [];
        global $wpdb;
        for ($i=0; $i < count($tags); $i++) {
            $tag_id = $wpdb->get_results($wpdb->prepare("SELECT Tag_ID FROM ".IAM_TAGS_TABLE." WHERE Tag=%s",$tags[$i]))[0]->Tag_ID;
            $equip_id_results = $wpdb->get_results($wpdb->prepare("SELECT Equipment_ID FROM ".IAM_TAGS_EQUIPMENT_TABLE." WHERE Tag_ID=%d",$tag_id));
            foreach ($equip_id_results as $e_row) {
                $equipment = $wpdb->get_results("SELECT Root_Tag,Name,Description,Pricing_Description,Photo,Manufacturer_Info FROM ".IAM_EQUIPMENT_TABLE." WHERE Equipment_ID='$e_row->Equipment_ID'")[0];
                $all_equipment[] = $equipment;
            }
            $child_tags = $wpdb->get_results($wpdb->prepare("SELECT Tag FROM ".IAM_TAGS_TABLE." WHERE Parent=%s",$tags[$i]));
            foreach ($child_tags as $t_row) {
                $tags[] = $t_row->Tag;
            }
        }
        iam_respond(SUCCESS,json_encode($all_equipment));
    }

}
