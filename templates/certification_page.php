<?php 

/**
* 
*/
class IAM_Certification_Page
{

	public static function or_sample_large($photo)
	{
		return trim($photo)=="" ? IAM_DEFAULT_LARGE_PICTURE : $photo;
	}

	public static function make_phase($current_phase,$user_certs)
	{
		global $wpdb;
		$html = '';
		for ($p=0; $p < count($current_phase); $p++) { 
			$no_cert = 'iam-no-cert';
			$cert_status_text = '<p style="color:red;">You do not have this certification.</p>';
			if (in_array($current_phase[$p][1]->Certification_ID, $user_certs)) {
				$no_cert = '';
				$cert_status_text = '<p style="color:green;">You have this certification!</p>';
			}
			$required = $current_phase[1]->Required==1 ? '(*required)' : '';
			$supporting_files_html = '<ul class="iam-level-files">';
			$supporting_files_results = $wpdb->get_results($wpdb->prepare("SELECT File_ID FROM ".IAM_SUPPORTING_FILES_TABLE." WHERE Certification_ID=%d",$current_phase[$p][1]->Certification_ID));
			foreach ($supporting_files_results as $row) {
				$url = $wpdb->get_results($wpdb->prepare("SELECT URL FROM ".IAM_FILES_TABLE." WHERE File_ID=%d ",$row->File_ID))[0]->URL;
				$supporting_files_html.='<li><a href="'.iam_output($url).'" target="_blank">'.iam_output($url).'</a></li>';
			}
			$supporting_files_html.='</ul>';
			$photo = IAM_Certification_Page::or_sample_large($current_phase[$p][1]->Photo);
			$cert_name = trim($current_phase[$p][0])=='' ? $current_phase[$p][1]->Name : $current_phase[$p][0];
			$html.='<div class="iam-phase-level '.$no_cert.'"><div class="iam-level-photo"><img width="200" src="'.iam_output($photo).'" alt="'.iam_output($current_phase[$p][1]->Name).'"></div>
							<div class="iam-level-attributes">
								'.$cert_status_text.'
								<p><div class="iam-level-attributes-label">Name: </div>'. ' '.iam_output($cert_name).' '.iam_output($required).'</p>
								<p><div class="iam-level-attributes-label">Time: </div>'. ' '.iam_output($current_phase[$p][1]->Time).'</p>
								<p><div class="iam-level-attributes-label">Description: </div>'. ' '.iam_output($current_phase[$p][1]->Description).'</p>
								<p><div class="iam-level-attributes-label">Associated Files: </div></p>
								'.$supporting_files_html.'
							</div></div>
							';
		}
		$html.='</div>';
		return $html;
	}

	public static function get()
	{
		global $wpdb;
		$cert_results = $wpdb->get_results("SELECT * FROM ".IAM_CERTIFICATION_TABLE." ORDER BY Name ASC");
		$phases = ['no phase'=>[]];
		foreach ($cert_results as $row) {
			$index = strpos(strtolower($row->Name), 'phase ');
			$row_phase = '';
			if ($index!=0 || $index===false) {
				$phases['no phase'][] = [$row->Name,$row];
			} else {
				$row_phase = substr(strtolower($row->Name), $index, $index+7);
				$row_after_phase = substr($row->Name, $index+8);
				if (array_key_exists($row_phase, $phases)) {
					$phases[$row_phase][] = [$row_after_phase,$row];
				} else {
					$phases[$row_phase] = [[$row_after_phase,$row]];
				}
			}
		}

		$phase_blocks = '';
		
      	$current_user = wp_get_current_user()->user_login;
   		
   		$iam_id = $wpdb->get_results("SELECT IAM_ID FROM ".IAM_USERS_TABLE." WHERE WP_Username='$current_user'")[0]->IAM_ID;
		
		$user_cert_results = $wpdb->get_results($wpdb->prepare("SELECT Certification_ID FROM ".IAM_USER_CERTIFICATIONS_TABLE." WHERE IAM_ID=%d ",$iam_id));
		
		$user_certs = [];
		foreach ($user_cert_results as $row) {
			$user_certs[] = $row->Certification_ID;
		}
		$i = 1;
		while (true) {
			if ($i>1000) {
				exit('Error creating page');
			}
			if (isset($phases['phase '.$i])) {
				$phase_blocks.='<div class="iam-phase-block" id="iam-'.'phase-'.$i.'" ><div class="iam-phase-title">Phase '.$i.' Trainings: </div>';
				$phase_blocks.=IAM_Certification_Page::make_phase($phases['phase '.$i],$user_certs);
				unset($phases['phase '.$i]);
			} else {
				if (count($phases['no phase'])==0) {
					break;
				}
				$phase_blocks.='<div class="iam-phase-block" id="iam-phase-none" ><div class="iam-phase-title">More Trainings: </div>';
				$phase_blocks.=IAM_Certification_Page::make_phase($phases['no phase'],$user_certs);
				break;
			}
			$i++;
		}

		$html = '
		<div id="iam-cert">
		<p class="iam-page-header">Certifications</p>
			'.$phase_blocks.'
		</div>
		';
		IAM_Public::render_page_for_login_status($html);
	}

}

 ?>