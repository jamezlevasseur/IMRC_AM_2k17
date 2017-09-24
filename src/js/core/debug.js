import $ from 'jquery';

import { rStr } from '../core/utils';

function registerDebug() {
  if ($('#signupform').length>0) {
    $('body').dblclick(function(event) {
      let em = rStr(16)+'@'+rStr(16)+'.comdasdadsa';
      $('#email').val(em);
      $('#email-confirm').val(em);
      $('#password').val('Asdfasdf1');
      $('#password-confirm').val('Asdfasdf1');
      $('#first-name').val(rStr(12));
      $('#last-name').val(rStr(12));
      $('#school-id').val(rStr(16));
      $('#phone-num-1').val('111');
      $('#phone-num-2').val('222');
      $('#phone-num-3').val('3333');
      $('#account_type option').eq(1).prop('selected', true);
    });
  }
}

function publicDebug() {
  if (window.location.href.indexOf('imrcaccounts')!=-1)
    return;

  console.warn('debug mode active');

  registerDebug();
}

export { publicDebug };
