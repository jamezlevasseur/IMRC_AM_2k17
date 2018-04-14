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
          <p>Note: Test emails for fab lab have been disabled</p>
          <h1 class="iam-ninja" id="debug-success" style=" position: fixed; top:20%; left:35%; padding:10px; margin:0; display:inline; font-size:30px; background:#0bbf56; border-radius:8px; color:white;">SUCCESS</h1>
        </div>
        <?php
        /** de bugs go here **/
        //self::restructure_charge_sheet();
    }

    public static function restructure_charge_sheet()
    {
      $charges = ezget("SELECT * FROM ".IAM_CHARGE_TABLE);

      foreach ($charges as $charge) {
        $index_of_bad_desc = strpos($charge->Charge_Description, 'with multiple materials:  material #1 -');
        $new_desc = self::make_generic_charge_desc($charge->Charge_Description,$index_of_bad_desc);
        $tags = ezget("SELECT Tag_ID FROM ".IAM_TAGS_EQUIPMENT_TABLE." WHERE Equipment_ID=%d",$charge->Equipment_ID);
        if ($index_of_bad_desc!=false) {
          $material_ids = [];
          foreach ($tags as $tag) {
            $material_ids = array_merge($material_ids,
                                        ezget("SELECT Material_ID FROM ".IAM_MATERIAL_TAGS_TABLE." WHERE Tag_ID=%d",$tag->Tag_ID));
          }
          /*$material_ids = array_merge($material_ids,
                                      ezget("SELECT Material_ID FROM ".IAM_MATERIAL_EQUIPMENT_TABLE." WHERE Equipment_ID=%d",$charge->Equipment_ID));*/
          if (count($material_ids)===1) {
            $material = ezget("SELECT * FROM ".IAM_MATERIAL_TABLE." WHERE Material_ID=%d",$material_ids[0]->Material_ID)[0];

            $num = self::get_number_from_bad_desc($charge->Charge_Description,$index_of_bad_desc);

            if ($num===false) {
              echo '<br> <span style="color:red;">UNSALVAGEABLE NO NUM</span> <br>'.$charge->Charge_Description.'<br>';
            }

            $new_desc = substr($charge->Charge_Description,0,$index_of_bad_desc).' for '.$num.' '.$material->Unit_Name.'. Item used: '.$material->Name.' at '.$material->Price_Per_Unit.' per '.$material->Unit_Name.'.';
            echo '<br> <span style="color:green;">SALVAGED</span> <br>'.$new_desc.'<br>';

            //ezquery("UPDATE ".IAM_CHARGE_TABLE." SET Charge_Description=%s, WHERE Charge_ID=%d",$new_desc,$charge->Charge_ID);
          } else {
            $tag = count($tags)==1 ? $tags[0]->Tag_ID : 'none';
            $tag = $tag!='none.' ? ezget("SELECT Tag FROM ".IAM_TAGS_TABLE." WHERE Tag_ID=%d",$tag)[0]->Tag : $tag;
            $tag = count($tags)>1 ? 'more than one' : $tag;
            echo '<br> <span style="color:red;">UNSALVAGEABLE '.$tag.'</span> <br>'.$charge->Charge_Description.'<br>';
          }

        } else {
          $tag = count($tags)==1 ? $tags[0]->Tag_ID : 'none';
          if (strpos($charge->Charge_Description,'late charge')!=false || strpos($charge->Charge_Description,'adjusted')!=false) {
            echo '<br> <span style="color:teal;">CHARGE IS OK </span> <br>'.$charge->Charge_Description.'<br>';
          } else {
            echo '<br> <span style="color:pink;">CHARGE IS GOLDEN '.$tag.'</span> <br>'.$charge->Charge_Description.'<br>';
          }

        }
      }
    }

    public static function get_number_from_bad_desc($bad_desc,$index_of_bad_desc)
    {
      $chopped = trim( substr($bad_desc,$index_of_bad_desc+44) );
      $num = trim( substr($chopped, 0, strpos($chopped,' ')) );
      if (!is_numeric($num)) {
        return false;
        exit($bad_desc.' <br> '.$num);
      }
      return $num;
    }

    public static function make_generic_charge_desc($current_desc,$index_of_bad_desc)
    {
      return substr($current_desc,0,$index_of_bad_desc).'. #####';
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
      //self::make_late_res_for('appointment');
      //Utils_Public::appointment_late_reservations_check();
      Utils_Public::rental_late_reservations_check();
      sleep(5);
      ezquery("DELETE FROM ".IAM_EQUIPMENT_TABLE." WHERE 1 ORDER BY Equipment_ID DESC LIMIT 1");
    }

    public static function make_late_res_for($facility_type)
    {
      if ($facility_type=='rental') {
        $equip_name = 'Test Equipment '.make_nid();
        ezquery("INSERT INTO ".IAM_EQUIPMENT_TABLE." (NI_ID,Certification_ID,Name,Description,Pricing_Description,Manufacturer_Info,Photo,On_Slide_Show,Out_Of_Order,Root_Tag,Checked_Out,Rental_Type,Comments,Serial_Number) VALUES ('12316ewtqt13t31f1',0,'%s','i am described','pricing described','manutfactured, prolly','no/path',0,0,'Equipment Room',0,0,'a comment.','12345')",$equip_name);

        global $wpdb;
        $nid = make_nid();
        $eq = $wpdb->get_results("SELECT * FROM ".IAM_EQUIPMENT_TABLE." WHERE Name='$equip_name'")[0];
        $equip_id = $eq->Equipment_ID;
        $iam_id = ezget("SELECT IAM_ID FROM ".IAM_USERS_TABLE." WHERE WP_Username='jlevasseur'")[0]->IAM_ID;

        date_default_timezone_set(IMRC_TIME_ZONE);
        $s = date_create( date('Y-m-d H:00:00') );
        $s = date_sub($s, date_interval_create_from_date_string(" 14 days"));
        $start = date_format($s, DATE_FORMAT);
        $end = date_format( date_add($s, date_interval_create_from_date_string("3 days")), DATE_FORMAT);

        $wpdb->query($wpdb->prepare("INSERT INTO ".IAM_RESERVATION_TABLE." (NI_ID,Equipment_ID,IAM_ID,Start_Time,End_Time,Status,Checked_Out) VALUES (%s,%d,%d,%s,%s,%d,%s)",$nid,$equip_id,$iam_id,$start,$end,1,$start));

        $res_id = ezget("SELECT Reservation_ID FROM ".IAM_RESERVATION_TABLE." WHERE NI_ID=%s",$nid)[0]->Reservation_ID;

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
