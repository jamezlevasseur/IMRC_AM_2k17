import $ from 'jquery';

import { doError } from '../core/utils';

import { initSearchListener, initPopupXListener } from '../module/uifunc';
import { handleServerResponse, handleServerError } from '../module/serverresponse';
import { submissionStart, submissionEnd } from '../module/userfeedback';

import Cal from '../module/cal';
import BreadCrumb from '../module/breadcrumb';

export default class ReservationPublic {

  constructor () {
    this.currentRootTag = null;
    this.pastEvent = null;
    this.oldScrollPos = null;

    this.grabResPopup();
    this.grabCalData();
    this.breadCrumb = new BreadCrumb(this);

    //listeners
    this.initEquipmentButtonListener();
    this.initResDelete();
    initSearchListener('.iam-reservations-search','.iam-equipment-title',2);
  }

  grabResPopup () {
    this.resPopup = $('.iam-res-popup').prop('outerHTML');
    $('.iam-res-popup').remove();
  }

  grabCalData () {
    this.facilities = $('.iam-cal-data').data('names').split(',');
    this.rootTags = $('.iam-cal-data').data('root-tags').split(',');
    this.canReserveER = $('.iam-cal-data').data('can-res-er');
    this.erLateFee = $('.iam-cal-data').data('late-fee');
    this.facilityInfo = {};

    for (let i = 0; i < this.facilities.length; i++) {
      this.facilityInfo[this.facilities[i]] = $('.iam-cal-data').data(this.facilities[i]);
    }

    $('.iam-cal-data').remove();
  }

  initResDelete () {
    let that = this;

    $('.iam-existing-res-del-button').click(function(event) {
      let value = $(this).parent().children('input').val();
      $.ajax({
        url: ajaxurl,
        type: 'POST',
        data: {action: 'delete_user_reservation', val: value},
        success: function (data) {
          handleServerResponse(data);
          that.reloadExistingRes();
        },
        error: function (data) {
          handleServerError(data, new Error());
        }
      });
    });
  }

  reloadExistingRes () {
    let that = this;
    $('#iam-existing-res-container').empty();
    $.ajax({
      url: ajaxurl,
      type: 'GET',
      data: {action: 'get_user_reservations'},
      success: function (data) {
        $('#iam-existing-res-container').append( handleServerResponse(data) );
        that.initResDelete();
      },
      error: function (data) {
        handleServerError(data, new Error());
      }
    });
  }

  spawnResPopup (facilityName, description) {
    $('body').append(this.resPopup);
    $('.iam-res-popup').removeClass('iam-ninja');
    $('.iam-res-popup-header').append(this.activeEquipName);
    $('.iam-facility-info').html('<p>'+description+'</p>');
  }

  getFacilityInfo (key) {
    if (key=='' || typeof key == 'undefined' || typeof this.facilityInfo[this.currentRootTag] == 'undefined') {
      return doError('An error occurred when trying to use this equipment! :(');
    }
    return this.facilityInfo[this.currentRootTag][key];
  }

	initEquipmentButtonListener () {
    let that = this;

		$('.iam-equipment-button').click(function(event) {

			that.currentRootTag = $(this).data('equiproot').split(' ').join('_').toLowerCase();
      that.activeEquipName = $(this).parent().parent().children('.iam-equipment-block-left').children('.iam-equipment-title').data('eid');

      if(that.canReserveER==0 && that.currentRootTag=='equipment_room') {
        alert('You have insufficient funds to reserve from the Equipment Room. You must have at least enough funds to cover the standard late fee of $'+that.erLateFee+'.');
        return;
      }

      if (that.getFacilityInfo('type')=='rental')
        that.rentalPeriod = $(this).data('rental-period');

      that.spawnResPopup($(this).data('equiproot'), that.getFacilityInfo('description'));

      that.cal = new Cal(that, 'public');

      that.popupSubmitListener();

      that.hideEquipmentBlocks();
			initPopupXListener(that.revealEquipmentBlocks);

			this.oldScrollPos = $(window).scrollTop();

		});
	}

  hideEquipmentBlocks () {
    $('.iam-res-left').addClass('iam-ninja');
  }

  revealEquipmentBlocks () {
    $('.iam-res-left').removeClass('iam-ninja');
  }

  popupSubmitListener () {
    let that = this;
    $('.iam-popup-submit button').click(function(event) {
      let newEvents = [];
      let events = $('.iam-res-cal').fullCalendar('clientEvents');
      let warning = false;
      let comment = $('.iam-res-comment').val();
      for (let i = 0; i < events.length; i++) {
        let starttime, endtime;
        if (events[i].className.length>0) {
          newEvents.push( {
            user: events[i].title,
            start: events[i].start.format('YYYY-MM-DD HH:mm:ss'),
            end: events[i].end.format('YYYY-MM-DD HH:mm:ss'),
            comment: comment
          });
        }
      }

      $.ajax({
        url: ajaxurl,
        type: 'POST',
        async: false,
        data: {action: 'submit_reservation', equipment: that.activeEquipName, events: newEvents},
        success: function (data) {
          handleServerResponse(data);
          $('.iam-res-popup').remove();
          that.reloadExistingRes();
          that.revealEquipmentBlocks();
        },
        error: function (data) {
          handleServerError(data, new Error());
        }
      });
    });
  }

}
