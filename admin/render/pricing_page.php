<?php

/**
* 
*/
class Pricing_Page
{

    private function make_pricing_drop_down($query_results, $selected='')
    {
        $html = $selected=='' ? '<div class="iam-pricing-drop-down"><select><option disabled selected>Select a value</option>': '<div class="iam-pricing-drop-down"><select><option disabled>Select a value</option>';
        foreach ($query_results as $name) {
            if ($selected == $name) {
                $html.='<option value="'.iam_output($name).'" selected>'.iam_output($name).'</option>';
            } else {
                $html.='<option value="'.iam_output($name).'">'.iam_output($name).'</option>';
            }
        }
        return $html.'</select><span class="iam-delete-pricing-drop-down"><i class="fa fa-close fa-3"></i></span></div>';
    }


    public static function admin_get_new_mat_row_callback()
    {
        iam_respond(SUCCESS,$this->make_mat_row());
    }

        public static function make_mat_row($id=null,$name,$price,$base_price,$unit_name,$associated_tags,$associated_equipment)
    {
        if ($id==null) {
            $id=$name=$price=$base_price=$unit_name='';
            $associated_tags = '<div class="iam-add-pricing-tags-drop-down-button iam-secondary-button">+</div>';
            $associated_equipment = '<div class="iam-add-pricing-equipment-drop-down-button iam-secondary-button">+</div>';
        }
        return '<tr class="test" data-nid="'.iam_output($id).'"><td><input class="iam-mat-name" type="text" value="'.iam_output($name).'" placeholder="name"></td><td><span class="iam-currency-field"><input class="iam-mat-pricing" type="number" value="'.iam_output($price).'"" placeholder="price"></span></td><td><span class="iam-currency-field"><input type="number" class="iam-mat-base-price" value="'.iam_output($base_price).'" placeholder="min price"></span></td><td><input class="iam-unit-name" type="text" value="'.iam_output($unit_name).'" placeholder="unit name"></td><td class="iam-mat-tags-data">'.$associated_tags.'</td><td class="iam-mat-equip-data">'.$associated_equipment.'</td><td><div class="iam-pricing-row-delete-button iam-delete-button">delete</div></td></tr>';
    }

    public static function admin_delete_material_callback()
    {
        global $wpdb;
        $ni_id = IAM_Sec::textfield_cleaner($_POST['nid']);
        $mat_id = $wpdb->query($wpdb->prepare("SELECT Material_ID FROM ".IAM_MATERIAL_TABLE." WHERE NI_ID=%s",$ni_id))[0]->Material_ID;
        $wpdb->query($wpdb->prepare("DELETE FROM ".IAM_MATERIAL_TABLE." WHERE NI_ID=%s",$ni_id));
        $wpdb->query("DELETE FROM ".IAM_MATERIAL_TAGS_TABLE." WHERE Material_ID='$mat_id'");
        $wpdb->query("DELETE FROM ".IAM_MATERIAL_EQUIPMENT_TABLE." WHERE Material_ID='$mat_id'");
        iam_respond(SUCCESS);
    }

