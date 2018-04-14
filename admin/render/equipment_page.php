<?php

/**
*
*/
class Equipment_Page extends Item_Mgmt
{

    public static function equipment_csv_upload()
    {
      $row = 1;
      $output = '';
      $has_id = false;
      $header_row = null;
      if (($handle = fopen($_FILES['file']['tmp_name'], "r")) !== FALSE) {
          while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
              $num = count($data);
              //$output.= "<p> $num fields in line $row: <br /></p>\n";
              if ($row==1) {
                $header_row = $data;
                for ($i=0; $i < count($header_row); $i++) {
                  $header_row[$i] = str_replace(' ', '_', $header_row[$i]);
                }
                if ($data[0]=='ID')
                  $has_id = true;
                $row++;
                continue;
              }
              $output.=$data[0];
              if ($has_id) {
                $action = trim(strtolower($data[1]));
                if ($action=='update') {
                  $p = self::make_update_params($data,$header_row,[0,1]);
                  $p['args'][] = $data[0];
                  ezquery("UPDATE ".IAM_EQUIPMENT_TABLE." SET ".$p['string']." WHERE Equipment_ID=%d", $p['args']);
                  self::csv_update_tags($data[0],$data[12]);
                  self::csv_update_certification($data[0],$data[6]);
                } else if ($action=='delete') {
                  ezquery("DELETE FROM ".IAM_EQUIPMENT_TABLE." WHERE Equipment_ID=%d", $data[0]);
                } else if ($action=='create') {
                  $p = self::make_create_params($data,$header_row,[0,1]);
                  ezquery("INSERT INTO ".IAM_EQUIPMENT_TABLE." ({$p['fields']}) VALUES ({$p['symbols']})",$p['args']);
                  $id = ezget("SELECT Equipment_ID FROM ".IAM_EQUIPMENT_TABLE." WHERE NI_ID=%s",$p['nid'])[0]->Equipment_ID;
                  self::csv_update_tags($id,$data[12]);
                  self::csv_update_certification($id,$data[6]);
                }
              } else { //one time use case
                $action = trim(strtolower($data[0]));
                $output.= $action.'///';
                if ($action=='update') {
                  $id = self::find_id_for_idless_row($data, $header_row);
                  if ($id==null) {
                    $output.='<br>Failed to update on '.$row.' - '.$data[1].'<br>';
                  } else {
                    $p = self::make_update_params($data,$header_row,[0]);
                    $p['args'][] = $id;
                    ezquery("UPDATE ".IAM_EQUIPMENT_TABLE." SET ".$p['string']." WHERE Equipment_ID=%d", $p['args']);
                    self::csv_update_tags($id,$data[11]);
                    self::csv_update_certification($id,$data[5]);
                  }
                } else if ($action=='delete') {
                  $id = self::find_id_for_idless_row($data, $header_row);
                  if (empty($id)) {
                    $output.='<br>Failed to delete on '.$row.' - '.$data[1].'<br>';
                  } else {
                    ezquery("DELETE FROM ".IAM_EQUIPMENT_TABLE." WHERE Equipment_ID=%d", $id);
                  }
                }
              }
              $row++;
          }
          fclose($handle);
      }
      date_default_timezone_set(IMRC_TIME_ZONE);
      $output.='<br>upload finished - '.date('H:i');
      iam_respond(SUCCESS,$output);
    }

    public static function csv_update_tags($id,$tagstring)
    {
      ezquery("DELETE FROM ".IAM_TAGS_EQUIPMENT_TABLE." WHERE Equipment_ID=%d",$id);
      $tags = explode('&', $tagstring);
      for ($i=0; $i < count($tags); $i++) {
        $target_tag = ezget("SELECT Tag_ID FROM ".IAM_TAGS_TABLE." WHERE Tag=%s", trim($tags[$i]));
        if (empty($target_tag))
          continue;
        $target_tag = $target_tag[0]->Tag_ID;
        ezquery("INSERT INTO ".IAM_TAGS_EQUIPMENT_TABLE." (Equipment_ID,Tag_ID,Unique_ID) VALUES (%d,%d,%d)",$id,$target_tag,$id.$target_tag);
      }
    }

    public static function csv_update_certification($id,$certname)
    {
      $c = ezget("SELECT Certification_ID FROM ".IAM_CERTIFICATION_TABLE." WHERE Name=%s",trim($certname));

      if (empty($c))
        return;
      $c = $c[0]->Certification_ID;

      ezquery("UPDATE ".IAM_EQUIPMENT_TABLE." SET Certification_ID=%d WHERE Equipment_ID=%d",$c,$id);
    }

    public static function find_id_for_idless_row($row, $header)
    {
      for ($i=1; $i < count($row); $i++) {
        $get_attempt = ezget("SELECT Equipment_ID FROM ".IAM_EQUIPMENT_TABLE." WHERE {$header[$i]}='{$row[$i]}'");
        if (count($get_attempt)===1) {
          return $get_attempt[0]->Equipment_ID;
        }
      }
      return null;
    }

    public static function make_create_params($row, $header, $skip)
    {
      $fields = '';
      $symbols = '';
      $args = [];
      for ($i=0; $i < count($row); $i++) {
        if (in_array($i, $skip) || $header[$i]=='Tags' || $header[$i]=='Certification')
          continue;
        $symbol = is_numeric($row[$i]) ? '%d' : '%s' ;
        $fields.=$header[$i].',';
        $symbols.=$symbol.',';
        $args[] = $row[$i];
      }
      $fields.='NI_ID';
      $symbols.='%s';
      $args[]=make_nid();
      return ['fields'=>$fields,
              'symbols'=>$symbols,
              'args'=>$args,
              'nid'=>$args[count($args)-1]
            ];
    }

    public static function make_update_params($row, $header, $skip)
    {
      $s = ' ';
      $a = [];
      for ($i=0; $i < count($row); $i++) {
        if (in_array($i, $skip) || $header[$i]=='Tags' || $header[$i]=='Certification')
          continue;
        $symbol = is_numeric($row[$i]) ? '%d' : '%s' ;
        $s.=$header[$i]."=$symbol, ";
        $a[] = $row[$i];
      }
      return ['string'=>substr($s,0,-2),'args'=>$a];
    }

    public static function duplicate_equipment()
    {
      global $wpdb;
      $equipment = $wpdb->get_results($wpdb->prepare("SELECT * FROM ".IAM_EQUIPMENT_TABLE." WHERE NI_ID=%s",$_POST['nid']))[0];

      $name = $equipment->Name;
      $count = 1;

      if (strpos($name,'(')!=false) {
        $num = (int) trim( substr($name, (strrpos($name,'(')+1), strrpos($name,')' ) ) );
        if ( is_numeric( $num ) ) {
          $count = $num;
          $count++;
          $name = substr($name, 0, strrpos($name,'(')-1 );
        }
      } else if ( is_numeric( substr($name, -1) ) ) {
        $count = (int) trim( substr($name, strrpos($name, ' ')) );
        $count++;
        $name = substr($name, 0, strrpos($name, ' '));
      }

      $base_name = $name;

      $name = $name." ($count)";

      while ( count($wpdb->get_results("SELECT Name FROM ".IAM_EQUIPMENT_TABLE." WHERE Name='$name' "))>0 ) {
        $count++;
        $name = $base_name." ($count)";
      }

      $ni_id = make_nid();

      //TODO this deletes the photo from disk some how????

      $wpdb->query( $wpdb->prepare("INSERT INTO ".IAM_EQUIPMENT_TABLE." (NI_ID,Certification_ID,Name,Description,Pricing_Description,Manufacturer_Info,Serial_Number,On_Slide_Show,Out_Of_Order,Comments,Photo,Root_Tag,Serial Number) VALUES (%s,'%d',%s,%s,%s,%s,%s,%d,%d,%s,%s,%s,%s)",$ni_id,$equipment->Certification_ID,$name,$equipment->Description,$equipment->Pricing_Description,$equipment->Manufacturer_Info,$equipment->Serial_Number,$equipment->On_Slide_Show,$equipment->Out_Of_Order,$equipment->Comments,$equipment->Photo,$equipment->Root_Tag,$equipment->Serial_Number) );

      $new_id = $wpdb->get_results("SELECT Equipment_ID FROM ".IAM_EQUIPMENT_TABLE." WHERE NI_ID='$ni_id'")[0]->Equipment_ID;

      $tags = $wpdb->get_results("SELECT Tag_ID FROM ".IAM_TAGS_EQUIPMENT_TABLE." WHERE Equipment_ID={$equipment->Equipment_ID}");

      foreach ($tags as $row) {
        $uid = $row->Tag_ID.''.$new_id;
        $wpdb->query("INSERT INTO ".IAM_TAGS_EQUIPMENT_TABLE." (Tag_ID,Equipment_ID,Unique_ID) VALUES ({$row->Tag_ID},{$new_id},{$uid})");
      }

      iam_respond(SUCCESS, $name);
    }

    public static function equipment_csv()
    {
      global $wpdb;

      $r = $wpdb->get_results("SELECT * FROM ".IAM_EQUIPMENT_TABLE." ORDER BY Name ASC");

      $csv = 'ID,Manual Edit Status,Name,Description,Pricing Description,Manufacturer Info,Certification,Out Of Order,Root Tag,Comments,Photo,Rental Type,Tags,On Slide Show'.PHP_EOL;

      foreach ($r as $row) {
        $cert = 'None';
        if ($row->Certification_ID!=0) {
          $cert = $wpdb->get_results("SELECT Name FROM ".IAM_CERTIFICATION_TABLE." WHERE Certification_ID={$row->Certification_ID}")[0]->Name;
        }

        $ooo = $row->Out_Of_Order==1 ? 'Out of Order' : 'Functional';

        $rental_type = get_rental_type_for($row->Rental_Type);
        $rental_type = $rental_type === 0 ? 'None' : $rental_type->label;

        $tags = get_list_of_tags_for($row->Equipment_ID, ' & ');

        $csv.='"'.escape_CSV_quotes($row->Equipment_ID).'","'.
                  escape_CSV_quotes('').'","'.
                  escape_CSV_quotes($row->Name).'","'.
                  escape_CSV_quotes($row->Description).'","'.
                  escape_CSV_quotes($row->Pricing_Description).'","'.
                  escape_CSV_quotes($row->Manufacturer_Info).'","'.
                  escape_CSV_quotes($cert).'","'.
                  escape_CSV_quotes($row->Out_Of_Order).'","'.
                  escape_CSV_quotes($row->Root_Tag).'","'.
                  escape_CSV_quotes($row->Comments).'","'.
                  escape_CSV_quotes($row->Photo).'","'.
                  escape_CSV_quotes($rental_type).'","'.
                  escape_CSV_quotes($tags).'","'.
                  escape_CSV_quotes($row->On_Slide_Show).'"'.PHP_EOL;
      }
      iam_respond(SUCCESS,$csv);
    }

    public static function admin_bind_rental()
    {
      global $wpdb;
      $e = $_POST['ev'];

      date_default_timezone_set(IMRC_TIME_ZONE);
  		$rightnow = date(DATE_FORMAT);

      if (isset($e['nid'])) {
        $res_id = $wpdb->get_results($wpdb->prepare("SELECT Reservation_ID FROM ".IAM_RESERVATION_TABLE." WHERE NI_ID=%s",$e['nid']))[0]->Reservation_ID;

        $wpdb->query($wpdb->prepare("UPDATE ".IAM_EQUIPMENT_TABLE." SET Checked_Out=%d WHERE Name=%s", $res_id, $e['equipment']));
        $wpdb->query($wpdb->prepare("UPDATE ".IAM_RESERVATION_TABLE." SET Status=%d,Checked_Out=%s WHERE NI_ID=%s",ACTIVE,$rightnow,$e['nid']));

        send_to_log_file("======== Reservation Started, Item Checkout ========");
        send_to_log_file("equipment: ".$e['equipment']);
  			send_to_log_file("res id: ".$res_id);
        send_to_log_file("user: ".$e['user']);

      } else {
        $nid = make_nid();
        $equipment_id = $wpdb->get_results($wpdb->prepare("SELECT Equipment_ID FROM ".IAM_EQUIPMENT_TABLE." WHERE Name=%s",$e['equipment']))[0]->Equipment_ID;
        $iam_id = get_user_for_email($e['user'])->IAM_ID;

        $wpdb->query($wpdb->prepare("INSERT INTO ".IAM_RESERVATION_TABLE." (NI_ID,IAM_ID,Equipment_ID,Status,Start_Time,End_Time,Checked_Out) VALUES (%s,%d,%d,%d,%s,%s,%s)",$nid,$iam_id,$equipment_id,ACTIVE,$e['start'],$e['end'],$rightnow));

        $res_id = $wpdb->get_results($wpdb->prepare("SELECT Reservation_ID FROM ".IAM_RESERVATION_TABLE." WHERE NI_ID=%s AND IAM_ID=%d",$nid,$iam_id))[0]->Reservation_ID;
        $wpdb->query($wpdb->prepare("UPDATE ".IAM_EQUIPMENT_TABLE." SET Checked_Out=%d WHERE Name=%s", $res_id, $e['equipment']));

        send_to_log_file("======== Reservation Started, Item Checkout ========");
  			send_to_log_file("equipment: ".$e['equipment']);
  			send_to_log_file("res id: ".$res_id);
        send_to_log_file("user: ".$e['user']);

      }
      iam_respond(SUCCESS);
    }

    public static function admin_end_rental()
    {
      global $wpdb;

      date_default_timezone_set(IMRC_TIME_ZONE);
  		$rightnow = date(DATE_FORMAT);

      $e = IAM_Sec::textfield_cleaner($_POST['equipment']);
      $res_id = $wpdb->get_results($wpdb->prepare("SELECT Checked_Out FROM ".IAM_EQUIPMENT_TABLE." WHERE Name=%s",$e))[0]->Checked_Out;
      $wpdb->query($wpdb->prepare("UPDATE ".IAM_EQUIPMENT_TABLE." SET Checked_Out=0 WHERE Checked_Out=%d",$res_id));

      $res = $wpdb->get_results($wpdb->prepare("SELECT Status,End_Time FROM ".IAM_RESERVATION_TABLE." WHERE Reservation_ID=%d",$res_id))[0];

      $status = $res->Status;
      $end_time = $res->End_Time;

      $end_time = date('DATE_ONLY_FORMAT').' '.explode(' ',$end_time)[1];

      $new_status = $status==IS_LATE ? WAS_LATE : COMPLETED;

      $wpdb->query($wpdb->prepare("UPDATE ".IAM_RESERVATION_TABLE." SET Status=%d,Checked_In=%s,End_Time=%s WHERE Reservation_ID=%d",$new_status,$rightnow,$end_time,$res_id));

      send_to_log_file("======== Reservation Ended, Item Check in ========");
      send_to_log_file("equipment: ".$e);
      send_to_log_file("res id: ".$res_id);
      send_to_log_file("new status: ".$new_status);

      iam_respond(SUCCESS);
    }

    public static function admin_get_tags_callback()
    {
        IAM_Tags::get_all_tags();
    }

    public static function admin_equipment_callback()
    {
        $interaction = $_POST['method'];
        if (isset($_POST['name']) && isset($_POST['certification']) && isset($_POST['out-of-order']) && isset($_POST['on-slide-show'])  && ($interaction=='u' && isset($_POST['x']) || $interaction=='n') ) {
            global $wpdb;
            $name = IAM_Sec::textfield_cleaner($_POST['name'], true);
            //name checks
            if (gettype($name)!='string') {
                iam_throw_error ('Error - Invalid Input in Field: "Item Name"');
            }
            if (strlen($name)>100) {
                iam_throw_error ( 'Error - Field "Item Name" max length 100 characters');
                exit;
            }
            if (preg_match("/[;'_]/", $name)) {
                iam_throw_error('Error - Item Name cannot contain single quotes, semi colons, or underscores.');
            }
            if (count($wpdb->get_results($wpdb->prepare("SELECT Equipment_ID FROM ".IAM_EQUIPMENT_TABLE." WHERE Name=%s",$name)))>0 && $interaction=='n') {
                iam_throw_error ( 'Error - Equipment of this name already exists');
                exit;
            }

            $certification = IAM_Sec::textfield_cleaner($_POST['certification']);
            //name checks
            if (gettype($certification)!='string') {
                iam_throw_error ( 'Error - Invalid Input in Field: "Certification"');
                exit;
            }

            if (isset($_POST['rental_type'])) {
              $rental_type = IAM_Sec::textfield_cleaner($_POST['rental_type']);
              //name checks
              if (gettype($rental_type)!='string') {
                  iam_throw_error ( 'Error - Invalid Input in Field: "Rental Type"');
                  exit;
              }
            }

            $out_of_order = $_POST['out-of-order'];
            if (IAM_Sec::is_num_val($out_of_order)===false) {
                iam_throw_error ( 'Error - Invalid Input in Field: "Out Of Order"');
                exit;
            }

            $on_slide_show = $_POST['on-slide-show'];
            if (IAM_Sec::is_num_val($on_slide_show)===false) {
                iam_throw_error ( 'Error - Invalid Input in Field: "On Slide Show"');
                exit;
            }

            $description = null;
            if (isset($_POST['description'])) {
                $description = IAM_Sec::textfield_cleaner($_POST['description']);
                //desc checks
                if (gettype($description)!='string') {
                    iam_throw_error ( 'Error - Invalid Input in Field: "Description"');
                    exit;
                }
            }

            $manufacturer_info = null;
            if (isset($_POST['manufacturer-info'])) {
                $manufacturer_info = IAM_Sec::textfield_cleaner($_POST['manufacturer-info']);
                //desc checks
                if (gettype($manufacturer_info)!='string') {
                    iam_throw_error ( 'Error - Invalid Input in Field: "Manufacturer Info"');
                    exit;
                }
            }

            $serial_number = null;
            if (isset($_POST['serial-number'])) {
                $serial_number = IAM_Sec::textfield_cleaner($_POST['serial-number']);
                //desc checks
                if (gettype($serial_number)!='string') {
                    iam_throw_error ( 'Error - Invalid Input in Field: "Serial Number"');
                    exit;
                }
            }

            $pricing_description = null;
            if (isset($_POST['pricing-description'])) {
                $pricing_description = IAM_Sec::textfield_cleaner($_POST['pricing-description']);
                //desc checks
                if (gettype($pricing_description)!='string') {
                    iam_throw_error ( 'Error - Invalid Input in Field: "Pricing Description"');
                    exit;
                }
            }

            $internal_comments = null;
            if (isset($_POST['internal-comments'])) {
                $internal_comments = IAM_Sec::textfield_cleaner($_POST['internal-comments']);
                //desc checks
                if (gettype($internal_comments)!='string') {
                    iam_throw_error ( 'Error - Invalid Input in Field: "Internal Comments"');
                    exit;
                }
            }

            $photo = null;
            if (count($_FILES)>0) {
                $photo = validateAndMoveImg( $_FILES['photo'] );
            }

            $insert_query = "";
            if ($certification=='') {
                $cert_id = 0;
            } else {
                $cert_query = "SELECT Certification_ID FROM ".IAM_CERTIFICATION_TABLE." WHERE Name='$certification'";
                $cert_id = $wpdb->get_results($cert_query);
                if ($cert_id==null) {
                    $cert_id = 0;
                } else {
                    $cert_id = $cert_id[0]->Certification_ID;
                }
            }

            if ($interaction=='n') {
                //TODO: try again routine for remote case of uniqueid producing a duplicate id
                //TODO: more complex ni_id
                $ni_id = make_nid();
                if ($photo!=null) {
                    $insert_query = $wpdb->prepare("INSERT INTO ".IAM_EQUIPMENT_TABLE." (NI_ID,Certification_ID,Name,Description,Pricing_Description,Manufacturer_Info,Serial_Number,Photo,On_Slide_Show,Out_Of_Order,Comments) VALUES (%s,%d,%s,%s,%s,%s,%s,%s,%d,%d,%s)",$ni_id,$cert_id,$name,$description,$pricing_description,$manufacturer_info,$serial_number,$photo,$on_slide_show,$out_of_order,$internal_comments);
                } else {
                    $insert_query = $wpdb->prepare("INSERT INTO ".IAM_EQUIPMENT_TABLE." (NI_ID,Certification_ID,Name,Description,Pricing_Description,Manufacturer_Info,Serial_Number,On_Slide_Show,Out_Of_Order,Comments) VALUES (%s,'%d',%s,%s,%s,%s,%s,%d,%d,%s)",$ni_id,$cert_id,$name,$description,$pricing_description,$manufacturer_info,$serial_number,$on_slide_show,$out_of_order,$internal_comments);
                }
            } else if ($interaction=='u') {
                $ni_id = IAM_Sec::textfield_cleaner($_POST['x']);
                if ($photo!=null) {
                    $insert_query = $wpdb->prepare("UPDATE ".IAM_EQUIPMENT_TABLE." SET Photo=%s,Certification_ID=%d,Name=%s,Description=%s,Pricing_Description=%s,Manufacturer_Info=%s,Serial_Number=%s,On_Slide_Show=%d,Out_Of_Order=%d,Comments=%s WHERE NI_ID=%s ",$photo,$cert_id,$name,$description,$pricing_description,$manufacturer_info,$serial_number,$on_slide_show,$out_of_order,$internal_comments,$ni_id);
                } else {
                    $insert_query = $wpdb->prepare("UPDATE ".IAM_EQUIPMENT_TABLE." SET Certification_ID=%d,Name=%s,Description=%s,Pricing_Description=%s,Manufacturer_Info=%s,Serial_Number=%s,On_Slide_Show=%d,Out_Of_Order=%d,Comments=%s WHERE NI_ID=%s ",$cert_id,$name,$description,$pricing_description,$manufacturer_info,$serial_number,$on_slide_show,$out_of_order,$internal_comments,$ni_id);
                }
            } else {
                iam_throw_error(INVALID_INPUT_EXCEPTION);
            }

            $result = $wpdb->query($insert_query);

            if (isset($rental_type)) {
              $wpdb->query($wpdb->prepare("UPDATE ".IAM_EQUIPMENT_TABLE." SET Rental_Type=%s WHERE NI_ID=%s",$rental_type, $ni_id));
            }

            $tags = $_POST['tags']=='' ? [] : explode(',', $_POST['tags']);
            $equip_id = $wpdb->get_results($wpdb->prepare("SELECT Equipment_ID FROM ".IAM_EQUIPMENT_TABLE." WHERE Name=%s",$name))[0]->Equipment_ID;
            $wpdb->query($wpdb->prepare("DELETE FROM ".IAM_TAGS_EQUIPMENT_TABLE." WHERE Equipment_ID=%d",$equip_id));
            $set_parent = false;
            if (count($tags)==0) {
              $wpdb->query($wpdb->prepare("UPDATE ".IAM_EQUIPMENT_TABLE." SET Root_Tag=%s WHERE Equipment_ID=%d",'',$equip_id));
            }
            for ($i=0; $i < count($tags); $i++) {
                if (gettype($tags[$i])!='string') {
                    iam_throw_error( 'Error - Field "Tags"');
                    exit;
                }
                if (trim($tags[$i])=='')
                    continue;
                $current = IAM_Sec::textfield_cleaner($tags[$i]);
                //if adding a new tag
                if (strpos($current,'->')!=false) {
                  $parts = explode('->', $current);

                  $all_tags = ezget("SELECT Tag FROM ".IAM_TAGS_TABLE);
                  $potential_new_tag = strtolower(trim($parts[0]));
                  $potential_parent_tag = strtolower(trim($parts[1]));
                  $confirmed_parent_tag = '';
                  foreach ($all_tags as $t) {
                    //if an existing tag matches this one
                    $lower_t = strtolower($t->Tag);
                    if ($potential_new_tag==$lower_t) {
                      continue;
                    }
                    if ($potential_parent_tag==$lower_t) {
                      $confirmed_parent_tag = $t->Tag;
                    }
                  }
                  //if the parent tag doesn't exist
                  if ($confirmed_parent_tag=='') {
                    continue;
                  }

                  ezquery("INSERT INTO ".IAM_TAGS_TABLE." (Tag,Parent) VALUES (%s,%s)",$potential_new_tag,$confirmed_parent_tag);
                  $current = $potential_new_tag;
                }

                $tag_id = $wpdb->get_results($wpdb->prepare("SELECT Tag_ID FROM ".IAM_TAGS_TABLE." WHERE Tag=%s",$current))[0]->Tag_ID;
                $tag_result = $wpdb->query($wpdb->prepare("INSERT INTO ".IAM_TAGS_EQUIPMENT_TABLE." (Equipment_ID, Tag_ID, Unique_ID) VALUES (%d,%d,%d) ",$equip_id,$tag_id,$tag_id.''.$equip_id));

                //root tag is top parent of first tag
                if (!$set_parent) {
                    $set_parent = true;
                    $search_tag = $current;
                    $search_parent = '';
                    while (true) {
                        $search_parent = $wpdb->get_results($wpdb->prepare("SELECT Parent FROM ".IAM_TAGS_TABLE." WHERE Tag=%s",$search_tag));
                        if (count($search_parent)==0) {
                            $search_tag = '';
                            break;
                        }
                        $search_parent = $search_parent[0]->Parent;
                        if ($search_parent=='') {
                          break;
                        }
                        $search_tag = $search_parent;
                    }
                    $search_tag = str_replace('_',' ',$search_tag);

                    $wpdb->query($wpdb->prepare("UPDATE ".IAM_EQUIPMENT_TABLE." SET Root_Tag=%s WHERE Equipment_ID=%d",$search_tag,$equip_id));
                }

                if (!$tag_result) {
                    iam_throw_error("Error - Inserting Tags");
                }
            }

            iam_respond(SUCCESS);
        } else {
            if (!isset($_POST['name'])) {
                iam_throw_error( 'Error - Please fill out required fields: Name' );
            } else if (!isset($_POST['certification'])) {
                iam_throw_error( 'Error - Please fill out required fields: Certification' );
            }
            iam_throw_error(INVALID_INPUT_EXCEPTION);
        }
    }

}
