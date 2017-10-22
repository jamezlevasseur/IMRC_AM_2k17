<?php

/**
*
*/
class IAM_Funds_Handler
{

	public static function update($username,$include_pending_balance=false)
	{
		global $wpdb;
		$charges_result = $wpdb->get_results($wpdb->prepare("SELECT Amount FROM ".IAM_CHARGE_TABLE." WHERE WP_Username=%s AND (Status='1')",$username));

		$total = 0;

		foreach ($charges_result as $row) {
			$total += $row->Amount;
		}
		$total = round($total,2);

		$result = $wpdb->query( $wpdb->prepare("UPDATE ".IAM_USERS_TABLE." SET Balance = %f WHERE WP_Username = %s ",$total,$username) );

		if ($include_pending_balance) {
			$charges_result = $wpdb->get_results($wpdb->prepare("SELECT Amount FROM ".IAM_CHARGE_TABLE." WHERE WP_Username=%s AND (Status='1' OR Status='0') ",$username));

			$pending_total = 0;

			foreach ($charges_result as $row) {
				$pending_total += $row->Amount;
			}
			$pending_total = round($pending_total,2);
			return number_format($total,2).' ('.$pending_total.')';
		}
		return number_format($total,2);
	}

	public static function get_pending_bal($username)
	{
		global $wpdb;

		$charges_result = $wpdb->get_results($wpdb->prepare("SELECT Amount FROM ".IAM_CHARGE_TABLE." WHERE WP_Username=%s AND (Status='1' OR Status='0') ",$username));

		$pending_total = 0;

		foreach ($charges_result as $row) {
			$pending_total += $row->Amount;
		}

		$pending_total = round($pending_total,2);
		return $pending_total;
	}

	public static function check_low_funds($username)
	{
		/* finish later, not require feature
		global $wpdb;
		$charges_result = $wpdb->get_results($wpdb->prepare("SELECT Amount FROM ".IAM_CHARGE_TABLE." WHERE WP_Username=%s AND (Status='1' OR Status='0')",$username));

		$total = 0;

		foreach ($charges_result as $row) {
			$total += $row->Amount;
		}
		if ($total<0) {
			$user_results = $wpdb->get_results($wpdb->prepare("SELECT user_email FROM ".$wpdb->prefix."users WHERE user_login=%s",$username));
			$user_email = $user_results[0]->user_email;
			iam_mail($user_email,'Negative Funds','Hello, <br /> <br /> This message is to notify you that your account funds for the IMRC are in the red. Currently you have $'.round($total,2).' in your account. You will need to  <br /> <br /> -The IMRC team');
			iam_mail(get_setting_iam('fab_lab_email'),'Negative Funds For '.$username,'');

		} else if ($total<5) {
			$user_results = $wpdb->get_results($wpdb->prepare("SELECT user_email FROM ".$wpdb->prefix."users WHERE user_login=%s",$username));
			$user_email = $user_results[0]->user_email;
			iam_mail($user_email,'You Have Low Funds','Hello, <br /> <br /> This message is to notify you that your account funds for the IMRC are low. Currently you have $'.round($total,2).' left if you account. <br /> <br /> -The IMRC team');
		}*/
	}

}
