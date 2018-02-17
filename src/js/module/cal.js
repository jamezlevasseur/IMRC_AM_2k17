import $ from 'jquery';

import 'fullcalendar';
import 'jquery-ui/ui/core';
import 'jquery-ui/ui/widgets/draggable';
import { submissionStart, submissionEnd } from '../module/userfeedback';
import { overridePrompt } from '../module/override';
import { initContextMenuLib } from '../lib/contextmenu';
import { copyToClipboard } from '../module/uifunc';


export default class Cal {

  //static "properties"

  static get DAY_NUMS() {
    return {'sun':0,'mon':1,'tue':2,'wed':3,'thu':4,'fri':5,'sat':6};
  }

  constructor(page, facing) {
    this.page = page;
    this.ERinvalidTimePrompt = 'Check out/in for the Equipment Room are allowed only during business hours. You may need to change your dates or shorten the reservation period.';
    if (this.page.cal=='adminRes')
      this.updateResListSource();
    this.setCalArgs();
    this.initCalFor(facing);

  }

  adminCalEventDrop (event, d ,revert) {
		if (this.eventFallsOnWeekend(event)) {
			overridePrompt({
				title: 'Confirm Override',
				body: this.ERinvalidTimePrompt,
				cancel: () => { revert(); },
				override: () => { this.updateEventsModified(event); }
			});
		} else {
			this.updateEventsModified(event);
		}
	}

	adminCalEventResize (event, d ,revert, jsevent) {
		if (this.eventIsLongerThan(event, parseInt(this.currenRentalPeriod))) {
			overridePrompt({
				title: 'Confirm Override',
				body: this.ERinvalidTimePrompt,
				cancel: () => {
					revert();
				},
				override: () => { this.updateEventsModified(event); }
			});
		} else {
			this.updateEventsModified(event);
		}
	}

	adminCalEventReceive (e) {
		if (this.eventFallsOnWeekend(e)) {
			$('.iam-res-cal').fullCalendar('removeEvents',e._id);
			return false;
		}
	}

  static convertBusinessHours (jsonString) {
    let json = typeof jsonString==='string' ? JSON.parse(jsonString) : jsonString;
    let converted = [];
    let counter = 1;
    for (let key in json) {
      let day = $.extend({}, json[key]);
      if (day.start!='') {
        day.start = moment(day.start,'hh:mm:a').format('HH:mm');
        day.end = moment(day.end,'hh:mm:a').format('HH:mm');
        converted.push({'start':day.start,'end':day.end,dow:[Cal.DAY_NUMS[key]],businessHoursMode:'std'});
      } else {
        converted.push({'start':'00:00','end':'00:01',dow:[Cal.DAY_NUMS[key]],businessHoursMode:'std'});
      }
      counter++;
    }
    return converted;
  }

  eventFallsOnWeekend (e) {
    let dayOfWeekStart = e.start.format('ddd').toLowerCase();
    let dayOfWeekEnd = e.end.format('ddd').toLowerCase();

    //for now it ends at midnight of the following day
    return (dayOfWeekStart=='sat' || dayOfWeekStart=='sun'
        || dayOfWeekEnd=='sun' || dayOfWeekEnd=='mon');
  }

  eventIsLongerThan  (e, days) {
    let start = moment( e.start.format('MM-DD-YYYY HH:mm'), 'MM-DD-YYYY HH:mm' );
    let end = moment( e.end.format('MM-DD-YYYY HH:mm'), 'MM-DD-YYYY HH:mm' );
    return end.diff(start, 'days') > days;
  }

  getCalID () {
    if ($('.iam-cal').length>0)
      return '.iam-cal';
    if ($('.iam-res-cal').length>0)
      return '.iam-res-cal';
  }

  handleEventToDelete (event,j) {

    if (j.hasClass('event-not-editable'))
      return;
    if (typeof this.eventsToDelete=='undefined')
      this.eventsToDelete = [];

    let index = this.eventsToDelete.indexOf(event.nid);
    if (index!=-1) {
      this.eventsToDelete.splice(index,1);
    } else {
      this.eventsToDelete.push(event.nid);
    }
    $(this.calID).fullCalendar('rerenderEvents');
  }

