<?php

/**
*
*/
class Settings_Page
{

    public static function admin_update_settings_callback()
    {
        foreach ($_POST as $key => $value) {
            if ( $key == 'action')
                continue;
            $v = IAM_Sec::textfield_cleaner($value);
            if ($key=='ipad_code') {
                if (get_setting_iam('ipad_code')!=$v) {
                    update_settings_iam('ipad_code_updated',time());
                }
            }
            update_settings_iam($key, $v);
        }
        iam_respond(SUCCESS);
    }

    public static function admin_update_rental_type_callback()
    {
        global $wpdb;
        //print_r($_POST);exit;
        $updated_vals = $_POST['updated_rental_types'];
        $new_vals = $_POST['new_rental_types'];
        foreach ($updated_vals as $key => $value) {

            if (!is_numeric($value['duration'])) {
                iam_throw_error(INVALID_INPUT_EXCEPTION);
            }
            $new_json = json_encode(['id'=>$key, 'duration'=>$value['duration'], 'label'=>IAM_Sec::textfield_cleaner($value['label']) ]);
            $wpdb->query($wpdb->prepare("UPDATE ".IAM_META_TABLE." SET Meta_Value=%s WHERE Meta_Key=%s",$new_json,RENTAL_PREFIX.$key));
        }
        foreach ($new_vals as $entry) {
            if (!is_numeric($entry['duration'])) {
                iam_throw_error(INVALID_INPUT_EXCEPTION);
            }
            $id = make_nid();
            $val = json_encode(['id'=>$id, 'duration'=>$entry['duration'], 'label'=>IAM_Sec::textfield_cleaner($entry['label']) ]);
            $wpdb->query($wpdb->prepare("INSERT INTO ".IAM_META_TABLE." (Meta_Key,Meta_Value) VALUES (%s,%s)",RENTAL_PREFIX.$id,$val));
        }
        iam_respond(SUCCESS);
    }

    public static function admin_delete_rental_type_callback()
    {
        global $wpdb;
        $replacement = IAM_Sec::textfield_cleaner($_POST['replacement']);
        $to_delete = IAM_Sec::textfield_cleaner($_POST['toDelete']);

        $wpdb->query($wpdb->prepare("UPDATE ".IAM_EQUIPMENT_TABLE." SET Rental_Type=%s WHERE Rental_Type=%s",$replacement,$to_delete));

        $wpdb->query($wpdb->prepare("DELETE FROM ".IAM_META_TABLE." WHERE Meta_Key=%s",RENTAL_PREFIX.$to_delete));
        iam_respond(SUCCESS);
    }

    public static function admin_update_account_type_callback()
    {
        global $wpdb;
        $updated_vals = $_POST['updated_account_types'];
        $new_vals = $_POST['new_account_types'];
        foreach ($updated_vals as $key => $value) {
            $id = IAM_Sec::iamDecrypt($key);
            if (!is_numeric($value['discount'])) {
                iam_throw_error(INVALID_INPUT_EXCEPTION);
            }
            $wpdb->query($wpdb->prepare("UPDATE ".IAM_ACCOUNT_TYPES_TABLE." SET Name=%s, Discount=%d WHERE Account_Type_ID=%d",IAM_Sec::textfield_cleaner($value['type']),$value['discount'],$id));
        }
        foreach ($new_vals as $entry) {
            if (!is_numeric($entry['discount'])) {
                iam_throw_error(INVALID_INPUT_EXCEPTION);
            }
            $wpdb->query($wpdb->prepare("INSERT INTO ".IAM_ACCOUNT_TYPES_TABLE." (Name,Discount) VALUES (%s,%d)",IAM_Sec::textfield_cleaner($entry['type']),$entry['discount']));
        }
        iam_respond(SUCCESS);
    }

    public static function admin_delete_account_type_callback()
    {
        global $wpdb;
        $replacement_results = $wpdb->get_results($wpdb->prepare("SELECT Account_Type_ID FROM ".IAM_ACCOUNT_TYPES_TABLE." WHERE Name=%s",IAM_Sec::textfield_cleaner($_POST['replacement']) ));
        $replacement_id = $replacement_results[0]->Account_Type_ID;
        $id = IAM_Sec::iamDecrypt($_POST['nid']);
        $wpdb->query($wpdb->prepare("UPDATE ".IAM_USERS_TABLE." SET Account_Type=%d WHERE Account_Type=%d",$replacement_id,$id));
        $wpdb->query($wpdb->prepare("DELETE FROM ".IAM_ACCOUNT_TYPES_TABLE." WHERE Account_Type_ID=%d",$id));
        iam_respond(SUCCESS);
    }

    public static function admin_report_bug_callback()
    {
        if (!BUG_REPORTING)
            exit;
        $current_user = wp_get_current_user();
        $message = "From Admin Side \n User: ".$current_user->user_login." Name Given: ".$_POST["from"]."\n Subject: ".$_POST["subject"]."\n Message: ".$_POST["message"];
        wp_mail('james.levasseur@maine.edu', 'Bug Report', $message);
        exit;
    }
}
