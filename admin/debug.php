<?php

/**
*
*/
class Debug_Page
{

    public static function debug_content()
    {
        ?>
        <div class="debug-wrap">
          <h3>Make Dummy Reservations</h3>
          <div class="make-dummy-res">
            <label>hour mod: <input type="number" name="hour-mod" value="1"></label>
            <input type="submit">
          </div>
          <h1 class="iam-ninja" id="debug-success" style=" position: fixed; top:20%; left:35%; padding:10px; margin:0; display:inline; font-size:30px; background:#0bbf56; border-radius:8px; color:white;">SUCCESS</h1>
        </div>
        <?php
        /** de bugs go here **/
        ezquery("UPDATE ".IAM_EQUIPMENT_TABLE." SET Rental_Type=0");

    }

    public static function make_dummy_res()
    {
      global $wpdb;
      $nid = make_nid();
      $eq = $wpdb->get_results("SELECT * FROM ".IAM_EQUIPMENT_TABLE." WHERE Name='Bandsaw'")[0];
      $equip_id = $eq->Equipment_ID;
      $iam_id = 18;

      date_default_timezone_set(IMRC_TIME_ZONE);
      $s = date_create( date('Y-m-d H:00:00') );
      $s = date_add($s, date_interval_create_from_date_string($_POST['mod']." hours"));
      $start = date_format($s, DATE_FORMAT);
      $end = date_format( date_add($s, date_interval_create_from_date_string("1 hours")), DATE_FORMAT);

      $wpdb->query($wpdb->prepare("INSERT INTO ".IAM_RESERVATION_TABLE." (NI_ID,Equipment_ID,IAM_ID,Start_Time,End_Time) VALUES (%s,%d,%d,%s,%s)",$nid,$equip_id,$iam_id,$start,$end));

      iam_respond(SUCCESS,['start'=>$start,'end'=>$end]);
    }

}