  handleEventCopyEmail (event) {
    let e = $('<div>'+event.email+'</div>');
    copyToClipboard(e[0]);
    $('body').append('<div class="iam-copy-notification">Email Copied to Clipboard</div>');
    $('.iam-copy-notification').fadeOut(3500, function() {
      $('.iam-copy-notification').remove();
    });
  }

  initCalFor (facing) {
    if (facing=='public') {
      this.initBusinessHours();
      this.initDraggable();
      this.initPubResCal(this.page.getFacilityInfo('type'));
    } else if (facing=='admin') {
      this.initAdminCal(this.page.cal);
    }
  }

  initStatusHideListeners () {
    let that = this;
    $('.res-toolbar input[name=upcoming]').off();
    $('.res-toolbar input[name=active]').off();
    $('.res-toolbar input[name=completed]').off();
    $('.res-toolbar input[name=no-show]').off();
    $('.res-toolbar input[name=no-pay]').off();

    $('.res-toolbar input[name=upcoming]').click(function (e) {
      if($('.iam-res-cal-placeholder').length>0) {
        e.preventDefault();
        return false;
      }
      that.updateStatusFilter('upcoming');
    });
    $('.res-toolbar input[name=active]').click(function (e) {
      if($('.iam-res-cal-placeholder').length>0) {
        e.preventDefault();
        return false;
      }
      that.updateStatusFilter('active');
    });
    $('.res-toolbar input[name=completed]').click(function (e) {
      if($('.iam-res-cal-placeholder').length>0) {
        e.preventDefault();
        return false;
      }
      that.updateStatusFilter('completed');
    });
    $('.res-toolbar input[name=no-show]').click(function (e) {
      if($('.iam-res-cal-placeholder').length>0) {
        e.preventDefault();
        return false;
      }
      that.updateStatusFilter('no-show');
    });
    $('.res-toolbar input[name=no-pay]').click(function (e) {
      if($('.iam-res-cal-placeholder').length>0) {
        e.preventDefault();
        return false;
      }
      that.updateStatusFilter('no-pay');
    });
    $('.res-toolbar input[name=is-late]').click(function (e) {
      if($('.iam-res-cal-placeholder').length>0) {
        e.preventDefault();
        return false;
      }
      that.updateStatusFilter('is-late');
    });
    $('.res-toolbar input[name=was-late]').click(function (e) {
      if($('.iam-res-cal-placeholder').length>0) {
        e.preventDefault();
        return false;
      }
      that.updateStatusFilter('was-late');
    });
  }

  initDraggable () {

    $('.iam-events .fc-event').each(function() {

      // store data so the calendar knows to render an event upon drop
      $(this).data('event', {
        title: $.trim($(this).text()), // use the element's text as the event title
        editable: true,
        eventDurationEditable: true,
        color:'#4cad57',
        className: 'iam-new-event'
      });

      // make the event draggable using jQuery UI
      $(this).draggable({
        zIndex: 999,
        revert: true,      // will cause the event to go back to its
        revertDuration: 0  //  original position after the drag
      });

    });

  }

  initBusinessHours () {
    this.businessHoursConverted = Cal.convertBusinessHours(this.page.getFacilityInfo('business_hours'));
  }

  initAdminCal (cal) {
    this.resetEvents();
    this.removePlaceholder();
    this.hiddenEvents = [];

    if (this.page.cal=='adminRes') {
      this.updateResListSource();
    } else { //irreg
      this.initDraggable();
    }

    let neutralArgs = {
      editable: false, //new events will be made editable else where
      eventLimit: true, // allow "more" link when too many events
      allDay: false,
      height: 500,
      forceEventDuration: true,
      droppable: true,
      eventOverlap: false,
      allDaySlot: false
    };

    if (cal=='adminRes') {
      if (this.page.facility.Schedule.type=='appointment') {
        if (typeof this.businessHoursConverted=='undefined')
          this.initBusinessHours();
        this.calArgs.adminRes['businessHours'] = this.businessHoursConverted;
      }
    }

    let finalArgs = $.extend(neutralArgs, this.calArgs[cal]);
    this.calID = this.getCalID();
    $(this.calID).fullCalendar(finalArgs);

    if (cal!='adminRes') {
      submissionStart();
      setTimeout( () => {this.initContextMenu(this.page.cal); submissionEnd();}, 1000 );
    }
  }

