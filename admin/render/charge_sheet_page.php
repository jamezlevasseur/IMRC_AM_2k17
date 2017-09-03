<?php

/**
*
*/
class Charge_Sheet_Page
{

    public static function get_all_charges_as_csv()
    {
      global $wpdb;
      $r = $wpdb->get_results("SELECT * FROM ".IAM_CHARGE_TABLE." ORDER BY Charge_ID DESC");

      $csv = 'Username,Contact Email,Account_Type,Certifications,Total Account Funds,Equipment Used, Description, Amount, Date, Employee Who Approved Charge, Comments'.PHP_EOL;

      $charge_array = Charge_Sheet_Page::make_charge_table_array($r, false);

      foreach ($charge_array as $row) {
        $csv.=implode(',',$row['values']).PHP_EOL;
      }

      iam_respond(SUCCESS,$csv);
    }

    public static function admin_get_pagination_max()
    {
        global $wpdb;
        $table_map = ['charge'=>IAM_CHARGE_TABLE];
        $table = $table_map[$_GET['table']];
        $num_rows = isset($_GET['amount']) ? $_GET['amount'] : 15;
        $v = floor(count($wpdb->get_results("SELECT * FROM ".$table)));
        $max = floor(count($wpdb->get_results("SELECT * FROM ".$table))/$num_rows);
        $max = $v%$num_rows==0 ? $max : $max+1;
        iam_respond(SUCCESS,$max+1);
    }

    public static function approve_charge_callback()
    {
        global $wpdb;
        $ni_id = IAM_Sec::textfield_cleaner($_POST['nid']);
        $status = $_POST['status'];
        if (!is_numeric($status)) {
            iam_throw_error(INVALID_INPUT_EXCEPTION);
        }
        $username = $wpdb->get_results($wpdb->prepare("SELECT WP_Username FROM ".IAM_CHARGE_TABLE." WHERE NI_ID=%s",$ni_id))[0]->WP_Username;
        if ($status==1) {
            $wpdb->query($wpdb->prepare("UPDATE ".IAM_CHARGE_TABLE." SET Status='-1', Approver=NULL WHERE NI_ID=%s",$ni_id));
        } else if ($status==0) {
            $current_user = wp_get_current_user();
            $approver = $current_user->user_login;
            $wpdb->query($wpdb->prepare("UPDATE ".IAM_CHARGE_TABLE." SET Status='1', Approver='%s' WHERE NI_ID=%s",$approver,$ni_id));
        }
        IAM_Funds_Handler::update($username);
        iam_respond(SUCCESS);
    }

    public static function admin_switch_charge_status()
    {
        global $wpdb;
        $nid = IAM_Sec::textfield_cleaner($_POST['nid']);
        $status = $wpdb->get_results($wpdb->prepare("SELECT Status FROM ".IAM_CHARGE_TABLE." WHERE NI_ID=%s",$nid))[0]->Status;
        if ($status==-1 || $status==0) {
            $status = 1;
        } else {
            $status = -1;
        }
        $wpdb->query($wpdb->prepare("UPDATE ".IAM_CHARGE_TABLE." SET Status=%d WHERE NI_ID=%s",$status,$nid));
        $username = $wpdb->get_results($wpdb->prepare("SELECT WP_Username FROM ".IAM_CHARGE_TABLE." WHERE NI_ID=%s",$nid))[0]->WP_Username;
        iam_respond(SUCCESS,IAM_Funds_Handler::update($username,true));
    }

