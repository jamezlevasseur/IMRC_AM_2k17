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
        print_r( json_decode( file_get_contents(iam_dir().'config/operations.json') )->dev );
        
    }

}