    public static function admin_pricing_callback()
    {
        global $wpdb;
        foreach ($_POST['updates'] as $pricing_array) {
            if ($pricing_array['nid']=='') {

                $ni_id = uniqid();
                $mat_name = IAM_Sec::textfield_cleaner($pricing_array['mat_name']);
                $price_per_unit = IAM_Sec::textfield_cleaner($pricing_array['mat_pricing']);
                $unit_name = IAM_Sec::textfield_cleaner($pricing_array['unit_name']);
                $base_price = IAM_Sec::textfield_cleaner($pricing_array['mat_base_price']);
                $wpdb->query($wpdb->prepare("INSERT INTO ".IAM_MATERIAL_TABLE." (NI_ID,Name,Unit_Name,Price_Per_Unit,Base_Price) VALUES (%s,%s,%s,%f,%f)",$ni_id,$mat_name,$unit_name,$price_per_unit,$base_price));
                $mat_id = $wpdb->get_results("SELECT Material_ID FROM ".IAM_MATERIAL_TABLE." WHERE NI_ID='$ni_id'")[0]->Material_ID;

                if (isset($pricing_array['equipment'])) {
                    $this->set_material_equipment_realtions($pricing_array['equipment'],$mat_id);
                }
                if (isset($pricing_array['tags'])) {
                    $this->set_material_tag_realtions($pricing_array['tags'],$mat_id);
                }
            } else {
                $ni_id = $pricing_array['nid'];
                $mat_name = IAM_Sec::textfield_cleaner($pricing_array['mat_name']);
                $price_per_unit = IAM_Sec::textfield_cleaner($pricing_array['mat_pricing']);
                $unit_name = IAM_Sec::textfield_cleaner($pricing_array['unit_name']);
                $base_price = IAM_Sec::textfield_cleaner($pricing_array['mat_base_price']);
                $wpdb->query($wpdb->prepare("UPDATE ".IAM_MATERIAL_TABLE." SET Name=%s,Unit_Name=%s,Price_Per_Unit=%f,Base_Price=%f WHERE NI_ID=%s",$mat_name,$unit_name,$price_per_unit,$base_price,$ni_id));
                $mat_id = $wpdb->get_results("SELECT Material_ID FROM ".IAM_MATERIAL_TABLE." WHERE NI_ID='$ni_id'")[0]->Material_ID;
                //clear old entries
                $wpdb->query("DELETE FROM ".IAM_MATERIAL_EQUIPMENT_TABLE." WHERE Material_ID='$mat_id'");
                $wpdb->query("DELETE FROM ".IAM_MATERIAL_TAGS_TABLE." WHERE Material_ID='$mat_id'");

                if (isset($pricing_array['equipment'])) {
                    $this->set_material_equipment_realtions($pricing_array['equipment'],$mat_id);
                }
                if (isset($pricing_array['tags'])) {
                    $this->set_material_tag_realtions($pricing_array['tags'],$mat_id);
                }
            }
        }
        iam_respond(SUCCESS);
    }

    public static function set_material_equipment_realtions($equip_array,$mat_id)
    {
        global $wpdb;
        foreach ($equip_array as $mat_equip) {
            $equip_id = $wpdb->get_results($wpdb->prepare("SELECT Equipment_ID FROM ".IAM_EQUIPMENT_TABLE." WHERE Name=%s",IAM_Sec::textfield_cleaner($mat_equip)))[0]->Equipment_ID;
            $unique_id = $mat_id.$equip_id;
            $wpdb->query("INSERT INTO ".IAM_MATERIAL_EQUIPMENT_TABLE." (Unique_ID,Material_ID,Equipment_ID) VALUES ('$unique_id','$mat_id','$equip_id')");
        }
    }

    public static function set_material_tag_realtions($tag_array,$mat_id)
    {
        global $wpdb;
        foreach ($tag_array as $mat_tag) {
            $tag_id = $wpdb->get_results($wpdb->prepare("SELECT Tag_ID FROM ".IAM_TAGS_TABLE." WHERE Tag=%s",IAM_Sec::textfield_cleaner($mat_tag)))[0]->Tag_ID;
            $unique_id = $mat_id.$tag_id;
            $wpdb->query("INSERT INTO ".IAM_MATERIAL_TAGS_TABLE." (Unique_ID,Material_ID,Tag_ID) VALUES ('$unique_id','$mat_id','$tag_id')");
        }
    }

    public static function admin_get_pricing_dropdowns_callback()
    {
        global $wpdb;
        $all_tags = [];
        $all_equip = [];
        $all_tag_results = $wpdb->get_results("SELECT Tag FROM ".IAM_TAGS_TABLE);
        foreach ($all_tag_results as $tag_row) {
            $all_tags[] = $tag_row->Tag;
        }
        $all_equip_results = $wpdb->get_results("SELECT Name FROM ".IAM_EQUIPMENT_TABLE);
        foreach ($all_equip_results as $equip_row) {
            $all_equip[] = $equip_row->Name;
        }
        iam_respond(SUCCESS,['tags'=>$this->make_pricing_drop_down($all_tags), 'equip'=>$this->make_pricing_drop_down($all_equip)]);
    }

}