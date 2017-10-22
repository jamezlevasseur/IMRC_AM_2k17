<?php

/**
 * Forms and functions for forms in the admin menu
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    IAM
 * @subpackage IAM/admin-forms
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Description here
 *
 * @package    IAM
 * @subpackage IAM/admin-forms
 * @author     Your Name <email@example.com>
 */

class IAM_Admin_Forms
{
	//cert constants
	const CERTIFICATION_NAME_LABEL = '<label for="name">Name: <span style="background:none;" title="Does not accept underscores, semi-colons, or single quotes"><i style="font-size:20px;" class="fa fa-question-circle"></i></span></label>';
	const CERTIFICATION_TIME_LABEL = '<label for="time">Approximate Length of Required Training:</label>';
	const CERTIFICATION_DESCRIPTION_LABEL = '<label for="description">Description:</label>';
	const CERTIFICATION_SUPPORT_LABEL = '<label for="supporting">Supporting Materials (Accepts .pdf, .doc, .png, .jpg, jpeg):</label>';
	const CERTIFICATION_PHOTO_LABEL = '<label for="photo">Photo: </label>';
	const CERTIFICATION_REQUIRED_LABEL = '<label style="display:inline;" for="required">Required: </label>';

	//equip constants
	const EQUIPMENT_PHOTO_LABEL = '<label for="photo">Item Photo:</label>';
	const EQUIPMENT_NAME_LABEL = '<label for="name">Item Name <span style="background:none;" title="Does not accept underscores, semi-colons, or single quotes"><i style="font-size:20px;" class="fa fa-question-circle"></i></span>:</label>';
	const EQUIPMENT_MANUFACTURER_INFO_LABEL = '<label for="manufacturer-info">Manufacturer Info:</label>';
	const EQUIPMENT_DESCRIPTION_LABEL = '<label for="description">Item Description:</label>';
	const EQUIPMENT_PRICING_DESCRIPTION_LABEL = '<label for="pricing-description">Pricing Description:</label>';
	const EQUIPMENT_CERTICATION_LABEL = '<label for="certification">Certification Required:</label>';
	const EQUIPMENT_TAGS_LABEL = '<label for="tags">Tags:</label>';
	const EQUIPMENT_ON_SLIDE_SHOW = '<label style="display:inline;" for="slide-show">Appear on Slideshow: </label>';
	const EQUIPMENT_OUT_OF_ORDER = '<label style="display:inline;" for="out-of-order">Out of Order: </label>';
	const EQUIPMENT_COMMENTS = '<label for="internal-comments">Internal Comments: </label>';

	public static function update_existing_file_list()
	{
		global $wpdb;
		$nid = $_GET['x'];
		$cert_id = $wpdb->get_results($wpdb->prepare("SELECT File_ID FROM ".IAM_CERTIFICATION_TABLE." WHERE NI_ID=%s ",$nid))[0]->Certification_ID;
		$supporting_files_results = $wpdb->get_results($wpdb->prepare("SELECT File_ID FROM ".IAM_SUPPORTING_FILES_TABLE." WHERE Certification_ID=%d ",$cert_id));
		$supporting_files = [];
		foreach ($supporting_files_results as $row) {
			$file_results = $wpdb->get_results($wpdb->prepare("SELECT Name FROM ".IAM_FILES_TABLE." WHERE File_ID=%d",$row->File_ID));
			$supporting_files[] = $file_results[0]->Name;
		}
		$list_html = "";
		for ($i=0; $i < count($supporting_files); $i++) {
			$list_html.='<div class="iam-existing-upload">'.iam_output($supporting_files[$i]).'<span class="iam-existing-upload-x"></span></div>';
		}
		iam_respond(SUCCESS,$list_html);
	}

	public static function or_sample_large($photo)
	{
		return trim($photo)=="" ? IAM_DEFAULT_LARGE_PICTURE : $photo;
	}

	public static function make_admin_form($data,$title,$new,$hidden, $type)
	{
		$html = '';
		$ninja = $hidden ? 'class="iam-ninja"': '' ;
		$id = $new ? 'iam-new-form' : 'iam-update-form' ;

		$html.= '<form '.$ninja.' id="'.$id.'" method="POST" accept-charset="utf-8">';
		if ($title!=null) {
			$html.= "<h3 class=\"iam-form-row\">".iam_output($title)."</h3>";
		}
		for ($i=0; $i < count($data); $i++) {
			$html.= '<p class="iam-form-row">'.$data[$i].'</p>';
		}
		$html.= '<p class="iam-form-row">
	 		<div class="iam-save iam-button iam-admin-submit-button"></div>
	 	</p>';
	 	if ($type=='c' && !$new) {
	 		$html.= '<p class="iam-form-row"><div class="iam-delete-form iam-delete-button" style="margin-top:-10px;">Delete Certification</div></p>';
	 	} else if ($type=='e' && !$new) {
	 		$html.= '<p class="iam-form-row"><div class="iam-delete-form iam-delete-button" style="margin-top:-10px;">Delete Equipment</div></p>';
	 	}
	 	$html.='</form>';
	 	return $html;
	}

