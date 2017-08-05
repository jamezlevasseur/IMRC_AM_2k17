<?php

/**
* 
*/
class Reservations_Page
{

    public static function admin_update_reservations_callback()
    {
        IAM_Cal::update_equipment_cal();
    }


}