  initPubResCal (facilitType) {
    let facilityNeutralArgs = {
      editable: false, //new events will be made editable else where
      eventLimit: true, // allow "more" link when too many events
      allDay: false,
      height: 500,
			forceEventDuration: true,
      businessHours: this.businessHoursConverted,
      droppable: true,
			eventOverlap: false,
			allDaySlot: false,
      eventSources: [
      {url:ajaxurl+"?action=get_equipment_calendar&name="+this.page.activeEquipName},
      {url: ajaxurl+"?action=get_irregular_hours_calendar&facility="+this.page.currentRootTag,
      color: '#f13d39'}
      ]
    };

    let finalArgs = $.extend(facilityNeutralArgs, this.calArgs[facilitType]);

		$('.iam-res-cal').fullCalendar(finalArgs);
  }

  initContextMenu (menuToUse, parentID = null) {
    let that = this;
    parentID = parentID===null ? that.calID : parentID;
    initContextMenuLib();
  	menuToUse = typeof menuToUse=='undefined' ? 'default' : menuToUse;

  	let menu = [{
          name: 'mark for deletion',
          title: 'delete button',
          fun: function (e) {
  					let t = $(e.trigger);
          	let event = {nid: t.data('nid')};
          	that.handleEventToDelete(event,t);
          }
      }, {
          name: 'copy email',
          title: 'copy button',
          fun: function (e) {
          	let t = $(e.trigger);
          	let event = {email: t.data('email')};
          	that.handleEventCopyEmail(event);
          }
      }];

  		let rentalMenu = [{
  					name: 'use this reservation',
  					title: 'select reservation button',
  					fun: function (e) {
  						let t = $(e.trigger);
  						let event = {nid: t.data('nid')};
  						makeRelevantReservation(t.data('fcSeg').event);
  					}
  			}, {
  					name: 'mark for deletion',
  					title: 'delete button',
  					fun: function (e) {
  						let t = $(e.trigger);
  						let event = {nid: t.data('nid')};
  						that.handleEventToDelete(event,t);
  					}
  			}
  			];

      let irregularMenu = [
        {
            name: 'mark for deletion',
            title: 'delete button',
            fun: function (e) {
              let t = $(e.trigger);
              let event = {nid: t.data('nid')};
              that.handleEventToDelete(t.data('fcSeg').event,t);
              $(that.calID).fullCalendar('rerenderEvents');
            }
        }
        ];

  		let menuDict = {'default':menu, 'rental':rentalMenu, 'irregular': irregularMenu};
  		let menuOfChoice = menuDict[menuToUse];

      $(parentID+' .fc-event:not(.event-not-editable)').contextMenu(menuOfChoice,{triggerOn:'click',mouseClick:'right'});
  }

  preventPastReservation (e) {

    let targetTimeStart = null;

    if (typeof e.start == 'undefined')
      targetTimeStart = moment( e.format('MM-DD-YYYY HH:mm'), 'MM-DD-YYYY HH:mm' );
    else
      targetTimeStart = moment( e.start.format('MM-DD-YYYY HH:mm'), 'MM-DD-YYYY HH:mm' );

    if (targetTimeStart.isBefore(moment())) {
      alert ('You cannot make reservations in the past.');
      return false;
    }
    return true;
  }

  resetEvents () {
    this.eventsToDelete = [];
    this.eventsModified = {};
    this.eventsConfirmed = [];
  }

  removePlaceholder () {
    $('.iam-res-cal-placeholder').remove();
    $('.iam-cal-placeholder').remove();
  }

