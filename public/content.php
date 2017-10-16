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
        echo IAM_Reservation_Page::get();
    }

    public static function render_certification_page()
    {
        echo IAM_Certification_Page::get();
    }

    public static function render_faq_page()
    {
        echo IAM_FAQ_Page::get();
    }

    public static function render_training_page()
    {
        echo IAM_Training_Page::get();
    }

    public static function render_checkout_page()
    {
        echo IAM_Checkout_Page::get();
        exit;
    }

    public static function render_account_balances_page()
    {
        echo IAM_User_Account_Page::get();
    }

}
