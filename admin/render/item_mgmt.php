<?php

/**
* 
*/
class Item_Mgmt
{
    
    public static function get_admin_forms_callback ()
    {
        $request = $_GET['request'];

        if ($request=='n_certification') {
            iam_respond(SUCCESS, IAM_Admin_Forms::new_certification_form() );
        } else if ($request=='u_certification') {
            iam_respond(SUCCESS, IAM_Admin_Forms::update_certification_form(IAM_Sec::textfield_cleaner($_GET['name'])) );
        }  else if ($request=='n_equipment') {
            iam_respond(SUCCESS, IAM_Admin_Forms::new_equipment_form() );
        }  else if ($request=='u_equipment') {
            iam_respond(SUCCESS, IAM_Admin_Forms::update_equipment_form(IAM_Sec::textfield_cleaner($_GET['name'])) );
        } else if ($request=='n_room') {
            iam_respond(SUCCESS, IAM_Admin_Forms::new_room_form() );
        }  else if ($request=='u_room') {
            iam_respond(SUCCESS, IAM_Admin_Forms::update_room_form(IAM_Sec::textfield_cleaner($_GET['name'])) );
        }
        iam_throw_error('INVALID_REQUEST');
    }

    public static function admin_delete_form()
    {
        $type = $_POST['type'];
        $ni_id = IAM_Sec::textfield_cleaner($_POST['x']);
        global $wpdb;
        if ($type=='c') {
            $cert_results = $wpdb->get_results($wpdb->prepare("SELECT Certification_ID,Photo FROM ".IAM_CERTIFICATION_TABLE." WHERE NI_ID=%s",$ni_id));
            $cert_id = $cert_results[0]->Certification_ID;
            $url = $cert_results[0]->Photo;
            $wpdb->query($wpdb->prepare("DELETE FROM ".IAM_USER_CERTIFICATIONS_TABLE." WHERE Certification_ID=%d",$cert_id));
            $wpdb->query($wpdb->prepare("DELETE FROM ".IAM_CERTIFICATION_TABLE." WHERE NI_ID=%s",$ni_id));
            $file_results = $wpdb->get_results($wpdb->prepare("SELECT File_ID FROM ".IAM_SUPPORTING_FILES_TABLE." WHERE Certification_ID=%d",$cert_id));
            $wpdb->query($wpdb->prepare("DELETE FROM ".IAM_SUPPORTING_FILES_TABLE." WHERE Certification_ID=%d",$cert_id));

            unlink(WP_CONTENT_DIR.substr($url, strpos($url, '/uploads')));
            foreach ($file_results as $row) {
                $path_results = $wpdb->get_results($wpdb->prepare("SELECT Path FROM ".IAM_FILES_TABLE." WHERE File_ID=%d",$row->File_ID));
                unlink($path_results[0]->Path);
                $wpdb->query($wpdb->prepare("DELETE FROM ".IAM_FILES_TABLE." WHERE File_ID=$%d",$row->File_ID));
            }
        } else if ($type=='e') {
            $equipment_results = $wpdb->get_results($wpdb->prepare("SELECT Equipment_ID,Photo FROM ".IAM_EQUIPMENT_TABLE." WHERE NI_ID=%s",$ni_id));
            $url = $equipment_results[0]->Photo;
            $equip_id = $equipment_results[0]->Equipment_ID;
            unlink(WP_CONTENT_DIR.substr($url, strpos($url, '/uploads')));

            $wpdb->query($wpdb->prepare("DELETE FROM ".IAM_EQUIPMENT_TABLE." WHERE NI_ID=%s",$ni_id));
            $wpdb->query($wpdb->prepare("DELETE FROM ".IAM_TAGS_EQUIPMENT_TABLE." WHERE Equipment_ID=%d",$equip_id));
            $wpdb->query($wpdb->prepare("DELETE FROM ".IAM_MATERIAL_EQUIPMENT_TABLE." WHERE Equipment_ID=%d",$equip_id));
            $wpdb->query($wpdb->prepare("DELETE FROM ".IAM_RESERVATION_TABLE." WHERE Equipment_ID=%d AND Is_Room=0",$equip_id));
        } else if ($type=='r') {
            $room_results = $wpdb->get_results($wpdb->prepare("SELECT Room_ID,Photo FROM ".IAM_ROOM_TABLE." WHERE NI_ID=%s",$ni_id));
            $room_id = $room_results[0]->Room_ID;
            $url = $room_results[0]->Photo;
            unlink(WP_CONTENT_DIR.substr($url, strpos($url, '/uploads')));
            $wpdb->query($wpdb->prepare("DELETE FROM ".IAM_RESERVATION_TABLE." WHERE Equipment_ID=%d AND Is_Room=1",$room_id));
            $wpdb->query($wpdb->prepare("DELETE FROM ".IAM_ROOM_TABLE." WHERE NI_ID=%s",$ni_id));
        }
        iam_respond(SUCCESS);
    }

}