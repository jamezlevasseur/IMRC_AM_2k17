<?php


/**
*
*/
class Checkout_Public
{

    public static function checkout_unlock_callback()
    {
        $user_code = $_GET['code'];
        if ((string)$user_code===(string)get_setting_iam('ipad_code'))
            iam_respond(SUCCESS);
        iam_throw_error('INVALID CODE');
    }

    public static function checkout_content_callback()
    {
        iam_respond(SUCCESS, IAM_Checkout_Page::getUnlocked());
    }


    public static function update_checkout_table_callback()
    {
        iam_respond(SUCCESS, IAM_Checkout_Page::update_checkout_table());
    }

    public static function checkout_submit_callback()
    {
        global $wpdb;
        date_default_timezone_set(IMRC_TIME_ZONE);
        $rightnow = date('Y-m-d H:i:s');
        $ni_id = IAM_Sec::textfield_cleaner($_POST['nid']);
        $wpdb->query($wpdb->prepare("UPDATE ".IAM_RESERVATION_TABLE." SET Checked_Out=%s, Status=%d WHERE NI_ID=%s",$rightnow,COMPLETED,$ni_id));

        $reservation = $wpdb->get_results($wpdb->prepare("SELECT * FROM ".IAM_RESERVATION_TABLE." WHERE NI_ID=%s",$ni_id))[0];

        $charge_ni_id = md5(uniqid());
        $equip_name = $wpdb->get_results($wpdb->prepare("SELECT Name FROM ".IAM_EQUIPMENT_TABLE." WHERE Equipment_ID=%d",$reservation->Equipment_ID))[0]->Name;
        $user_info = $wpdb->get_results($wpdb->prepare("SELECT WP_Username,Account_Type FROM ".IAM_USERS_TABLE." WHERE IAM_ID=%d",$reservation->IAM_ID))[0];

        $username = $user_info->WP_Username;
        $account_type = ezget("SELECT * FROM ".IAM_ACCOUNT_TYPES_TABLE." WHERE Account_Type_ID=%d",$user_info->Account_Type)[0];

        $mat_used = 0;
        $amount = 0;
        $total = 0;

        if ($_POST['no_mats']==true) {
          $charge_description = $username.' used '.$equip_name.' with no materials because none were required.';
        } else {
          $mat_used = $_POST['mat'];
          $amount = $_POST['amount'];
          $total = $_POST['total'];
          if (!is_numeric($total)) {
            iam_throw_error(INVALID_INPUT_EXCEPTION);
          }
          $discount_text = ' With a '.$account_type->Name.' discount of '.$account_type->Discount.'%.';
          if ((int) $_POST['multiple_mats']===1) {
              $charge_description = $username.' used '.$equip_name.' with multiple materials: ';
              for ($i=0; $i < count($mat_used); $i++) {
                  $charge_description .= ' material #'.($i+1).' - '.$mat_used[$i]['name'].' for '.$amount[$i].' '.$mat_used[$i]['unit_name'].' at '.$mat_used[$i]['price_per_unit'].' per '.$mat_used[$i]['unit_name'].'. ';
              }
              $charge_description.=$discount_text;
          } else {
              $charge_description = $username.' used '.$equip_name.' for '.$amount.' '.$mat_used['unit_name'].'. Item used: '.$mat_used['name'].' at '.$mat_used['price_per_unit'].' per '.$mat_used['unit_name'].'.'.$discount_text;
          }
        }

        $wpdb->query($wpdb->prepare("INSERT INTO ".IAM_CHARGE_TABLE." (NI_ID,Equipment_ID,WP_Username,Charge_Description,Status,Date,Amount,JSON) VALUES (%s,%d,%s,%s,%d,%s,%f,%s)",$charge_ni_id,$reservation->Equipment_ID,$username,$charge_description,0,$rightnow,$total,json_encode($_POST)));
        iam_respond(SUCCESS);
    }

