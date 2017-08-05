<?php

/**
* 
*/
class Registration_Page
{

    public static function admin_delete_registration_key_callback()
    {
        $id = IAM_Sec::iamDecrypt($_POST['nid']);
        if (!is_numeric($id))
            iam_throw_error('Error - bad nid');
        global $wpdb;
        $wpdb->query($wpdb->prepare("DELETE FROM ".IAM_META_TABLE." WHERE Meta_ID=%d",$id));
        iam_respond(SUCCESS,json_encode([$id,$_POST]));
    }

    public static function admin_make_registration_key_callback()
    {
        global $wpdb;
        if ($_POST['key']=='') {
            $names = explode("\n",file_get_contents(IAM_DIR.'animal-words.txt'));
            $key = $names[rand(0,count($names))].rand(100,999);
        } else {
            $key = IAM_Sec::textfield_cleaner($_POST['key']);
        }
        $expiration = IAM_Sec::textfield_cleaner($_POST['expiration']);
        $expiration = $expiration==null ? '' : $expiration;
        $value = json_encode(['key'=>$key,'expiration'=>$expiration]);
        $wpdb->query("INSERT INTO ".IAM_META_TABLE." (Meta_Key, Meta_Value) VALUES ('".REGISTRATION_KEY."','$value')");
        iam_respond(SUCCESS);
    }

    public static function admin_approve_new_user_callback()
    {
        global $wpdb;
        $user_results = $wpdb->get_results($wpdb->prepare("SELECT ID,user_email FROM ".$wpdb->prefix."users WHERE user_login=%s",IAM_Sec::textfield_cleaner($_POST['user'])));
        $user_id = $user_results[0]->ID;
        $user_email = $user_results[0]->user_email;
        delete_user_meta($user_id, 'iam_need_admin_approval');
        iam_mail($user_email,'Your IMRC account has been approved','Congratulations, <br /><br /> Your account for the imrcaccounts.com has been approved. Please login at your leisure with the username "'.IAM_Sec::textfield_cleaner($_POST['user']).'" and the password you chose at registration. <br /><br /> The IMRC Team');
        iam_respond(SUCCESS,'',IAM::$status_message);
    }

    public static function admin_deny_new_user_callback()
    {
        global $wpdb;
        $user_id = $wpdb->get_results($wpdb->prepare("SELECT ID FROM ".$wpdb->prefix."users WHERE user_login=%s",IAM_Sec::textfield_cleaner($_POST['user'])))[0]->ID;
        wp_delete_user($user_id);
        iam_respond(SUCCESS);
    }


}