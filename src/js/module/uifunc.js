import $ from 'jquery';

import { handleServerResponse, handleServerError } from '../module/serverresponse';
import { submissionStart, submissionEnd } from '../module/userfeedback';

let initCSVButtonListener = function (ignoreColumn,id) {
  $('.iam-csv-button').click(function(event) {
    var csvText = 'data:text/csv;charset=utf-8,';
    id = typeof id === 'undefined' ? '' : '#'+id+' ';
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
    var encodedUri = encodeURI(csvText);
    window.open(encodedUri);

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
				var encodedUri = encodeURI('data:text/csv;charset=utf-8,'+handleServerResponse(data));
				window.open(encodedUri);
			},
			error: function (data) {
				submissionEnd();
				handleServerError(data, new Error());
			}
		});
	});
}

export { initCSVButtonListener, initCSVAJAXButtonListener }
