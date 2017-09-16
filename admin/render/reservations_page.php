<?php

/**
*
*/
class Reservations_Page
{

    public static function admin_update_reservations_callback()
    {
        IAM_Cal::update_equipment_cal();
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
          $events = IAM_Cal::get_cal_for_equipment($row->Name, ['is'=>'y','descriptive'=>'y','all'=>'y']);
          $results[$row->NI_ID] = $events;
      }
      iam_respond(SUCCESS, $results);
    }
}
