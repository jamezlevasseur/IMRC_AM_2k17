<?php

/**
* 
*/
class Debug_Page
{
    
    public static function debug_content()
    {
        ?>

        <p>Nothing to see here, move along.</p>

        <?php

        /** de bugs go here **/
        global $wpdb;
        print_r($wpdb->get_results("DB_NAME"));
    }

}