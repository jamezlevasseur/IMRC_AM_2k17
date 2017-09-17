let handleServerResponse = function (r) {
  let debug = window.location.href.indexOf('imrcaccounts')==-1;

	if (debug)
		console.log(r);
	if (typeof r === 'string') {
		if (r.indexOf('Fatal error')!=-1 && r.indexOf('Fatal error')<32) { //make sure fatal error isn't some incidental text in a json strong somewhere
			alert(r.substring( r.indexOf('Uncaught Exception'), r.indexOf('in /') ));
			return;
		}
	}
	try {
		let _r = JSON.parse(r);
		if (debug)
			console.log(_r);
		if (_r.message!='')
			alert(_r.status.toUpperCase()+": "+_r.message);
		if (_r.redirect!='')
      window.location.href = _r.redirect;
		return _r.content;
	} catch (error) {
			console.warn(error);
			console.log('JS error occured when handling server response.');
	}

}

let handleServerError = function (e, err) {
	console.log(e);
	console.log( err );
	alert(e.statusText+" \n Error Code:"+e.status);
}

export { handleServerResponse, handleServerError };
