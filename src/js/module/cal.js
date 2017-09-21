let ERinvalidTimePrompt = 'Check out/in for the Equipment Room are allowed only during business hours. You may need to change your dates or shorten the reservation period.';

let eventFallsOnWeekend = function (e) {
  let dayOfWeekStart = e.start.format('ddd').toLowerCase();
  let dayOfWeekEnd = e.end.format('ddd').toLowerCase();

  //for now it ends at midnight of the following day
  return (dayOfWeekStart=='sat' || dayOfWeekStart=='sun'
      || dayOfWeekEnd=='sun' || dayOfWeekEnd=='mon');
}

let eventIsLongerThan = function (e, days) {
  let start = moment( e.start.format('MM-DD-YYYY HH:mm'), 'MM-DD-YYYY HH:mm' );
  let end = moment( e.end.format('MM-DD-YYYY HH:mm'), 'MM-DD-YYYY HH:mm' );
  return end.diff(start, 'days') > days;
}

export { ERinvalidTimePrompt, eventFallsOnWeekend, eventIsLongerThan }
