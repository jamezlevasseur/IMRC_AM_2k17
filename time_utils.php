<?php

function short_res_period()
{
  date_default_timezone_set(IMRC_TIME_ZONE);
  return date("Y-m-d 00:00:00", strtotime('-4 week'));
}

function format_res_time($time)
{
  date_default_timezone_set(IMRC_TIME_ZONE);

  $f = DateTime::createFromFormat('Y-m-d H:i:s',$time);
  return $f->format('M d, Y \a\t g:i a');
}
