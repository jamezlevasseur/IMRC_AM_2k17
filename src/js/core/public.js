import $ from 'jquery';

import { isEmail, escapeHtml, getPhoneNumberFromPage, phoneNumberIsFilledIn } from '../core/utils';
import { publicDebug, debugWarn } from '../core/debug';

import { initPopupXListener } from '../module/uifunc';
import { alphaNumericOnlyListener, alphaOnlyListener, emailOnlyListener, numbersOnlyListener } from '../module/textfieldlisteners';
import { createCookie, readCookie, eraseCookie } from '../module/cookie';
import { handleServerResponse, handleServerError } from '../module/serverresponse';
import { convertBusinessHours } from '../module/cal';
import { submissionStart, submissionEnd } from '../module/userfeedback';

import ReservationPublic from '../page/reservationpublic';

(function( $ ) {

	$(function () {
		//constants
		const IPAD_LOCK_COOKIE = 'iam_ipad_code_last_updated';
		//global vars
		var firstLoginAttempt=1;

		//misc functions

		var loginLockout = function () {
			$('.login-form-container').empty();
			$('.login-form-container').append('<h2 style="color:red;">Too many login attempts, you have been locked out.</h2><small>Please attempt to recover your password and try later.</small>');
		}

		var removeNav = function () {
			$('.menu li').remove();
			$('.site-navigation').height(53);
			$('.entry-title').remove();
		}

		//reservation management

		// checkout functions
		var checkout_mats, selected_equip_schedule, selectedMat, checkoutRow, checkoutNid, checkoutTotal, balance, selected_equip_name, lastSource, currentCheckout, currentDiscount, currentAccountType, checkoutAmount,checkoutBusinessHours;
		var comparingSchedules = false;

		var initOldReservationsListener = function () {
			$('.iam-not-checked-out-container').toggleClass('iam-ninja');
			$('.iam-old-reservations').click(function(event) {
				$('.iam-not-checked-out-container').toggleClass('iam-ninja');
				$('.iam-caret').toggleClass('fa-caret-right');
				$('.iam-caret').toggleClass('fa-caret-down');
			});
		}

		var canMakeReservation = function (desired_appointment,dateOf) {
			var equip_and_business_schedule = selected_equip_schedule.slice(0);

			var dayOfWeek = moment(dateOf).format('ddd').toLowerCase();

			for (var key in checkoutBusinessHours) {

				var day = checkoutBusinessHours[key];

				if (key==dayOfWeek) {
					//add business hours event to event array
					equip_and_business_schedule.push({
						start:dateOf+' 00:00:00',
					 	end:dateOf+' '+moment(day.start,'hh:mm:a').format('HH:mm:00'),
					 	businessHours: true});
					equip_and_business_schedule.push({
						start:dateOf+' '+moment(day.end,'hh:mm:a').format('HH:mm:00'),
						end:dateOf+' 24:00:00',
						businessHours: true});
				}
			}

			let warnOutsideOfHours = false;

			for (var i=0; i<equip_and_business_schedule.length; i++) {
				var obj = equip_and_business_schedule[i];

				//cache conditions
				/*
				>[desired]
						>[event]
					*/
				var check1 = moment(desired_appointment.start).isBefore(obj.start);
				/*
				>[desired]
						[event]<
					*/
				var check2 = moment(desired_appointment.start).isBefore(obj.end);
				/*
				[desired]<
						   >[event]
					*/
				var check3 = moment(desired_appointment.end).isBefore(obj.start);
				/*
				[desired]<
						[event]<
					*/
				var check4 = moment(desired_appointment.end).isBefore(obj.end);
				//checking for event intersection, all must be the same value true or false
				if (
					/*
							  [desired]
						[event]
					*/
					(moment(desired_appointment.start).isSame(obj.end) && (check1 == check3) && (check3==check4))==false &&
					/*
						[desired]
								[event]
					*/
					(moment(desired_appointment.end).isSame(obj.start) && (check1 == check2) && (check2==check4))==false &&

					((check1 == check2) && (check2==check3) && (check3==check4))==false) {
						if (obj.hasOwnProperty('businessHours') && !warnOutsideOfHours) {
							warnOutsideOfHours = true;
							alert('Caution: You reservation takes place outside of operating hours. The IMRC may be closed during this time.');
						} else {
							alert('Your reservation interferes with another. Please double check the calendar for today and refresh the page if necessary.');
							return false;
						}
				}
			}
			return true;
		}


		var reserveNewEquipmentAuthCallback = function (username) {
			if ($('.iam-datepicker').val()=='' ||
				$('.iam-from-timepicker').val()=='' ||
				$('.iam-to-timepicker').val()=='') {
				alert('Please select a value for date, start time, end time.');
				return false;
			}
			if (comparingSchedules) {
				alert('Please wait.');
				return false;
			}
			var desired_appointment = {start:$('.iam-datepicker').val()+" "+$('.iam-from-timepicker').val()+':00', end:$('.iam-datepicker').val()+" "+$('.iam-to-timepicker').val()+':00', user: username};
			comparingSchedules = true;
			$('.iam-popup').remove();
			$.ajax({
				url: lastSource+'&get_irregular_hours=y',
				type: 'GET',
				success: function (data) {
					//handle as raw json since this is normally used for fullcal
					selected_equip_schedule = JSON.parse(data);
					if (canMakeReservation(desired_appointment,$('.iam-datepicker').val())) {
						/*if (moment($('.iam-datepicker').val()).isBefore(moment())) {
							alert('The reservation cannot start in the past.');
							comparingSchedules = false;
							return;
						}*/
						$.ajax({
							url: ajaxurl,
							type: 'POST',
							data: {action: 'submit_reservation', equipment: selected_equip_name, events: [desired_appointment], room: 0},
							success: function (data) {
								handleServerResponse(data);
								comparingSchedules = false;
								$('.iam-cal').fullCalendar( 'removeEventSource', lastSource );
								$('.iam-cal').fullCalendar( 'addEventSource', lastSource );
								alert('success');
							},
							error: function (data) {
								handleServerError(data, new Error());
							}
						});
					}
					comparingSchedules = false;
				},
				error: function (data) {
					handleServerError(data, new Error());
				}
			});
		}

		var lastActivity = Date.now();
		var refreshPageAttempt = function (argument) {
			if (Date.now()-lastActivity>120000 && $('.iam-popup').length<1) {
				window.location.reload();
			}
		}

		var initCheckout = function () {
			var date_picker,from_picker,to_picker;
			initCheckinListeners();
			initCheckoutListeners();
			setupEquipmentSchedule();

			$('.iam-checkout-refresh').click(function(event) {
				window.location.reload();
			});

			$('body *').click(function(event) {
				lastActivity = Date.now();
			});

			setInterval(function(){ refreshPageAttempt(); }, 120000);

			$('.logo').attr('href', '');
			$('.entry-title').remove();
			$('.menu').empty();
			$('.menu').append('<li class="menu-item menu-item-type-post_type menu-item-object-page iam-checkout-area-tab"><a>Checkout</a></li><li class="menu-item menu-item-type-post_type menu-item-object-page iam-equipment-schedule-tab"><a>Equipment Schedule</a></li>');
			$('.iam-equipment-schedule-tab').click(function(event) {
				$('.iam-popup').remove();
				$('.iam-equipment-schedule').removeClass('iam-ninja');
				$('.iam-checkout-area').addClass('iam-ninja');
				$('.iam-cal').fullCalendar('today');
				$('.iam-reserve-new-equipment').off();
				$('.iam-reserve-new-equipment').click(function(event) {
					makeAuthPopup(reserveNewEquipmentAuthCallback);
				});
			});
			$('.iam-checkout-area-tab').click(function(event) {
				$('.iam-equipment-schedule').addClass('iam-ninja');
				$('.iam-checkout-area').removeClass('iam-ninja');
			});
			initOldReservationsListener();
		}

		var updateForCheckoutDropDown = function () {
			$('.iam-mats-row').each(function(index, el) {
				selectedMat = $(this).find('.iam-checkout-possible-mats option:selected').val();
				var un = $(this).children('span').children('.iam-checkout-unit-name');
				var ppu = $(this).children('span').children('.iam-checkout-price-per-unit');
				var d = $('.iam-checkout-discount');
				var bp = $(this).children('label').children('.iam-checkout-base-price');

				un.empty();
				un.text(checkout_mats[selectedMat]['unit_name']);
				ppu.empty();
				ppu.text(checkout_mats[selectedMat]['price_per_unit']);
				d.empty();
				d.text((currentDiscount*100)+'% '+currentAccountType+' discount');
				bp.empty();
				bp.text((checkout_mats[selectedMat]['base_price']-checkout_mats[selectedMat]['base_price']*currentDiscount).toFixed(2));
			});
		}
		var initCheckoutDropDownListener = function () {
			$('.iam-checkout-possible-mats').change(function(event) {
				$('.iam-checkout-amount').keyup();
				updateForCheckoutDropDown();
			});
		}

		var initCheckoutTotalListener = function () {
			$('.iam-checkout-amount').off();
			$('.iam-checkout-amount').keyup(function(event) {
				if ($(this).val().length>0 && !$.isNumeric($(this).val())) {
					$(this).val($(this).val().substring(0,$(this).val().length-2))
					return;
				}
				checkoutAmount = $(this).val();
				var thisMat = $(this).parent().find('.iam-checkout-possible-mats option:selected').val();
				checkoutTotal = checkoutAmount*checkout_mats[thisMat]['price_per_unit'];
				if (checkoutTotal<checkout_mats[thisMat]['base_price']) {
					checkoutTotal = checkout_mats[thisMat]['base_price'];
				}
				checkoutTotal = checkoutTotal - checkoutTotal*currentDiscount;
				$(this).next('span').children('.iam-checkout-total').text(checkoutTotal.toFixed(2));
			});
		}
		var initCheckinListeners = function () {
			$('.iam-check-in-button').off();
			$('.iam-check-in-button').click(function(event) {
				var that = this;
				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: {action: 'update_appointment', nid: $(that).data('nid'), status: 1},
					dataType: 'html',
					success: function (data) {
						handleServerResponse(data);
						$(that).addClass('iam-check-out-button');
						$(that).removeClass('iam-check-in-button');
						$('.iam-check-out-button').off();
						initCheckoutListeners();
					},
					error: function (data) {
						handleServerError(data, new Error());
					}
				});
			});
		}

		var addDeleteMatRowListeners = function () {
			$('.iam-checkout-add-mat').click(function(event) {
				if (cachedMatsRow==null)
					return;
				$('.iam-mats-row').eq(-1).after(cachedMatsRow);
				initCheckoutTotalListener();
				initCheckoutDropDownListener();
				updateForCheckoutDropDown();
				numbersOnlyListener($('.iam-checkout-amount'));
			});

			$('.iam-checkout-del-mat').click(function(event) {
				if ($('.iam-mats-row').length==1)
					return;
				$('.iam-mats-row').eq(-1).remove();
			});
		}

		var cachedMatsRow = null;
		var checkoutAuthenticateCallback = function (username,data) {
			var accountType = data;
			currentAccountType = accountType.account_type;
			currentDiscount = accountType.discount/100;
			$('.iam-popup').remove();
			var thisnid = $(currentCheckout).data('nid');
			var checkoutRow = $(currentCheckout).parent().parent();
			$.ajax({
				url: ajaxurl,
				type: 'GET',
				data: {action: 'get_checkout_popup',nid:thisnid},
				success: function (data) {
					data = handleServerResponse(data);
					checkout_mats = JSON.parse(data['mats']);
					$('body').append(data['html']);
					if (cachedMatsRow==null) {
						cachedMatsRow = $('<div>').append($('.iam-mats-row').clone()).html();
					}
					addDeleteMatRowListeners();
					balance = $('.iam-checkout-bal').text();
					checkoutNid = thisnid;
					initClosePopupListener();
					initCheckoutTotalListener();
					initCheckoutDropDownListener();
					initCheckoutSubmitListener();
					updateForCheckoutDropDown();
					numbersOnlyListener($('.iam-checkout-amount'));
					$('.iam-checkout-discount')
				},
				error: function (data) {
					handleServerError(data, new Error());
				}
			});
		}

		var makeAuthPopup = function (callback, request, predefinedUser) {
			var userfield = typeof predefinedUser === 'undefined' ? '<input type="text" placeholder="username" class="iam-username">' : '<input type="text" placeholder="username" class="iam-username" value="'+predefinedUser+'" disabled>' ;
			request = typeof request === 'undefined' ? '' : request;
			$('body').append('<div class="iam-popup" style="width:150px;left:30%;"><div class="iam-popup-header">Login<i style="float:right;" class="fa fa-close fa-3"></i></div><div class="iam-popup-body"><p class="iam-popup-message" style="color:red;"></p>'+userfield+'<br /><input type="password" class="iam-password" placeholder="password" style="margin-bottom:40px;"><input type="submit" class="iam-popup-submit iam-autheticate-submit"></div></div>');
			initClosePopupListener();
			initAuthenticationListeners(callback, request);
			if (typeof predefinedUser === 'undefined') {
				$('.iam-username').focus();
			} else {
				$('.iam-password').focus();
			}

		}

		var initAuthenticationListeners = function (callback, req) {
			$('.iam-autheticate-submit').off()
			$('.iam-autheticate-submit').click(function(event) {
				var user = $('.iam-username').val();
				if (isEmail(user)) {
					alert('Please enter your username, not email.');
					return;
				}
				$.ajax({
					url: ajaxurl,
					type: 'GET',
					data: {action: 'public_login', user: $('.iam-username').val(), password: $('.iam-password').val(), request: req},
					success: function (data) {
						data = handleServerResponse(data);
						callback($('.iam-username').val(), data);
					},
					error: function (data) {
						handleServerError(data, new Error());
					}
				});
			});
		}
		var initCheckoutListeners = function () {
			$('.iam-check-out-button').off();
			$('.iam-check-out-button').click(function(event) {
				currentCheckout = this;
				var currentCheckoutUser = $(this).parent().parent().children('.iam-checkout-username').text();
				$('body').addClass('iam-no-select');
				makeAuthPopup(checkoutAuthenticateCallback, 'account_type', currentCheckoutUser);
			});
		}
		var initClosePopupListener = function () {
			$('.fa-close').click(function(event) {
				$('.iam-popup').remove();
				if ($('.iam-checkout').length>0) {
					$('body').removeClass('iam-no-select');
				}
			});
		}
		var initCheckoutSubmitListener = function () {
			$('.iam-checkout-submit').click(function(event) {
				if ($('.iam-checkout-amount').val().length<1) {
					alert("Please enter an amount.");
					return;
				}
				if (balance-parseFloat($('.iam-checkout-total').text())<0) {
					alert("Insufficient account funds.");
					return;
				}
				if (!confirm("Are you sure all the information is correct?"))
					return;
				var checkoutSubmitAmount = 0;
				var matToSend = {};
				var multipleMats = false;
				if ($('.iam-mats-row').length>1) {
					multipleMats = true;

					$.each($('.iam-checkout-total'), function(index, val) {
						checkoutSubmitAmount -= parseFloat($(this).text());
					});

					matToSend = [];
					checkoutAmount = [];

					$.each($('.iam-mats-row'), function(index, val) {

						matToSend.push( {'name':$(this).find('.iam-checkout-possible-mats option:selected').val(),
										'unit_name':$(this).children('span').children('.iam-checkout-unit-name').eq(0).text(),
										'price_per_unit':$(this).children('span').children('.iam-checkout-price-per-unit').text(),
										'base_price':$(this).children('label').children('.iam-checkout-base-price').text()} );
						checkoutAmount.push($(this).find('.iam-checkout-amount').val());
					});

				} else {
					checkoutSubmitAmount = (-checkoutTotal);
					matToSend = {'name':selectedMat,'unit_name':checkout_mats[selectedMat]['unit_name'],'price_per_unit':checkout_mats[selectedMat]['price_per_unit'],'base_price':checkout_mats[selectedMat]['base_price']};
				}

				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: {'action':'checkout_submit','nid':checkoutNid,'total':checkoutSubmitAmount,'mat':matToSend,'amount':checkoutAmount,'multiple_mats':multipleMats},
					success: function (data) {
						handleServerResponse(data);
						$('body').removeClass('iam-no-select');
						$('.iam-popup').remove();
						$(checkoutRow).remove();
						window.location.reload();
					},
					error: function (data) {
						handleServerError(data, new Error());
					}
				});

			});
		}
		var setupEquipmentSchedule = function () {
			//init calendar
			selected_equip_name = $('.iam-equipment-schedule-list li').eq(0).text().replace(' ','_');
			$('.iam-equipment-schedule-list li').eq(0).addClass('currently-selected');
			$('.iam-to-reserve').html($('.iam-equipment-schedule-list li').eq(0).text());
			$('.iam-equipment-schedule-list li').click(function(event) {
				$('.iam-equipment-schedule-list li').removeClass('currently-selected');
				$(this).addClass('currently-selected');
				selected_equip_name = $(this).text().replace(' ','_');
				$('.iam-to-reserve').html($(this).text())
				var newSource = ajaxurl+"?action=get_equipment_calendar&name="+selected_equip_name;
				$('.iam-cal').fullCalendar( 'removeEventSource', lastSource );
				$('.iam-cal').fullCalendar( 'addEventSource', newSource );
				lastSource = newSource;
			});
			var wknd = false;
			var d = moment().day();
			if (d==0 || d==6)
				wknd = true;
			$.ajax({
				url: ajaxurl,
				type: 'GET',
				data: {action: 'get_business_hours',equip_name: selected_equip_name},
				success: function (data) {
					data = handleServerResponse(data);
					checkoutBusinessHours = JSON.parse(data);
					var businessHoursConverted = convertBusinessHours(data);
					lastSource = ajaxurl+"?action=get_equipment_calendar&name="+selected_equip_name;
					$('.iam-cal').fullCalendar({
						header: {
							left: 'prev,next today',
							right: 'title',
						},
						allDaySlot: false,
						eventOverlap: false,
						weekends: wknd,
						eventTextColor: '#ffffff',
						height: 500,
						forceEventDuration: true,
						defaultView: 'agendaDay',
						editable: false, //new events will be made editable else where
						businessHours: businessHoursConverted,
						eventSources: [
							{url:ajaxurl+"?action=get_equipment_calendar&name="+selected_equip_name},
							{url: ajaxurl+"?action=get_irregular_hours_calendar&equip_name="+selected_equip_name,
							color: '#f13d39'}
							],

					});
				},
				error: function (data) {
					handleServerError(data, new Error());
				}
			});
		}

		//login functions

		var initDiscoverAvailabilityListener = function () {
			$('.iam-discover-availability-button').off();
			$('.iam-discover-availability-button').click(function(event) {
				//init popup

				$('body').append(res_form);
				initPopupXListener();
				var equip_name = $('.iam-discover-data').data('name');
				var original_name = equip_name;
				$('.iam-res-popup-header').append(equip_name);
				equip_name = equip_name.replace(/ /g, '_');
				var event_data = [];

				current_root_tag = $('.iam-discover-data').data('equiproot').replace(' ','_').toLowerCase();
				var wknd = false;
				var d = moment().day();
				if (d==0 || d==6)
					wknd = true;
				if (facility_info[current_root_tag]['schedule_type']=='Rental') {
					$('.iam-facility-info').html('<h1>'+$(this).data('equiproot')+' Hours</h1><p>'+facility_info[current_root_tag]['rental_hours_description'])+'</p>';

					$('.iam-res-cal').fullCalendar({
						header: {
							left: 'prev,next today',
							center: 'title',
							right: 'month'
						},
						droppable: true,
						eventOverlap: false,
						allDaySlot: true,
					  weekends: wknd,
						height: 500,
						forceEventDuration: true,
						defaultView: 'month',
						allDay: true,
						defaultAllDayEventDuration: {days: facility_info[current_root_tag]['rental_period']},
						editable: false, //new events will be made editable else where
						eventLimit: true, // allow "more" link when too many events
						events: ajaxurl+"?action=get_equipment_calendar&name="+equip_name
					});

				} else if (facility_info[current_root_tag]['schedule_type']=='Appointment') {

					var businessHoursConverted = convertBusinessHours(facility_info[current_root_tag]['appointment_business_hours']);
					$('.iam-res-cal').fullCalendar({
						header: {
							left: 'prev,next today',
							center: 'title',
							right: 'agendaWeek,agendaDay'
						},
						droppable: true,
						allDaySlot: false,
						eventOverlap: false,
					    businessHours: businessHoursConverted,
					    weekends:wknd,
						height: 500,
						forceEventDuration: true,
						defaultView: 'agendaWeek',
						editable: false, //new events will be made editable else where
						eventLimit: true, // allow "more" link when too many events
						eventSources: [
						{url:ajaxurl+"?action=get_equipment_calendar&name="+equip_name},
						{url: ajaxurl+"?action=get_irregular_hours_calendar&facility="+current_root_tag,
						color: '#f13d39'}
						]
					});
				} else if (facility_info[current_root_tag]['schedule_type']=='Approval') {
					$.ajax({
						url: ajaxurl,
						type: 'GET',
						data: {action: 'get_approval_hours',name:original_name},
						success: function (data) {
							var businessHoursConverted = JSON.parse(data);
							if (businessHoursConverted==null) {
								businessHoursConverted = [];
							}
							$('.iam-res-cal').fullCalendar({
								header: {
									left: 'prev,next today',
									center: 'title',
									right: 'agendaWeek,agendaDay'
								},
								droppable: true,
								allDaySlot: false,
								eventOverlap: false,
							    businessHours: businessHoursConverted,
							    weekends:wknd,
								height: 500,
								forceEventDuration: true,
								defaultView: 'agendaWeek',
								editable: false, //new events will be made editable else where
								eventLimit: true, // allow "more" link when too many events
								eventSources: [
								{url:ajaxurl+"?action=get_equipment_calendar&name="+equip_name},
								{url:ajaxurl+"?action=get_equipment_calendar&rstatus=0&name="+equip_name,
								color:'#a5a5a5'},
								]
							});
						},
						error: function (data) {
							handleServerError(data, new Error());
						}
					});
				}
				//listeners
			});

		}

		var discoverEquipment = [];

		var initDiscoverListListener = function () {
			$('.iam-discover-list li').click(function(event) {
				$('.iam-discover-display').empty();
				var equipment = discoverEquipment[$(this).data('equipment')];
				if (equipment['Description']=='')
					equipment['Description'] = 'N/A';
				if (equipment['Pricing_Description']=='')
					equipment['Pricing_Description'] = 'N/A';
				if (equipment['Manufacturer_Info']=='')
					equipment['Manufacturer_Info'] = 'N/A';
				if (equipment['Manufacturer_Info'].indexOf('http')!=-1)
					equipment['Manufacturer_Info'] = '<a href="'+equipment['Manufacturer_Info']+'">'+equipment['Manufacturer_Info']+'</a>';
				$('.iam-discover-display').html('<input type="hidden" class="iam-discover-data" data-name="'+escapeHtml(equipment['Name'])+'" data-equiproot="'+escapeHtml(equipment['Root_Tag'])+'"><img style="height:120px;" src="'+equipment['Photo']+'" alt="'+equipment['Name']+'" /><p><div class="iam-secondary-button iam-discover-availability-button">View Availability</div><br/><br/><b>Item Name:</b> '+equipment['Name']+'</p><p><b>Description:</b> '+equipment['Description']+'</p><p><b>Pricing Description:</b> '+equipment['Pricing_Description']+'</p><p><b>Manufacturer Info:</b> '+equipment['Manufacturer_Info']+'</p>');
				initDiscoverAvailabilityListener();
			});
		}

		var cachedDiscoverData = {};

		var buildDiscoverBlock = function (data) {
			discoverEquipment = data;
			var list = '<div class="iam-discover-list-container"><ul class="iam-discover-list">';
			for (var i = 0; i < data.length; i++) {
				if (data[i]==null)
					continue;
				list+='<li data-equipment="'+i+'">'+data[i]['Name']+'</li>';
			}
			list+='</ul></div><div class="iam-discover-display"></div>';
			$('.iam-discover-block').empty();
			$('.iam-discover-block').append(list);
			initDiscoverListListener();
			$('.iam-discover-list').children('li').eq(0).click();
		}

		var makeDiscoverBlock = function (tag) {
			if (typeof cachedDiscoverData[tag]!='undefined') {
				buildDiscoverBlock(cachedDiscoverData[tag]);
				return;
			}
			$.ajax({
				url: ajaxurl,
				type: 'GET',
				data: {action: 'get_equipment_for_tag','tag':tag},
				success: function (data) {
					data = JSON.parse(handleServerResponse(data));
					cachedDiscoverData[tag] = data;
					buildDiscoverBlock(data);
				},
				error: function (data) {
					handleServerError(data, new Error());
				}
			});
		}


		//perpage setup

		//TODO: mixed up reservation with reference a while ago, change later
		if ($('#iam-res').length>0) { //reservation page

			var resPage = new ReservationPublic();

		} else if ($('#signupform').length>0) {
			removeNav();
			alphaOnlyListener($('#first-name'));
			alphaOnlyListener($('#last-name'));
			emailOnlyListener($('#email'));
			emailOnlyListener($('#email-confirm'));
			alphaNumericOnlyListener($('#reg-key'));
			$('#register-submit').click(function(event) {
				if ($('#email').val()=='' || $('#first-name').val()=='' || $('#last-name').val()=='' || $('#password').val()=='') {
					alert('Please fill out all fields');
					return;
				}
				if ($('#account_type').val()=='Select a Value' || $('#account_type').val()==null) {
					alert('Please select an account type.');
					return;
				}
				if (!$('#last-name').val().match(/^[a-zA-Z0-9.@]*$/) || !$('#first-name').val().match(/^[a-zA-Z0-9.@]*$/)) {
					alert('Characters A-Z only for first and last names.');
					return false;
				}
				if ($('#email').val()!=$('#email-confirm').val()) {
					alert('Emails do not match!');
					return;
				}
				if ($('#password').val()!=$('#password-confirm').val()) {
					alert('Passwords do not match!');
					return;
				}
				if (!isEmail($('#email').val())) {
					alert('Please enter a valid email!');
					return;
				}
				if ($('#password').val().length<8 ||
					!(/[0-9]/.test($('#password').val()) && /[a-z]/.test($('#password').val()) && /[A-Z]/.test($('#password').val()))
					) {
					alert('Your password must be at least 8 characters, contain an uppercase letter, a lowercase letter and a number');
					return;
				}

				var registerArgs = {action: 'iam_register_user', 'email': $('#email').val(), 'first-name': $('#first-name').val(), 'last-name': $('#last-name').val(), 'account_type': $('#account_type').val(), 'school-id': $('#school-id').val(), phonenum: getPhoneNumberFromPage(), 'password': $('#password').val(), 'key': $('#reg-key').val(),captcha:grecaptcha.getResponse()};

				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: registerArgs,
					success: function (data) {
						handleServerResponse(data);
					},
					error: function (data) {
						handleServerError(data, new Error());
						grecaptcha.reset();
					}
				});

			});
		} else if ($('.login-form-container').length>0) {
			removeNav();
			var res_form, current_root_tag;
			var facilities = $('.iam-cal-data').data('names').split(',');
			var facility_info = {};
			for (var i = 0; i < facilities.length; i++) {
				facility_info[facilities[i]] = $('.iam-cal-data').data(facilities[i]);
			}
			$('.iam-cal-data').remove();
			//init reservation popup
			res_form = '<div class="iam-res-popup"><div class="iam-res-popup-header"><div class="iam-x fa fa-close fa-4"></div></div><div class="iam-res-popup-body"><div class="iam-res-cal" style="float: none; width:100%;"></div></div></div>';
			$('.menu').append('<li class="menu-item menu-item-type-post_type menu-item-object-page iam-login-tab"><a>Discover</a></li>');
			$('.iam-login-tab').click(function(event) {
				$('.login-form-container').toggleClass('iam-ninja');
				$('.iam-discover-container').toggleClass('iam-ninja');
				if ($('.iam-discover-container').hasClass('iam-ninja')) {
					$('.iam-login-tab a').text('Discover');
					$('#main').removeClass('iam-no-pad-top');
				} else {
					$('.iam-login-tab a').text('< Back to Login');
					$('#main').addClass('iam-no-pad-top');
				}
				if ($('.iam-discover-list').length<1) {
					makeDiscoverBlock('3D Printer');
				}
			});
			$('.iam-discover-link').click(function(event) {
				$('.iam-login-tab').click();
			});
			$('.iam-discover-button').click(function(event) {
				makeDiscoverBlock($(this).text());
			});
			if (readCookie('iamLoginCookie')!=null) {
				loginLockout();
			}
			$('.slick-prev').append('<img src="http://imrc.jameslevasseur.com/wp-content/plugins/imrc-account-manager/assets/left-arrow.png">');
			$('.slick-next').append('<img src="http://imrc.jameslevasseur.com/wp-content/plugins/imrc-account-manager/assets/right-arrow.png">');
			alphaNumericOnlyListener($('#user_login'));

			$('#iam-slide-show').slick({
				autoplay: true,
				dots: true,
				arrows: false
			});
			$('input[type=submit]').click(function(event) {
				event.preventDefault();
				if (!$('#user_login').val().match(/^[a-zA-Z0-9.]*$/)) {
					alert('Characters A-Z 0-9 only please.');
					return false;
				}
				if ($('#user_login').val().length<1 || $('#user_password').val().length<1) {
					alert('Please fill out both email and password to login.');
					return false;
				}
				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: {action: 'iam_login',user:$('#user_login').val(),password:$('#user_password').val(),captcha:grecaptcha.getResponse(),first:firstLoginAttempt},
					success: function (data) {
						firstLoginAttempt = 0;
						handleServerResponse(data);
					},
					error: function (data) {
						if (firstLoginAttempt) {
							$('.iam-captcha-container').removeClass('iam-ninja');
						}
						if (data.status==401) {

							var lockTime = 60000;//1000*Math.pow(2,5+data.statusText);
							createCookie('iamLoginCookie',lockTime,lockTime,true);
							loginLockout();
							return;
						}
						firstLoginAttempt = 0;
						handleServerError(data, new Error());
						grecaptcha.reset();
					}
				});
			});
		} else if ($('.iam-checkout').length>0) {
			var lastUpdateCookie = readCookie(IPAD_LOCK_COOKIE);
			numbersOnlyListener($('.iam-checkout-lock'));
			removeNav();
			if (lastUpdateCookie>=$('.iam-data').data('timestamp')) {
				$.ajax({
					url: ajaxurl,
					type: 'GET',
					data: {action: 'checkout_content'},
					success: function (data) {
						data = handleServerResponse(data);
						$('.iam-checkout').empty();
						$('.iam-checkout').append(data);
						initCheckout();
					},
					error: function (data) {
						handleServerError(data, new Error());
					}
				});
			}
			$('.iam-checkout-lock-submit').click(function(event) {
				$.ajax({
					url: ajaxurl,
					type: 'GET',
					data: {action: 'checkout_unlock', code: $('.iam-checkout-lock').val()},
					success: function (data) {
						console.log('some thing')
						data = handleServerResponse(data);
						createCookie(IPAD_LOCK_COOKIE,$('.iam-data').data('timestamp'),365);
						$.ajax({
							url: ajaxurl,
							type: 'GET',
							data: {action: 'checkout_content'},
							success: function (data) {
								data = handleServerResponse(data);
								$('.iam-checkout').empty();
								$('.iam-checkout').append(data);
								initCheckout();
							},
							error: function (data) {

								handleServerError(data, new Error());
							}
						});
					},
					error: function (data) {
						console.log('some thing else')
						handleServerError(data, new Error());
					}
				});
			});

		} else if ($('.iam-training-container').length>0) {
			$('input[type=submit]').click(function(event) {
				var emailContent = $('.iam-training-comment').val();
				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: {action: 'training_email', message: $('.iam-training-comment').val()},
					success: function (data) {
						handleServerResponse(data);
						alert('Your message was sent!');
					},
					error: function (data) {
						handleServerError(data, new Error());
					}
				});
			});
		} else if ($('.login-action-lostpassword').length>0) {
			var p = window.location.protocol=='http:' ? 'http://' : 'https://';
			$('#lostpasswordform input[type=hidden]').val('/');
			$('p#nav a').eq(0).attr('href',p+window.location.hostname);
			$('p#nav a').eq(1).attr('href',p+window.location.hostname+'/register');
		} else if ($('.login-action-register').length>0) {
			$('body').empty();
			var p = window.location.protocol=='http:' ? 'http://' : 'https://';
			window.location.href = p+window.location.hostname;
		} else if ($('.login-action-rp').length>0) {
			var p = window.location.protocol=='http:' ? 'http://' : 'https://';
			$('p#nav a').eq(0).attr('href',p+window.location.hostname);
			$('p#nav a').eq(1).attr('href',p+window.location.hostname+'/register');
			$('input[type=submit]').click(function(event) {
				var pw = $('#pass1-text').val();

				if (pw.length<8 ||
					!(/[0-9]/.test(pw) && /[a-z]/.test(pw) && /[A-Z]/.test(pw))
					) {
					alert('Your password must be at least 8 characters, contain an uppercase letter, a lowercase letter and a number');
					return false;
				}
			});
		} else if ($('.login-action-resetpass').length>0) {
			var p = window.location.protocol=='http:' ? 'http://' : 'https://';

			$('a').attr('href',p+window.location.hostname);
		} else if ($('.error404').length>0) {
			$('.entry-content').empty();
			$('.entry-content').html('<p>There\'s nothing here.</p>');
		} else if ($('#iam-user-account').length>0) {
			$('.iam-user-info-form .iam-submit').click(function(event) {
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
									school_id: $('#school-id').val()
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
		debugWarn();
		publicDebug();
	});
})( jQuery );
