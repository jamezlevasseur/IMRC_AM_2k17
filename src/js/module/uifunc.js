import $ from 'jquery';

import { handleServerResponse, handleServerError } from '../module/serverresponse';
import { submissionStart, submissionEnd } from '../module/userfeedback';

let copyToClipboard = function(elem) {
    // create hidden text element, if it doesn't already exist
    let targetId = "_hiddenCopyText_";
    let isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    let origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    let currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);

    // copy the selection
    let succeed;
    try {
        succeed = document.execCommand("copy");
    } catch(e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }

    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }
    return succeed;
}

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

export { initCSVButtonListener, initCSVAJAXButtonListener, initSearchListener, initPopupXListener, copyToClipboard }
