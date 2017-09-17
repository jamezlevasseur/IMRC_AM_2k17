import $ from 'jquery';

let submissionStart = function () {
  $('body').append('<div class="iam-loading-anim"><div class="iam-loading-bg"></div></div>');
}

let submissionEnd = function () {
  $('.iam-loading-anim').remove();
}

export {submissionStart, submissionEnd};
