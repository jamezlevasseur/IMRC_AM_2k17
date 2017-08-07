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

    public static function reservation_popup_callback()
    {
        echo IAM_Reservation_Popup::get();
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
            $tags = ['Equipment Room','Fab Lab'];
        }
        $all_equipment = [];
        global $wpdb;
        if ($tags[0]=='Rooms') {
            $all_rooms = $wpdb->get_results("SELECT Name,Description,Pricing_Description,Photo FROM ".IAM_ROOM_TABLE);
            foreach ($all_rooms as $row) {
                $row->Manufacturer_Info = '';
                $row->Root_Tag = 'Rooms';
            }
            iam_respond(SUCCESS,json_encode($all_rooms));
        }
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

    public static function get_rooms()
    {
        $html = IAM_Reservation_Page::get_rooms();
        iam_respond(SUCCESS,$html);
    }
}
