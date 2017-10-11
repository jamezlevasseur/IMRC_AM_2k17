import $ from 'jquery';

import { rStr, isEmail, getSize } from '../core/utils';

import { numbersOnlyListener } from '../module/textfieldlisteners';
import { handleServerResponse, handleServerError } from '../module/serverresponse';
import { submissionStart, submissionEnd } from '../module/userfeedback';

import Cal from '../module/cal';

export default class SettingsAdmin {

  constructor () {
    this.link = $('.iam-link').data('link');
    $('.iam-link').remove();


    numbersOnlyListener($('.iam-ipad-code'));

    this.adminSettingsListener();
    this.facilityNameListener();
    this.facilityEmailListener();
    this.notificationEmailListeners();
    this.initScheduleSubmitListeners();
    this.initIrregularHoursButtonListener();

    this.facilityName = $('.facility-name').val();
  }

  getTimePickerVal ($container) {
    return $container.children('.iam-hour-select').val()+':'+$container.children('.iam-min-select').val()+' '+$container.children('.iam-am-pm-select').val();
  }

  makeBusinessHours () {
    let that = this;
    let block  = $('.iam-scheduling-block');
    let days = ['sun','mon','tue','wed','thu','fri','sat'];
    let full_days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    let businessHours = {};

    block.find('.iam-opening-row').children('td').each(function(index, el) {
      if (index!=0) {
        if ($(this).children('label').children('.iam-closed-checkbox').is(':checked')) {
          businessHours[days[index-1]] = {start:'',end:''};
        } else {
          businessHours[days[index-1]] = {start: that.getTimePickerVal($(this)) };
        }
      }
    });

    block.find('.iam-closing-row').children('td').each(function(index, el) {
      if (index!=0) {
        if (businessHours[days[index-1]].start!='') {
          let closeTime = that.getTimePickerVal($(this));
          if (moment('2016-1-1 '+businessHours[days[index-1]].start).isAfter('2016-1-1 '+closeTime)) {
            let errormsg ='Your opening time for '+full_days[index-1]+' is after this closing time, please correct this.';
            alert (errormsg);
            throw errormsg;
          }
          businessHours[days[index-1]].end = closeTime;
        }
      }
    });

    return businessHours;
  }

  initScheduleSubmitListeners () {
    let that = this;
    $('.iam-scheduling-block .btn-success').off();
    $('.iam-scheduling-block .btn-success').click(function(event) {
      let businessHours = that.makeBusinessHours();
      console.log(businessHours)

      submissionStart();

      $.ajax({
        url: ajaxurl,
        type: 'POST',
        data: { 'action': 'update_facility_schedule',
                'link': that.link,
                'business_hours': businessHours,
                'description': $('.scheduling-description').val(),
                'late_check_time': that.getTimePickerVal($('.late-check-time'))
              },
        success: function (data) {
          handleServerResponse(data);
          submissionEnd();
        },
        error: function (data) {
          handleServerError(data, new Error());
        }
      });
    });
  }

  facilityNameListener () {
    let that = this;
    $('.facility-name').change(function(event) {
      submissionStart();
      $.ajax({
        url: ajaxurl,
        type: 'POST',
        data: { 'action': 'facility_name_change',
                'link': that.link,
                'new_name': $('.facility-name').val()},
        success: function (data) {
          handleServerResponse(data);
          submissionEnd();
        },
        error: function (data) {
          handleServerError(data, new Error());
        }
      });
    });
  }

  facilityEmailListener () {
    let that = this;
    $('.facility-email').change(function(event) {
      submissionStart();
      $.ajax({
        url: ajaxurl,
        type: 'POST',
        data: { 'action': 'facility_email_change',
                'link': that.link,
                'new_email': $('.facility-email').val()},
        success: function (data) {
          handleServerResponse(data);
          submissionEnd();
        },
        error: function (data) {
          handleServerError(data, new Error());
        }
      });
    });
  }

  notificationEmailListeners () {
    let that = this;

    $('.new-res-email .btn-success').click(function(event) {
      that.updateNotificationEmail('new_res_email_change', $(this).parent());
    });
    $('.late-res-admin-email .btn-success').click(function(event) {
      that.updateNotificationEmail('late_res_admin_email_change', $(this).parent());
    });
    $('.late-res-user-email .btn-success').click(function(event) {
      that.updateNotificationEmail('late_res_user_email_change', $(this).parent());
    });
  }

  updateNotificationEmail (action, $panelBody) {
    let that = this;
    submissionStart();
    $.ajax({
      url: ajaxurl,
      type: 'POST',
      data: { 'action': action,
              'subject': $panelBody.find('.email-subject').val(),
              'body': $panelBody.find('.email-body').val(),
              'link': that.link
            },
      success: function (data) {
        handleServerResponse(data);
        submissionEnd();
      },
      error: function (data) {
        handleServerError(data, new Error());
      }
    });
  }

	adminSettingsListener () {
		$('.iam-settings-submit').click(function(event) {
			submissionStart();
			let newSettings = {action:'admin_update_settings'};
			if ($('.iam-late-charge-fee').length>0)
				newSettings.late_charge_fee = $('.iam-late-charge-fee').val()
			if ($('.iam-ipad-code').length>0)
				newSettings.ipad_code = $('.iam-ipad-code').val();
			if ($('.iam-training-page-email').length>0)
				newSettings.training_email = $('.iam-training-page-email').val();
			$.ajax({
				url: ajaxurl,
				type: 'POST',
				data: newSettings,
  			success: function (data) {
  				handleServerResponse(data);
  				submissionEnd();
  			},
  			error: function (data) {
  				handleServerError(data, new Error());
  			}
			});
		});
	}

  initUpdateIrregularHoursButtonListener () {
    let that = this;
    $('#irregular-hours-modal .btn-success').off();
    $('#irregular-hours-modal .btn-success').click(function(event) {

      submissionStart();
      let newEvents = [];
      let events = $('.iam-cal').fullCalendar('clientEvents');
      for (let i = 0; i < events.length; i++) {
        let starttime, endtime;
        if (events[i].className.length>0) {
          newEvents.push( {
            title: 'closed',
            start: events[i].start.format('YYYY-MM-DD HH:mm:ss'),
            end: events[i].end.format('YYYY-MM-DD HH:mm:ss')
          });
        }
      }

      $.ajax({
        url: ajaxurl,
        type: 'POST',
        data: {action: 'admin_update_irregular_hours', facility:that.facilityName, events: newEvents, to_delete: that.irregularCal.eventsToDelete},
        success: function (data) {
          handleServerResponse(data);
          submissionEnd();
        },
        error: function (data) {
          handleServerError(data, new Error());
        }
      });
    });
  }

  initIrregularHoursButtonListener () {
    let that = this;
    this.cal = 'irregular';

    $('.iam-irregular-hours-button').off();
    $('.iam-irregular-hours-button').click(function(event) {
      $('#irregular-hours-modal .modal-body').empty();
      $('#irregular-hours-modal .modal-body').append('<div class="iam-cal"></div>');

      setTimeout( () => { that.irregularCal = new Cal(that, 'admin'); }, 200);

      that.initUpdateIrregularHoursButtonListener();
    });
  }

}
