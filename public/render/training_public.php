<?php

/**
* 
*/
class Training_Public
{

    public static function training_email_callback()
    {
        $message = IAM_Sec::textfield_cleaner($_POST['message']);
        $current_user = wp_get_current_user();
        iam_mail(get_setting_iam('training_email'),'IMRC Training',$message.' <br /><br /> Sent from user: '.$current_user->user_login,'Failed to send training email.');
        iam_respond(SUCCESS,'',IAM::$status_message);
    }
}