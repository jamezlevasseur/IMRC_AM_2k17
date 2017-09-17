let createCookie = function (name,value,days,readAsMS) {
  let expires = "";
  if (days) {
    let date = new Date();
    if (readAsMS==true) {
      date.setTime(date.getTime()+days);
    } else {
      date.setTime(date.getTime()+(days*24*60*60*1000));
    }
    let expires = "; expires="+date.toGMTString();
  }
  document.cookie = name+"="+value+expires+"; path=/";
}

let readCookie = function (name) {
  let nameEQ = name + "=";
  let ca = document.cookie.split(';');
  for(let i=0;i < ca.length;i++) {
    let c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

let eraseCookie = function (name) {
  createCookie(name,"",-1);
}

export {createCookie, readCookie, eraseCookie};
