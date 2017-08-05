<?php 

/**
* 
*/
class IAM_Reservation_Popup 
{

	public static function get()
	{
		$current_user = wp_get_current_user();
		$html= '<div class="iam-res-popup">
			<div class="iam-res-popup-header"><div class="iam-x fa fa-close fa-4"></div></div>
			<div class="iam-res-popup-body">
				<div class="iam-events">
					<h4 style="font-weight:bold;color:#248cc8;text-align:center;">DRAG ME OVER --></h4>
					<div class="fc-event">'.$current_user->user_login.'</div>
					<div class="iam-facility-info"></div>
					<div class="iam-popup-submit"><button type="button">Submit</button></div>
				</div>
				<div class="iam-res-cal"></div>
			</div>
			<textarea class="iam-textarea iam-res-comment" placeholder="Additional details go here." rows="4"></textarea>
		</div>';
		iam_respond(SUCCESS, $html);

	}

}