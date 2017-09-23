<?php

//sentry
if ( strpos($_SERVER['HTTP_HOST'], 'imrcaccounts')===false )
	$sentry_client = new Raven_Client('https://0165b1189752472c9d0daf5ad7789f49:22bc7871773a424cb14dba3b7c32dc56@sentry.io/215004');
else
	$sentry_client = new Raven_Client('https://d5d0b3fa167c49ffa6cc8364e094ba01:dd29a64341f04d32901bdf617e3ca30e@sentry.io/214196');

$error_handler = null;

add_action('init','init_sentry');
function init_sentry(){
	global $sentry_client;
	global $error_handler;

	$current_wp_user = wp_get_current_user();

	if ($current_wp_user->ID>0) {
		$sentry_client->user_context(array(
		    'email' => $current_wp_user->user_email
		));
	}

	$error_handler = new Raven_ErrorHandler($sentry_client);

	$error_handler->registerExceptionHandler();
	$error_handler->registerErrorHandler();
	$error_handler->registerShutdownFunction();
}

function iam_throw_error($message,$code='400')
{
	// create a log channel
	/*
	$monolog = new Logger('basic_logger');
	$monolog->pushHandler(new StreamHandler(iam_dir().'logs/phplogs.log', Logger::WARNING));
	$monolog->error($message);*/

	header('HTTP/1.1 '.$code.' '.$message);
  throw new Exception($message);
	exit;
}
