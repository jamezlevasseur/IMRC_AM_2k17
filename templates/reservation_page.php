<?php
/**
*
*/
class IAM_Reservation_Page
{

	public static function get_child_tags()
	{
		$parent_tag = IAM_Sec::textfield_cleaner($_GET['parent_tag']);
		global $wpdb;
		$child_tag_results = $wpdb->get_results($wpdb->prepare("SELECT Tag FROM ".IAM_TAGS_TABLE." WHERE Parent=%s ",$parent_tag));
		$child_tags = [];
		foreach ($child_tag_results as $row) {
			$child_tags[] = $row->Tag;
		}
		iam_respond(SUCCESS,$child_tags);
	}

	private static function get_all_child_tag_ids ($tag) {
		global $wpdb;
		$all_tags = [];
		$unchecked_tags = [$tag];
		while (count($unchecked_tags)) {
			$results = $wpdb->get_results($wpdb->prepare("SELECT Tag,Tag_ID FROM ".IAM_TAGS_TABLE." WHERE Parent=%s", array_shift($unchecked_tags)));
			foreach ($results as $row) {
				$all_tags[] = $row->Tag_ID;
				$unchecked_tags[] = $row->Tag;
			}
		}
		//print_r($all_tags);
		//exit;
		return $all_tags;
	}

	private static function orNoInfo($key, $val, $test_val=false)
	{
		if ($test_val===false) {
			$test_val=$val;
		}
		if ($test_val=='' || $test_val==null) {
			return $key.'No info';
		}
		return $key.$val;
	}

	public static function make_equipment_block($is_out_of_order, $name, $photo_url, $manufacturer_info, $description, $pricing_description, $cert_name, $cert_id, $rental_period, $equip_root_tag)
	{
		global $wpdb;
		$current_username = wp_get_current_user()->user_login;
		$current_user_results = ezget("SELECT IAM_ID FROM ".IAM_USERS_TABLE." WHERE WP_Username=%s", $current_username);
		$iam_id = $current_user_results[0]->IAM_ID;
		$user_certs_results = $wpdb->get_results("SELECT Certification_ID FROM ".IAM_USER_CERTIFICATIONS_TABLE." WHERE IAM_ID='$iam_id'");
		$user_certs = [0];
		foreach ($user_certs_results as $row) {
			$user_certs[] = $row->Certification_ID;
		}
		$certified_html = in_array($cert_id, $user_certs) ? '' : '<div class="iam-equipment-not-certified">You are not certified for this equipment.</div>';
		$out_of_order = $is_out_of_order==1 ? '<div class="iam-out-of-order"><h2>OUT OF ORDER</h2><div class="iam-out-of-order-bg"></div></div>' : '';
		$button_disabled = ($is_out_of_order==1 || $certified_html!='') ? 'disabled' : '';
		$manufacturer_info = iam_output($manufacturer_info);
		if (strlen($manufacturer_info)>4) {
			$manufacturer_info = substr($manufacturer_info, 0, 4)=='http' ? IAM_Reservation_Page::orNoInfo('Manufacturer Info: ','<a href="'.$manufacturer_info.'" title="">'.$manufacturer_info.'</a>',$manufacturer_info) : IAM_Reservation_Page::orNoInfo('Manufacturer Info: ',$manufacturer_info) ;
		} else {
			$manufacturer_info = IAM_Reservation_Page::orNoInfo('Manufacturer Info: ',$manufacturer_info) ;
		}
		return '<div class="iam-equipment-block">
							'.$out_of_order.'
							<div class="iam-equipment-block-left">
								<div class="iam-equipment-title">'.iam_output($name).'</div>
								<div class="iam-equipment-photo"><img width="200" src="'.iam_output($photo_url).'" alt="picture of '.iam_output($name).'"></div>
							</div>
							<div class="iam-equipment-block-right">
								<div class="iam-equipment-manufacturer-info iam-equipment-sub-block">'.$manufacturer_info.'</div>
								<div class="iam-equipment-description iam-equipment-sub-block">'.IAM_Reservation_Page::orNoInfo('Description: ',iam_output($description)).'</div>
								<div class="iam-equipment-pricing iam-equipment-sub-block">'.IAM_Reservation_Page::orNoInfo('Pricing: ',iam_output($pricing_description)).'</div>
								<div class="iam-equipment-certifications iam-equipment-sub-block">'.IAM_Reservation_Page::orNoInfo('Certifications : ',iam_output($cert_name)).'</div>
								'.$certified_html.'
							</div>
							<div class="iam-equipment-block-button"><button class="iam-equipment-button" data-equiproot="'.iam_output($equip_root_tag).'" data-equip data-rental-period="'.$rental_period.'" '.$button_disabled.'>Select</button></div>
						</div>';
	}

