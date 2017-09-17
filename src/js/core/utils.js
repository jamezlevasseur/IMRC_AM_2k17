let rStr = function (length) {
  let str = '';
  for (let i = 0; i < length; i++) {
    str+=String.fromCharCode(97+Math.floor(Math.random()*25));
  }
  return str;
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

export {rStr, isEmail, getSize, escapeHtml};
