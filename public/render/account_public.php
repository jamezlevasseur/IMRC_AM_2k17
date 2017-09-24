<?php

class Account_Public
{

  public static function user_update_account_info()
  {
    $first_name = IAM_Sec::textfield_cleaner($_POST['first_name']);
    $last_name = IAM_Sec::textfield_cleaner($_POST['last_name']);
    $email = IAM_Sec::textfield_cleaner($_POST['email']);
    $phonenum = IAM_Sec::textfield_cleaner($_POST['phonenum']);
    $school_id = IAM_Sec::textfield_cleaner($_POST['school_id']);

    $id = IAM_Sec::iamDecrypt($_POST['link']);

    global $wpdb;

    $wpidquery = $wpdb->get_results($wpdb->prepare("SELECT WP_ID FROM ".IAM_USERS_TABLE." WHERE IAM_ID=%d",$id));

    if ( empty( $wpidquery ) ) {
      iam_throw_error('Invalid link given for updating user settings.');
    }

    $wpid = $wpidquery[0]->WP_ID;

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

}
