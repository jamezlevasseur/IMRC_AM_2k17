<?php

/**
*
*/
class Certifications_Page extends Item_Mgmt
{

    public static function admin_update_existing_file_list()
    {
        global $wpdb;
        $nid = $_GET['x'];
        $cert_id = $wpdb->get_results($wpdb->prepare("SELECT Certification_ID FROM ".IAM_CERTIFICATION_TABLE." WHERE NI_ID=%s ",$nid))[0]->Certification_ID;
        $supporting_files_results = $wpdb->get_results($wpdb->prepare("SELECT File_ID FROM ".IAM_SUPPORTING_FILES_TABLE." WHERE Certification_ID=%d ",$cert_id));
        $supporting_files = [];
        foreach ($supporting_files_results as $row) {
            $file_results = $wpdb->get_results($wpdb->prepare("SELECT Name FROM ".IAM_FILES_TABLE." WHERE File_ID=%d",$row->File_ID));
            $supporting_files[] = $file_results[0]->Name;
        }
        $list_html = "<p>Existing Files:</p>";
        for ($i=0; $i < count($supporting_files); $i++) {
            $list_html.='<div class="iam-existing-upload">'.iam_output($supporting_files[$i]).'<span class="iam-existing-upload-x"></span></div>';
        }
        iam_respond(SUCCESS,$list_html);
    }

    public static function admin_delete_supporting_file()
    {
        $name = $_POST['filename'];
        global $wpdb;
        $file_results = $wpdb->get_results($wpdb->prepare("SELECT File_ID,Path FROM ".IAM_FILES_TABLE." WHERE Name=%s ",$name));
        $file_id = $file_results[0]->File_ID;
        unlink($file_results[0]->Path);
        $wpdb->query($wpdb->prepare("DELETE FROM ".IAM_FILES_TABLE." WHERE Name=%s",$name));
        $wpdb->query($wpdb->prepare("DELETE FROM ".IAM_SUPPORTING_FILES_TABLE." WHERE File_ID=%d",$file_id));
        iam_respond(SUCCESS);
    }