	public static function get_equipment_for_tags()
	{
		$tags = gettype($_GET['tags'])=='string' ? [$_GET['tags']] : $_GET['tags'];
		if (gettype($tags)!='array')
			return;
		global $wpdb;
		$equipment_blocks = [];
		//to make sure same equip isn't grabbed twice due to overlapping tags
		$added_equip_ids = [];
		for ($i=0; $i < count($tags); $i++) {
			$all_tag_ids = [];
			$current_tag = IAM_Sec::textfield_cleaner($tags[$i]);
			$tag_id_results = $wpdb->get_results($wpdb->prepare("SELECT Tag_ID FROM ".IAM_TAGS_TABLE." WHERE Tag=%s",$current_tag));
			$all_tag_ids[] = $tag_id_results[0]->Tag_ID;
			$all_tag_ids = array_merge($all_tag_ids, IAM_Reservation_Page::get_all_child_tag_ids($current_tag));
			for ($k=0; $k < count($all_tag_ids); $k++) {
				$tag_id = $all_tag_ids[$k];
				$equipment_id_results = $wpdb->get_results($wpdb->prepare("SELECT Equipment_ID FROM ".IAM_TAGS_EQUIPMENT_TABLE." WHERE Tag_ID=%d ",$tag_id));

				if ($equipment_id_results===false) {
					iam_throw_error("Error - Tagging Error");
				}
				foreach ($equipment_id_results as $row) {
					$equip_id = $row->Equipment_ID;
					if (!in_array($equip_id, $added_equip_ids)) {
						$added_equip_ids[] = $equip_id;
						$equip_results = $wpdb->get_results($wpdb->prepare("SELECT * FROM ".IAM_EQUIPMENT_TABLE." WHERE Equipment_ID=%d",$equip_id));
						if (empty($equip_results))
							continue;
						$equip_row = $equip_results[0];
						$cert_id = $equip_row->Certification_ID;
						$cert_name = ezget("SELECT Name FROM ".IAM_CERTIFICATION_TABLE." WHERE Certification_ID=%d ",$cert_id);
						if (!empty($cert_name))
							$cert_name = $cert_name[0]->Name;
						else
							$cert_name = '';
						$rental_type = get_rental_period($equip_row->Rental_Type);
						$photo_url = $equip_row->Photo==null ? IAM_DEFAULT_LARGE_PICTURE : $equip_row->Photo;
						$equipment_blocks[$equip_row->Name] = IAM_Reservation_Page::make_equipment_block(
							$equip_row->Out_Of_Order,
							$equip_row->Name,
							$photo_url,
							$equip_row->Manufacturer_Info,
							$equip_row->Description,
							$equip_row->Pricing_Description,
							$cert_name,
							$cert_id,
							$rental_type,
							$equip_row->Root_Tag);
					}
				}
			}
		}
		ksort($equipment_blocks);

		$html = '';
		foreach ($equipment_blocks as $key => $value) {
			//checks against blank entries
			if (strlen($key)) {
				$html.=$value;
			}
		}
		if ($html=='')
			$html = '<div class="iam-server-title">Whoops!</div><div class="iam-server-message">No equipment in this category.</div>';
		return $html;
	}

	public static function get_equipment()
	{
		global $wpdb;
		$query = "SELECT * FROM ".IAM_EQUIPMENT_TABLE." ORDER BY Name ASC";
		$results = $wpdb->get_results($query);
		$html = "";
		foreach ($results as $row) {
			$cert_id = $row->Certification_ID;
			$cert = ezget("SELECT Name FROM ".IAM_CERTIFICATION_TABLE." WHERE Certification_ID=%d ", $cert_id);
			$cert_name = '';
			if (!empty($cert))
				$cert_name = $cert[0]->Name;
			$photo_url = $row->Photo==null ? IAM_DEFAULT_LARGE_PICTURE : $row->Photo;
			$html .= IAM_Reservation_Page::make_equipment_block(
				$row->Out_Of_Order,
				$row->Name,
				$photo_url,
				$row->Manufacturer_Info,
				$row->Description,
				$row->Pricing_Description,
				$cert_name,
				$cert_id,
				get_rental_period($row->Rental_Type),
				$row->Root_Tag);
		}
		return $html;
	}

	public static function delete_user_reservation()
	{
		global $wpdb;
		$ni_id = IAM_Sec::textfield_cleaner($_POST['val']);
		$wpdb->query($wpdb->prepare("DELETE FROM ".IAM_RESERVATION_TABLE." WHERE NI_ID=%s",$ni_id));
		iam_respond(SUCCESS);
	}

