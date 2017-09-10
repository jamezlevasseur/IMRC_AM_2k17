(function( $ ) {
		'use strict';

	 $(function () {
	 		//constants
			var PLUG_DIR = 'http://'+document.domain+"/wp-content/plugins/imrc-account-manager/";

			var FORM_METHOD_NEW = 'n';

			var FORM_METHOD_UPDATE = 'u';

			//global vars
			var redirectUrl,selectedBalUser, eventsToDelete = [], eventsModified = {}, eventsConfirmed = [];
			var debug = window.location.href.indexOf('imrcaccounts')==-1;

			var reservationSources = [], reservationSourcesMap = {}, lastReservationResource = '', lastBalClick = null, userEmails = [], erRentalDays = null, releventRes = null, persistentRelEvent = null, eventCount = 0, lastequipclick = $('.iam-existing-list li[selected]'), updatedAccountTypes = {}, updatedRentalTypes = {}, userBalances = {}, eqLateFee = null;

			var availableTags,comparableTags;

			var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;


			//debug

			var handleServerResponse = function (r) {
				if (debug)
					console.log(r);
				try {
					var _r = JSON.parse(r);
					if (debug)
						console.log(_r);
					if (_r.message!='')
						alert(_r.status.toUpperCase()+": "+_r.message);
					if (_r.redirect!='')
						redirectUrl = _r.redirect;
					return _r.content;
				} catch (error) {
						if (debug)
							console.log(error);
						console.log('error occured');
				}
			}

			var handleServerError = function (e, err) {
				if (debug) {
					console.log(e);
					console.log( err );
				}
				alert(e.statusText+" \n Error Code:"+e.status);
			}

			var debugSuccess = function() {
				$('#debug-success').removeClass('iam-ninja');
				$('#debug-success').fadeOut('500', function() {
					$(this).remove();
					$('.debug-wrap').append('<h1 class="iam-ninja" id="debug-success" style=" position: fixed; top:20%; left:35%; padding:10px; margin:0; display:inline; font-size:30px; background:#0bbf56; border-radius:8px; color:white;">SUCCESS</h1>');

				});
			}

			if ( $('.debug-wrap').length>0 ) {
				$('.make-dummy-res input[type=submit]').click(function(event) {
					$.ajax({
						url: ajaxurl,
						type: 'POST',
						data: {action: 'debug_make_res', mod: $('.make-dummy-res input[name=hour-mod]').val() },
						success: function (data) {
							handleServerResponse(data);
							debugSuccess();
						},
						error: function (data) {
							handleServerError(data, new Error());
						}
					});
				});
			}

			//misc functions

			var getUrlArg = function (argname) {
				var url = new URL(window.location.href);
				return url.searchParams.get(argname);
			}

			var findItemAgain = function (list) {
				if (window.location.href.indexOf('&finditem=')==-1)
					return;

				var target = getUrlArg('finditem').split('_').join(' ');

				$.each(list.children('li'), function(index, el) {
					if ($(this).html().trim()==target) {
						$(this).click();
						return false;
					}
				});
			}

			var findTableItemAgain = function (table, colNum) {
				if (window.location.href.indexOf('&finditem=')==-1)
					return;

				var target = getUrlArg('finditem').split('_').join(' ');

				$.each(table.find('tbody').find('tr'), function(index, el) {
					if ($(this).find('td').eq(colNum).html().trim()==target) {
						$(this).click();
						return false;
					}
				});
			}

			var reloadAndFind = function (target) {
				window.location.href = window.location.href+'&finditem='+target.trim().split(' ').join('_');
			}

			var initChargeTableActions = function () {
				$.each($('tr'), function(index, val) {
					if (index!=0) {
						if ($(this).children('.iam-charge-table-approver').html()=='n/a') {
							$(this).append('<td><div class="iam-button iam-approve-charge-button" data-status="0">approve</div></td>');
						} else {
							$(this).append('<td><div class="iam-secondary-button iam-approve-charge-button" data-status="1">cancel</div></td>');
						}
					}
				});
				initApproveChargeButtonListener();
			}

			var initChargeTable = function () {
				$.ajax({
					url: ajaxurl,
					type: 'GET',
					data: {action: 'admin_get_charge_table_json'},
					success: function (data) {
						data = JSON.parse(data);
						makeEditableTableHeaders(data,'#iam-table-container','iam-charge-table');
						initSearchWithTableDataSetListener($('.iam-search'),data['data'], ['username','email','account_type','certifications','equipment_used','Charge_Description','date','approver','Comment','values'], function (searchResults) {
							$('#iam-table-container').pagination({
								position: 'top',
								pageSize: 5,
								dataSource: searchResults,
								callback: function (pgData, pagination) {
									makeEditableTableBody(pgData,'#iam-table-container','iam-charge-table',chargeTableEditingCallback);
									initChargeTableActions();
								}
							});
						});
						updateSearch();
					},
					error: function (data) {
						handleServerError(data, new Error());
					}
				});
			}

			var editableTableRowData = [];

			var makeEditableTableHeaders = function (json,container,tableName) {
				var table = '<table id="'+tableName+'"><thead><tr class="table-header">', rowData = [];
				for (var i = 0; i < json.metadata.length; i++) {
					var editMark = json.metadata[i]['editable'] ? '<b style="color:red;">*</b>': '';
					table+='<th>'+json.metadata[i]['label']+editMark+'</th>';
					editableTableRowData.push( json.metadata[i] );
				}
				table+='</tr></thead><tbody></tbody></table>';
				$(container).append(table);
			}

			var makeEditableTableBody = function (json,container,tableName,finishEditingCallback) {
				if (typeof json=='string') {
					json = JSON.parse(json);
				}
				if (typeof finishEditingCallback === 'undefined') {
					finishEditingCallback = function () {
						//do nothing;
					}
				}
				var tbody = '', rowData = [];
				for (var i = 0; i < json.length; i++) {
					tbody+='<tr data-id="'+json[i].id+'">';
					for (var k = 0; k < editableTableRowData.length; k++) {
						var d = json[i].values;
						var val = d[editableTableRowData[k].name];
						var editClass = editableTableRowData[k].editable ? 'table-editable': '' ;
						switch (editableTableRowData[k].datatype) {
							case 'varchar':
							tbody+='<td class="'+tableName+'-'+editableTableRowData[k].name+' table-varchar '+editClass+'" data-field="'+editableTableRowData[k].name+'">'+val;
							break;
							case 'text':
							tbody+='<td class="'+tableName+'-'+editableTableRowData[k].name+' table-text '+editClass+'" data-field="'+editableTableRowData[k].name+'">'+val;
							break;
						}
						tbody+='</td>';
					}
					tbody+='</tr>';
				}
				$(container).find('tbody').empty();
				$(container).find('tbody').append(tbody);
				editableTableTDListener(tableName,finishEditingCallback);
			}
			var editableTableTDListener = function (tableName,finishEditingCallback) {
				$('table#'+tableName+' td.table-editable').click(function(event) {
					$(this).off();
					if ($(this).hasClass('table-varchar')) {
						$(this).html('<input type="text" class="table-active-varchar table-active-data" value="'+$(this).html()+'">');
					} else if ($(this).hasClass('table-text')) {
						$(this).html('<textarea class="table-active-text table-active-data">'+$(this).html()+'</textarea>');
					} else {
						alert('an error occured while editing the row! :(');
						return;
					}
					$('.table-active-data').focus();
					$('.table-active-data').blur(function(event) {
						var td = $(this).parents('td'), ele = td[0], v = null;
						if ($(this).hasClass('table-active-varchar')) {
							v = $(this).val();
							td.html(v);
						} else if ($(this).hasClass('table-active-text')) {
							v = $(this).val();
							td.html(v);
						}
						$('table#'+tableName+' td.table-editable').off();
						editableTableTDListener(tableName,finishEditingCallback);
						finishEditingCallback(ele,td.parents('tr').data('id'),td.data('field'),v);
					});
				});
			}
			var chargeTableEditingCallback = function (ele,rowID,rowField,rowVal) {
				submissionStart();
				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: {action: 'admin_update_charge_row',id: rowID, field:rowField, val:rowVal},
					success: function (data) {
						handleServerResponse(data);
						submissionEnd();
					},
					error: function (data) {
						handleServerError(data, new Error());
						submissionEnd();
					}
				});

			}

			var copyToClipboard = function(elem) {
				  // create hidden text element, if it doesn't already exist
			    var targetId = "_hiddenCopyText_";
			    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
			    var origSelectionStart, origSelectionEnd;
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
			    var currentFocus = document.activeElement;
			    target.focus();
			    target.setSelectionRange(0, target.value.length);

			    // copy the selection
			    var succeed;
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

			var eventToolTip = function (event,element) {
				var e = $(element);
				e.attr('title','Name: '+event.fullname+'\n Email: '+event.email+' \n Equipment: '+event.equipment);
			}

			var makeSubmitPopup = function (heading,body,callback,a) {
				$('body').append('<div class="iam-popup iam-submit-popup" style="width:150px;left:30%;"><div class="iam-popup-header">'+heading+'<i style="float:right;" class="fa fa-close fa-3 iam-submit-popup-close"></i></div><div class="iam-popup-body">'+body+'<br/><input type="submit" class="iam-popup-submit iam-autheticate-submit"></div></div>');
				initClosePopupListener();
				$('.iam-submit-popup input[type=submit]').click(function(event) {
					callback(a);
					$('.iam-popup').remove();
				});
			}

			var initClosePopupListener = function () {
				$('.iam-submit-popup-close').click(function(event) {
					$('.iam-popup').remove();
				});
			}

			//functions
			var numbersOnlyListener = function (jqueryObject) {
				jqueryObject.keydown(function(event) {
					if (event.key!='Backspace' && event.key!='ArrowLeft' && event.key!='ArrowRight') {
						if (!event.key.match(/^[0-9.]*$/)) {
							return false;
						}
					}
				});
			}

			var emailOnlyListener = function (jqueryObject) {
				jqueryObject.keydown(function(event) {
					if (!event.key.match(/^[a-zA-Z0-9.@]*$/)) {
						return false;
					}
				});
			}

			var alphaNumericOnlyListener = function (jqueryObject) {
				jqueryObject.keydown(function(event) {
					if (!event.key.match(/^[a-zA-Z0-9.]*$/)) {
						return false;
					}
				});
			}

			var alphaOnlyListener = function (jqueryObject) {
				jqueryObject.keydown(function(event) {
					if (!event.key.match(/^[a-zA-Z.]*$/)) {
						return false;
					}
				});
			}

			var itemNameListener = function (jqueryObject) {
				jqueryObject.keydown(function(event) {
					if (event.key.match(/^[;'_]*$/)) {
						return false;
					}
				});
			}

			var maxLengthListener = function (jqueryObject, maxLength) {
				jqueryObject.keydown(function(event) {
					if (jqueryObject.val().length>=maxLength && event.keyCode!=8) {
						return false;
					}
				});
			}

			var getSize = function (obj) {
				var size = 0, key;
			    for (key in obj) {
			        if (obj.hasOwnProperty(key)) size++;
			    }
			    return size;
			}

			var submissionStart = function () {
				$('body').append('<div class="iam-loading-anim"><div class="iam-loading-bg"></div></div>');
			}

			var submissionEnd = function () {
				$('.iam-loading-anim').remove();
			}

			var unsupportedFile = function (element) {
				element.value = null;
				alert ('Unsupported file type!\n Supported file types: .pdf, .doc, .jpg, .jpeg, .png');
			}

			var tooManyFiles = function (element) {
				element.value = null;
				alert ('One file per upload field!');
			}

			var checkFile = function (element) {
				//TODO: check file size
				if (element.files.length>1) {
					tooManyFiles();
					return false;
				}
				if (window.FileReader && window.Blob) {
					var blob = element.files[0];
				    var fileReader = new FileReader();
					fileReader.onloadend = function(e) {
					  var arr = (new Uint8Array(e.target.result)).subarray(0, 4);
					  var header = "";
					  for(var i = 0; i < arr.length; i++) {
					     header += arr[i].toString(16);
					  }
					  header.toLowerCase();
					  switch (header) {
					  		case "ffd8ffdb":
					  		case "ffd8ffe0":
					  		case "ffd8ffe1":
					  		case "ffd8ffe2":
					  			//jpeg or jpg
					  			break;
					  		case "89504E47":
					  		case "89504e47":
					  			//png
					  			break;
						    case "25504446":
						        //application/pdf
						        break;
						    case "d0cf11e0":
						    case "D0CF11E0":
						    	//msoffice file
						    	var ext = blob.name.trim().split('.');
						    	ext = ext[ext.length-1];
						    	if (ext.toLowerCase()!=='doc') {
						    		unsupportedFile(element);
						    	}
						    	break;
						    default:
						        unsupportedFile(element);
						        break;
						}
					};
					fileReader.readAsArrayBuffer(blob);
				} else {
				    console.warn("FILE APIs not supported");
				}
			}

			var updateExistingFiles = function () {
				$.ajax({
					url: ajaxurl,
					type: 'GET',
					data: {action: 'admin_update_existing_file_list',x: $('#x').val()},
					success: function (data) {
						data = handleServerResponse(data);
						$('#iam-existing-files').empty();
						$('#iam-existing-files').append(data);
					},
					error: function (data) {
						handleServerError(data, new Error());
					}
				})

			}

			var make_id = function (element_id) {
				if (element_id.substring(0,1)!="#")
					element_id = "#"+element_id;
				return element_id;
			}

			var prepare_new_form = function (form_name) {
				form_name = make_id(form_name);
				var children = $(form_name).children();
				for (var i = 0; i < children.length; i++) {
					var current = children[i];
					if (current.tagName=="INPUT") {
						current.attr('value','');
					} else if (current.tagName=="TEXTAREA") {
						current.html('');
					}

				}
			}

			var image_sizer = function (img_element) {
				if ($(img_element).attr('data-size')=='large') {
					$(img_element).attr('data-size', 'small');
					$(img_element).width( $(img_element).width()/2 );
				} else {
					$(img_element).attr('data-size', 'large');
					$(img_element).width( $(img_element).width()*2 );
				}
			}

			var swap_visible_forms = function () {
				if ($('#iam-update-form').length<1) {
					$('#iam-new-form').toggleClass('iam-ninja');
					return;
				}
				if ($('#iam-new-form').hasClass('iam-ninja')) {
					$('#iam-new-form').removeClass('iam-ninja');
					$('#iam-update-form').addClass('iam-ninja');
				} else {
					$('#iam-update-form').removeClass('iam-ninja');
					$('#iam-new-form').addClass('iam-ninja');
				}
			}

			var make_form_visible = function (name) {
				name = make_id(name);
				if (!$(name).hasClass('iam-ninja'))
					return;
				swap_visible_forms();
			}

			var loadComparableTags = function () {
		  		$.ajax({
					url: ajaxurl,
					type: 'GET',
					async: false,
					data: {action: 'admin_get_tags', request: 'all'},
					success: function (data) {
						availableTags = handleServerResponse(data);
						comparableTags = [];
						for (var i = 0; i < availableTags.length; i++) {
							comparableTags.push(availableTags[i].toLowerCase());
						}
					},
					error: function (data) {
						handleServerError(data, new Error());
					}
				});
		  	}

			var rStr = function (length) {
				var str = '';
				for (var i = 0; i < length; i++) {
					str+=String.fromCharCode(97+Math.floor(Math.random()*25));
				}
				return str;
			}

			var isEmail = function (email) {
			    var atpos = email.indexOf("@");
			    var dotpos = email.lastIndexOf(".");
			 	if (atpos<1 || dotpos<atpos+2 || dotpos+2>=email.length) {
			        return false;
			    }
			    return true;
		  	}

			//listener functions

			//MULTI-PAGE LISTENERS

			var updateSearchOnLoad = function () {
				if ($('.iam-search').val().length>0) {
					$('.iam-search').keyup();
				}
			}

			var updateSearch = function () {
				if ($('.iam-search').next('input[type=submit]').length>0)
					$('.iam-search').next('input[type=submit]').click()
				else
					$('.iam-search').keyup();
			}

			var paginationRefresh = function () {
				$('.paginationjs-page.active').click();
			}

			var initSearchWithTableDataSetListener = function (searchElement,dataset,fields,searchCallback) {
				$(searchElement).next('input[type=submit]').click(function(event) {
					submissionStart();
					var targetString = $(searchElement).val();
					if (targetString=='') {
						searchCallback( dataset );
						submissionEnd();
						event.preventDefault();
						return false;
					}
					var filtered = dataset.filter(function (a) {
						return dataContainsString(targetString, a, fields);
					});
					searchCallback( filtered );
					submissionEnd();
					event.preventDefault();
					return false;
				});
			}

			var dataContainsString = function (string, data, fields) {
				var add = false;
				for (var key in data) {
					if ( fields.indexOf(key)==-1 && fields.length>0 )
						continue;
					var val = data[key];
					if (typeof val == 'string') {
						if (val.indexOf(string)!=-1)
							add = true;
					} else if (Array.isArray(val)) {
						add = dataContainsString(string, val, fields);
					} else if (typeof val == 'object') {
						//debugger;
						add = dataContainsString(string, val, fields);
					}
					if (add)
						return true;
				}
				return add;
			}

			var initSearchListener = function (searchElement,elementWithText,parents) {
				$(searchElement).keyup(function(event) {
					$(elementWithText).each(function(index, el) {
						if ($(this).text().toLowerCase().indexOf($(searchElement).val().toLowerCase())==-1) {
							var hideable = $(this);
							for (var i = 0; i < parents; i++) {
								hideable = hideable.parent();
							}
							hideable.addClass('iam-ninja');
						} else {
							var hideable = $(this);
							for (var i = 0; i < parents; i++) {
								hideable = hideable.parent();
							}
							hideable.removeClass('iam-ninja');
						}
						if ($(searchElement).val().length==0) {
							var hideable = $(this);
							for (var i = 0; i < parents; i++) {
								hideable = hideable.parent();
							}
							hideable.removeClass('iam-ninja');
						}
					});
				});
			}

			var initDeleteFormListener = function (formtype) {
				$('.iam-delete-form').click(function(event) {
					if (confirm("Are you sure you want to delete "+$('#iam-update-form #name').val()+"?") === true) {
						$.ajax({
							url: ajaxurl,
							type: 'POST',
							data: {action: 'admin_delete_form', x:$('#x').val(), type:formtype},
							success: function (data) {
								handleServerResponse(data);
								window.location.reload();
							},
							error: function (data) {
								handleServerError(data, new Error());
							}
						});
				    }
				});
			}

			var initExistingFileListener = function () {
				$('.iam-existing-upload-x').click(function(event) {
					$.ajax({
						url: ajaxurl,
						type: 'POST',
						data: {action: 'admin_delete_supporting_file',filename:$(this).parent().text()},
						success: function (data) {
							handleServerResponse(data);
							updateExistingFiles();
						},
						error: function (data) {
							handleServerError(data, new Error());
						}
					})
				});
			}

		  	var initImageListener = function () {
		  		$('.iam-image').click(function(event) {
					image_sizer(this);
				});
		  	}

		  	//MAIN MENU LISTENERS

				var initRentalTypeRowListener = function () {
		  		$('.rental-duration').off();
		  		numbersOnlyListener($('.rental-duration'));
				//detects changes in account and type
				$('.rental-duration').change(function(event) {
					var n = $(this).closest('tr').data('id');
					if (n=='') {
						return;
					}
					updatedRentalTypes[$(this).closest('tr').data('id')] = {
						'label':$(this).closest('tr').find('.rental-label').val(),
						'duration':$(this).val()
										};
				});
				$('.rental-label').change(function(event) {
					var n = $(this).closest('tr').data('id');
					if (typeof n=='undefined' || n=='') {
						return;
					}
					updatedRentalTypes[$(this).closest('tr').data('id')] = {
						'duration':$(this).closest('tr').find('.rental-duration').val(),
						'label':$(this).val()
										};
				});
				initDeleteRentalTypeButtonListener();
		  	}

				var initAddRentalTypeButtonListener = function () {
					$('.iam-add-rental-type').click(function(event) {
						if ($('.iam-rental-type-form .iam-no-data-row').length>0) {
							$('.iam-rental-type-form .iam-no-data-row').remove();
						}
						$('.iam-rental-type-form table tbody').append('<tr data-id=""><td><label>Label: <input type="text" class="rental-label"></label></td><td><label>Duration (in days): <input type="number" class="rental-duration"></label></td><td><i class="iam-delete-rental-type fa fa-close fa-3"></i></td></tr>');
						initRentalTypeRowListener();
					});
				}

				var initDeleteRentalTypeButtonListener = function () {
					$('.iam-delete-rental-type').off();
					$('.iam-delete-rental-type').click(function(event) {
						var toDelete = $(this).parent().parent().find('.rental-label').val();
						var list = '<select class="iam-select iam-delete-rental-type-select">';
		  			$('.rental-label').each(function(index, el) {
		  				if ($(this).val()!=toDelete) {
		  					list+='<option value="'+$(this).closest('tr').data('id')+'">'+$(this).val()+'</option>';
		  				}
		  			});
		  			list+='</select>';
		  			deleteRentalTypeListener.bind(this);
		  			if ($(this).parent().parent().data('id')=='') {
		  				$(this).parent().parent().remove();
		  				return;
		  			}
		  			makeSubmitPopup('Delete Rental Type','<p style="color:red;">Deleting: '+toDelete+'</p><p>Select a replacement rental type for equipment that currently have '+toDelete+'.</p>'+list,deleteRentalTypeListener,[$(this).closest('tr')]);
					});
				}

				var deleteRentalTypeListener = function (a) {
					$.ajax({
						url: ajaxurl,
						type: 'POST',
						data: {action: 'admin_delete_rental_type', replacement: $('.iam-delete-rental-type-select').val(), toDelete: a[0].data('id')},
						success: function (data) {
							handleServerResponse(data);
							a[0].remove();
						},
					error: function (data) {
						handleServerError(data, new Error());
					}
					});
				}

				var initSubmitRentalTypeListener = function () {
					$('.iam-rental-types-submit').click(function(event) {
						submissionStart();
						var newTypes = [];
						$('.iam-rental-type-form table tbody tr').each(function(index, el) {
							if ($(this).data('id')=='' &&
								$(this).find('.rental-label').val().length>0 &&
								$(this).find('.rental-duration').val().length>0) {
								var duration = $(this).find('.rental-duration').val();
								newTypes.push({
											'label':$(this).find('.rental-label').val(),
											'duration': duration
										});
							}
						});
						$.ajax({
							url: ajaxurl,
							type: 'POST',
							data: {action: 'admin_update_rental_type', updated_rental_types: updatedRentalTypes, new_rental_types: newTypes},
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

				var initAccountTypeRowListener = function () {
					$('.iam-account-discount').off();
					numbersOnlyListener($('.iam-account-discount'));
				maxLengthListener($('.iam-account-discount'),3);
				//detects changes in account and type
				$('.iam-account-discount').change(function(event) {
					var n = $(this).parent().parent().data('nid');
					if (typeof n=='undefined' || n=='') {
						return;
					}
					updatedAccountTypes[$(this).parent().parent().data('nid')] = {
											'type':$(this).parent().parent().children('td').children('.iam-account-type').val(),
											'discount':$(this).val()
										};
				});
				$('.iam-account-type').change(function(event) {
					var n = $(this).parent().parent().data('nid');
					if (typeof n=='undefined' || n=='') {
						return;
					}
					updatedAccountTypes[$(this).parent().parent().data('nid')] = {
											'discount':$(this).parent().parent().children('td').children('.iam-account-discount').val(),
											'type':$(this).val()
										};
				});
				initDeleteAccountTypeButtonListener();
				}

		  	var initAddAccountTypeButtonListener = function () {
		  		$('.iam-add-account-type').click(function(event) {
		  			if ($('.iam-account-type-form .iam-no-data-row').length>0) {
		  				$('.iam-account-type-form .iam-no-data-row').remove();
		  			}
		  			$('.iam-account-type-form table tbody').append('<tr data-nid=""><td><label>Account Type</label><br /><label>Discount (0-100)</label></td>	<td><input type="text" placeholder="example: student, faculty, alumni" class="iam-account-type"><br /><input type="number" class="iam-account-discount"></td><td><i class="iam-delete-account-type fa fa-close fa-3"></i></td></tr>');
		  			initAccountTypeRowListener();
		  		});
		  	}

		  	var initDeleteAccountTypeButtonListener = function () {
		  		$('.iam-delete-account-type').off();
		  		$('.iam-delete-account-type').click(function(event) {
		  			var toDeleteAccountType = $(this).parent().parent().children('td').children('.iam-account-type').val();
		  			var list = '<select class="iam-select iam-delete-account-type-select">';
		  			$('.iam-account-type').each(function(index, el) {
		  				if ($(this).val()!=toDeleteAccountType) {
		  					list+='<option value="'+$(this).val()+'">'+$(this).val()+'</option>';
		  				}
		  			});
		  			list+='</select>';
		  			deleteAccountTypeListener.bind(this);
		  			if ($(this).parent().parent().data('nid')=='') {
		  				$(this).parent().parent().remove();
		  				return;
		  			}
		  			makeSubmitPopup('Delete Account Type','<p style="color:red;">Deleting: '+toDeleteAccountType+'</p><p>Select a replacement account type for users who currently have '+toDeleteAccountType+'.</p>'+list,deleteAccountTypeListener,[$(this).parent().parent()]);
		  		});
		  	}

		  	var deleteAccountTypeListener = function (a) {
  				$.ajax({
  					url: ajaxurl,
  					type: 'POST',
  					data: {action: 'admin_delete_account_type', replacement: $('.iam-delete-account-type-select').val(), nid: a[0].data('nid')},
  					success: function (data) {
  						handleServerResponse(data);
  						a[0].remove();
  					},
					error: function (data) {
						handleServerError(data, new Error());
					}
  				});
		  	}

		  	var initSubmitAccountTypeListener = function () {
		  		$('.iam-account-types-submit').click(function(event) {
		  			submissionStart();
		  			var newAccountTypes = [];
		  			$('.iam-account-type-form table tbody tr').each(function(index, el) {
		  				if (typeof $(this).data('id')=='undefined' &&
		  					$(this).children('td').children('.iam-account-type').val().length>0) {
		  					var discount = $(this).children('td').children('.iam-account-discount').val();
		  					discount = discount>0 ? discount : 0;
		  					newAccountTypes.push({
											'type':$(this).children('td').children('.iam-account-type').val(),
											'discount':discount
										});
		  				}
		  			});
		  			$.ajax({
		  				url: ajaxurl,
		  				type: 'POST',
		  				data: {action: 'admin_update_account_type', updated_account_types: updatedAccountTypes, new_account_types: newAccountTypes},
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
/*
		  	var reportBugListener = function () {
				$('.iam-report-bug-box input[type=submit]').click(function(event) {
					submissionStart();
					$.ajax({
						url: ajaxurl,
						type: 'POST',
						data: {action: 'admin_report_bug', from: $('.iam-report-bug-from').val(), subject: $('.iam-report-bug-subject').val(), message: $('.iam-report-bug-message').val()},
						success: function (data) {
							submissionEnd();
							$('.iam-report-bug-box').html('<h1>Report a Bug</h1><input type="text" class="iam-report-bug-from" placeholder="From"><br><input type="text" class="iam-report-bug-subject" placeholder="Subject"><br><textarea class="iam-report-bug-message" placeholder="Describe the bug here." cols="50" rows="5"></textarea><br><input type="submit">');
							reportBugListener();
							alert("sent!");

						},
						error: function (data) {
							handleServerError(data, new Error());
						}
					});
				});
			}*/

			var adminSettingsListener = function () {
				$('.iam-settings-submit').click(function(event) {
					submissionStart();
					if (!isEmail($('.iam-training-page-email').val())) {
						alert('Please enter a valid email address.');
						submissionEnd();
						return;
					}
					var newSettings = {action:'admin_update_settings'};
					if ($('.iam-late-charge-fee').length>0)
						newSettings.late_charge_fee = $('.iam-late-charge-fee').val()
					if ($('.iam-ipad-code').length>0)
						newSettings.ipad_code = $('.iam-ipad-code').val();
					if ($('.iam-training-page-email').length>0)
						newSettings.training_email = $('.iam-training-page-email').val();
					if ($('.iam-late-reservations-email').length>0)
						newSettings.late_reservations_email = $('.iam-late-reservations-email').val();
					if ($('.iam-fab-lab-email').length>0)
						newSettings.fab_lab_email = $('.iam-fab-lab-email').val();
					if ($('.iam-equipment-room-email').length>0)
						newSettings.equipment_room_email = $('.iam-equipment-room-email').val();
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

			//EQUIPMENT LISTENERS

			var initSubmitEquipmentFormListener = function () {
				$('.iam-admin-submit-button').off();
				$('.iam-admin-submit-button').click(function(event) {
					submissionStart();
					var form = $('form#iam-update-form').hasClass('iam-ninja') ? $('form#iam-new-form') : $('form#iam-update-form') ;
					var method = form.attr('id')=='iam-new-form' ? 'n' : 'u' ;
					var outOfOrder = form.children('.iam-form-row').children('#out-of-order').is(':checked') ? 1 : 0 ;
					var slideShow = form.children('.iam-form-row').children('#slide-show').is(':checked') ? 1 : 0 ;
					var tagsVal = form.children('.iam-form-row').children('.tags').val().trim();
					if (tagsVal.substring(tagsVal.length-1)==',') {
						tagsVal = tagsVal.substring(0,tagsVal.length-1);
					}
					var equip_tags = tagsVal=='' ? [] : tagsVal.split(',');
					var new_tags = [];
					for (var i = 0; i < equip_tags.length; i++) {
						equip_tags[i] = equip_tags[i].trim();
						if (comparableTags.indexOf(equip_tags[i].toLowerCase())==-1) {
							new_tags.push(equip_tags[i]);
						}
					};
					var formData = new FormData();
					if (form.children('.iam-form-row').children('#photo').val()!='') {
						formData.append('photo',form.children('.iam-form-row').children('#photo').prop('files')[0]);
					}
					formData.append('method',method);
					formData.append('action','admin_equipment_action');
					formData.append('name', form.children('.iam-form-row').children('#name').val());

					formData.append('certification',form.children('.iam-form-row').children('#certification').val());
					formData.append('description',form.children('.iam-form-row').children('#description').val());
					formData.append('pricing-description',form.children('.iam-form-row').children('#pricing-description').val());
					formData.append('internal-comments',form.children('.iam-form-row').children('#internal-comments').val());
					formData.append('manufacturer-info',form.children('.iam-form-row').children('#manufacturer-info').val());
					if ($('.iam-rental-types-list').length>0)
						formData.append('rental_type', form.find('.iam-rental-types-list').val());
					formData.append('out-of-order',outOfOrder);
					formData.append('on-slide-show',slideShow);
					formData.append('tags',equip_tags);
					formData.append('new_tags',new_tags);

					if (method=='u')
						formData.append('x',form.children('.iam-form-row').children('#x').val());
					$.ajax({
						url: ajaxurl,
						type: 'POST',
						data: formData,
						cache: false,
						contentType: false,
						processData: false,
						success: function (data) {
							handleServerResponse(data);
							reloadAndFind(form.children('.iam-form-row').children('#name').val())
						},
						error: function (data) {
							handleServerError(data, new Error());
							submissionEnd();
						}
					});

				});
			}

			var initTagAutoCompleteListener = function () {
				//jquery ui code from http://jqueryui.com/autocomplete/#multiple
			    function split( val ) {
			      return val.split( /,\s*/ );
			    }
			    function extractLast( term ) {
			      return split( term ).pop();
			    }

				$('.tags').bind( "keydown", function( event ) {
			        if ( event.keyCode === $.ui.keyCode.TAB &&
			            $( this ).autocomplete( "instance" ).menu.active ) {
			          event.preventDefault();
			        }
			      })
			      .autocomplete({
			        minLength: 0,
			        source: function( request, response ) {
			          // delegate back to autocomplete, but extract the last term
			          response( $.ui.autocomplete.filter(
			            availableTags, extractLast( request.term ) ) );
			        },
			        focus: function() {
			          // prevent value inserted on focus
			          return false;
			        },
			        select: function( event, ui ) {
			          var terms = split( this.value );
			          // remove the current input
			          terms.pop();
			          // add the selected item
			          terms.push( ui.item.value );
			          // add placeholder to get the comma-and-space at the end
			          terms.push( "" );
			          this.value = terms.join( ", " );
			          return false;
			        }
			      });
		  	}

		  	var initNewEquipmentButtonListener = function () {
		  		$('#iam-new-equipment-button').click(function(event) {
						make_form_visible('#iam-new-form');
						prepare_new_form('#iam-new-form');
					});
		  	}

		  	var initDuplicateEquipmentButtonListener = function () {
		  		$('#iam-duplicate-equipment-button').click(function(event) {
		  			submissionStart();

						$.ajax({
							url: ajaxurl,
							type: 'POST',
							data: {action: 'duplicate_equipment', nid: $('#iam-update-form').children('.iam-form-row').children('#x').val()},
							success: function (data) {
								reloadAndFind( handleServerResponse(data) );
							},
							error: function (data) {
								handleServerError(data, new Error());
							}
						});

		  		});
		  	}

				var initCheckinCheckout = function () {
						userEmails = $('.iam-on-load-data').data('users').split(',');
						$('.iam-er-user-emails').autocomplete({
				      source: userEmails
				    });

						userBalances = $('.iam-on-load-data').data('balances');

						eqLateFee = $('.iam-on-load-data').data('fee');

						//$('.iam-on-load-data').remove();
				}

				var makeRelevantReservation = function (event) {
					releventRes = event._id;
					refreshResCal();
				}

				var initRentalButton = function () {
					if (erRentalDays==null) {
						var erInfo = $('.iam-facility-data').data('facility');
						erRentalDays = erInfo['rental_period'];
					}
					$('.iam-er-action-button').off();
					$('.iam-er-action-button.iam-er-checkout').off();
					$('.iam-er-action-button.iam-er-checkout').click(function(event) {
						resetEvents();
						if ($('.iam-er-user-emails').val()=='') {
							alert('please enter an email.');
							return;
						}

						try {
							if (eqLateFee>userBalances[$('.iam-er-user-emails').val()]) {
								alert('This user has less than the late fee amount of $'+eqLateFee+'. They will not be able to pay late fees if they keep the equipment late. User balance: $'+userBalances[$('.iam-er-user-emails').val()]);
							}
						} catch (error) {
							//nothing
						}

						$('.modal-header .fc-event').removeClass('iam-ninja');

						$('#myModal').modal('show');

						$('#myModal .modal-footer .btn-primary').off();

						$('#myModal .modal-footer .btn-primary').click(function(event) {
							if ($('.relevant-res').length<1) {
								alert('No Reservation Selected.');
								return;
							}
							submissionStart();
							$('#myModal').modal('hide');
							$.ajax({
								url: ajaxurl,
								type: 'POST',
								data: {action: 'admin_update_reservations', to_delete: eventsToDelete, modified: eventsModified, sendEmails: false, reason: ''},
								success: function (data) {
									handleServerResponse(data);
									resetEvents();
									submissionEnd();
								},
								error: function (data) {
									handleServerError(data, new Error());
								}
							});

							var relRes = $('.relevant-res'), chosen = null;
							if (typeof relRes.data('nid') != 'undefined') {
								chosen = {nid: relRes.data('nid'),
													equipment: equip_name.split('_').join(' ')};
							} else {
								var events = $('.iam-cal').fullCalendar('clientEvents');
								for (var i = 0; i < events.length; i++) {

									if (events[i]._id==releventRes) {
										chosen = {
											user: useremail,
											equipment: equip_name.split('_').join(' '),
											start: events[i].start.format('YYYY-MM-DD HH:mm:ss'),
											end: events[i].end.format('YYYY-MM-DD HH:mm:ss')
										}
									}
								}
							}

							if (chosen===null) {
								alert("Error selecting reservation.");
								return;
							}

							$.ajax({
								url: ajaxurl,
								type: 'POST',
								data: {action: 'admin_bind_rental', ev: chosen},
								success: function (data) {
									handleServerResponse(data);
									resetEvents();
									submissionEnd();
									lastequipclick.data('rented-to',useremail);
									updateForRentalStatus(useremail);
								},
								error: function (data) {
									handleServerError(data, new Error());
								}
							});
						});

						$('#myModal .modal-footer .btn-secondary').off();
						$('#myModal .modal-footer .btn-secondary').click(function(event) {
							resetEvents();
						});

						$('.iam-cal').remove();
						$('.modal-body').append('<div class="iam-cal"></div>');

						var equip_name = $('#iam-update-form input#name').data('original').split(' ').join('_');
						var useremail = $('.iam-er-user-emails').val();
						var thisRentalDays = $('.iam-rental-types-list').data('onload-duration')>0 ? $('.iam-rental-types-list').data('onload-duration') : erRentalDays;

						$('.modal-header .fc-event').each(function() {

							// store data so the calendar knows to render an event upon drop
							$(this).data('event', {
								title: "Drag Me", // use the element's text as the event title
								stick: true, // maintain when user navigates (see docs on the renderEvent method)
								editable: true,
								className: 'iam-new-event',
								allDay:true
							});

							// make the event draggable using jQuery UI
							$(this).draggable({
								zIndex: 999,
								revert: true,      // will cause the event to go back to its
								revertDuration: 0  //  original position after the drag
							});

						});

						$('.iam-cal').fullCalendar({
							header: {
								left: 'prev,next today',
								center: 'title',
								right: 'month,agendaWeek'
							},
							droppable: true,
							eventOverlap: true,
						  weekends:true,
							height: 600,
							forceEventDuration: true,
							defaultView: 'month',
							editable: true,
							durationEditable: true,
							allDay: true,
							defaultAllDayEventDuration: {days: thisRentalDays},
							eventLimit: true, // allow "more" link when too many events
							eventRender: function (event, element) {
								$(element).data('fullname', event.fullname);
								$(element).data('email', event.email);
								$(element).data('equipment', event.equipment);

								$(element).data('nid', event.nid);

								if (typeof event.nid == 'undefined' && typeof event.isNewbie=='undefined' ) {

									$('.modal-header .fc-event').addClass('iam-ninja');
									releventRes = event._id;
									$(element).addClass('relevant-res');
								}

								if (releventRes == event._id) {
									$(element).addClass('relevant-res');
								}

								if (event.editable==false) {
									$(element).addClass('event-not-editable');
								}

								if (eventsToDelete.indexOf(event.nid)!=-1) {
									$(element).addClass('marked-for-delete');
								}

								eventToolTip(event,element);
							},
							eventAfterAllRender: function (view) {
								var events = $('.iam-cal').fullCalendar('clientEvents');
								var toUpdate = [];
								for (var i = 0; i < events.length; i++) {
									var ev = events[i];

									if (typeof ev.nid == 'undefined' && typeof ev.isNewbie=='undefined') {
										ev.isNewbie = 1;
										toUpdate.push(ev);
									}
									if (ev.email!=useremail && typeof ev.nid != 'undefined' && (ev.editable==true || typeof ev.editable == 'undefined' )) {
										ev.editable = false;
										toUpdate.push(ev);
									}
								}
								if (toUpdate.length>0) {
									$('.iam-cal').fullCalendar('updateEvents', toUpdate);
								}
								initContextMenu('rental');
							},
							eventDrop: function (event) {
								if (typeof event.nid != 'undefined')
									eventsModified[event.nid] = {start:event.start.format('YYYY-MM-DD HH:mm:ss'), end: event.end.format('YYYY-MM-DD HH:mm:ss')};
							},
							eventResize: function (event) {
								$('.iam-cal').fullCalendar( 'rerenderEvents' );
								if (typeof event.nid != 'undefined')
									eventsModified[event.nid] = {start:event.start.format('YYYY-MM-DD HH:mm:ss'), end: event.end.format('YYYY-MM-DD HH:mm:ss')};
							},
							eventClick: function (event, jsEvent, view) {
							},
							events: ajaxurl+"?action=get_equipment_calendar&allDay=y&is=y&descriptive=y&name="+equip_name
						});
					});

					$('.iam-er-action-button.iam-er-checkin').off();
					$('.iam-er-action-button.iam-er-checkin').click(function(event) {
						$.ajax({
							url: ajaxurl,
							type: 'POST',
							data: {action: 'admin_end_rental', equipment: $('#iam-update-form #name').val()},
							success: function (data) {
								handleServerResponse(data);
								lastequipclick.data('rented-to',0);
								updateForRentalStatus(0);
							},
							error: function (data) {
								handleServerError(data, new Error());
							}
						});
					});
				}

				var updateForRentalStatus = function (rentedTo) {
					if (rentedTo==0) {
						$('.iam-er-action-button').addClass('iam-er-checkout');
						$('.iam-er-action-button').removeClass('iam-er-checkin');
						$('.iam-er-user-emails').prop('disabled',false);
						$('.iam-er-user-emails').val('');
					} else {
						$('.iam-er-action-button').removeClass('iam-er-checkout');
						$('.iam-er-action-button').addClass('iam-er-checkin');
						$('.iam-er-user-emails').prop('disabled',true);
						$('.iam-er-user-emails').val(rentedTo);
					}
					initRentalButton();
				}

		  	var initExistingEquipmentListItemsListener = function () {
					updateForRentalStatus($('.iam-existing-list li[selected]').data('rented-to'));

					$('.iam-existing-list li').click(function(event) {
						lastequipclick = $(this);
						make_form_visible('#iam-update-form');
						//if form is already present do not make a request
						if ($(this).html()==$('#iam-update-form').children('.iam-form-row').children('#name').val())
							return;
						updateForRentalStatus($(this).data('rented-to'));
						$.ajax({
							url: ajaxurl,
							type: 'GET',
							data: {action: 'get_admin_forms', request: 'u_equipment', name: $(this).html()},
							success: function (data) {
								$('#iam-update-form').replaceWith(handleServerResponse(data));
								initTagAutoCompleteListener();
								initSubmitEquipmentFormListener();
								initDeleteFormListener('e');

							},
							error: function (data) {
								handleServerError(data, new Error());
							}
						});

					});
		  	}

			//CERT LISTENERS

			var initSupportingFileListeners = function () {
				$('#supporting0').change(function(event) {
					checkFile(this);
				});

				$('#new-supporting0').change(function(event) {
					checkFile(this);
				});
			}

			var initAddSupportingFileUploadButtonListeners = function () {
				//for update form
				$('#iam-add-supporting-upload-button').click(function(event) {
					$('#iam-new-supporting-upload').prepend('<input type="file" id="supporting'+supportingCount+'" name="supporting'+supportingCount+'"><br />');
					$('#supporting'+supportingCount).change(function(event) {
						checkFile(this);
					});
					supportingCount++;
				});
				//for new submit form
				$('#iam-new-add-supporting-upload-button').click(function(event) {
					$('#iam-brand-new-supporting-upload').prepend('<input type="file" id="new-supporting'+newSupportingCount+'" name="new-supporting'+newSupportingCount+'"><br />');
					$('#new-supporting'+newSupportingCount).change(function(event) {
						checkFile(this);
					});
					newSupportingCount++;
				});
			}

			var initSubmitCertificationFormListener = function () {
				$('.iam-admin-submit-button').off();
				$('.iam-admin-submit-button').click(function(event) {
					submissionStart();
					var form = $(this).parent();
					var method = form.attr('id')=='iam-new-form' ? 'n' : 'u' ;
					var formData = new FormData();
					var required = form.children('.iam-form-row').children('#required').is(':checked') ? 1 : 0 ;
					formData.append('action','admin_certification_action');
					formData.append('method',method);
					formData.append('name',form.children('.iam-form-row').children('#name').val());
					formData.append('time',form.children('.iam-form-row').children('#time').val());
					formData.append('description',form.children('.iam-form-row').children('#description').val());
					formData.append('required',required);

					if (form.children('.iam-form-row').children('#photo').val()!='') {
						formData.append('photo',form.children('.iam-form-row').children('#photo').prop('files')[0]);
					}

					var sCount, sID;

					if (method=='u') {
						sCount = supportingCount;
						sID = '#supporting';
					} else {
						sCount = newSupportingCount;
						sID = '#new-supporting';
					}

					for (var i = 0; i <= sCount; i++) {
						if ($(sID+i).length>0)
							formData.append('supporting'+i,$(sID+i)[0].files[0]);
					}

					if (method=='u')
						formData.append('x',form.children('.iam-form-row').children('#x').val());

					$.ajax({
						url: ajaxurl,
						type: 'POST',
						processData: false,
						contentType: false,
						data: formData,
						success: function (data) {
							handleServerResponse(data);
							reloadAndFind(form.children('.iam-form-row').children('#name').val());
						},
						error: function (data) {
							handleServerError(data, new Error());
						}
					});

				});
			}

			var initNewCertificationButtonListener = function () {
				$('#iam-new-certification-button').click(function(event) {
					make_form_visible('#iam-new-form');
					prepare_new_form('#iam-new-form');
				});
			}


			var initExistingCertificationListItemsListener = function () {
				$('.iam-existing-list li').click(function(event) {
					make_form_visible('#iam-update-form');
					//if form is already present do not make a request
					if ($(this).html()==$('#iam-update-form').children('.iam-form-row').children('#name').val())
						return;
					$.ajax({
						url: ajaxurl,
						type: 'GET',
						data: {action: 'get_admin_forms', request: 'u_certification', name: $(this).text()},
						success: function (data) {
							$('#iam-update-form').replaceWith(handleServerResponse(data));
							initSubmitCertificationFormListener();
							initAddSupportingFileUploadButtonListeners();
							initDeleteFormListener('c');
						},
						error: function (data) {
							handleServerError(data, new Error());
						}
					});
				});
			}

			//ROOM LISTENERS

	  	var initNewRoomButtonListener = function () {
	  		$('#iam-new-room-button').click(function(event) {
					make_form_visible('#iam-new-form');
					prepare_new_form('#iam-new-form');
				});
	  	}

			var initSubmitRoomFormListener = function () {
				$('.iam-admin-submit-button').off();
				$('.iam-admin-submit-button').click(function(event) {
					submissionStart();
					var form = $(this).parent();
					var method = form.attr('id')=='iam-new-form' ? 'n' : 'u' ;
					var outOfOrder = form.children('.iam-form-row').children('#out-of-order').is(':checked') ? 1 : 0 ;
					var formData = new FormData();

					if (form.children('.iam-form-row').children('#photo').val()!='') {
						formData.append('photo',form.children('.iam-form-row').children('#photo').prop('files')[0]);
					}
					formData.append('method',method);
					formData.append('action','admin_room_action');
					formData.append('name', form.children('.iam-form-row').children('#name').val());
					formData.append('description',form.children('.iam-form-row').children('#description').val());
					formData.append('pricing-description',form.children('.iam-form-row').children('#pricing-description').val());
					formData.append('out-of-order',outOfOrder);

					if (method=='u')
						formData.append('x',form.children('.iam-form-row').children('#x').val());
					$.ajax({
						url: ajaxurl,
						type: 'POST',
						data: formData,
						cache: false,
						contentType: false,
						processData: false,
						success: function (data) {
							handleServerResponse(data);
							window.location.reload();
						},
						error: function (data) {
							handleServerError(data, new Error());
						}
					});

				});
			}

		  	var initExistingRoomListItemsListener = function () {
				$('.iam-existing-list li').click(function(event) {
					make_form_visible('#iam-update-form');
					//if form is already present do not make a request
					if ($(this).html()==$('#iam-update-form').children('.iam-form-row').children('#name').val())
						return;
					$.ajax({
						url: ajaxurl,
						type: 'GET',
						data: {action: 'get_admin_forms', request: 'u_room', name: $(this).html()},
						success: function (data) {
							$('#iam-update-form').replaceWith(handleServerResponse(data));
							initTagAutoCompleteListener();
							initSubmitRoomFormListener();
							initDeleteFormListener('r');
						},
						error: function (data) {
							handleServerError(data, new Error());
						}
					});

				});
		  	}

			//BAL LISTENERS

			var initBalancesButtonListener = function () {
				$('.iam-balances-button').click(function(event) {
					if ($('#amount').val().length<1) {
						alert('invalid number');
						return;
					}
					submissionStart();
					$.ajax({
						url: ajaxurl,
						type: 'POST',
						data: {action: 'admin_balances_action', comment: $('#description').val(), username: $('#username').val(), amount: $('#amount').val()},
						success: function (data) {
							handleServerResponse(data);
							reloadAndFind($('#username').val());
						},
						error: function (data) {
							handleServerError(data, new Error());
						}
					});

				});
			}
			var initAddFundsButtonListener = function () {
				$('.iam-add-funds-button').click(function(event) {
					$('body').append('<div class="iam-popup"><div class="iam-popup-header"><h3>Add Funds</h3><i class="fa fa-close fa-3 iam-x"></i></div><div class="iam-popup-body">'+addFundsHTML+'</div></div>');
					if (typeof selectedBalUser!='undefined') {
						$('select#username option').each(function(index, el) {
							if ($(this).text()==selectedBalUser) {
								$(this).prop('selected', true);
							}
						});
					}
					numbersOnlyListener($('#amount'));
					initBalancesButtonListener();
					$('.iam-x').click(function(event) {
						$('.iam-popup').remove();
					});
				});
			}

			var initEditChargeRowListener = function () {
				$('#iam-bal-charges-table-container table tr').each(function(index, el) {
					//don't call on row with titles
					if ($(this).children('td').length<5)
						return;
					if ($(this).children('.iam-charge-status').text()=='Canceled' || $(this).children('.iam-charge-status').text()=='Pending') {
						$(this).children('td').children('.iam-edit-charge-row').text('approve');
					} else {
						$(this).children('td').children('.iam-edit-charge-row').text('cancel');
					}
				});
				$('.iam-edit-charge-row').click(function(event) {
					var that = this;
					var thatId = $(this).data('relational-id');
					$.ajax({
						url: ajaxurl,
						type: 'POST',
						data: {action: 'admin_switch_charge_status',nid: $(this).data('nid')},
						success: function (data) {
							var newAmount = handleServerResponse(data);
							$('.iam-bal-user-row').each(function(index, el) {
								if ($(this).data('relational-id')==thatId) {
									$($(this).children('td')[2]).text(newAmount);
									return false;
								}
							});
							fetchingChargeTable = true;
							$.ajax({
								url: ajaxurl,
								type: 'GET',
								data: {action: 'admin_get_charge_table', nid:currentBalRowNID},
								success: function (data) {
									$('#iam-bal-charges-table-container').empty();

									$('#iam-bal-charges-table-container').append(handleServerResponse(data));
									initEditChargeRowListener();
									$('.iam-edit-charge-row').data('relational-id', thatId);
									fetchingChargeTable = false;
								},
								error: function (data) {
									handleServerError(data, new Error());
									fetchingChargeTable = false;
								}
							});
						},
						error: function (data) {
							handleServerError(data, new Error());
						}
					});
				});
			}

			//USER CERTIFICATION LISTENERS

			var initSeeExistingCertificationsListener = function () {
				$('.iam-see-existing-certifications').click(function(event) {
					var that = this;
					$.ajax({
						url: ajaxurl,
						type: 'GET',
						data: {action: 'admin_get_user_certifications', nid: $(this).data('nid')},
						success: function (data) {
							$(that).parent('td').html(handleServerResponse(data));
						},
						error: function (data) {
							handleServerError(data, new Error());
						}
					});

				});
			}

			var areValuesChecked = function () {
				if ($('input:checked').length<1)
					return false;
				return true;
			}

			var initAddRemoveCertificationsButtonListener = function () {
				$('#iam-add-cert-button').click(function(event) {
					submissionStart();
					if ($('#iam-cert-to-apply').val()=='Select a value') {
						alert('Please select a certification from the drop down menu.');
						return;
					}
					if (!areValuesChecked()) {
						alert("Please select some accounts for this action");
						return;
					}
					var checkedUsers = [];
					$(':checked').each(function(index, el) {
						checkedUsers.push($(this).data('user'));
					});
					$.ajax({
						url: ajaxurl,
						type: 'POST',
						data: {action: 'admin_add_certifications_to_users', users: checkedUsers, certification: $('#iam-cert-to-apply').val()},
						success: function (data) {
							handleServerResponse(data);
							window.location.reload();
						},
						error: function (data) {
							handleServerError(data, new Error());
						}
					});
				});
				$('#iam-remove-cert-button').click(function(event) {
					submissionStart();
					if ($('#iam-cert-to-apply').val()=='Select a value') {
						alert('Please select a certification from the drop down menu.');
						return;
					}
					if (!areValuesChecked()) {
						alert("Please select some accounts for this action");
						return;
					}
					var checkedUsers = [];
					$('input:checked').each(function(index, el) {
						checkedUsers.push($(this).data('user'));
					});
					$.ajax({
						url: ajaxurl,
						type: 'POST',
						data: {action: 'admin_remove_certifications_to_users', users: checkedUsers, certification: $('#iam-cert-to-apply').val()},
						success: function (data) {
							handleServerResponse(data);
							window.location.reload();
						},
						error: function (data) {
							handleServerError(data, new Error());
						}
					});
				});
			}

			//Reservation wrap

			var resetEvents = function () {
				eventsToDelete = [];
				eventsModified = {};
				eventsConfirmed = [];
			}

			var refreshResCal = function () {
				var c = '.iam-cal';
				if ($('.iam-res-cal').length>0)
					c = '.iam-res-cal';
				$(c).fullCalendar( 'removeEventSource', lastReservationResource);
				$(c).fullCalendar( 'addEventSource', lastReservationResource);
			}

			var initResCalSubmitListener = function () {
				$('.iam-res-cal-submit').click(function(event) {
					if ($('.iam-res-cal-placeholder').length>0)
						return;
					if (!getSize(eventsModified) && !eventsToDelete.length)
						return;
					if (!confirm("Are you sure you want to make these changes?"))
						return;
					submissionStart();
					$.ajax({
						url: ajaxurl,
						type: 'POST',
						data: {action: 'admin_update_reservations', to_delete: eventsToDelete, modified: eventsModified, sendEmails: $('.iam-res-cal-send-emails').is(':checked'), reason: $('.iam-res-cal-reason').val()},
						success: function (data) {
							handleServerResponse(data);
							refreshResCal();
							resetEvents();
							submissionEnd();
						},
						error: function (data) {
							handleServerError(data, new Error());
						}
					});
				});
				$('.iam-res-cal-cancel').click(function(event) {
					if ($('.iam-res-cal-placeholder').length>0)
						return;
					refreshResCal();
				});
			}

			var handleEventToDelete = function(event,j) {
				if (j.hasClass('event-not-editable'))
					return;
				var index = eventsToDelete.indexOf(event.nid);
				if (index!=-1) {
					eventsToDelete.splice(index,1);
					refreshResCal();
				} else {
					eventsToDelete.push(event.nid);
					refreshResCal();
				}
			}

			var handleEventCopyEmail = function(event) {
				var e = $('<div>'+event.email+'</div>');
				copyToClipboard(e[0]);
				$('body').append('<div class="iam-copy-notification">Email Copied to Clipboard</div>');
				$('.iam-copy-notification').fadeOut(3500, function() {
					$('.iam-copy-notification').remove();
				});
			}

			var initContextMenu = function (menuToUse) {
				menuToUse = typeof menuToUse=='undefined' ? 'default' : menuToUse;

				var menu = [{
			        name: 'mark for deletion',
			        title: 'delete button',
			        fun: function (e) {
								var t = $(e.trigger);
			        	var event = {nid: t.data('nid')};
			        	handleEventToDelete(event,t);
			        }
			    }, {
			        name: 'copy email',
			        title: 'copy button',
			        fun: function (e) {
			        	var t = $(e.trigger);
			        	var event = {email: t.data('email')};
			        	handleEventCopyEmail(event);
			        }
			    }];

					var rentalMenu = [{
								name: 'use this reservation',
								title: 'select reservation button',
								fun: function (e) {
									var t = $(e.trigger);
									var event = {nid: t.data('nid')};
									makeRelevantReservation(t.data('fcSeg').event);
								}
						}, {
								name: 'mark for deletion',
								title: 'delete button',
								fun: function (e) {
									var t = $(e.trigger);
									var event = {nid: t.data('nid')};
									handleEventToDelete(event,t);
								}
						}
						];

					var menuDict = {'default':menu, 'rental':rentalMenu};
					var menuOfChoice = menuDict[menuToUse];

			    $('.fc-event').contextMenu(menuOfChoice,{triggerOn:'click',mouseClick:'right'});
			}

			var makeCalendarReservationsMulti = function (equip_name) {
				if (equip_name=='' && !$('.iam-cal-placeholder').length) { //refresh but with new res status
                    refreshResCal();
                    return;
                }
				equip_name = equip_name.split(' ').join('_');
				submissionStart();

				//init calendar
				$('.fc-event').each(function() {

					// store data so the calendar knows to render an event upon drop
					$(this).data('event', {
						title: $.trim($(this).text()), // use the element's text as the event title
						stick: true, // maintain when user navigates (see docs on the renderEvent method)
						editable: true,
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
				if ($('.iam-res-cal-placeholder').length) {
					$('.iam-res-cal-placeholder').remove();

					if (typeof reservationSourcesMap[equip_name]!='undefined') {
              reservationSources.splice(reservationSourcesMap[equip_name],1);
          } else {
              reservationSources.push(equip_name);
              reservationSourcesMap[equip_name] = reservationSources.length-1;
          }
          var equip_names = reservationSources.join('~!~');
          lastReservationResource = ajaxurl+"?action=get_equipment_calendar&is=y&descriptive=y&names="+equip_names;

					if ($('.iam-load-all-reservations').is(':checked'))
						lastReservationResource = ajaxurl+"?action=get_equipment_calendar&is=y&descriptive=y&all=y&names="+equip_names;
					else
						lastReservationResource = ajaxurl+"?action=get_equipment_calendar&is=y&names="+equip_names;

					$('.iam-res-cal').fullCalendar({
						header: {
							left: 'prev,next today',
							center: 'title',
							right: 'month,agendaWeek,agendaDay'
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
							eventToolTip(event,element);
							$(element).data('fullname', event.fullname);
							$(element).data('email', event.email);
							$(element).data('equipment', event.equipment);
              $(element).data('nid', event.nid);
							$(element).addClass('iam-status-'+event.status);
							if (eventsToDelete.indexOf(event.nid)!=-1) {
								$(element).addClass('marked-for-delete');
							}
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
               initContextMenu();
							 initStatusHideListeners();
							 submissionEnd();
            },
						eventDrop: function (event) {
							eventsModified[event.nid] = {start:event.start.format('YYYY-MM-DD HH:mm:ss'), end: event.end.format('YYYY-MM-DD HH:mm:ss')};
						},
						eventResize: function (event) {
							eventsModified[event.nid] = {start:event.start.format('YYYY-MM-DD HH:mm:ss'), end: event.end.format('YYYY-MM-DD HH:mm:ss')};
						},
						eventClick: function (event, jsEvent, view) {
						},
						events: lastReservationResource
					});
				} else {

					$('.iam-res-cal').fullCalendar( 'removeEventSource', lastReservationResource);
          if (typeof reservationSourcesMap[equip_name]!='undefined') {
              reservationSources.splice(reservationSourcesMap[equip_name],1);
							delete reservationSourcesMap[equip_name]
              //reservationSourcesMap[equip_name] = undefined;
          } else {
              reservationSources.push(equip_name);
              reservationSourcesMap[equip_name] = reservationSources.length-1;
          }

					if (Object.values(reservationSourcesMap).length===0) {
						reservationSources = [];
					}

          var equip_names = reservationSources.join('~!~');

					if ($('.iam-load-all-reservations').is(':checked'))
						lastReservationResource = ajaxurl+"?action=get_equipment_calendar&all=y&is=y&names="+equip_names;
					else
						lastReservationResource = ajaxurl+"?action=get_equipment_calendar&is=y&names="+equip_names;

          $('.iam-res-cal').fullCalendar( 'addEventSource', lastReservationResource);

				}
			}

			var initStatusHideListeners = function () {
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
					$('.iam-status-upcoming').toggleClass('iam-ninja');
				});
				$('.res-toolbar input[name=active]').click(function (e) {
					if($('.iam-res-cal-placeholder').length>0) {
						e.preventDefault();
						return false;
					}
					$('.iam-status-active').toggleClass('iam-ninja');
				});
				$('.res-toolbar input[name=completed]').click(function (e) {
					if($('.iam-res-cal-placeholder').length>0) {
						e.preventDefault();
						return false;
					}
					$('.iam-status-completed').toggleClass('iam-ninja');
				});
				$('.res-toolbar input[name=no-show]').click(function (e) {
					if($('.iam-res-cal-placeholder').length>0) {
						e.preventDefault();
						return false;
					}
					$('.iam-status-no-show').toggleClass('iam-ninja');
				});
				$('.res-toolbar input[name=no-pay]').click(function (e) {
					if($('.iam-res-cal-placeholder').length>0) {
						e.preventDefault();
						return false;
					}
					$('.iam-status-no-pay').toggleClass('iam-ninja');
				});
				$('.res-toolbar input[name=is-late]').click(function (e) {
					if($('.iam-res-cal-placeholder').length>0) {
						e.preventDefault();
						return false;
					}
					$('.iam-status-is-late').toggleClass('iam-ninja');
				});
				$('.res-toolbar input[name=was-late]').click(function (e) {
					if($('.iam-res-cal-placeholder').length>0) {
						e.preventDefault();
						return false;
					}
					$('.iam-status-was-late').toggleClass('iam-ninja');
				});
			}

			//schedling wrap functions
			var initScheduleTypeListeners = function () {
				/*
				$('.iam-scheduling-type select').change(function(event) {
					var that = this;
					var schedulingInfoElement = $(this).parent('.iam-scheduling-type').parent('.iam-scheduling-block').children('.iam-scheduling-info');
					if ($(this).val()=='Rental') {
						$.ajax({
							url: ajaxurl,
							type: 'GET',
							data: {action: 'admin_get_rental_info_template'},
							success: function (data) {
								schedulingInfoElement.empty();
								schedulingInfoElement.html(handleServerResponse(data));
							},
							error: function (data) {
								handleServerError(data, new Error());
							}
						});
					} else if ($(this).val()=='Appointment') {
						$.ajax({
							url: ajaxurl,
							type: 'GET',
							data: {action: 'admin_get_appointment_info_template'},
							success: function (data) {
								schedulingInfoElement.empty();
								schedulingInfoElement.html(handleServerResponse(data));
							},
							error: function (data) {
								handleServerError(data, new Error());
							}
						});
						initIrregularHoursButtonListener();
					} else {
						schedulingInfoElement.empty;
					}
				});*/
				initIrregularHoursButtonListener();
			}

			var initUpdateIrregularHoursButtonListener = function () {
				$('.iam-irregular-hours-update-button').off();
				$('.iam-irregular-hours-update-button').click(function(event) {
					var cal = $(this).siblings('.iam-cal');
					var facilityName = $(this).parent().siblings('.iam-scheduling-name').children('h1').text().trim();
					facilityName = facilityName.split(' ').join('_');
					submissionStart();
					var newEvents = [];
					var events = $(this).siblings('.iam-cal').fullCalendar('clientEvents');
					for (var i = 0; i < events.length; i++) {
						var starttime, endtime;
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
						data: {action: 'admin_update_irregular_hours', facility:facilityName, events: newEvents},
						success: function (data) {
							handleServerResponse(data);
							cal.fullCalendar( 'removeEventSource', ajaxurl+"?action=admin_get_irregular_hours&facility="+facilityName);
							cal.fullCalendar( 'removeEvents');
							cal.fullCalendar( 'addEventSource', ajaxurl+"?action=admin_get_irregular_hours&facility="+facilityName);
							submissionEnd();

						},
						error: function (data) {
							handleServerError(data, new Error());
						}
					});
				});
			}

			var initApprovalRoomSelectListener = function () {
				$('.iam-approval-room-select').change(function(event) {
					$('.iam-approval-hours-cal').fullCalendar('removeEventSources');
					$('.iam-approval-hours-cal').fullCalendar( 'addEventSource', ajaxurl+"?action=admin_get_approval_hours&name="+$(this).val() );
				});
			}

			var updateApprovalCal = function () {
				//submissionStart();
				var e = $('.iam-approval-hours-cal').fullCalendar('clientEvents');
				var a = [];
				for (var i = 0; i < e.length; i++) {
					var c = e[i];
					if (typeof c!='undefined') {
						if (c.toDelete!=1) {
							var dayOfWeek = typeof c.dow=='undefined' ? [c.start.format('e')] : c.dow;
							if (c.end.format('e')!=dayOfWeek[0]) {
								var newEvent = {start:moment.utc('1970-2-1 00:00:00'),end:c.end,dow:[c.end.format('e')]};
								e.push(newEvent);
								c.end = moment.utc('1970-2-1 23:59:59');
							}

							a.push({
								title:'closed',
								constraint:'businessHours',
								start:c.start.format('HH:mm:ss'),
								end:c.end.format('HH:mm:ss'),
								businessHoursMode:'multi',
								dow:dayOfWeek
							});
						}
					}
				}
				var roomName = $('.iam-approval-room-select').val();
				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: {action: 'admin_update_approval_hours', events: a, name: roomName},
					success: function (data) {
						handleServerResponse(data);
						window.location.reload();
					},
					error: function (data) {
						handleServerError(data, new Error());
						submissionEnd();
					}
				});
			}

			var initApproval = function () {
				$('#approval-external-events .fc-event').each(function() {

					// store data so the calendar knows to render an event upon drop
					$(this).data('event', {
						title: 'closed', // use the element's text as the event title
						stick: true, // maintain when user navigates (see docs on the renderEvent method)
						editable: true,
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
				var roomName = $('.iam-approval-room-select').val();
				$('.iam-approval-hours-cal').fullCalendar({
					header: {
						left: '',
						center: '',
						right: 'agendaWeek'
					},
					eventClick: function(calEvent, jsEvent, view) {
						if (jsEvent.shiftKey) {
							$(this).remove();
							calEvent.toDelete = 1;
							updateApprovalCal();
						}
				    },
					droppable: true,
					eventOverlap: false,
					defaultDate:'1970-2-1',
					allDaySlot: false,
					height: 500,
					forceEventDuration: true,
					defaultView: 'agendaWeek',
					editable: false, //new events will be made editable else where
					eventLimit: true, // allow "more" link when too many events
					title: 'closed',
					events: ajaxurl+"?action=admin_get_approval_hours&name="+roomName
				});
				initApprovalRoomSelectListener();
			}

			var initIrregularHoursButtonListener = function () {
				$('.iam-irregular-hours-button').off();
				$('.iam-irregular-hours-button').click(function(event) {
					initUpdateIrregularHoursButtonListener();
					var sib = $(this).siblings('.iam-irregular-hours-cal');
					sib.toggleClass('iam-ninja');
					$(this).siblings('.iam-irregular-hours-update-button').toggleClass('iam-ninja');
					$(this).siblings('#external-events').toggleClass('iam-ninja');
					$(this).siblings('.iam-irregular-hours-instructions').toggleClass('iam-ninja');
					if (sib.hasClass('iam-ninja')) {
						$(this).text('set irregular hours');
					} else {
						$(this).text('collapse irregular hours');
					}
					if (!sib.hasClass('_init')) {
						sib.addClass('_init');
						$('#external-events .fc-event').each(function() {

							// store data so the calendar knows to render an event upon drop
							$(this).data('event', {
								title: 'closed', // use the element's text as the event title
								stick: true, // maintain when user navigates (see docs on the renderEvent method)
								editable: true,
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
						var facilityName = sib.parent().siblings('.iam-scheduling-name').children('h1').text().trim();

						facilityName = facilityName.split(' ').join('_');
						sib.fullCalendar({
							header: {
								left: 'prev,next today',
								center: 'title',
								right: 'month,agendaWeek,agendaDay'
							},
							eventClick: function(calEvent, jsEvent, view) {
								if (jsEvent.shiftKey) {
									$.ajax({
										url: ajaxurl,
										type: 'POST',
										data: {action: 'admin_delete_irregular_hours',nid: calEvent.nid},
										success: function (data) {
											handleServerResponse(data);
											var cal = sib;
											cal.fullCalendar( 'removeEventSource', ajaxurl+"?action=admin_get_irregular_hours&facility="+facilityName);
											cal.fullCalendar( 'removeEvents');
											cal.fullCalendar( 'addEventSource', ajaxurl+"?action=admin_get_irregular_hours&facility="+facilityName);
											submissionEnd();
										},
										error: function (data) {
											handleServerError(data, new Error());
										}
									});
								}
						    },
							droppable: true,
							eventOverlap: false,
							height: 500,
							forceEventDuration: true,
							defaultView: 'agendaWeek',
							editable: false, //new events will be made editable else where
							eventLimit: true, // allow "more" link when too many events
							title: 'closed',
							events: ajaxurl+"?action=admin_get_irregular_hours&facility="+facilityName
						});
					}
				});
			}

			var initScheduleSubmitListeners = function () {
				$('.iam-scheduling-block input[type=submit]').off();
				$('.iam-scheduling-block input[type=submit]').click(function(event) {
					var block  = $(this).parent('.iam-scheduling-block');
					var scheduleInfo = {};
					var validDates = true;
					var scheduleType = block.children('.iam-scheduling-type').children('select').val();
					if (scheduleType=='Rental') {
						scheduleInfo.rental_period = block.children('.iam-scheduling-info').children('label').children('.iam-rental-period').val();
						scheduleInfo.rental_hours_description = block.children('.iam-scheduling-info').children('.iam-rental-hours-description').val();
					} else if (scheduleType=='Appointment') {
						var days = ['sun','mon','tue','wed','thu','fri','sat'];
						var full_days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
						var businessHours = {};
						block.children('.iam-scheduling-info').children('table').children('tbody').children('.iam-opening-row').children('td').each(function(index, el) {
							if (index!=0) {
								if ($(this).children('label').children('.iam-closed-checkbox').is(':checked')) {
									businessHours[days[index-1]] = {start:'',end:''};
								} else {
									var openTime = $(this).children('.iam-open-hour').val()+':'+$(this).children('.iam-open-min').val()+':'+$(this).children('.iam-open-am-pm').val();
									businessHours[days[index-1]] = {start:openTime};
								}
							}
						});
						block.children('.iam-scheduling-info').children('table').children('tbody').children('.iam-closing-row').children('td').each(function(index, el) {
							if (index!=0) {
								if (businessHours[days[index-1]].start!='') {
									var closeTime = $(this).children('.iam-close-hour').val()+':'+$(this).children('.iam-close-min').val()+':'+$(this).children('.iam-close-am-pm').val();
									if (moment('2016-1-1 '+businessHours[days[index-1]].start).isAfter('2016-1-1 '+closeTime)) {
										alert ('Your opening time for '+full_days[index-1]+' is after this closing time, please correct this.');
										validDates = false;
									}
									businessHours[days[index-1]].end = closeTime;
								}
							}
						});
						scheduleInfo.businessHours = businessHours;
					} else if (scheduleType=='Approval') {
						updateApprovalCal();
						return;
					} else {
						if (!confirm("This will disable reservations for this facility. Do you want to continue?")) {
							return;
						} else {
							$.ajax({
								url: ajaxurl,
								type: 'POST',
								data: {action: 'admin_facility_schedule', type: block.children('.iam-scheduling-type').children('select').val(), tag: block.children('.iam-scheduling-name').text()},
								success: function (data) {
									handleServerResponse(data);
									window.location.reload();
								},
								error: function (data) {
									handleServerError(data, new Error());
								}
							});
						}
						return;
					}
					if (!validDates) {
						return;
					}
					submissionStart();

					$.ajax({
						url: ajaxurl,
						type: 'POST',
						data: {action: 'admin_facility_schedule', type: block.children('.iam-scheduling-type').children('select').val(), info: scheduleInfo, tag: block.children('.iam-scheduling-name').text()},
						success: function (data) {
							handleServerResponse(data);
							window.location.reload();
							submissionEnd();
						},
						error: function (data) {
							handleServerError(data, new Error());
						}
					});
				});
			}

			//charge sheet wrap functions
			var initApproveChargeButtonListener = function () {
				$('.iam-approve-charge-button').off();
				$('.iam-approve-charge-button').click(function(event) {
					var that = this;
					submissionStart();
					$.ajax({
						url: ajaxurl,
						type: 'POST',
						data: {action: 'approve_charge',nid:$(this).parents('tr').data('id'),status:$(this).data('status')},
						success: function (data) {
							handleServerResponse(data);
							if ($(that).data('status')==1) {
								$(that).removeClass('iam-secondary-button');
								$(that).addClass('iam-button');
								$(that).data('status', 0);
								$(that).html('approve');
							} else {
								$(that).removeClass('iam-button');
								$(that).addClass('iam-secondary-button');
								$(that).data('status', 1);
								$(that).html('cancel');
							}
							submissionEnd();
						},
						error: function (data) {
							submissionEnd();
							handleServerError(data, new Error());
						}
					});
				});
			}

			var initCSVAJAXButtonListener = function (ajaxaction) {
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

			var initCSVButtonListener = function (ignoreColumn,id) {
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

			//user registration wrap functions
			var initRegKeyButtonListener = function () {
				$('.iam-reg-key-button').click(function(event) {
					var expDay = $('.iam-reg-key-day').val();
					var expMonth = $('.iam-reg-key-month').val();
					var expYear  = $('.iam-reg-key-year').val();
					var dateToSend;
					if (expDay.length!=0 || expMonth.length!=0 || expYear.length!=0) {
						if (expDay.length<1 || expMonth.length<1 || expYear.length<4) {
							alert('please fill out all date fields');
							return;
						}
						var exp_date = moment($('.iam-reg-key-month').val()+'-'+$('.iam-reg-key-day').val()+'-'+$('.iam-reg-key-year').val(),'M-D-YYYY');
						if (!exp_date.isValid()) {
							alert('Please enter a valid date.');
							return;
						} else {
							dateToSend = exp_date.format('M-D-YYYY');
						}
					}
					submissionStart();
					$.ajax({
						url: ajaxurl,
						type: 'POST',
						data: {action: 'admin_make_registration_key',key:$('.iam-reg-key').val(),expiration: dateToSend},
						success: function (data) {
							handleServerResponse(data);
							window.location.reload();
						},
						error: function (data) {
							handleServerError(data, new Error());
						}
					});
				});
			}
			var initDeleteRegKeyButtonListener = function () {
				$('.iam-delete-key').click(function(event) {
					submissionStart();
					$.ajax({
						url: ajaxurl,
						type: 'POST',
						data: {action: 'admin_delete_registration_key', nid:$(this).data('nid')},
						success: function (data) {
							handleServerResponse(data);
							window.location.reload();
						},
						error: function (data) {
							handleServerError(data, new Error());
						}
					});
				});
			}

			//pricing wrap functions
			var initNewMaterialButtonListener = function () {
				$.ajax({
					url: ajaxurl,
					type: 'GET',
					data: {action: 'admin_get_new_mat_row'},
					success: function (data) {
						$('.iam-new-mat-button').click(function(event) {
							$('tbody').append(handleServerResponse(data));
							initAddPricingDropDownListeners();
							initDeletePricingDropDownListener();
							initPricingRowDeleteListener();
						});
					},
					error: function (data) {
						handleServerError(data, new Error());
					}
				});
			}
			var initDropDownContent = function () {
				$.ajax({
					url: ajaxurl,
					type: 'GET',
					data: {action: 'admin_get_pricing_dropdowns'},
					success: function (data) {
						data = handleServerResponse(data);
						equipDropDown = data['equip'];
						tagsDropDown = data['tags'];
						initAddPricingDropDownListeners();
					},
					error: function (data) {
						handleServerError(data, new Error());
					}
				});
			}
			var initAddPricingDropDownListeners = function () {
				if (equipDropDown==null || tagsDropDown==null) {
					initDropDownContent();
					return;
				}
				$('.iam-add-pricing-tags-drop-down-button').off();
				$('.iam-add-pricing-equipment-drop-down-button').off();
				$('.iam-add-pricing-tags-drop-down-button').click(function(event) {
					changedRows.push($(this).parent().parent().data('nid'));
					$(this).parent().prepend(tagsDropDown);
					initDeletePricingDropDownListener();
				});
				$('.iam-add-pricing-equipment-drop-down-button').click(function(event) {
					changedRows.push($(this).parent().parent().data('nid'));
					$(this).parent().prepend(equipDropDown);
					initDeletePricingDropDownListener();
				});
			}
			var initPricingChangeListeners = function () {
				$('input[type=text]').off();
				$('input[type=number]').off();
				$('.iam-pricing-drop-down select').change(function(event) {
					var nid = $(this).parent().parent().parent().data('nid');
					if (changedRows.indexOf(nid)!=-1)
						return;
					changedRows.push(nid);
				});
				$('input[type=text]').change(function(event) {
					var nid = $(this).parent().parent().data('nid');
					if (changedRows.indexOf(nid)!=-1)
						return;
					changedRows.push(nid);
				});
				$('input[type=number]').change(function(event) {
					var nid = $(this).parent().parent().parent().data('nid');
					if (changedRows.indexOf(nid)!=-1)
						return;
					changedRows.push(nid);
				});
			}
			var initPricingRowDeleteListener = function () {
				$('.iam-pricing-row-delete-button').off();
				$('.iam-pricing-row-delete-button').click(function(event) {
					if (!confirm("Delete this row?"))
						return;
					var row = $(this).parent().parent();
					submissionStart();
					$.ajax({
						url: ajaxurl,
						type: 'POST',
						data: {action: 'admin_delete_material', nid: row.data('nid')},
						success: function (data) {
							handleServerResponse(data);
							row.remove();
							submissionEnd();
						},
						error: function (data) {
							handleServerError(data, new Error());
						}
					});
				});
			}
			var initDeletePricingDropDownListener = function () {
				$('.iam-delete-pricing-drop-down').off();
				$('.iam-delete-pricing-drop-down').click(function(event) {
					changedRows.push($(this).parent().parent().parent().data('nid'));
					$(this).parent().remove();
				});
			}
			var initPricingSubmitListener = function () {
				$('.iam-admin-submit-button').off();
				$('.iam-admin-submit-button').click(function(event) {
					var toUpdate = [];
					$('tr').each(function(index, el) {
						//skip header
						if (index==0)
							return;

						if (changedRows.indexOf($(this).data('nid'))!=-1 || $(this).data('nid').length==0) {
							var associatedTags = [];
							var associatedEquipment = [];
							$($(this).children('.iam-mat-tags-data')).children('.iam-pricing-drop-down').each(function(index, el) {
								associatedTags.push($(this).children('select').children('option:selected').val());
							});
							$($(this).children('.iam-mat-equip-data')).children('.iam-pricing-drop-down').each(function(index, el) {
								associatedEquipment.push($(this).children('select').children('option:selected').val());
							});
							var matName = $(this).children('td').children('.iam-mat-name').val();
							var matPricing = $(this).children('td').find('.iam-mat-pricing').val();
							var matBasePrice = $(this).children('td').find('.iam-mat-base-price').val();
							var unitName = $(this).children('td').children('.iam-unit-name').val();
							if (matName.length<1 || matPricing.length<1 || unitName.length<1) {
								alert("Please fill out Material Name, Price Per Unit, and Unit Name for each entry.");
								return;
							}
							toUpdate.push({ nid: $(this).data('nid'),
											mat_name: matName,
							 				mat_pricing: matPricing,
							 				mat_base_price: matBasePrice,
							 				unit_name: unitName,
							 				tags: associatedTags,
							 				equipment: associatedEquipment
							 			});
						}
					});
					if (toUpdate.length<1) {
						alert("No changes or new entries.");
						return;
					}
					submissionStart();
					$.ajax({
						url: ajaxurl,
						type: 'POST',
						data: {action: 'admin_pricing', updates: toUpdate},
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

			//run time
			if ( $('.iam-main-menu-wrap').length>0 ) {

				//reportBugListener();
				numbersOnlyListener($('.iam-ipad-code'));

				adminSettingsListener();
				initAddAccountTypeButtonListener();
				initAccountTypeRowListener();
				initSubmitAccountTypeListener();

				initAddRentalTypeButtonListener();
				initRentalTypeRowListener();
				initSubmitRentalTypeListener();

			} else if ( $('.iam-room-wrap').length>0 ) {

				//listeners
				initExistingRoomListItemsListener();
				initImageListener();
				initNewRoomButtonListener();
				initSubmitRoomFormListener();
				initDeleteFormListener('r');
				initSearchListener('.iam-room-search','#iam-room-list li',0);
				itemNameListener($('#iam-new-form #name'));
				itemNameListener($('#iam-update-form #name'));
				updateSearchOnLoad();
				$(document).tooltip();
			} else if ( $('.iam-reservation-wrap').length>0 ) {
				resetEvents();
				$('.iam-load-all-reservations').click(function(event) {
					if ($('.iam-res-cal-placeholder').length>0)
						return;
					if ($(this).is(':checked')) {
						$('.iam-res-cal').fullCalendar( 'removeEventSource', lastReservationResource);
						lastReservationResource+='&all=y';
						$('.iam-res-cal').fullCalendar( 'addEventSource', lastReservationResource);
					} else {
						$('.iam-res-cal').fullCalendar( 'removeEventSource', lastReservationResource);
						lastReservationResource = lastReservationResource.split('&all=y').join('');
						$('.iam-res-cal').fullCalendar( 'addEventSource', lastReservationResource);
					}
				});
        $('.iam-res-select-all').click(function(event) {
            $(this).toggleClass('iam-highlighted');
            if ($(this).hasClass('iam-highlighted')) {
                var lastEquip = null;
                $('.iam-reservation-list div:not(.iam-highlighted)').each(function(index, el) {
                    if (!$(this).hasClass('iam-ninja')) {
                        $(this).addClass('iam-highlighted');
                        if (lastEquip==null) {
                            lastEquip=$(this).text();
                        } else {
                            reservationSources.push($(this).text());
                            reservationSourcesMap[$(this).text()] = reservationSources.length-1;
                        }
                    }
                });
                makeCalendarReservationsMulti(lastEquip);
            } else {

                $('.iam-reservation-list div.iam-highlighted').each(function(index, el) {
                    $(this).removeClass('iam-highlighted');
                });
                reservationSources = [];
                reservationSourcesMap = {};
                $('.iam-res-cal').fullCalendar( 'removeEventSource', lastReservationResource);
            }
        });
				$('.iam-reservation-list div').click(function(event) {
					makeCalendarReservationsMulti($(this).text());
					$(this).toggleClass('iam-highlighted');
				});
				$('label.iam-status-label input').prop('checked', true);
				initResCalSubmitListener();
				initSearchListener('.iam-search','.iam-reservation-list div',0);
				$(document).tooltip();
			} else if ( $('.iam-user-certification-wrap').length>0 ) {

				//initSeeExistingCertificationsListener();
				initAddRemoveCertificationsButtonListener();
				initSearchListener('.iam-user-certifications-search','tr .iam-username',1);
				updateSearchOnLoad();

			}  else if ( $('.iam-scheduling-wrap').length>0 ) {

				initScheduleTypeListeners();
				initApproval();
				initScheduleSubmitListeners();

			} else if ( $('.iam-charge-sheet-wrap').length>0 ) {
				initCSVAJAXButtonListener('admin_get_all_charges_as_csv');
				initChargeTable();
				$(document).tooltip();

			} else if ( $('.iam-equipment-wrap').length>0 ) {

				//on load
				loadComparableTags();

				//listeners
				initExistingEquipmentListItemsListener();
				initImageListener();
				initNewEquipmentButtonListener();
				initSubmitEquipmentFormListener();
				initDuplicateEquipmentButtonListener();
				initTagAutoCompleteListener();
				initDeleteFormListener('e');
				initSearchListener('.iam-equipment-search','#iam-equipment-list li',0);
				itemNameListener($('#iam-new-form #name'));
				itemNameListener($('#iam-update-form #name'));
				updateSearchOnLoad();
				if ($('.iam-er').length>0) {
					initCheckinCheckout();
				}
				initCSVAJAXButtonListener('admin_equipment_csv');
				$(document).tooltip();
				findItemAgain($('#iam-equipment-list'));

			} else if ( $('.iam-certification-wrap').length>0 ) {
				//vars
				var supportingCount, newSupportingCount;
				supportingCount = newSupportingCount = 1;

				//listeners
				initSupportingFileListeners();
				initExistingFileListener();
				initNewCertificationButtonListener();
				initExistingCertificationListItemsListener();
				initSubmitCertificationFormListener();
				initAddSupportingFileUploadButtonListeners();
				initDeleteFormListener('c');
				initSearchListener('.iam-certification-search','#iam-certifcation-list li',0);
				itemNameListener($('#iam-new-form #name'));
				itemNameListener($('#iam-update-form #name'));
				updateSearchOnLoad();
				$(document).tooltip();
				findItemAgain($('#iam-certifcation-list'));
			} else if ( $('.iam-balances-wrap').length>0 ) {
				var addFundsHTML = $('.iam-add-funds').html(), fetchingChargeTable = false, currentBalRowNID;
				$('.iam-add-funds').remove();
				$('.iam-bal-user-row').click(function(event) {
					if (fetchingChargeTable)
						return;

					currentBalRowNID = $(this).data('nid');

					if (lastBalClick==currentBalRowNID)
						return;
					lastBalClick = currentBalRowNID;

					fetchingChargeTable = true;
					var that = this;
					selectedBalUser = $(this).children('.iam-bal-user-row-username').text();
					$('.iam-bal-user-row').removeClass('iam-selected-row');
					$(this).addClass('iam-selected-row');
					$.ajax({
						url: ajaxurl,
						type: 'GET',
						data: {action: 'admin_get_charge_table', nid: currentBalRowNID},
						success: function (data) {
							$('#iam-bal-charges-table-container').empty();
							$('#iam-bal-charges-table-container').append(handleServerResponse(data));
							initEditChargeRowListener();
							var id = rStr(30);
							$(that).data('relational-id', id);
							$('.iam-edit-charge-row').data('relational-id', id);
							initCSVButtonListener(4,'iam-user-charges-table');
							fetchingChargeTable = false;
						},
						error: function (data) {
							handleServerError(data, new Error());
							fetchingChargeTable = false;
						}
					});

				});

				initAddFundsButtonListener();
				initSearchListener('.iam-balances-search','.iam-bal-user-row-username',1);
				updateSearchOnLoad();

				findTableItemAgain($('#iam-balances-table'), 0);
			} else if ($('.iam-registration-wrap').length>0) {
				$('.iam-approve-account').click(function(event) {
					$.ajax({
						url: ajaxurl,
						type: 'POST',
						data: {action: 'admin_approve_new_user', user: $(this).data('user')},
						success: function (data) {
							handleServerResponse(data);
							window.location.reload();
						},
						error: function (data) {
							handleServerError(data, new Error());
						}
					});
				});
				$('.iam-deny-account').click(function(event) {
					$.ajax({
						url: ajaxurl,
						type: 'POST',
						data: {action: 'admin_deny_new_user', user: $(this).data('user')},
						success: function (data) {
							handleServerResponse(data);
							window.location.reload();
						},
						error: function (data) {
							handleServerError(data, new Error());
						}
					});
				});
				initRegKeyButtonListener();
				initDeleteRegKeyButtonListener();
				initSearchListener('.iam-registration-search','tr .iam-username',1);
			} else if ($('.iam-user-privileges-wrap').length>0) {
				var approvedUsers = [];
				var deniedUsers = [];
				$('input[type=checkbox]').click(function(event) {
					var user = $(this).parent().prev('td').text();
					for (var i = 0; i < approvedUsers.length; i++) {
						if (approvedUsers[i]==user) {
							approvedUsers.splice(i,1);
							return;
						}
					}
					for (var i = 0; i < deniedUsers.length; i++) {
						if (deniedUsers[i]==user) {
							deniedUsers.splice(i,1);
							return;
						}
					}
					if ($(this).is(':checked')) {
						approvedUsers.push(user);
					} else {
						deniedUsers.push(user);
					}
				});
				$('input[type=submit]').click(function(event) {
					submissionStart();
					$.ajax({
						url: ajaxurl,
						type: 'POST',
						data: {action: 'admin_user_privileges', approved: approvedUsers, denied: deniedUsers},
						success: function (data) {
							handleServerResponse(data);
							window.location.reload();
						},
						error: function (data) {
							handleServerError(data, new Error());
						}
					});
				});
				initSearchListener('.iam-user-privileges-search','tr .iam-username',1);
			} else if ($('.iam-pricing-wrap').length>0) {
				var changedRows = [];
				var equipDropDown,tagsDropDown;

				initPricingSubmitListener();
				initPricingChangeListeners();
				initAddPricingDropDownListeners();
				initNewMaterialButtonListener();
				initDeletePricingDropDownListener();
				initPricingRowDeleteListener();
				initCSVAJAXButtonListener('admin_pricing_csv');
			} else if ($('.iam-room-res-wrap').length>0) {

				resetEvents();
				initRoomResCalSubmitListener();
				$('.iam-confirmed-tab').click(function(event) {
					$(this).addClass('iam-selected-tab');
					$('.iam-pending-tab').removeClass('iam-selected-tab');
					roomResStatus = 1;
					makeCalendarRoomRes('',1);
				});
				$('.iam-pending-tab').click(function(event) {
					$(this).addClass('iam-selected-tab');
					$('.iam-confirmed-tab').removeClass('iam-selected-tab');
					roomResStatus = 0;
					makeCalendarRoomRes('',0);
				});
				$('.iam-room-res-list-container ul li:not(.iam-select-all-room-res)').click(function(event) {
					makeCalendarRoomRes($(this).text(),roomResStatus);
					$(this).toggleClass('iam-highlighted');
					if ($(this).hasClass('iam-highlighted'))
						$(this).children('input').prop('checked', true);
					else
						$(this).children('input').prop('checked', false);
				});

				//select all listener
				$('.iam-select-all-room-res').click(function(event) {
					$(this).toggleClass('iam-highlighted');
					if ($(this).hasClass('iam-highlighted')) {
						$(this).children('input').prop('checked', true);
						var lastEquip = null;
						$('.iam-room-res-list-container ul li:not(.iam-highlighted)').each(function(index, el) {
							$(this).children('input').prop('checked', true);
							$(this).addClass('iam-highlighted');
							if (lastEquip==null) {
								lastEquip=$(this).text();
							} else {
								roomResSources.push($(this).text());
								roomResSourcesMap[$(this).text()] = roomResSources.length-1;
							}
						});
						makeCalendarRoomRes(lastEquip);
					}
					else {
						$(this).children('input').prop('checked', false);
						$('.iam-room-res-list-container ul li.iam-highlighted').each(function(index, el) {
							$(this).children('input').prop('checked', false);
							$(this).removeClass('iam-highlighted');
						});
						roomResSources = [];
						roomResSourcesMap = {};
						$('.iam-cal').fullCalendar( 'removeEventSource', lastRoomResResource);
					}
				});
				$(document).tooltip();
			}
	 });

})( jQuery );
