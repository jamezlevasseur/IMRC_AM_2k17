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

  public static function apply_email_filters($string, $email_args)
  {
    $search = [];
    $replace = [];
    if (isset($email_args['comment'])) {
      $search[] = '%comment%';
      $replace[] = $email_args['comment'];
    }
    if (isset($email_args['fee'])) {
      $search[] = '%fee%';
      $replace[] = $email_args['fee'];
    }
    if (isset($email_args['datetime'])) {
      $search[] = '%time_of_reservation%';
      $replace[] = $email_args['datetime'];
    }
    if (isset($email_args['schedule_description'])) {
      $search[] = '%schedule_description%';
      $replace[] = $email_args['schedule_description'];
    }
    if (isset($email_args['equipment'])) {
      $search[] = '%equipment%';
      $replace[] = $email_args['equipment'];
    }
    if (isset($email_args['notification_num'])) {
      $search[] = '%notification_number%';
      $replace[] = $email_args['notification_num'];
    }
    if (isset($email_args['username'])) {
      $search[] = '%username%';
      $replace[] = $email_args['username'];
    }
    if (isset($email_args['start'])) {
      $search[] = '%start_time%';
      $replace[] = $email_args['start'];
    }
    if (isset($email_args['end'])) {
      $search[] = '%end_time%';
      $replace[] = $email_args['end'];
    }
    $string = str_replace($search,$replace,$string);
    return $string;
  }

  public static function send_admin_late_res_email($facility_name, $email_args)
  {
    $email_info = ezget("SELECT Email,Late_Reservation_Admin_Email_Body,Late_Reservation_Admin_Email_Subject FROM ".IAM_FACILITY_TABLE." WHERE Name=%s",$facility_name)[0];

    $email_subject = $email_info->Late_Reservation_Admin_Email_Subject;
    $email_template = $email_info->Late_Reservation_Admin_Email_Body;

    $email_subject = self::apply_email_filters($email_subject, $email_args);
    $email_template = self::apply_email_filters($email_template, $email_args);

    iam_mail( $email_info->Email,
              $email_subject,
              $email_template,
              'Failed to send notification.' );
  }

  public static function send_user_late_res_email($facility_name, $email_args)
  {
    $email_info = ezget("SELECT Email,Late_Reservation_User_Email_Body,Late_Reservation_User_Email_Subject FROM ".IAM_FACILITY_TABLE." WHERE Name=%s",$facility_name)[0];

    $email_subject = $email_info->Late_Reservation_User_Email_Subject;
    $email_template = $email_info->Late_Reservation_User_Email_Body;

    $email_subject = self::apply_email_filters($email_subject, $email_args);
    $email_template = self::apply_email_filters($email_template, $email_args);

    iam_mail( $email_args['user_email'],
              $email_subject,
              $email_template,
              'Failed to send notification.' );
  }

  public static function send_facility_new_res_email($facility_name, $email_args)
  {
    $email_info = ezget("SELECT Email,New_Reservation_Email_Body,New_Reservation_Email_Subject FROM ".IAM_FACILITY_TABLE." WHERE Name=%s",$facility_name)[0];

    $email_subject = $email_info->New_Reservation_Email_Subject;
    $email_template = $email_info->New_Reservation_Email_Body;

    $email_subject = self::apply_email_filters($email_subject, $email_args);
    $email_template = self::apply_email_filters($email_template, $email_args);

    iam_mail( $email_info->Email,
              $email_subject,
              $email_template,
              'Failed to send notification.' );
  }

}
