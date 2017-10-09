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

  public static function apply_email_filters(&$subject, &$body, $email_args)
  {
    if (isset($email_args['fee'])) {
      $subject = str_replace('%fee%',$email_args['fee'],$subject);
      $body = str_replace('%fee%',$email_args['fee'],$body);
    }
    if (isset($email_args['datetime'])) {
      $subject = str_replace('%time_of_reservation%',$email_args['datetime'],$subject);
      $body = str_replace('%time_of_reservation%',$email_args['datetime'],$body);
    }
    if (isset($email_args['schedule_description'])) {
      $subject = str_replace('%schedule_description%',$email_args['schedule_description'],$subject);
      $body = str_replace('%schedule_description%',$email_args['schedule_description'],$body);
    }
    if (isset($email_args['equipment'])) {
      $subject = str_replace('%equipment%',$email_args['equipment'],$subject);
      $body = str_replace('%equipment%',$email_args['equipment'],$body);
    }
    if (isset($email_args['notification_num'])) {
      $subject = str_replace('%notification_number%',$email_args['notification_num'],$subject);
      $body = str_replace('%notification_number%',$email_args['notification_num'],$body);
    }
    if (isset($email_args['username'])) {
      $subject = str_replace('%username%',$email_args['username'],$subject);
      $body = str_replace('%username%',$email_args['username'],$body);
    }
    if (isset($email_args['start'])) {
      $subject = str_replace('%start_time%',$email_args['start'],$subject);
      $body = str_replace('%start_time%',$email_args['start'],$body);
    }
    if (isset($email_args['end'])) {
      $subject = str_replace('%end_time%',$email_args['end'],$subject);
      $body = str_replace('%end_time%',$email_args['end'],$body);
    }
  }

  public static function send_admin_late_res_email($facility_name, $email_args)
  {
    $email_info = ezget("SELECT Email,Late_Reservation_Admin_Email_Body,Late_Reservation_Admin_Email_Subject FROM ".IAM_FACILITY_TABLE." WHERE Name=%s",$facility_name)[0];

    $email_subject = $email_info->Late_Reservation_Admin_Email_Subject;
    $email_template = $email_info->Late_Reservation_Admin_Email_Body;

    self::apply_email_filters($email_subject, $email_template, $email_args);

    iam_mail( $email_info->Email,
              $email_subject,
              $email_template,
              'Failed to send notification.' );

    send_to_debug_file( $email_info->Email );
    send_to_debug_file( $email_template );
  }

  public static function send_user_late_res_email($facility_name, $email_args)
  {
    $email_info = ezget("SELECT Email,Late_Reservation_User_Email_Body,Late_Reservation_User_Email_Subject FROM ".IAM_FACILITY_TABLE." WHERE Name=%s",$facility_name)[0];

    $email_subject = $email_info->Late_Reservation_User_Email_Subject;
    $email_template = $email_info->Late_Reservation_User_Email_Body;

    self::apply_email_filters($email_subject, $email_template, $email_args);

    iam_mail( $email_args['user_email'],
              $email_subject,
              $email_template,
              'Failed to send notification.' );

    send_to_debug_file( $email_args['user_email'] );
    send_to_debug_file( $email_template );
  }

  public static function send_facility_new_res_email($facility_name, $email_args)
  {
    $email_info = ezget("SELECT Email,New_Reservation_Email_Body,New_Reservation_Email_Subject FROM ".IAM_FACILITY_TABLE." WHERE Name=%s",$facility_name)[0];

    $email_subject = $email_info->New_Reservation_Email_Subject;
    $email_template = $email_info->New_Reservation_Email_Body;

    self::apply_email_filters($email_subject, $email_template, $email_args);

    iam_mail( $email_info->Email,
              $email_subject,
              $email_template,
              'Failed to send notification.' );

    send_to_debug_file( $email_info->Email );
    send_to_debug_file( $email_template );
  }

}
