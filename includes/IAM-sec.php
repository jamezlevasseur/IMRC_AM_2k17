<?php

/**
*
*/
class IAM_Sec
{

	public static function iamEncrypt($data)
	{
		$data = trim($data);
		$iv_size = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC);
		//TODO update key periodically
		$key = pack('H*', "adcdabf14d9507e122f4af0ba461fb4b4403321e4b91106b871881b9375e4c09");
    	$iv = mcrypt_create_iv($iv_size, MCRYPT_RAND);
    	$ciphertext = mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $key,
                                 $data, MCRYPT_MODE_CBC, $iv);
    	# prepend the IV for it to be available for decryption
	    $ciphertext = $iv . $ciphertext;

	    # encode the resulting cipher text so it can be represented by a string
	    $ciphertext_base64 = base64_encode($ciphertext);
	    return $ciphertext_base64;
	}

	public static function iamDecrypt($data)
	{
		$key = pack('H*', "adcdabf14d9507e122f4af0ba461fb4b4403321e4b91106b871881b9375e4c09");
		$iv_size = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC);
		$ciphertext_dec = base64_decode($data);

	    # retrieves the IV, iv_size should be created using mcrypt_get_iv_size()
	    $iv_dec = substr($ciphertext_dec, 0, $iv_size);

	    # retrieves the cipher text (everything except the $iv_size in the front)
	    $ciphertext_dec = substr($ciphertext_dec, $iv_size);

	    # may remove 00h valued characters from end of plain text
	    $plaintext_dec = mcrypt_decrypt(MCRYPT_RIJNDAEL_128, $key,
	                                    $ciphertext_dec, MCRYPT_MODE_CBC, $iv_dec);
	    return trim($plaintext_dec);
	}

	public static function strtohex($x)
    {
        $s='';
        foreach (str_split($x) as $c) $s.=sprintf("%02X",ord($c));
        return($s);
    }

	public static function verifyImageFile($filepath)
	{
		$type = exif_imagetype($filepath);
		if ($type==IMAGETYPE_JPEG ||
			$type==IMAGETYPE_PNG ||
			$type==IMAGETYPE_GIF) {
			return true;
		}
		return false;
	}

	public static function is_alpha($val, $throw_error = true)
	{
		if (preg_match('/^[a-zA-Z]*$/', $val)!=1) {
			if (!$throw_error) {
				return false;
			}
    		iam_throw_error(INVALID_INPUT_EXCEPTION);
		}
		return true;
	}

	public static function is_alphanumeric($val, $throw_error = true)
	{
		if (preg_match('/^[a-zA-Z0-9]*$/', $val)!=1) {
			if (!$throw_error) {
				return false;
			}
    		iam_throw_error(INVALID_INPUT_EXCEPTION);
		}
		return true;
	}

	public static function textfield_cleaner($val, $check_empty = false)
	{
		if (strlen($val)<1 && $check_empty) {
			iam_throw_error(INVALID_INPUT_EXCEPTION.' tc1');
		}
		$clean = sanitize_text_field( stripslashes_deep( strip_tags( trim($val) ) ) );
		if (strpos($clean, 'javascript://')!==false || strpos($clean, 'data://')!==false) {
    		iam_throw_error(INVALID_INPUT_EXCEPTION.' tc2');
		}
		return $clean;
	}

	public static function is_date($val, $throw_error = true)
	{
		if (!date_parse($val)) {
			if (!$throw_error) {
				return false;
			}
    		iam_throw_error(INVALID_INPUT_EXCEPTION);
		}
		return $val;
	}

	public static function is_num_val($val, $throw_error = true)
	{
		if (is_numeric( trim($val) )) {
			return true;
		}
		if ($throw_error) {
		    iam_throw_error(INVALID_INPUT_EXCEPTION);
		}
		return false;
	}

	/**
	 * Escape all HTML, JavaScript, and CSS
	 *
	 * @param string $input The input string
	 * @param string $encoding Which character encoding are we using?
	 * @return string
	 */
	public static function noHTML($input, $encoding = 'UTF-8')
	{
	    return htmlentities($input, ENT_QUOTES | ENT_HTML5, $encoding);
	}

}
