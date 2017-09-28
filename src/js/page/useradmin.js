import $ from 'jquery';

import { handleServerResponse, handleServerError } from '../module/serverresponse';
import { submissionStart, submissionEnd } from '../module/userfeedback';
import { isEmail, getPhoneNumberFromPage, phoneNumberIsFilledIn } from '../core/utils';
import { initCSVButtonListener } from '../module/uifunc';

export default class UserAdmin {

  constructor () {
    this.initUsersList();
  }

  initManageFunds () {
    let that = this;
    $('.manage-funds').click(function(event) {
      that.updateModalWithUserChargeTable()
    });
  }

  updateModalWithUserChargeTable () {
    let that = this;
    submissionStart();
    $('#myModal .modal-body').empty();
    $.ajax({
      url: ajaxurl,
      type: 'GET',
      data: {'action': 'get_user_charge_table', 'link': $('.iam-form').data('link')},
      success: function (data) {
        $('#myModal .modal-body').append( handleServerResponse(data) );
        that.initEditChargeButtons();
        $('.iam-csv-button').off();
        initCSVButtonListener(4,'iam-user-charges-table');
        submissionEnd();
      },
      error: function (data) {
        handleServerError(data, new Error());
      }
    });
  }

  initUsersList () {
    let that = this;
    $('.iam-users-list li').click(function(event) {
      submissionStart();
      $('.iam-user-info-col').empty();
      let username = $(this).html();

      $.ajax({
        url: ajaxurl,
        type: 'GET',
        data: {'action': 'get_user_info_html', 'username': username},
        success: function (data) {
          $('.iam-user-info-col').append( handleServerResponse(data) );
          that.initUserUpdate();
          that.initManageFunds();
          submissionEnd();
        },
        error: function (data) {
          handleServerError(data, new Error());
        }
      });

    });
  }

  initUserUpdate () {
    $('.iam-user-info-form .btn-success').click(function(event) {
      submissionStart();
      $.ajax({
        url: ajaxurl,
        type: 'POST',
        data: {	action: 'user_update_account_info',
                link: $('.iam-user-info-form').data('link'),
                first_name: $('#first-name').val(),
                last_name: $('#last-name').val(),
                email: $('#email').val(),
                phonenum: getPhoneNumberFromPage(),
                school_id: $('#school-id').val(),
                account_type: $('#account_type').val()
              },
        success: function (data) {
          handleServerResponse(data);
          $('.iam-user-info-form .iam-submit').blur();
          submissionEnd();
        },
        error: function (data) {
          handleServerError(data, new Error());
        }
      });
    });
  }

  initEditChargeButtons () {
    $('#myModal table tbody tr').each(function(index, el) {
      if ($(this).children('.iam-charge-status').text()=='Canceled' || $(this).children('.iam-charge-status').text()=='Pending') {
        $(this).children('td').children('.iam-edit-charge-row').text('approve');
      } else {
        $(this).children('td').children('.iam-edit-charge-row').text('cancel');
      }
    });
    this.editChargeListeners();
  }

  editChargeListeners () {
    let that = this;
  	$('.iam-edit-charge-row').click(function(event) {
  		$.ajax({
  			url: ajaxurl,
  			type: 'POST',
  			data: {action: 'admin_switch_charge_status',nid: $(this).data('nid')},
  			success: function (data) {
          handleServerResponse(data);
  				that.updateModalWithUserChargeTable();
  			},
  			error: function (data) {
  				handleServerError(data, new Error());
  			}
  		});
  	});
  }

}