    public static function admin_certification_callback()
    {
        $interaction = $_POST['method'];
        global $wpdb;
        if (isset($_POST['name']) && isset($_POST['required']) && ($interaction=='u' && isset($_POST['x']) || $interaction=='n') ) {
            $name = IAM_Sec::textfield_cleaner($_POST['name']);
            //name checks
            if (gettype($name)!='string') {
                iam_throw_error( 'Error - Invalid Input in Field: "Name"');
                return false;
            }
            if (strlen($name)>100) {
                iam_throw_error(  'Error - Field "Name" max length 100 characters');
                return false;
            }
            if (preg_match("/[;'_]/", $name)) {
                iam_throw_error('Error - Name cannot contain single quotes, semi colons, or underscores.');
            }
            if (count($wpdb->get_results($wpdb->prepare("SELECT Certification_ID FROM ".IAM_CERTIFICATION_TABLE." WHERE Name=%s",$name)))>0 && $interaction=='n') {
                iam_throw_error(  'Error - Certification of this name already exists');
                exit;
            }

            $required = $_POST['required'];
            if (IAM_Sec::is_num_val($required)===false) {
                iam_throw_error(  'Error - Invalid Input in Field: "Required"');
                exit;
            }

            //time is a text field, not date
            $time = null;
            if (isset($_POST['time'])) {
                $time = IAM_Sec::textfield_cleaner($_POST['time']);
                //time checks
                if (gettype($time)!='string') {
                    iam_throw_error(  'Error - Invalid Input in Field: "Approximate Length of Required Training"');
                    return false;
                }
                if (strlen($time)>120) {
                    iam_throw_error(  'Error - Field "Approximate Length of Required Training" max length 120 characters');
                    return false;
                }
            }
            $description = null;
            if (isset($_POST['description'])) {
                $description = IAM_Sec::textfield_cleaner($_POST['description']);
                //desc checks
                if (gettype($description)!='string') {
                    iam_throw_error(  'Error - Invalid Input in Field: "Description"');
                    return false;
                }
            }

            $photo = null;
            if (count($_FILES)>0) {
                $photo = validateAndMoveImg( $_FILES['photo'] );
            }

            $insert_query = "";
            $cert_id;
            if ($interaction=='n') {
                //TODO: try again routine for remote case of uniqueid producing a duplicate id
                $ni_id = uniqid();
                if ($photo==null) {
                    $insert_query = $wpdb->prepare("INSERT INTO ".IAM_CERTIFICATION_TABLE." (NI_ID,Name,Description,Time,Required) VALUES (%s,%s,%s,%s,%d)",$ni_id,$name,$description,$time,$required);
                } else {
                    $insert_query = $wpdb->prepare("INSERT INTO ".IAM_CERTIFICATION_TABLE." (NI_ID,Name,Description,Time,Required,Photo) VALUES (%s,%s,%s,%s,%d,%s)",$ni_id,$name,$description,$time,$required,$photo);
                }

            } else if ($interaction=='u') {
                $ni_id = IAM_Sec::textfield_cleaner($_POST['x']);
                if ($photo==null) {
                    $insert_query = $wpdb->prepare("UPDATE ".IAM_CERTIFICATION_TABLE." SET Name=%s,Description=%s,Time=%s WHERE NI_ID=%s ",$name,$description,$time,$ni_id);
                } else {
                    $insert_query = $wpdb->prepare("UPDATE ".IAM_CERTIFICATION_TABLE." SET Name=%s,Description=%s,Time=%s, Photo=%s WHERE NI_ID=%s ",$name,$description,$time,$photo,$ni_id);
                }
                $cert_id = $wpdb->get_results($wpdb->prepare("SELECT Certification_ID FROM ".IAM_CERTIFICATION_TABLE." WHERE NI_ID=%s",$ni_id))[0]->Certification_ID;
            }

            $result = $wpdb->query($insert_query);

            if ($interaction=='n')
                $cert_id = $wpdb->insert_id;

            $supporting = null;
            if (count($_FILES)>0) {
                for ($i=0; $i < count($_FILES); $i++) {
                    $file = $_FILES['supporting'.$i];
                    if (IAM_Sec::verifyFileType($file['tmp_name'], 'application/pdf') || IAM_Sec::verifyFileType($file['tmp_name'], 'application/msword') || IAM_Sec::verifyImageFile($file['tmp_name'],['image/jpeg','image/pjpeg','image/jpeg','image/pjpeg','image/png'])) {
                        $movefile = wp_handle_upload($file,array( 'test_form' => false ));
                        if ( $movefile && !isset( $movefile['error'] ) ) {
                            $pathexplode = explode("/", $movefile['file']);
                            $filename = $pathexplode[count($pathexplode)-1];
                            $wpdb->query($wpdb->prepare("INSERT INTO ".IAM_FILES_TABLE." (Name,URL,Path,Size,Type) VALUES (%s,%s,%s,%d,%s)",$filename,$movefile['url'],$movefile['file'],$file['size'],$file['type']));
                            $file_id = $wpdb->insert_id;
                            $wpdb->query($wpdb->prepare("INSERT INTO ".IAM_SUPPORTING_FILES_TABLE." (File_ID, Certification_ID) VALUES (%d,%d)",$file_id,$cert_id));
                        } else {
                            /**
                             * Error generated by _wp_handle_upload()
                             * @see _wp_handle_upload() in wp-admin/includes/file.php
                             */
                            iam_throw_error(  $movefile['error']);
                            exit;
                        }
                    }
                }
            }

            iam_respond(SUCCESS);
        } else {
            iam_throw_error( 'Error - Please fill out required fields: Name');
        }
    }

}
