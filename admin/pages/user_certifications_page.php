<?php

/**
* 
*/
class User_Certifications_Page
{

    public static function admin_add_certifications_to_users_callback()
    {
        global $wpdb;
        $cert_id = $wpdb->get_results($wpdb->prepare("SELECT Certification_ID FROM ".IAM_CERTIFICATION_TABLE." WHERE Name=%s",IAM_Sec::textfield_cleaner($_POST['certification'])))[0]->Certification_ID;
        for ($i=0; $i < count($_POST['users']); $i++) {
            $iam_id = $wpdb->get_results($wpdb->prepare("SELECT IAM_ID FROM ".IAM_USERS_TABLE." WHERE WP_Username=%s",IAM_Sec::textfield_cleaner($_POST['users'][$i])))[0]->IAM_ID;
            //check to see if this user already has this cert, if not add it
            if (!count($wpdb->get_results($wpdb->prepare("SELECT * FROM ".IAM_USER_CERTIFICATIONS_TABLE." WHERE IAM_ID=%d AND Certification_ID=%d",$iam_id,$cert_id)))) {
                $wpdb->query($wpdb->prepare("INSERT INTO ".IAM_USER_CERTIFICATIONS_TABLE." (IAM_ID,Certification_ID) VALUES (%d,%d)",$iam_id,$cert_id));
            }
        }
        iam_respond(SUCCESS);
    }

    public static function admin_remove_certifications_to_users_callback()
    {
        global $wpdb;

        $cert_id = $wpdb->get_results($wpdb->prepare("SELECT Certification_ID FROM ".IAM_CERTIFICATION_TABLE." WHERE Name=%s",IAM_Sec::textfield_cleaner($_POST['certification'])))[0]->Certification_ID;
        for ($i=0; $i < count($_POST['users']); $i++) {
            $iam_id = $wpdb->get_results($wpdb->prepare("SELECT IAM_ID FROM ".IAM_USERS_TABLE." WHERE WP_Username=%s",IAM_Sec::textfield_cleaner($_POST['users'][$i])))[0]->IAM_ID;
            $wpdb->query($wpdb->prepare("DELETE FROM ".IAM_USER_CERTIFICATIONS_TABLE." WHERE IAM_ID=%d AND Certification_ID=%d",$iam_id,$cert_id));
        }
        iam_respond(SUCCESS);
    }

    public static function admin_get_user_certifications_callback()
    {
        global $wpdb;
        $iam_id = $wpdb->get_results($wpdb->prepare("SELECT IAM_ID FROM ".IAM_USERS_TABLE." WHERE NI_ID=%s",IAM_Sec::textfield_cleaner($_GET['nid'])))[0]->IAM_ID;
        if (!$iam_id) {
            iam_throw_error("Error - Could not find user.");
        }
        $users_cert_results = $wpdb->get_results($wpdb->prepare("SELECT Certification_ID FROM ".IAM_USER_CERTIFICATIONS_TABLE." WHERE IAM_ID=%d",$iam_id));
        if (count($users_cert_results)<1) {
            exit("None");
        }
        $html = '';
        foreach ($users_cert_results as $row) {
            $html.= $wpdb->get_results($wpdb->prepare("SELECT Name FROM ".IAM_CERTIFICATION_TABLE." WHERE Certification_ID=%d", $row->Certification_ID))[0]->Name;
            $html.= '<br />';
        }
        iam_respond(SUCCESS,$html);
    }
}