  setCalArgs () {
    let that = this;
    this.calArgs = {};

    let adminResViews = 'month,agendaWeek,agendaDay';
    if (typeof that.page.facility!='undefined')
      if (that.page.facility.Schedule.type=='rental')
        adminResViews = 'month,basicWeek,basicDay';

    this.calArgs['adminRes'] = {
      header: {
        left: 'prev,next today',
        center: 'title',
        right: adminResViews
      },
      droppable: true,
      eventOverlap: true,
      weekends:true,
      height: 600,
      forceEventDuration: true,
      defaultView: 'month',
      editable: true,
      eventLimit: true, // allow "more" link when too many events
      eventRender: function (event, element) {
        //that.toolTipsForEvents(event,element);
        $(element).data('fullname', event.fullname);
        $(element).data('email', event.email);
        $(element).data('equipment', event.equipment);
        $(element).data('nid', event.nid);
        $(element).addClass('iam-status-'+event.status);
        if (event.status=='completed' || event.status=='was-late') {
          $(element).addClass('event-not-editable');
        }
        if (that.eventsToDelete.indexOf(event.nid)!=-1) {
          $(element).addClass('marked-for-delete');
        }
        if (that.hiddenEvents.includes(event.status))
          return false;
      },
      eventAfterRender: function (event, element) {
        if (event.toDelete==1) {
          $(element).css({
            'background-color': '#ef4040',
            'border': '1px solid #ef4040'
          });
        }
      },
      eventAfterAllRender: function () {
         that.initContextMenu();
         that.initStatusHideListeners();
         submissionEnd();
         $('.fc-more').click(function(event) {
           $(document).off('mousedown');
           that.initContextMenu('default','');
         });
      },
      eventDrop: function (event, d ,revert) {
        that.eventsModified[event.nid] = {start:event.start.format('YYYY-MM-DD HH:mm:ss'), end: event.end.format('YYYY-MM-DD HH:mm:ss')};
        if (that.page.facility.Schedule.type=='appointment')
          that.warnIfOutOfBounds(event);
        if (that.page.facility.Schedule.type=='rental')
          that.adminCalEventDrop(event, d ,revert);
      },
      eventResize: function (event, d ,revert, jsevent) {
        that.eventsModified[event.nid] = {start:event.start.format('YYYY-MM-DD HH:mm:ss'), end: event.end.format('YYYY-MM-DD HH:mm:ss')};
        that.currenRentalPeriod = event.period;
        if (that.page.facility.Schedule.type=='appointment')
          that.warnIfOutOfBounds(event);
        if (that.page.facility.Schedule.type=='rental')
          that.adminCalEventResize(event, d ,revert, jsevent);
      },
      eventMouseover: function(calEvent, jsEvent) {
        var tooltip = '<div class="tooltipevent" style="box-shadow: 0px 0px 8px #888;border-radius:4px;padding:5px;background:#eee;position:absolute;z-index:10001;">Name: '+calEvent.fullname+'<br /> Email: '+calEvent.email+' <br /> Equipment: '+calEvent.equipment+'<br /> Checked In: '+calEvent.in+'<br /> Checked Out: '+calEvent.out+'<br /> Comment: '+calEvent.comment+'</div>';

        var $tooltip = $(tooltip).appendTo('body');

        $(this).mouseover(function(e) {
                $(this).css('z-index', 10000);
                $tooltip.fadeIn('500');
                $tooltip.fadeTo('10', 1.9);
            }).mousemove(function(e) {
                $tooltip.css('top', e.pageY + 10);
                $tooltip.css('left', e.pageX + 20);
            });
      },
      eventMouseout: function(calEvent, jsEvent) {
          $(this).css('z-index', 8);
          $('.tooltipevent').remove();
      },
      events: that.lastReservationResource
    }

    this.calArgs['irregular'] = {
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
      },
      defaultView: 'agendaWeek',
      title: 'closed',
      eventReceive: function (e, d, revert) {
        e.title = 'closed';
      },
      eventRender: function (event, element) {
        if (that.eventsToDelete.indexOf(event.nid)!=-1) {
          $(element).addClass('marked-for-delete');
        }
        that.toolTipsForEvents(event,element);
      },
      eventAfterAllRender: () => {
        that.initContextMenu(that.page.cal);
      },
      events: ajaxurl+"?action=admin_get_irregular_hours&facility="+this.page.facilityName
    };

