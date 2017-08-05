<?php

/**
* 
*/
class Public_Content
{
    
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
        echo IAM_Account_Balance_Page::get();
    }

}