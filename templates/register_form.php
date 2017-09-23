
<div id="register-form" class="widecolumn">
    <?php if ( $attributes['show_title'] ) : ?>
        <h3><?php _e( 'Register', 'personalize-login' ); ?></h3>
    <?php endif; ?>

    <div id="signupform" class="iam-form">
        <h1>Register</h1>
        <p class="form-row">
            <label for="email"><?php _e( 'Email', 'personalize-login' ); ?> <strong style="color:red;">*</strong></label><br />
            <input  type="text" name="email" id="email">
        </p>

        <p class="form-row">
            <label for="email-confirm"><?php _e( 'Email-Confirm', 'personalize-login' ); ?> <strong style="color:red;">*</strong></label><br />
            <input  type="text" name="email-confirm" id="email-confirm">
        </p>

        <p class="form-row">
            <label for="password"><?php _e( 'Password', 'personalize-login' ); ?> <strong style="color:red;">*</strong></label><br />
            <input  type="password" name="password" id="password">
        </p>

        <p class="form-row">
            <label for="password-confirm"><?php _e( 'Password-Confirm', 'personalize-login' ); ?> <strong style="color:red;">*</strong></label><br />
            <input  type="password" name="password-confirm" id="password-confirm">
        </p>

        <p class="form-row">
            <label for="first_name"><?php _e( 'First name', 'personalize-login' ); ?> <strong style="color:red;">*</strong></label><br />
            <input  type="text" name="first_name" id="first-name">
        </p>

        <p class="form-row">
            <label for="last_name"><?php _e( 'Last name', 'personalize-login' ); ?> <strong style="color:red;">*</strong></label><br />
            <input  type="text" name="last_name" id="last-name">
        </p>

        <p class="form-row">
            <label for="phone_num"><?php _e( 'Phone number', 'personalize-login' ); ?></label><br />
            <?php echo make_phone_number_field(); ?>
        </p>

        <p class="form-row">
            <label for="student_id"><?php _e( 'Student ID', 'personalize-login' ); ?></label><br />
            <input  type="text" name="student_id" id="student-id">
        </p>

        <p class="form-row">
            <label for="account_type"><?php _e( 'Account Type', 'personalize-login' ); ?> <strong style="color:red;">*</strong></label>
            <select type="text" name="account_type" id="account_type" style="display:block;" >
                <option selected disabled value="Select a Value">Select a Value</option>
                <?php
                global $wpdb;
                $account_type_results = $wpdb->get_results("SELECT * FROM ".IAM_ACCOUNT_TYPES_TABLE);
                require_once iam_dir() . 'includes/IAM-sec.php';
                foreach ($account_type_results as $row) {
                    echo '<option value="'.iam_output(IAM_Sec::iamEncrypt($row->Account_Type_ID)).'">'.iam_output($row->Name).'</option>';
                }
                 ?>
            </select>
        </p>

        <p class="form-row">
            <label for="last_name">Registration Key (Optional)</label><br />
            <input  type="text" name="reg_key" id="reg-key" >
        </p>

        <p class="form-row">
            <?php _e( 'Note: Your account will be approved by an admin shortly.', 'personalize-login' ); ?>
        </p>

        <div class="g-recaptcha" data-sitekey="6Lfx8ScTAAAAAGjL7qQzDfH_U4OT8ghafFd3pyab"></div>

        <p class="signup-submit">
            <button id="register-submit" type="button">Submit</button>
        </p>
    </div>
</div>