    this.calArgs['appointment'] = {
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'agendaWeek,agendaDay'
      },
      defaultTimedEventDuration: '00:30:00',
      weekends:true,
      defaultView: 'agendaWeek',
      eventReceive: function (e, d, revert) {
        if (!that.preventPastReservation(e)) {
          $('.iam-res-cal').fullCalendar('removeEvents',e._id);
          return false;
        }
        that.warnIfOutOfBounds(e);
      },
      eventDrop: function (e, d, revert) {
        if (!that.preventPastReservation(e)) {
          revert();
          return;
        }
        that.warnIfOutOfBounds(e);
      },
      eventResize: function (e, d, revert) {
        if (!that.preventPastReservation(e)) {
          revert();
          return;
        }
        that.warnIfOutOfBounds(e);
      }
    }

    this.calArgs['rental'] = {
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month'
      },
      weekends: true,
      defaultView: 'month',
      eventReceive: function (e) {
        if (that.eventFallsOnWeekend(e)) {
          alert(that.ERinvalidTimePrompt);
          $('.iam-res-cal').fullCalendar('removeEvents',e._id);
          return false;
        }
      },
      eventDrop: function (e, d, revert) {
        if (that.eventFallsOnWeekend(e)) {
          alert(that.ERinvalidTimePrompt);
          revert();
        }
      },
      eventResize: function (e, d, revert) {
        if (that.eventIsLongerThan(e, (parseInt(that.page.rentalPeriod)))) {
          alert('The maximum rental time for this equipment is ' + (that.page.rentalPeriod-1) + ' days.')
          revert();
        }
      },
      eventRender: function (event, element) {
        that.toolTipsForEvents(event,element);
      },
      defaultAllDayEventDuration: {days: parseInt(that.page.rentalPeriod) }
    };
  }

  toolTipsForEvents (event, element) {return;
    let e = $(element);
    e.attr('title',event.title);
    e.data('toggle','tooltip');
  }

  update () {
    $('.iam-res-cal').fullCalendar( 'removeEventSources' );
    this.updateResListSource();
    $('.iam-res-cal').fullCalendar( 'addEventSource', this.lastReservationResource);
  }

  updateResListSource () {
    let selectedEquipment = $('.iam-reservations-equipment-list-item.iam-highlighted');
    let newEventResource = [];
    $(selectedEquipment).each(function(index, el) {
      newEventResource = newEventResource.concat( $(this).data('calevents') );
    });
    this.lastReservationResource = newEventResource;
  }

  updateStatusFilter (status) {
    if (this.hiddenEvents.includes(status))
      for (var i = 0; i < this.hiddenEvents.length; i++) {
        if (this.hiddenEvents[i]==status)
          this.hiddenEvents.splice(i,1);
      }
    else
      this.hiddenEvents.push(status);
    $(this.calID).fullCalendar('rerenderEvents');
  }

  updateEventsModified (event) {
    if (typeof event.nid != 'undefined')
      this.eventsModified[event.nid] = {start:event.start.format('YYYY-MM-DD HH:mm:ss'), end: event.end.format('YYYY-MM-DD HH:mm:ss')};
  }

  warnIfOutOfBounds (e) {
    let thisDay = this.businessHoursConverted[Cal.DAY_NUMS[e.start.format('ddd').toLowerCase()]];

    let thisStart = moment(thisDay.start, 'HH:mm');
    let thisEnd = moment(thisDay.end, 'HH:mm');

    let targetTimeStart = moment( e.start.format('HH:mm'), 'HH:mm' );
    let targetTimeEnd = moment( e.end.format('HH:mm'), 'HH:mm' );

    if ( targetTimeStart.isBefore(thisStart) || targetTimeEnd.isAfter(thisEnd) || e.start.format('ddd').toLowerCase() != e.end.format('ddd').toLowerCase()) {
        alert ('Caution: You reservation takes place outside of operating hours. The IMRC may be closed during this time.');
    }
  }

}
