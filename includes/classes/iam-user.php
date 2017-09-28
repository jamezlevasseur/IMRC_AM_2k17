<?php

/**
 *
 */
class IAM_User
{

    public static function user_update_account_info()
    {
      global $wpdb;

      $first_name = IAM_Sec::textfield_cleaner($_POST['first_name']);
      $last_name = IAM_Sec::textfield_cleaner($_POST['last_name']);
      $email = IAM_Sec::textfield_cleaner($_POST['email']);
      $phonenum = IAM_Sec::textfield_cleaner($_POST['phonenum']);
      $school_id = IAM_Sec::textfield_cleaner($_POST['school_id']);

      if (isset($_POST['account_type'])) {
          $account_type = IAM_Sec::iamDecrypt($_POST['account_type']);
      }

      $id = IAM_Sec::iamDecrypt($_POST['link']);

      $wpidquery = $wpdb->get_results($wpdb->prepare("SELECT WP_ID FROM ".IAM_USERS_TABLE." WHERE IAM_ID=%d",$id));

      if ( empty( $wpidquery ) ) {
        iam_throw_error('Invalid link given for updating user settings.');
      }

      $wpid = $wpidquery[0]->WP_ID;

      if (isset($_POST['account_type']))
        $wpdb->query($wpdb->prepare("UPDATE ".IAM_USERS_TABLE." SET Account_Type=%d,Phone=%s,School_ID=%s WHERE IAM_ID=%d",$account_type,$phonenum,$school_id,$id));
      else
        $wpdb->query($wpdb->prepare("UPDATE ".IAM_USERS_TABLE." SET Phone=%s,School_ID=%s WHERE IAM_ID=%d",$phonenum,$school_id,$id));

      $email_check = get_user_by('email',$email);

      if ($email_check!=false) {
        if ($email_check->ID!=$wpid)
          iam_throw_error('A user with that email already exists.');
      }

      wp_update_user([
        'ID'=>$wpid,
        'first_name'=>$first_name,
        'last_name'=>$last_name,
        'user_email'=>$email
      ]);

      iam_respond(SUCCESS);
    }

    public static function get_user_charge_table_rows_for($id, $editable = false)
    {
      global $wpdb;
      $username = $wpdb->get_results($wpdb->prepare("SELECT WP_Username FROM ".IAM_USERS_TABLE." WHERE IAM_ID=%d",$id))[0]->WP_Username;
      $charge_results = $wpdb->get_results($wpdb->prepare("SELECT * FROM ".IAM_CHARGE_TABLE." WHERE WP_Username=%s ORDER BY Charge_ID DESC",$username));
      $table_rows = '';
      $edit_row = '';
      $c = $charge_results;
      $c = array_reverse($c);
      $after_charge = [];
      $t = 0;
      foreach($c as $row) {
        if ($row->Status==1 || $row->Status==0) {
          $t+=$row->Amount;
          $after_charge[] = $t;
        } else {
          $after_charge_count = count($after_charge);
          if ($after_charge_count>0) {
            $after_charge[] = $after_charge[$after_charge_count-1];
          } else {
            $after_charge[] = $t;
          }
        }

      }
      $count = 0;
      $length = count($after_charge)-1;
      foreach($charge_results as $row) {

        $status;
        if ($row->Status==1) {
          $status = 'Approved';
        } else if ($row->Status==0) {
          $status = 'Pending';
        } else if ($row->Status==-1) {
          $status = 'Canceled';
        }
        if($editable) {
          $edit_row = '<td><div class="iam-edit-charge-row" data-nid="'.iam_output($row->NI_ID).'"></div></td>';
        }
        $datetime = new DateTime($row->Date);
        $table_rows.='<tr><td>'.iam_output($datetime->format('m-d-Y')).'</td>'.'<td>'.iam_output($row->Charge_Description).'</td>'.'<td>$'.iam_output($row->Amount).'</td>'.'<td>$'.$after_charge[$length-$count].'</td>'.'<td class="iam-charge-status">'.iam_output($status).'</td>'.$edit_row.'</tr>';
        $count++;
      }
        if ($table_rows=='') {
            $table_rows = '<tr><td>no</td><td>activity</td><td>currently</td><td>found.</td><td>:(</td></tr>';
          }
          return $table_rows;
    }

    public static function get_user_charge_table_head()
    {
      return '<thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Charge</th>
              <th>Funds After</th>
              <th>Status</th>
            </tr>
          </thead>';
    }

}
