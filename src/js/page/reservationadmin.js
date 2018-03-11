import $ from 'jquery';

import { rStr, isEmail, getSize } from '../core/utils';

import { numbersOnlyListener } from '../module/textfieldlisteners';
import { handleServerResponse, handleServerError } from '../module/serverresponse';
import { submissionStart, submissionEnd } from '../module/userfeedback';
import { initSearchListener } from '../module/uifunc';

import Cal from '../module/cal';

export default class ReservationAdmin {

  constructor () {
    this.facility = $('.iam-reservation-wrap').data('facility');
    this.facility.Schedule = JSON.parse(this.facility.Schedule);

    this.initListItems();
    this.initSelectAll();
    this.initLoadAllReservationsBtn();
    $('label.iam-status-label input').prop('checked', true);
    this.initResCalSubmitListener();
    initSearchListener('.iam-search','.iam-reservation-list div',0);
  }

  calRender () {
    submissionStart();
    if (typeof this.cal =='undefined') {
      this.cal = 'adminRes';
      this.calendar = new Cal(this,'admin')
    } else {
      this.calendar.update();
    }
    submissionEnd();
  }

  getFacilityInfo (key) {
    return this.facility.Schedule[key];
  }

	initResCalSubmitListener () {
    let that = this;
		$('.iam-res-cal-submit').click(function(event) {
			if ($('.iam-res-cal-placeholder').length>0)
				return;
			if (!getSize(that.calendar.eventsModified) && !that.calendar.eventsToDelete.length)
				return;
			if (!confirm("Are you sure you want to make these changes?"))
				return;
			submissionStart();
      console.log({action: 'admin_update_reservations', to_delete: that.calendar.eventsToDelete, modified: that.calendar.eventsModified, sendEmails: $('.iam-res-cal-send-emails').is(':checked'), reason: $('.iam-res-cal-reason').val(), facility: that.facility.Name, load_all: that.didLoadAll})
			$.ajax({
			  url: ajaxurl,
			  type: 'POST',
			  data: {action: 'admin_update_reservations', to_delete: that.calendar.eventsToDelete, modified: that.calendar.eventsModified, sendEmails: $('.iam-res-cal-send-emails').is(':checked'), reason: $('.iam-res-cal-reason').val(), facility: that.facility.Name, load_all: that.didLoadAll},
			  success: function (data) {
			    that.updateEquipmentEvents( handleServerResponse(data) );
			    that.calRender();
          that.calendar.resetEvents();
			    submissionEnd();
			  },
			  error: function (data) {
			    handleServerError(data, new Error());
			  }
			});
		});
		$('.iam-res-cal-cancel').click(function(event) {
			if ($('.iam-res-cal-placeholder').length>0)
				return;
			refreshResCal();
		});
	}

  initListItems () {
    let that = this;
    $('.iam-reservation-list div').click(function(event) {
      $(this).toggleClass('iam-highlighted');
      that.calRender();
    });
  }

  initSelectAll () {
    let that = this;
    $('.iam-res-select-all').click(function(event) {
        $(this).toggleClass('iam-highlighted');
        if ($(this).hasClass('iam-highlighted')) {
            $('.iam-reservation-list div:not(.iam-highlighted)').each(function(index, el) {
                if (!$(this).hasClass('iam-ninja')) {
                    $(this).addClass('iam-highlighted');
                }
            });
            that.calRender();
        } else {
            $('.iam-reservation-list div.iam-highlighted').each(function(index, el) {
                $(this).removeClass('iam-highlighted');
            });
            that.calRender();
        }
    });
  }

  initLoadAllReservationsBtn () {
    let that = this;
    $('.iam-load-all-reservations').click(function(event) {
      if ($('.iam-res-cal-placeholder').length>0)
        return;

      submissionStart();
      $.ajax({
          url: ajaxurl,
          type: 'GET',
          data: {action: 'load_all_events_admin_res_cal', facility: that.facility.Name},
          success: function (data) {
            let newData = handleServerResponse(data);
            that.updateEquipmentEvents(newData);
            that.didLoadAll = true;
            that.calRender();
          },
          error: function (data) {
            handleServerError(data, new Error());
          }
        });
    });
  }

  updateEquipmentEvents (newData) {
    for (let i in newData) {
      let c = newData[i];
      $('.iam-reservations-equipment-list-item[data-nid='+i+']').data('calevents', c);
    }
  }

}
