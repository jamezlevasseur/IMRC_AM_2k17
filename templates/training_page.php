<?php

/**
*
*/
class IAM_Training_Page
{

	public static function get()
	{
		$html = '
		<p class="iam-page-header">Training Inquiry</p>
		<div class="iam-training-container">
			<label><label for="iam-training-comment">Please indicate what training you are interested in and we will contact you about a time and date to complete it (required)</label><br>
			<textarea class="iam-training-comment" cols="100" rows="10"></textarea></label><br><br>
			<input type="submit" name="submit">
		</div>
		';
		return Utils_Public::render_page_for_login_status($html);
	}

}
