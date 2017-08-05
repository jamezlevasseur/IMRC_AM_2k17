<?php

/**
* 
*/
class User_Privileges_Page
{

    public static function admin_user_privileges_callback()
    {
        global $wpdb;
        for ($i=0; $i < count($_POST['approved']); $i++) {
            $id = $wpdb->get_results($wpdb->prepare("SELECT WP_ID FROM ".IAM_USERS_TABLE." WHERE WP_Username=%s",IAM_Sec::textfield_cleaner($_POST['approved'][$i])))[0]->WP_ID;
            delete_user_meta($id,IAM_RESERVATIONS_PRIVILEGE_META);
        }
        for ($i=0; $i < count($_POST['denied']); $i++) {
            $id = $wpdb->get_results($wpdb->prepare("SELECT WP_ID FROM ".IAM_USERS_TABLE." WHERE WP_Username=%s",IAM_Sec::textfield_cleaner($_POST['denied'][$i])))[0]->WP_ID;
            add_user_meta($id,IAM_RESERVATIONS_PRIVILEGE_META,'denied');
        }
        iam_respond(SUCCESS);
    }

}