<?php

/**
 *
 */
class Facility
{

  public static function create($args)
  {
    $name = $args['name'];
    $type = $args['type'];
    if (isset($args['description']))
      $description = $args['description'];
    else
      $description = '';

    if ( !empty(ezget("SELECT * FROM ".IAM_FACILITY_TABLE." WHERE Name=%s",$name)) )
      iam_throw_error("A facility with that name already exists.");
    //if ( !empty(ezget("SELECT * FROM ".IAM_TAGS_TABLE." WHERE Tag=%s",$name)) )
    //  iam_throw_error("A tag with that name already exists.");

    //type: rental or appointment, business_hours: {}, checkintime: G:i
    if ($type=='r' || $type=='rental')
      $schedule = ['type'=> 'rental', 'business_hours'=> [], 'check_in_time'=> '0:00'];
    else if ($type=='a' || $type=='appointment')
      $schedule = ['type'=> 'appointment', 'business_hours'=> []];
    else
      iam_throw_error('Invalid facility type given: '.$name.' '.$type);

    ezquery("INSERT INTO ".IAM_TAGS_TABLE." (Tag) VALUES (%s)", $name);

    $tag_id = ezget("SELECT Tag_ID FROM ".IAM_TAGS_TABLE." WHERE Tag=%s",$name)[0]->Tag_ID;

    ezquery("INSERT INTO ".IAM_FACILITY_TABLE." (Name,Tag_ID,Description,Schedule) VALUES (%s,%d,%s,%s)",$name,$tag_id,$description,json_encode($schedule));
  }

  public static function get_facility_by_tag($tag)
  {
    $f = ezget("SELECT * FROM ".IAM_FACILITY_TABLE." WHERE Name=%s",$tag);

    if (empty($f)) {
      //TODO add recursive get root tag
      return false;
    }

    return $f[0];
  }

  public static function send_admin_late_res_email($facility_name, $email_args)
  {
    $email_info = ezget("SELECT Facility_Email,Late_Reservation_Admin_Email_Body,Late_Reservation_Admin_Email_Subject FROM ".IAM_FACILITY_TABLE." WHERE Name=%s",$facility_name)[0];

    $email_subject = $email_info->Late_Reservation_Admin_Email_Subject;
    $email_template = $email_info->Late_Reservation_Admin_Email_Body;

    if (isset($email_args['fee'])) {
      $email_subject = str_replace('%fee%',$email_args['fee'],$email_subject);
      $email_template = str_replace('%fee%',$email_args['fee'],$email_template);
    }
    if (isset($email_args['datetime'])) {
      $email_subject = str_replace('%time_of_reservation%',$email_args['datetime'],$email_subject);
      $email_template = str_replace('%time_of_reservation%',$email_args['datetime'],$email_template);
    }
    if (isset($email_args['schedule_description'])) {
      $email_subject = str_replace('%schedule_description%',$email_args['schedule_description'],$email_subject);
      $email_template = str_replace('%schedule_description%',$email_args['schedule_description'],$email_template);
    }
    if (isset($email_args['equipment'])) {
      $email_subject = str_replace('%equipment%',$email_args['equipment'],$email_subject);
      $email_template = str_replace('%equipment%',$email_args['equipment'],$email_template);
    }

    iam_mail( $email_info->Facility_Email,
              $email_subject,
              $email_template,
              'Failed to send notification.' );

    send_to_debug_file( get_email($user->IAM_ID) );
    send_to_debug_file( $email_template );
  }

  public static function send_user_late_res_email($facility_name, $email_args)
  {
    $email_info = ezget("SELECT Facility_Email,Late_Reservation_User_Email_Body,Late_Reservation_User_Email_Subject FROM ".IAM_FACILITY_TABLE." WHERE Name=%s",$facility_name)[0];

    $email_subject = $email_info->Late_Reservation_User_Email_Subject;
    $email_template = $email_info->Late_Reservation_User_Email_Body;

    if (isset($email_args['fee'])) {
      $email_subject = str_replace('%fee%',$email_args['fee'],$email_subject);
      $email_template = str_replace('%fee%',$email_args['fee'],$email_template);
    }
    if (isset($email_args['schedule_description'])) {
      $email_subject = str_replace('%schedule_description%',$email_args['schedule_description'],$email_subject);
      $email_template = str_replace('%schedule_description%',$email_args['schedule_description'],$email_template);
    }
    if (isset($email_args['equipment'])) {
      $email_subject = str_replace('%equipment%',$email_args['equipment'],$email_subject);
      $email_template = str_replace('%equipment%',$email_args['equipment'],$email_template);
    }
    if (isset($email_args['datetime'])) {
      $email_subject = str_replace('%time_of_reservation%',$email_args['datetime'],$email_subject);
      $email_template = str_replace('%time_of_reservation%',$email_args['datetime'],$email_template);
    }

    iam_mail( $email_args['user_email'],
              $email_subject,
              $email_template,
              'Failed to send notification.' );

    send_to_debug_file( get_email($user->IAM_ID) );
    send_to_debug_file( $email_template );
  }

  public static function send_facility_new_res_email($facility_name, $email_args)
  {
    $email_info = ezget("SELECT Facility_Email,New_Reservation_Email_Body,New_Reservation_Email_Subject FROM ".IAM_FACILITY_TABLE." WHERE Name=%s",$facility_name)[0];

    $email_subject = $email_info->New_Reservation_Email_Subject;
    $email_template = $email_info->New_Reservation_Email_Body;

    if (isset($email_args['username'])) {
      $email_subject = str_replace('%username%',$email_args['username'],$email_subject);
      $email_template = str_replace('%username%',$email_args['username'],$email_template);
    }
    if (isset($email_args['start'])) {
      $email_subject = str_replace('%start_time%',$email_args['start'],$email_subject);
      $email_template = str_replace('%start_time%',$email_args['start'],$email_template);
    }
    if (isset($email_args['end'])) {
      $email_subject = str_replace('%end_time%',$email_args['end'],$email_subject);
      $email_template = str_replace('%end_time%',$email_args['end'],$email_template);
    }
    if (isset($email_args['equipment'])) {
      $email_subject = str_replace('%equipment%',$email_args['equipment'],$email_subject);
      $email_template = str_replace('%equipment%',$email_args['equipment'],$email_template);
    }

    iam_mail( $email_info->Facility_Email,
              $email_subject,
              $email_template,
              'Failed to send notification.' );
  }

}
