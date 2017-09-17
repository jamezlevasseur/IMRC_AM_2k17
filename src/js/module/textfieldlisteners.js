import $ from 'jquery';

let numbersOnlyListener = function (jqueryObject) {
	jqueryObject.keydown(function(event) {
		if (event.key!='Backspace' && event.key!='ArrowLeft' && event.key!='ArrowRight') {
			if (!event.key.match(/^[0-9.]*$/)) {
				return false;
			}
		}
	});
}

let emailOnlyListener = function (jqueryObject) {
	jqueryObject.keydown(function(event) {
		if (!event.key.match(/^[a-zA-Z0-9.@]*$/)) {
			return false;
		}
	});
}

let alphaNumericOnlyListener = function (jqueryObject) {
	jqueryObject.keydown(function(event) {
		if (!event.key.match(/^[a-zA-Z0-9.]*$/)) {
			return false;
		}
	});
}

let alphaOnlyListener = function (jqueryObject) {
	jqueryObject.keydown(function(event) {
		if (!event.key.match(/^[a-zA-Z.]*$/)) {
			return false;
		}
	});
}

let itemNameListener = function (jqueryObject) {
	jqueryObject.keydown(function(event) {
		if (event.key.match(/^[;'_]*$/)) {
			return false;
		}
	});
}

let maxLengthListener = function (jqueryObject, maxLength) {
	jqueryObject.keydown(function(event) {
		if (jqueryObject.val().length>=maxLength && event.keyCode!=8) {
			return false;
		}
	});
}

export { alphaNumericOnlyListener, alphaOnlyListener, emailOnlyListener, itemNameListener, maxLengthListener, numbersOnlyListener };
