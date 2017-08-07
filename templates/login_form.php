<div class="iam-discover-container iam-ninja">
    <?php
    global $wpdb;
    $facility_results = $wpdb->get_results("SELECT * FROM ".IAM_FACILITY_TABLE);
    $facility_html = '';
    $facility_names = '';
    foreach ($facility_results as $row) {
        $tag_id = $row->Tag_ID;
        if ($tag_id==0) {
            $tag = 'Rooms';
        } else {
            $tag = $wpdb->get_results("SELECT Tag FROM ".IAM_TAGS_TABLE." WHERE Tag_ID='$tag_id'")[0]->Tag;
        }
        //make readable by javascript
        $tag = strtolower(str_replace(' ', '_', $tag));
        $facility_names.=$tag.',';
        $facility_html.='data-'.$tag.'="'.iam_output(json_encode(['schedule_type'=>$row->Schedule_Type,'rental_period'=>$row->Rental_Days,'rental_hours_description'=>$row->Rental_Hours_Description,'appointment_business_hours'=>$row->Appointment_Business_Hours])).'" ';
    }
    $facility_names = substr($facility_names, 0, strlen($facility_names)-1);
    ?>
    <div class="iam-ninja iam-cal-data" <?php echo 'data-names="'.iam_output($facility_names).'" '.$facility_html; ?>></div>
    <h1 class="iam-discover-header" style="text-align:center;">Take a Look at Our Equipment</h1>
    <div class="iam-discover-button-container">
        <div class="iam-secondary-button iam-discover-button" >3D Printer</div>
        <div class="iam-secondary-button iam-discover-button" >2D Printer</div>
        <div class="iam-secondary-button iam-discover-button" >Laser Cutter</div>
        <div class="iam-secondary-button iam-discover-button" >Wood Shop</div>
        <div class="iam-secondary-button iam-discover-button" >Electronics Lab</div>
        <!--<div class="iam-secondary-button iam-discover-button" >Textiles Lab</div>-->
        <div class="iam-secondary-button iam-discover-button" >Audio</div>
        <div class="iam-secondary-button iam-discover-button" >Photo/Video</div>
        <!--<div class="iam-secondary-button iam-discover-button" >Computer</div>-->
        <!--<div class="iam-secondary-button iam-discover-button" >Projector</div>-->
        <div class="iam-secondary-button iam-discover-button" >Monitor/TVs</div>
        <div class="iam-secondary-button iam-discover-button" >Equipment Room Miscellaneous</div>
        <div class="iam-secondary-button iam-discover-button" >Rooms</div>
        <div class="iam-secondary-button iam-discover-button" >All</div>
    </div>
    <div class="iam-discover-block">

    </div>
</div>
<div class="login-form-container">
    <?php if ( $attributes['show_title'] ) : ?>
        <h2><?php _e( 'Sign In', 'iam-login' ); ?></h2>
    <?php endif; ?>
    <form name="loginform" id="loginform" method="post">

        <p class="login-username">
            <label for="user_login">Username</label>
            <input type="text" name="log" id="user_login" class="input" value="" size="20">
        </p>
        <p class="login-password">
            <label for="user_pass">Password</label>
            <input type="password" name="pwd" id="user_password" class="input" value="" size="20">
        </p>
        <div class="iam-captcha-container iam-ninja">
            <div class="g-recaptcha" data-sitekey="6Lf95icTAAAAAOghakxZY6hPw7NdU4k90hmh8nge"></div>
        </div>
        <p class="login-submit">
            <input type="submit" name="wp-submit" id="wp-submit" class="button-primary" value="Sign In">
        </p>
    </form>
    <?php
    /*
        wp_login_form(
            array(
                'label_username' => __( 'Username', 'iam-login' ),
                'label_log_in' => __( 'Sign In', 'iam-login' ),
                'redirect' => $_SERVER['HTTP_HOST'],
                'remember' => false
            )
        );*/
    ?>

    <a class="forgot-password" href="<?php echo wp_lostpassword_url(); ?>">
        <?php _e( 'Forgot your password?', 'iam-login' ); ?>
    </a> <br />
    <a class="register" href="<?php echo get_site_url().'/register' ?>">
        Register
    </a> <br />
    <a href="mailto:<?php echo get_setting_iam('fab_lab_email'); ?>?subject=feedback" "email me">Contact us</a>
    <br /><br /><br />
    <a href="#" class="iam-discover-link">Discover What We Have to Offer</a>
    <div id="iam-slide-show">
        <?php
            Utils_Public::render_login_slide_show();
         ?>
    </div>

    <style type="text/css">
        /* ONLY FOR DISPLAYING BANNER ON RES PAGE, REMOVE AFTERWARDS */
        #main {
            padding-top: 0px!important;

        }

        .entry-header {
            margin: 0!important;

        }

        .iam-res-banner {
            text-align: center;
            width: 100%;
            background-color: #248cc8;
            text-transform: uppercase;
            font-size: 16px;
            color: white;
            padding: 22px 0;
        }

        body {
            background: none;
        }

        body.layout-full {
            background: none;
        }

       .slick-dots {
            position:static;
            margin:0 auto;
        }
       .slick-prev {
            background:blue;
            left:-55px;
            top:70%;
       }
       .slick-next {
            right:-55px;
            top:70%;
       }
        #iam-slide-show {
            width: 650px;
            height: 300px;
            position: fixed;
            /*top: 250px;*/
            top: 300px; /* FOR BANNER */
            right: 400px;
        }
        .iam-img-name {
            display:inline-block;
            color:#F13D39;
            font-family:"HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
            font-size: 30px;
            line-height:35px;
            float:left;
            max-width:175px;
            margin-bottom:-5px !important;
        }
        .iam-img-description {
            display:inline-block;
            float:left;
            color:gray;
            font-size:16px;
            font-family:"HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
            max-width:175px;
        }
        .iam-slideshow-img{
            display:inline-block;
            max-width:400px;
            float:right;
        }
        .iam-slideshow-equip-img{
            width:400px;
            float:right;
        }
        @media screen and (max-width: 1900px) {
            #iam-slide-show {
                right: 10% !important;
            }
        }
        @media screen and (max-width: 1200px) {
            #iam-slide-show {
                width:50%;
            }
            .slick-prev {
                top: 50%;
            }
            .slick-next {
                top: 50%;
            }
            .iam-slideshow-equip-img {
                max-width:50% !important;
            }
            .iam-img-name {
                max-width:48% !important;
            }
            .iam-img-description {
                max-width:48% !important;
            }
        }
        @media screen and (max-width: 780px) {
            #iam-slide-show {
                display:none;
            }
        }
    </style>
</div>
