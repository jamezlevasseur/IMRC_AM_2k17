<?php

/**
*
*/
class Public_Content
{
    public static function render_rental_cron_page()
    {
      send_to_debug_file("RUNNING RENTAL CRON");
      Utils_Public::rental_late_reservations_check();
    }

    public static function render_appointment_cron_page()
    {
      send_to_debug_file("RUNNING APPOINTMENT CRON");
      Utils_Public::appointment_late_reservations_check();
    }

    public static function render_reservation_page()
    {
        return IAM_Reservation_Page::get();
    }

    public static function render_certification_page()
    {
        return  IAM_Certification_Page::get();
    }

    public static function render_faq_page()
    {
        return IAM_FAQ_Page::get();
    }

    public static function render_training_page()
    {
        return IAM_Training_Page::get();
    }

    public static function render_checkout_page()
    {
        return IAM_Checkout_Page::get();
    }

    public static function render_account_balances_page()
    {
        return IAM_User_Account_Page::get();
    }

}