	public static function new_certification_form()
	{
		$new_cert_fields = [];
		$new_cert_fields[] = '<img class="iam-image" width="200" src="'.IAM_Admin_Forms::or_sample_large('').'" alt="" >';
		$new_cert_fields[] = IAM_Admin_Forms::CERTIFICATION_PHOTO_LABEL.'<input type="file" id="photo" name="photo" accept="image/*">';
		$new_cert_fields[] = IAM_Admin_Forms::CERTIFICATION_NAME_LABEL.'<input type="text" id="name" name="name" maxlength="100" value="">';
		$new_cert_fields[] = IAM_Admin_Forms::CERTIFICATION_TIME_LABEL.'<input type="text" id="time" name="time" maxlength="120" value="">';
		$new_cert_fields[] = IAM_Admin_Forms::CERTIFICATION_DESCRIPTION_LABEL.'<textarea name="description" id="description" rows="4" cols="50"></textarea>';
		$new_cert_fields[] = IAM_Admin_Forms::CERTIFICATION_SUPPORT_LABEL.'<div id="iam-existing-files"></div><div id="iam-brand-new-supporting-upload"><input type="file" id="new-supporting0" name="new-supporting0"><br /><button id="iam-new-add-supporting-upload-button" type="button">add</button></div>';
		//$new_cert_fields[] = IAM_Admin_Forms::CERTIFICATION_REQUIRED_LABEL.'<input type="checkbox" id="required" name="required">';
		return IAM_Admin_Forms::make_admin_form($new_cert_fields,'Insert New Certification',true,true,'c');
	}

	public static function update_certification_form($selected_name)
	{
		global $wpdb;
		$init_cert_results = $wpdb->get_results($wpdb->prepare("SELECT * FROM ".IAM_CERTIFICATION_TABLE." WHERE Name=%s ",$selected_name));
		$update_cert_fields = [];
		$update_cert_fields[] = '<input class="iam-ninja" name="x" id="x" value="'.iam_output($init_cert_results[0]->NI_ID).'">';
		$update_cert_fields[] = '<img class="iam-image" width="200" src="'.IAM_Admin_Forms::or_sample_large($init_cert_results[0]->Photo).'" alt="" >';
		$update_cert_fields[] = IAM_Admin_Forms::CERTIFICATION_PHOTO_LABEL.'<input type="file" id="photo" name="photo" accept="image/*">';
		$update_cert_fields[] = IAM_Admin_Forms::CERTIFICATION_NAME_LABEL.'<input type="text" id="name" name="name" maxlength="100" value="'.iam_output($init_cert_results[0]->Name).'">';
		$update_cert_fields[] = IAM_Admin_Forms::CERTIFICATION_TIME_LABEL.'<input type="text" id="time" name="time" maxlength="120" value="'.iam_output($init_cert_results[0]->Time).'">';
		$update_cert_fields[] = IAM_Admin_Forms::CERTIFICATION_DESCRIPTION_LABEL.'<textarea name="description" id="description" rows="4" cols="50">'.iam_output($init_cert_results[0]->Description).'</textarea>';

		$supporting_files_results = $wpdb->get_results($wpdb->prepare("SELECT File_ID FROM ".IAM_SUPPORTING_FILES_TABLE." WHERE Certification_ID=%d ",$init_cert_results[0]->Certification_ID));
		$supporting_files = [];
		foreach ($supporting_files_results as $row) {
			$file_results = $wpdb->get_results($wpdb->prepare("SELECT Name FROM ".IAM_FILES_TABLE." WHERE File_ID=%d",$row->File_ID));
			$supporting_files[] = $file_results[0]->Name;
		}
		$list_html = "<label>Existing Files:</label>";
		for ($i=0; $i < count($supporting_files); $i++) {
			$list_html.='<div class="iam-existing-upload">'.iam_output($supporting_files[$i]).'<span class="iam-existing-upload-x"></span></div>';
		}
		$update_cert_fields[] = IAM_Admin_Forms::CERTIFICATION_SUPPORT_LABEL.'<div id="iam-existing-files">'.$list_html.'</div><div id="iam-new-supporting-upload"><input type="file" id="supporting0" name="supporting0"><br /><button id="iam-add-supporting-upload-button" type="button">add</button></div>';
		//$required_val = $init_cert_results[0]->Required === 1 ? 'checked' : '' ;
		//$update_cert_fields[] = IAM_Admin_Forms::CERTIFICATION_REQUIRED_LABEL.'<input type="checkbox" id="required" name="required" '.$required_val.'>';
		return IAM_Admin_Forms::make_admin_form($update_cert_fields,'Update Existing Certification',false, false,'c');
	}

