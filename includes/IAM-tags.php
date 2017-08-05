<?php 

/**
* 
*/
class IAM_Tags
{
	
	public static function get_all_tags()
	{
		global $wpdb;
		$results = $wpdb->get_results("SELECT Tag FROM ".IAM_TAGS_TABLE." ORDER BY Tag ASC ");
		$tags = [];
		foreach ($results as $row) {
			$tags[] = $row->Tag;
		}
		iam_respond(SUCCESS,$tags);
	}

}
