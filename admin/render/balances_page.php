<?php

/**
*
*/
class Balances_Page
{

    public static function admin_balances_callback()
    {
        global $wpdb;
        $ni_id = md5(uniqid());
        $username = IAM_Sec::textfield_cleaner($_POST['username']);
        $iam_id = $wpdb->get_results($wpdb->prepare("SELECT IAM_ID FROM ".IAM_USERS_TABLE." WHERE WP_Username=%s",$username))[0]->IAM_ID;
        $approver_username = wp_get_current_user()->user_login;
        date_default_timezone_set(IMRC_TIME_ZONE);
        $rightnowat = date('Y-m-d \a\t H:i:s');
        $rightnow = date('Y-m-d H:i:s');
        $charge_description = "Account funds for ".$username." adjusted on ".$rightnowat." by ".$approver_username;
        $wpdb->query($wpdb->prepare("INSERT INTO ".IAM_CHARGE_TABLE." (NI_ID,WP_Username,Charge_Description,Status,Date,Amount,Comment,Approver) VALUES (%s,%s,%s,'1',%s,%f,%s,%s)",$ni_id,$username,$charge_description,$rightnow,IAM_Sec::textfield_cleaner($_POST['amount']),IAM_Sec::textfield_cleaner($_POST['comment']),$approver_username));
        IAM_Funds_Handler::update($username);
        iam_respond(SUCCESS);
    }

    public static function admin_get_charge_table()
    {
        require_once iam_dir(). 'templates/user_account_page.php';
        global $wpdb;
        if (isset($_GET['nid'])) {
            $iam_id = $wpdb->get_results($wpdb->prepare("SELECT IAM_ID FROM ".IAM_USERS_TABLE." WHERE NI_ID=%s",IAM_Sec::textfield_cleaner($_GET['nid'])))[0]->IAM_ID;
        } else {
            $iam_id = 0;
        }
        $html = '<table id="iam-user-charges-table">' . IAM_User_Account_Page::get_charge_table_head() . '<tbody>'. IAM_User_Account_Page::get_table_rows_for_id($iam_id, true) . '</tbody></table><br><button type="button" class="iam-secondary-button iam-csv-button">generate csv</button>';
        iam_respond(SUCCESS,$html);
    }

}
