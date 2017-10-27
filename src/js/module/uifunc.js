import $ from 'jquery';

import { handleServerResponse, handleServerError } from '../module/serverresponse';
import { submissionStart, submissionEnd } from '../module/userfeedback';

let initCSVButtonListener = function (ignoreColumn,id) {
  $('.iam-csv-button').click(function(event) {
    let csvText = 'data:text/csv;charset=utf-8,';
    id = typeof id === 'undefined' ? '' : '#'+id+' ';
    if (id.substring(1,2)=='#')
      id = id.substring(1,id.length);
    $(id+'th').each(function(index, el) {
      csvText+=$(this).text().replace(/(<([^>]+)>)/ig,"")+',';
    });
    csvText = csvText.substring(0,csvText.length-1)+'\n';
    $(id+'tr').each(function(index, el) {
      $(this).children('td').each(function(i, e) {
        if (i!=ignoreColumn)
          csvText+=$(this).text().replace(/(<([^>]+)>)/ig,"")+',';
      });
      csvText = csvText.substring(0,csvText.length-1)+'\n';
    });
    let encodedUri = encodeURI(csvText);
    window.open(encodedUri);

  });
}

let initPopupXListener = function (callback) {
  $('.iam-x').click(function(event) {
    $('.iam-res-popup').remove();
    if (typeof callback!='undefined') {
      callback();
    }
  });
}

let initCSVAJAXButtonListener = function (ajaxaction) {
	$('.iam-csv-button').click(function(event) {
		submissionStart();
		$.ajax({
			url: ajaxurl,
			type: 'POST',
			data: {action: ajaxaction},
			success: function (data) {
				submissionEnd();
        let d = handleServerResponse(data);
				let encodedUri = encodeURI('data:text/csv;charset=utf-8,'+d);
				window.open(encodedUri);
			},
			error: function (data) {
				submissionEnd();
				handleServerError(data, new Error());
			}
		});
	});
}

let initSearchListener = function (searchElement,elementWithText,parents) {
  $(searchElement).keyup(function(event) {
    $(elementWithText).each(function(index, el) {
      if ($(this).text().toLowerCase().indexOf($(searchElement).val().toLowerCase())==-1) {
        let hideable = $(this);
        for (let i = 0; i < parents; i++) {
          hideable = hideable.parent();
        }
        hideable.addClass('iam-ninja');
      } else {
        let hideable = $(this);
        for (let i = 0; i < parents; i++) {
          hideable = hideable.parent();
        }
        hideable.removeClass('iam-ninja');
      }
      if ($(searchElement).val().length==0) {
        let hideable = $(this);
        for (let i = 0; i < parents; i++) {
          hideable = hideable.parent();
        }
        hideable.removeClass('iam-ninja');
      }
    });
  });
}

export { initCSVButtonListener, initCSVAJAXButtonListener, initSearchListener, initPopupXListener }