	public static function make_rental_list($chosen=0)
	{
		global $wpdb;
		$rental_types = $wpdb->get_results(RENTAL_ALL_QUERY);
		$rental_list = ' class="iam-rental-types-list"><option data-nid="">None</option>';
		foreach ($rental_types as $row) {
			$r = json_decode($row->Meta_Value);
			$selected = $chosen==$r->id ? 'selected' : '';
			$rental_list.='<option value="'.$r->id.'" '.$selected.'>'.$r->label.' ('.$r->duration.')</option>';
		}
		$rental_list = '<select data-onload-duration="'.get_rental_period($chosen).'" '.$rental_list;
		$rental_list.='</select>';
		return $rental_list;
	}

		public static function new_equipment_form($schedule_type)
	{
		global $wpdb;
		$certifications_query = "SELECT Certification_ID,Name FROM ".IAM_CERTIFICATION_TABLE." ";
		$certifications_results = $wpdb->get_results($certifications_query);
		$cert_list = [];
		foreach ($certifications_results as $row) {
			$cert_list[] = $row->Name;
		}



	 	$new_equipment_fields = [];
		$new_equipment_fields[] = '<img class="iam-image" width="200" src="'.IAM_Admin_Forms::or_sample_large('').'" alt="" >';
		$new_equipment_fields[] = IAM_Admin_Forms::EQUIPMENT_PHOTO_LABEL.'<input type="file" id="photo" name="photo" accept="image/*">';
		$new_equipment_fields[] = IAM_Admin_Forms::EQUIPMENT_NAME_LABEL.'<input type="text" id="name" name="name" max="100" value="">';
		$new_equipment_fields[] = IAM_Admin_Forms::EQUIPMENT_MANUFACTURER_INFO_LABEL.'<input type="text" id="manufacturer-info" name="manufacturer-info" value="">';
		$new_equipment_fields[] = IAM_Admin_Forms::EQUIPMENT_DESCRIPTION_LABEL.'<textarea id="description" name="description" rows="4" cols="50"></textarea>';
	 	$new_equipment_fields[] = IAM_Admin_Forms::EQUIPMENT_PRICING_DESCRIPTION_LABEL.'<textarea id="pricing-description" name="pricing-description" rows="4" cols="50"></textarea>';
	 	$list_html = '<option value="">None</option>';
		for ($i=0; $i < count($cert_list); $i++) {
			$list_html.='<option value="'.iam_output($cert_list[$i]).'">'.iam_output($cert_list[$i]).'</option>';
		}
	 	$new_equipment_fields[] = IAM_Admin_Forms::EQUIPMENT_CERTICATION_LABEL.'<select id="certification" name="certification">'.$list_html.'</select>';
	 	$new_equipment_fields[] = IAM_Admin_Forms::EQUIPMENT_TAGS_LABEL.'<input class="tags" size="50">';
		if ($schedule_type=='rental') {
			$new_equipment_fields[] = '<label>Rental_Type: </label>'.IAM_Admin_Forms::make_rental_list();
		}
	 	$new_equipment_fields[] = IAM_Admin_Forms::EQUIPMENT_ON_SLIDE_SHOW.'<input type="checkbox" id="slide-show" name="slide-show">';
	 	$new_equipment_fields[] = IAM_Admin_Forms::EQUIPMENT_OUT_OF_ORDER.'<input type="checkbox" id="out-of-order" name="out-of-order">';
		$new_equipment_fields[] = IAM_Admin_Forms::EQUIPMENT_COMMENTS.'<textarea id="internal-comments" name="internal-comments" rows="4" cols="50"></textarea>';


	 	return IAM_Admin_Forms::make_admin_form($new_equipment_fields,'Insert New Equipment',true,true,'e');
	}

