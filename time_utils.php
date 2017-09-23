<?php

function short_res_period()
{
  date_default_timezone_set(IMRC_TIME_ZONE);
  return date("Y-m-d 00:00:00", strtotime('-4 week'));
}
