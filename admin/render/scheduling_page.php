<?php

/**
*
*/
class Scheduling_Page
{

    public static function make_rental_block($period, $hours_description)
    {
        return '<br />
        <label>Rental period (in days): <input class="iam-rental-period" type="number" value="'.iam_output($period).'"></label><br /><br />
        <label>Tell your users when you are open:</label><br /><textarea class="iam-rental-hours-description" cols="30">'.iam_output($hours_description).'</textarea>';
    }

    public static function admin_get_rental_info_template_callback()
    {
        iam_respond(SUCCESS,Scheduling_Page::make_rental_block('',''));
    }

    public static function admin_get_appointment_info_template_callback()
    {
        iam_respond(SUCCESS,Scheduling_Page::make_appointment_info_template());
    }

}