	public static function update_equipment_form($selected_name, $schedule_type)
	{
		global $wpdb;
		$selected_name = stripslashes($selected_name);
		$init_equipment_results = $wpdb->get_results($wpdb->prepare("SELECT * FROM ".IAM_EQUIPMENT_TABLE." WHERE Name=%s ",$selected_name));
		$certifications_results = $wpdb->get_results("SELECT Certification_ID,Name FROM ".IAM_CERTIFICATION_TABLE." ");
		$current_cert = 'None';
		$cert_list = [];
		foreach ($certifications_results as $row) {
			if ($row->Certification_ID == $init_equipment_results[0]->Certification_ID) {
				$current_cert = $row->Name;
			}
			$cert_list[] = $row->Name;
		}
		$equip_id = $init_equipment_results[0]->Equipment_ID;
		$tag_result = $wpdb->get_results($wpdb->prepare("SELECT Tag_ID FROM ".IAM_TAGS_EQUIPMENT_TABLE." WHERE Equipment_ID=%d",$equip_id));
		$equip_tags = "";
		foreach ($tag_result as $row) {
			$current_tag_id = $row->Tag_ID;
			$current_tag_result = $wpdb->get_results($wpdb->prepare("SELECT Tag FROM ".IAM_TAGS_TABLE." WHERE Tag_ID=%d",$current_tag_id));
			$equip_tags .= $current_tag_result[0]->Tag.",";
		}
		$equip_tags = substr($equip_tags,0,-1);

		$update_equipment_fields = [];
		$update_equipment_fields[] = '<input class="iam-ninja" name="x" id="x" value="'.iam_output($init_equipment_results[0]->NI_ID).'">';
		$update_equipment_fields[] = '<img class="iam-image" width="200" src="'.IAM_Admin_Forms::or_sample_large($init_equipment_results[0]->Photo).'" alt="'.iam_output($init_equipment_results[0]->Name).'" >';
		$update_equipment_fields[] = IAM_Admin_Forms::EQUIPMENT_PHOTO_LABEL.'<input type="file" id="photo" name="photo" accept="image/*">';
		$update_equipment_fields[] = IAM_Admin_Forms::EQUIPMENT_NAME_LABEL.'<input type="text" id="name" name="name" max="100" data-original="'.iam_output($init_equipment_results[0]->Name).'" value="'.iam_output($init_equipment_results[0]->Name).' ">';
		$update_equipment_fields[] = IAM_Admin_Forms::EQUIPMENT_MANUFACTURER_INFO_LABEL.'<input type="text" id="manufacturer-info" name="manufacturer-info" value="'.iam_output($init_equipment_results[0]->Manufacturer_Info).' ">';
		$update_equipment_fields[] = IAM_Admin_Forms::EQUIPMENT_DESCRIPTION_LABEL.'<textarea id="description" name="description" rows="4" cols="50">'.iam_output($init_equipment_results[0]->Description).'</textarea>';
	 	$update_equipment_fields[] = IAM_Admin_Forms::EQUIPMENT_PRICING_DESCRIPTION_LABEL.'<textarea id="pricing-description" name="pricing-description" rows="4" cols="50">'.iam_output($init_equipment_results[0]->Pricing_Description).'</textarea>';
	 	$update_equipment_fields[] = '<label for="certification">Certification Required: '.iam_output($current_cert).'</label>';
	 	$list_html = '<option value="">None</option>';
		for ($i=0; $i < count($cert_list); $i++) {
			if ($cert_list[$i]==$current_cert)
				$list_html.='<option selected value="'.iam_output($cert_list[$i]).'">'.iam_output($cert_list[$i]).'</option>';
			else
				$list_html.='<option value="'.iam_output($cert_list[$i]).'">'.iam_output($cert_list[$i]).'</option>';
		}
	 	$update_equipment_fields[] = '<label for="certification">Certification:</label><select id="certification" name="certification">'.$list_html.'</select>';
	 	$update_equipment_fields[] = IAM_Admin_Forms::EQUIPMENT_TAGS_LABEL.'<input class="tags" value="'.iam_output($equip_tags).'" size="50">';
	 	$slide_show_val = $init_equipment_results[0]->On_Slide_Show==1 ? 'checked' : '' ;
	 	$out_of_order_val = $init_equipment_results[0]->Out_Of_Order==1 ? 'checked' : '' ;

		if ($schedule_type=='rental') {
			$update_equipment_fields[] = '<label>Rental_Type: </label>'.IAM_Admin_Forms::make_rental_list($init_equipment_results[0]->Rental_Type);
		}

	 	$update_equipment_fields[] = IAM_Admin_Forms::EQUIPMENT_ON_SLIDE_SHOW.'<input type="checkbox" id="slide-show" name="slide-show" '.$slide_show_val.'>';
	 	$update_equipment_fields[] = IAM_Admin_Forms::EQUIPMENT_OUT_OF_ORDER.'<input type="checkbox" id="out-of-order" name="out-of-order" '.$out_of_order_val.'>';
		$update_equipment_fields[] = IAM_Admin_Forms::EQUIPMENT_COMMENTS.'<textarea id="internal-comments" name="internal-comments" rows="4" cols="50">'.iam_output($init_equipment_results[0]->Comments).'</textarea>';


	 	return IAM_Admin_Forms::make_admin_form($update_equipment_fields,'Update Existing Equipment',false,false,'e');
	}

}