	public static function get_user_reservations()
	{
		global $wpdb;
		global $current_user;
		date_default_timezone_set(IMRC_TIME_ZONE);
		$today = date("Y-m-d 00:00:00");
		get_currentuserinfo();
		$username = $current_user->user_login;
		$user_results = $wpdb->get_results($wpdb->prepare("SELECT IAM_ID FROM ".IAM_USERS_TABLE." WHERE WP_Username=%s",$username));
		$iam_id = $user_results[0]->IAM_ID;
		if ($iam_id===null || $iam_id===false) {
			return '';
		}
		$reservation_results = $wpdb->get_results($wpdb->prepare("SELECT * FROM ".IAM_RESERVATION_TABLE." WHERE IAM_ID=%d AND Start_Time >= '$today'",$iam_id));
		$html = '';
		foreach ($reservation_results as $res_row) {
			$equip_id = $res_row->Equipment_ID;
			$equip_results;

			$equip_results = $wpdb->get_results($wpdb->prepare("SELECT Name,Root_Tag FROM ".IAM_EQUIPMENT_TABLE." WHERE Equipment_ID=%d ",$equip_id));

			$root_tag = $equip_results[0]->Root_Tag;
			$equip_name = $equip_results[0]->Name;
			if ($equip_name===null || $equip_name===false) {
				continue;
			}

			if ($root_tag=='Equipment Room') {
				$end_time = explode(' ', $res_row->End_Time)[0].' '.get_late_check_time($root_tag);
				$start_format = 'M d';
				$end_format = 'M d \d\u\e \a\t g:i a';
			} else {
				$end_time = $res_row->End_Time;
				$start_format = 'M d \a\t g:i a';
				$end_format = 'M d \a\t g:i a';
			}

			$start_time = DateTime::createFromFormat('Y-m-d H:i:s',$res_row->Start_Time);
			$start_time = $start_time->format($start_format);

			$end_time = DateTime::createFromFormat('Y-m-d H:i:s',$end_time);
			$end_time = $end_time->format($end_format);

			$html.= '<div class="iam-existing-res">
						<input class="iam-ninja" value="'.iam_output($res_row->NI_ID).'">
						<div class="iam-existing-res-equip-name">'.iam_output($equip_name).' </div>
						<div class="iam-existing-res-date"> '.iam_output($start_time).' <b>to</b><br /> '.iam_output($end_time).'</div>
						<button class="iam-existing-res-del-button"></button>
					</div>';
		}
		if ($html=='') {
			$html='<div class="iam-server-message">You have no reservations!</div>';
		}
		return $html;
	}

	public static function res_banner()
	{
		return '
		<div class="iam-banner iam-res-banner">
			The Equipment Room is under going an update. <br /><br /> Online reservations for the Equipment Room will be available soon!
		</div>';
	}

	public static function get()
	{

		global $wpdb;
		$current_user = wp_get_current_user();
  	get_currentuserinfo();
  	$has_priv = get_user_meta($current_user->ID,IAM_RESERVATIONS_PRIVILEGE_META);

		if (count($has_priv)>0 && $has_priv!=false) {
			Utils_Public::render_page_for_login_status('<h1>Your reservation privileges have been removed</h1><p>Please contact an admin for further assistance.</p>');
			return;
		} else {
			$can_reserve_er = 1;
			$user_bal = $wpdb->get_results("SELECT Balance FROM ".IAM_USERS_TABLE." WHERE WP_ID=".$current_user->ID)[0]->Balance;
			if ((float)$user_bal<(float)get_setting_iam(LATE_CHARGE_FEE_KEY)) {
				$can_reserve_er = 0;
			}
		}
		$facility_results = $wpdb->get_results("SELECT * FROM ".IAM_FACILITY_TABLE);
		$facility_crumb_buttons = '';
		$facility_html = '';
		$facility_names = '';
		$root_tags = [];
		foreach ($facility_results as $row) {
			$tag_id = $row->Tag_ID;
			$tag = $wpdb->get_results("SELECT Tag FROM ".IAM_TAGS_TABLE." WHERE Tag_ID='$tag_id'")[0]->Tag;
			$row_scheduling = json_decode($row->Schedule);
			$root_tags[] = $tag;
			$tag = strtolower(str_replace(' ', '_', $tag));
			$facility_names.=$tag.',';
			$facility_html.='data-'.$tag.'="'.iam_output($row->Schedule).'" ';
			$facility_crumb_buttons .= '<button class="iam-crumb-button">'.$row->Name.'</button>';
		}
		$facility_names = substr($facility_names, 0, strlen($facility_names)-1);
		$html = '<div id="iam-res">'.IAM_Reservation_Page::res_banner().'
		<p class="iam-page-header">Available Equiment</p>
		<div class="iam-ninja iam-cal-data" data-late-fee="'.get_setting_iam(LATE_CHARGE_FEE_KEY).'" data-can-res-er="'.$can_reserve_er.'" data-names="'.iam_output($facility_names).'" '.$facility_html.' data-root-tags="'.iam_output(implode(',',$root_tags)).'"></div>
		<div class="iam-res-left-top">
			<div class="iam-search-container">
				<input type="search" placeholder="search..." class="iam-search iam-reservations-search">
			</div>
			<div id="iam-res-crumb-buttons">'.$facility_crumb_buttons.'</div><br>
			<div class="iam-crumb-container"><div id="iam-crumb-root"></div><div id="iam-res-crumb"></div></div>
		</div>
		<div class="iam-res-left">'.IAM_Reservation_Page::get_equipment().'
		</div>
		<div id="iam-res-right"><div id="iam-res-right-title">Existing Reservations</div><div id="iam-existing-res-container">'.IAM_Reservation_Page::get_user_reservations().'</div></div>
		</div>';

		$current_user = wp_get_current_user();
		$html.= '<div class="iam-res-popup iam-ninja">
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

		Utils_Public::render_page_for_login_status($html);
	}

}
