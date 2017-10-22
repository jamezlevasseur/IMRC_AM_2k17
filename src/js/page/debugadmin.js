import $ from 'jquery';

import { handleServerResponse, handleServerError } from '../module/serverresponse';

export default class DebugAdmin {

  constructor () {
    if ( $('.debug-wrap').length>0 ) {
      this.lateResCheckInit();
      this.dummyResInit();
    }
  }

  lateResCheckInit () {
    let that = this;
    $('.late-res-check input[type=submit]').click(function(event) {
      console.log('late res test')
      $.ajax({
        url: ajaxurl,
        type: 'POST',
        data: {action: 'late_res_testing' },
        success: function (data) {
          handleServerResponse(data);
          that.debugSuccess();
        },
        error: function (data) {
          handleServerError(data, new Error());
        }
      });
    });
  }

  dummyResInit () {
    let that = this;
    $('.make-dummy-res input[type=submit]').click(function(event) {
      console.log('dummy res')
      $.ajax({
        url: ajaxurl,
        type: 'POST',
        data: {action: 'debug_make_res', mod: $('.make-dummy-res input[name=hour-mod]').val() },
        success: function (data) {
          handleServerResponse(data);
          that.debugSuccess();
        },
        error: function (data) {
          handleServerError(data, new Error());
        }
      });
    });
  }

  debugSuccess () {
    $('#debug-success').removeClass('iam-ninja');
    $('#debug-success').fadeOut('500', function() {
      $(this).remove();
      $('.debug-wrap').append('<h1 class="iam-ninja" id="debug-success" style=" position: fixed; top:20%; left:35%; padding:10px; margin:0; display:inline; font-size:30px; background:#0bbf56; border-radius:8px; color:white;">SUCCESS</h1>');
    });
  }
}