    public static function make_charge_table_array($results, $html=true)
    {
      global $wpdb;
      $arr = [];
      foreach ($results as $row) {
          $wp_user = $row->WP_Username;
          $iam_results = $wpdb->get_results("SELECT WP_ID,Account_Type,Balance,IAM_ID FROM ".IAM_USERS_TABLE." WHERE WP_Username='$wp_user'");
          $iam_id = $iam_results[0]->IAM_ID;
          $wp_id = $iam_results[0]->WP_ID;
          $wp_id = $wp_id == null ? 0 : $wp_id;
          $account_type = $wp_id==0 ? 'user_deleted' : $iam_results[0]->Account_Type;
          if ($account_type!='user_deleted') {
              $account_type = $wpdb->get_results($wpdb->prepare("SELECT Name FROM ".IAM_ACCOUNT_TYPES_TABLE." WHERE Account_Type_ID=%d",$account_type))[0]->Name;
          }
          $balance = $wp_id==0 ? 'user_deleted' :$iam_results[0]->Balance;
          $userdata = $wp_id==0 ? 'user_deleted' : get_userdata($wp_id);
          $email = $wp_id==0 ? 'user_deleted' : $userdata->user_email;
          $name = $wp_id==0 ? $wp_user : $userdata->first_name.' '.$userdata->last_name;
          if (trim($name)=='') {
              $name = $wp_user;
          }
          $user_certs = [];
          if ($wp_id!=0) {
              $cert_results = $wpdb->get_results("SELECT Certification_ID FROM ".IAM_USER_CERTIFICATIONS_TABLE." WHERE IAM_ID='$iam_id'");

              foreach ($cert_results as $cert_row) {
                  $cert_id = $cert_row->Certification_ID;
                  $cert_name = $wpdb->get_results("SELECT Name FROM ".IAM_CERTIFICATION_TABLE." WHERE Certification_ID='$cert_id'")[0]->Name;
                  $user_certs[] = $cert_name;
              }
              if ($html)
                $user_certs = implode('<br />', $user_certs);
              else
                $user_certs = implode(' & ', $user_certs);
          }
          $user_certs = $user_certs=='' ? 'None' : $user_certs ;
          $equip_id = $row->Equipment_ID;
          if ($equip_id!=null) {
              $equip_name = $wpdb->get_results("SELECT Name FROM ".IAM_EQUIPMENT_TABLE." WHERE Equipment_ID='$equip_id'")[0]->Name;
          } else {
              $equip_name = 'None';
          }
          $comment = $row->Comment=='' ? 'None' : $row->Comment ;
          $charge_description = $row->Charge_Description=='' ? 'Empty' : $row->Charge_Description ;
          $amount = $row->Amount;
          $approver = $row->Approver==null ? 'n/a' : $row->Approver;
          $arr[] = [
              'id'=>iam_output($row->NI_ID),
              'values'=>['username'=>$name,'email'=>$email,'account_type'=>$account_type,'certifications'=>$user_certs,'total_account_funds'=>$balance,'equipment_used'=>iam_output($equip_name),'Charge_Description'=>$charge_description,'Amount'=>$amount,'date'=>$row->Date,'approver'=>$approver,'Comment'=>$comment]
              ];
      }
      return $arr;
    }

    public static function admin_get_charge_table_json()
    {
        $num_rows = isset($_GET['amount']) ? $_GET['amount'] : 15;
        $start_index = isset($_GET['i']) ? ($_GET['i']-1)*$num_rows : 0;
        if ($start_index<0 || !is_numeric($start_index)) {
            $start_index = 0;
        }
        if (!is_numeric($num_rows)) {
            iam_throw_error(INVALID_INPUT_EXCEPTION);
        }
        global $wpdb;
        $charge_results = $wpdb->get_results($wpdb->prepare("SELECT * FROM ".IAM_CHARGE_TABLE." ORDER BY Charge_ID DESC LIMIT %d, %d",$start_index,$num_rows));
        $json = [
            'metadata'=>[
            ['name'=>'username','label'=>'Username','datatype'=>'varchar','editable'=>false],
            ['name'=>'email','label'=>'Contact Email','datatype'=>'varchar','editable'=>false],
            ['name'=>'account_type','label'=>'Account Type','datatype'=>'varchar','editable'=>false],
            ['name'=>'certifications','label'=>'Certifications','datatype'=>'varchar','editable'=>false],
            ['name'=>'total_account_funds','label'=>'Total Account Funds','datatype'=>'varchar','editable'=>false],
            ['name'=>'equipment_used','label'=>'Equipment Used','datatype'=>'varchar','editable'=>false],
            ['name'=>'Charge_Description','label'=>'Description','datatype'=>'text','editable'=>true],
            ['name'=>'Amount','label'=>'Amount','datatype'=>'varchar','editable'=>true],
            ['name'=>'date','label'=>'Date','datatype'=>'varchar','editable'=>false],
            ['name'=>'approver','label'=>'Employee Who Approved Charge','datatype'=>'varchar','editable'=>false],
            ['name'=>'Comment','label'=>'Comments','datatype'=>'text','editable'=>true]
            ],
            'data'=> Charge_Sheet_Page::make_charge_table_array($charge_results)
        ];

        echo json_encode($json);
        exit;
    }

}
