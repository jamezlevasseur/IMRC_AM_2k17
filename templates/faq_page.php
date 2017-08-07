<?php

/**
* 
*/
class IAM_FAQ_Page
{

	public function get()
	{
		
		$html = '
		<p class="iam-page-header">Frequently Asked Questions</p>
		<div class="iam-faq-container">
		<strong>Who can use the facilities at the IMRC Center?</strong>

		<p>The IMRC Center is open to everyone in the state of Maine. Students and faculty at the University of Maine frequent the facility for both academic and personal projects, and we welcome community members to utilize the equipment, labs, and classrooms as well.</p>

		<br>
		<strong>What are the hours of operation for the Fabrication Labs at the IMRC Center?</strong>

		<p>Fabrication Labs:<br>

		Monday: 9am-9pm<br>

		Tuesday: 9am-7pm<br>

		Wednesday: 9am-9pm<br>

		Thursday: 9am-9pm<br>

		Friday: 9am-9pm<br>

		Saturday &amp; Sunday: <a href="mailto:gene.felice@maine.edu">Contact us</a></p>

		<br>

		<strong>What are the hours of operation for the equipment room at the IMRC Center?</strong>

		<p>Monday - Friday 10am to 2pm</p>

		<br>
		<strong>I have been trained on 3D printers, laser cutters/etchers, etc. before, do I still need to complete the IMRC trainings?</strong>

		<p>For your safety we ask that you complete our in-house trainings even if you\'ve been trained on similar equipment at another lab.</p>

		<br>
		<strong>I have a project in mind but I may need assistance. Is there anyone at the IMRC that can help me?</strong>

		<p>Our techs are happy to assist you with your projects. Tech assistance is charged at a rate of $26/hour ($13/hour for students at the University of Maine).</p>

		<br>
		<strong>Is there a list of prices for equipment use?</strong>

		<p>Please see below.</p>

		<a href="http://imrc.jameslevasseur.com/wp-content/uploads/2015/12/Price-Poster1.jpg" rel="attachment wp-att-66"><img class="alignnone wp-image-66 size-large" src="http://imrc.jameslevasseur.com/wp-content/uploads/2015/12/Price-Poster1-1024x683.jpg" alt="Price Poster" width="720" height="480" /></a>

		<p>Don\'t see your question listed? <a href="mailto:admin@imrc.com" target="_blank">Contact us for more information</a></p>
		</div>'
		;
		Utils_Public::render_page_for_login_status($html);
	}

}
