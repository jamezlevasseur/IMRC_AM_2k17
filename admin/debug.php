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
          <h3>Make Late Reservations and Run Late Res Check</h3>
          <div class="late-res-check">
            <input type="submit">
          </div>
          <h1 class="iam-ninja" id="debug-success" style=" position: fixed; top:20%; left:35%; padding:10px; margin:0; display:inline; font-size:30px; background:#0bbf56; border-radius:8px; color:white;">SUCCESS</h1>
        </div>
        <?php
        /** de bugs go here **/

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

    public static function late_res_testing()
    {
      self::make_late_res_for('rental');
      self::make_late_res_for('appointment');
      Utils_Public::appointment_late_reservations_check();
      Utils_Public::rental_late_reservations_check();
      sleep(5);
      ezquery("UPDATE ".IAM_EQUIPMENT_TABLE." SET Checked_Out=0 WHERE Name='ACM Monopad'");
    }

    public static function make_late_res_for($facility_type)
    {
      if ($facility_type=='rental') {

        global $wpdb;
        $nid = make_nid();
        $eq = $wpdb->get_results("SELECT * FROM ".IAM_EQUIPMENT_TABLE." WHERE Name='ACM Monopad'")[0];
        $equip_id = $eq->Equipment_ID;
        $iam_id = ezget("SELECT IAM_ID FROM ".IAM_USERS_TABLE." WHERE WP_Username='jlevasseur'")[0]->IAM_ID;

        date_default_timezone_set(IMRC_TIME_ZONE);
        $s = date_create( date('Y-m-d H:00:00') );
        $s = date_sub($s, date_interval_create_from_date_string(" 14 days"));
        $start = date_format($s, DATE_FORMAT);
        $end = date_format( date_add($s, date_interval_create_from_date_string("3 days")), DATE_FORMAT);

        $wpdb->query($wpdb->prepare("INSERT INTO ".IAM_RESERVATION_TABLE." (NI_ID,Equipment_ID,IAM_ID,Start_Time,End_Time,Status,Checked_Out) VALUES (%s,%d,%d,%s,%s,%d,%s)",$nid,$equip_id,$iam_id,$start,$end,1,$start));

        $res_id = ezget("SELECT Reservation_ID FROM ".IAM_RESERVATION_TABLE." WHERE NI_ID=%s",$nid)[0]->Reservation_ID;

        ezquery("UPDATE ".IAM_EQUIPMENT_TABLE." SET Checked_Out=%d WHERE Name='ACM Monopad'",$res_id);

      } else if ($facility_type=='appointment') {

        global $wpdb;
        $nid = make_nid();
        $eq = $wpdb->get_results("SELECT * FROM ".IAM_EQUIPMENT_TABLE." WHERE Name='Bandsaw'")[0];
        $equip_id = $eq->Equipment_ID;
        $iam_id = ezget("SELECT IAM_ID FROM ".IAM_USERS_TABLE." WHERE WP_Username='jlevasseur'")[0]->IAM_ID;

        date_default_timezone_set(IMRC_TIME_ZONE);
        $s = date_create( date('Y-m-d H:00:00') );
        $s = date_sub($s, date_interval_create_from_date_string(" 14 days"));
        $start = date_format($s, DATE_FORMAT);
        $end = date_format( date_add($s, date_interval_create_from_date_string("3 hours")), DATE_FORMAT);

        $wpdb->query($wpdb->prepare("INSERT INTO ".IAM_RESERVATION_TABLE." (NI_ID,Equipment_ID,IAM_ID,Start_Time,End_Time,Status,Checked_In) VALUES (%s,%d,%d,%s,%s,%d,%s)",$nid,$equip_id,$iam_id,$start,$end,1,$start));

      }
    }

}