    public static function get_checkout_popup_callback()
    {
        global $wpdb;
        $ni_id = IAM_Sec::textfield_cleaner($_GET['nid']);
        $reservation = $wpdb->get_results($wpdb->prepare("SELECT * FROM ".IAM_RESERVATION_TABLE." WHERE NI_ID=%s",$ni_id))[0];
        $equip_id = $reservation->Equipment_ID;
        $user_results = $wpdb->get_results($wpdb->prepare("SELECT WP_Username,Balance FROM ".IAM_USERS_TABLE." WHERE IAM_ID=%d",$reservation->IAM_ID));
        $username = $user_results[0]->WP_Username;

        $charge_results = $wpdb->get_results($wpdb->prepare("SELECT Amount FROM ".IAM_CHARGE_TABLE." WHERE WP_Username=%s AND Status='0' OR WP_Username=%s AND Status='1'",$username,$username));
        $balance = 0;
        foreach ($charge_results as $charge_row) {
            $balance+=$charge_row->Amount;
        }

        if ($balance<=0) {
            $balanceHTML = '<span style="color:red;">'.iam_output($balance).'</span>';
        } else {
            $balanceHTML = '<span style="color:green;">'.iam_output($balance).'</span>';
        }

        $equip_name = $wpdb->get_results($wpdb->prepare("SELECT Name FROM ".IAM_EQUIPMENT_TABLE." WHERE Equipment_ID=%d",$reservation->Equipment_ID))[0]->Name;
        $possible_mats = [];
        $tag_results = $wpdb->get_results("SELECT Tag_ID FROM ".IAM_TAGS_EQUIPMENT_TABLE." WHERE Equipment_ID='$equip_id'");
        foreach ($tag_results as $row) {
            $mat_tag_results = $wpdb->get_results($wpdb->prepare("SELECT Material_ID FROM ".IAM_MATERIAL_TAGS_TABLE." WHERE Tag_ID=%d",$row->Tag_ID));
            $current_tag_id = $row->Tag_ID;
            while (true) {

                $current_tag_results = $wpdb->get_results($wpdb->prepare("SELECT Parent FROM ".IAM_TAGS_TABLE." WHERE Tag_ID=%d",$current_tag_id));

                if ($current_tag_results[0]->Parent=='' || $current_tag_results[0]->Parent==null) {
                    break;
                }
                $current_tag_id = $wpdb->get_results($wpdb->prepare("SELECT Tag_ID FROM ".IAM_TAGS_TABLE." WHERE Tag=%s",$current_tag_results[0]->Parent))[0]->Tag_ID;

                $mat_tag_results = array_merge($mat_tag_results, $wpdb->get_results($wpdb->prepare("SELECT Material_ID FROM ".IAM_MATERIAL_TAGS_TABLE." WHERE Tag_ID=%d",$current_tag_id)));
            }
            foreach ($mat_tag_results as $mat_tag_row) {
                $mat_results = $wpdb->get_results($wpdb->prepare("SELECT * FROM ".IAM_MATERIAL_TABLE." WHERE Material_ID=%d",$mat_tag_row->Material_ID));
                $possible_mats[$mat_results[0]->Name] = ['price_per_unit'=>$mat_results[0]->Price_Per_Unit, 'unit_name'=>$mat_results[0]->Unit_Name, 'base_price'=>$mat_results[0]->Base_Price];
            }
        }
        $mats_equip_results = $wpdb->get_results("SELECT Material_ID FROM ".IAM_MATERIAL_EQUIPMENT_TABLE." WHERE Equipment_ID='$equip_id'");
        foreach ($mats_equip_results as $row) {
            if ($mat_results[0]->Name=='' || $mat_results[0]->Name==null) {
                continue;
            }
            $mat_results = $wpdb->get_results($wpdb->prepare("SELECT * FROM ".IAM_MATERIAL_TABLE." WHERE Material_ID=%d",$row->Material_ID));
            $possible_mats[$mat_results[0]->Name] = ['price_per_unit'=>$mat_results[0]->Price_Per_Unit, 'unit_name'=>$mat_results[0]->Unit_Name, 'base_price'=>$mat_results[0]->Base_Price];
        }
        $possible_mats_list = '<select class="iam-checkout-possible-mats">';
        $has_mats = false;
        foreach ($possible_mats as $key => $val) {
            if ($key=='' || $key==null) {
                continue;
            }
            $possible_mats_list.='<option value="'.iam_output($key).'">'.iam_output($key).'</option>';
            $has_mats = true;
        }
        $possible_mats_list.='</select>';

        $html = '
        <div class="iam-popup">
            <div class="iam-popup-header">
                Submit Use
                <i class="fa fa-close fa-3 iam-x"></i>
            </div>
            <div class="iam-popup-body">
                <div>
                    <label class="iam-checkout-name"> <b>Name: </b> '.iam_output($username).' </label>
                    <label class="iam-checkout-equipment"> <b>Equipment: </b> '.iam_output($equip_name).' </label>
                </div>';

        if ($has_mats) {
          $html.='
                <div>
                    <label class="iam-checkout-balance"> <b>Available Balance: </b> <span class="iam-checkout-bal">'.$balanceHTML.' </span></label>
                </div>
                <div>
                    <label class="iam-checkout-discount"></label>
                </div>
                <div class="iam-mats-row">
                    <label class="iam-checkout-material"><b>Material: </b> '.$possible_mats_list.'</label>
                    <label><b>Min Price:</b> <span class="iam-checkout-base-price"></span></label>
                    <input type="number" class="iam-checkout-amount"> <span><span class="iam-checkout-unit-name"></span> x $<span class="iam-checkout-price-per-unit"></span>/<span class="iam-checkout-unit-name"></span> = <b>Total: </b><span class="iam-checkout-total"></span></span>
                </div>
                <div>
                  <button type="button" class="iam-checkout-add-mat iam-green-button">Add</button>
                  <button type="button" class="iam-checkout-del-mat iam-red-button">Delete</button>
                </div>';
        } else {
          $html.='<div id="no-mats"><h3>No materials required. Just submit and you\'re done!</h3></div>';
        }
        $html.='
                <div>
                    <button type="button" class="iam-checkout-submit">SUBMIT CHARGE</button>
                </div>
            </div>
        </div>';
        iam_respond(SUCCESS,['html'=>$html, 'mats'=>json_encode($possible_mats)]);
    }

    public static function update_appointment_callback()
    {
        IAM_Checkout_Page::update_appointment();
        exit;
    }


}
