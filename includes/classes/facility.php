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

}
