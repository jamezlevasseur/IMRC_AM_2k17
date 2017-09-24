import $ from 'jquery';

/**
 * detect IE
 * returns version of IE or false, if browser is not Internet Explorer
 */
function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
       // Edge (IE 12+) => return version number
       return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}

let isEmail = function (email) {
  let atpos = email.indexOf("@");
  let dotpos = email.lastIndexOf(".");
  if (atpos<1 || dotpos<atpos+2 || dotpos+2>=email.length) {
    return false;
  }
  return true;
}

let getSize = function (obj) {
	let size = 0, key;
  for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
  }
  return size;
}

function escapeHtml(text) {
	let map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};

	return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

let plsFillInPhoneNum = 'Please fill in all fields of the phone number.';

function getPhoneNumberFromPage(required=false) {
  if (!phoneNumberIsFilledIn()) {
    if (!required)
      return '';
    alert(plsFillInPhoneNum);
    throw plsFillInPhoneNum;
  }
  return $('.iam-phone-num-grp #phone-num-1').val() +'-'+ $('.iam-phone-num-grp #phone-num-2').val() +'-'+ $('.iam-phone-num-grp #phone-num-3').val();
}

function phoneNumberIsFilledIn() {
  return ($('.iam-phone-num-grp #phone-num-1').val().length==3 &&
          $('.iam-phone-num-grp #phone-num-2').val().length==3 &&
          $('.iam-phone-num-grp #phone-num-3').val().length==4);
}

let rStr = function (length) {
  let str = '';
  for (let i = 0; i < length; i++) {
    str+=String.fromCharCode(97+Math.floor(Math.random()*25));
  }
  return str;
}

export {rStr, isEmail, getSize, escapeHtml, getPhoneNumberFromPage, phoneNumberIsFilledIn, detectIE};
