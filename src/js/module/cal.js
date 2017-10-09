import $ from 'jquery';

import 'fullcalendar';
import 'jquery-ui/ui/core';
import 'jquery-ui/ui/widgets/draggable';

export default class Cal {

  constructor(page, facing) {
    this.page = page;
    this.daynums = {'sun':0,'mon':1,'tue':2,'wed':3,'thu':4,'fri':5,'sat':6};
    this.setCalArgs();
    this.initCalFor(facing)
  }

  initCalFor (facing) {
    if (facing=='public') {
      this.businessHoursConverted = this.convertBusinessHours(this.page.getFacilityInfo('business_hours'));
      this.ERinvalidTimePrompt = 'Check out/in for the Equipment Room are allowed only during business hours. You may need to change your dates or shorten the reservation period.';
      this.initDraggable();
      this.initPubResCal(this.page.getFacilityInfo('type'));
    } else {

    }
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

  convertBusinessHours (jsonString) {
    let json = typeof jsonString==='string' ? JSON.parse(jsonString) : jsonString;
    let converted = [];
    let counter = 1;
    for (let key in json) {
      let day = $.extend({}, json[key]);
      if (day.start!='') {
        day.start = moment(day.start,'hh:mm:a').format('HH:mm');
        day.end = moment(day.end,'hh:mm:a').format('HH:mm');
        converted.push({'start':day.start,'end':day.end,dow:[this.daynums[key]],businessHoursMode:'std'});
      } else {
        converted.push({'start':'00:00','end':'00:01',dow:[this.daynums[key]],businessHoursMode:'std'});
      }
      counter++;
    }
    return converted;
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

  warnIfOutOfBounds (e) {
    let thisDay = this.businessHoursConverted[this.daynums[e.start.format('ddd').toLowerCase()]];

    let thisStart = moment(thisDay.start, 'HH:mm');
    let thisEnd = moment(thisDay.end, 'HH:mm');

    let targetTimeStart = moment( e.start.format('HH:mm'), 'HH:mm' );
    let targetTimeEnd = moment( e.end.format('HH:mm'), 'HH:mm' );

    if ( targetTimeStart.isBefore(thisStart) || targetTimeEnd.isAfter(thisEnd) || e.start.format('ddd').toLowerCase() != e.end.format('ddd').toLowerCase()) {
        alert ('Caution: You reservation takes place outside of operating hours. The IMRC may be closed during this time.');
    }
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

  setCalArgs () {

    let that = this;
    this.calArgs = {};

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
        if (!preventPastReservation(e)) {
          $('.iam-res-cal').fullCalendar('removeEvents',e._id);
          return false;
        }
        warnIfOutOfBounds(e);
      },
      eventDrop: function (e, d, revert) {
        if (!preventPastReservation(e)) {
          revert();
          return;
        }
        warnIfOutOfBounds(e);
      },
      eventResize: function (e, d, revert) {
        if (!preventPastReservation(e)) {
          revert();
          return;
        }
        warnIfOutOfBounds(e);
      }
    }

    this.calArgs['appointment'] = {
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month'
      },
      weekends: false,
      defaultView: 'month',
      eventReceive: function (e) {
        if (eventFallsOnWeekend(e)) {
          alert(that.ERinvalidTimePrompt);
          $('.iam-res-cal').fullCalendar('removeEvents',e._id);
          return false;
        }
      },
      eventDrop: function (e, d, revert) {
        if (eventFallsOnWeekend(e)) {
          alert(that.ERinvalidTimePrompt);
          revert();
        }
      },
      eventResize: function (e, d, revert) {
        if (eventIsLongerThan(e, (parseInt(that.page.rentalPeriod) + 1))) {
          alert('The maximum rental time for this equipment is ' + that.page.rentalPeriod + ' days.')
          revert();
        }
      },
      defaultAllDayEventDuration: {days: (parseInt(that.page.rentalPeriod) + 1) }
    };
  }
}
