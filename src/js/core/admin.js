import $ from 'jquery';
import 'jquery-ui/ui/widgets/autocomplete';

import { rStr, isEmail, getSize } from '../core/utils';
import { publicDebug, debugWarn } from '../core/debug';

import { itemNameListener, maxLengthListener, numbersOnlyListener } from '../module/textfieldlisteners';
import { handleServerResponse, handleServerError } from '../module/serverresponse';
import { submissionStart, submissionEnd } from '../module/userfeedback';
import { overridePrompt } from '../module/override';
import { initCSVButtonListener, initCSVAJAXButtonListener, initSearchListener } from '../module/uifunc';

import UserAdmin from '../page/useradmin';
import SettingsAdmin from '../page/settingsadmin';
import DebugAdmin from '../page/debugadmin';

(function( $ ) {

	 $(function () {
			//global vars
			var selectedBalUser, eventsToDelete = [], eventsModified = {}, eventsConfirmed = [], reservationSources = [], reservationSourcesMap = {}, lastReservationResource = '', lastBalClick = null, userEmails = [], releventRes = null, persistentRelEvent = null, eventCount = 0, lastequipclick = $('.iam-existing-list li[selected]'), updatedAccountTypes = {}, updatedRentalTypes = {}, userBalances = {}, eqLateFee = null,availableTags,comparableTags, didLoadAllRes = false, releventResEventStart = null, thisRentalDays;

			var ERinvalidTimePrompt = 'Check out/in for the Equipment Room are allowed only during business hours. You may need to change your dates or shorten the reservation period.';

			var debugadmin = new DebugAdmin();

			//url reload functions

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

			//charge table

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
								pageSize: 10,
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
				e.attr('title','Name: '+event.fullname+'\n Email: '+event.email+' \n Equipment: '+event.equipment+'\n Checked In: '+event.in+'\n Checked Out: '+event.out);
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
					$('.rental-duration').change(function(event) {
						var n = $(this).closest('.rental-period-container').data('id');
						if (n=='') {
							return;
						}
						updatedRentalTypes[$(this).closest('.rental-period-container').data('id')] = {
							'label':$(this).closest('.rental-period-container').find('.rental-label').val(),
							'duration':$(this).val()
							};
					});
					$('.rental-label').change(function(event) {
						var n = $(this).closest('.rental-period-container').data('id');
						if (typeof n=='undefined' || n=='') {
							return;
						}
						updatedRentalTypes[$(this).closest('.rental-period-container').data('id')] = {
							'duration':$(this).closest('.rental-period-container').find('.rental-duration').val(),
							'label':$(this).val()
							};
					});
					$('.default-rental-type').click(function(event) {
						var n = $(this).closest('.rental-period-container').data('id');
						if (typeof n=='undefined' || n=='') {
							return;
						}
						updatedRentalTypes[$(this).closest('.rental-period-container').data('id')] = {
							'duration':$(this).closest('.rental-period-container').find('.rental-duration').val(),
							'label':$(this).closest('.rental-period-container').find('.rental-label').val()

								};
					});
					initDeleteRentalTypeButtonListener();
		  	}

				var initAddRentalTypeButtonListener = function () {
					$('.template-rental-seg').removeClass('iam-ninja');
					var templateRentalSeg = $('.template-rental-seg').prop('outerHTML');
					$('.template-rental-seg').remove();


					$('.iam-add-rental-type').click(function(event) {
						if ($('.no-data-found').length>0) {
							$('.no-data-found').remove();
						}
						$('.rental-type-master-container').append(templateRentalSeg);
						initRentalTypeRowListener();
					});
				}

				var initDeleteRentalTypeButtonListener = function () {
					$('.iam-delete-rental-type').off();
					$('.iam-delete-rental-type').click(function(event) {
						let that = this;
						if ($(this).closest('.rental-period-container').find('.default-rental-type').is(':checked')) {
								alert('Cannot delete the default rental type. Please assign another to default then delete this one.');
								return;
						}
						if ($('.rental-label').length<2) {
							alert('Cannot delete the last rental type.');
							return;
						}
						submissionStart();
						$.ajax({
							url: ajaxurl,
							type: 'POST',
							data: {action: 'admin_delete_rental_type', toDelete: $(this).closest('.rental-period-container').data('id')},
							success: function (data) {
								submissionEnd();
								handleServerResponse(data);
								$(that).closest('.rental-period-container').remove();
							},
							error: function (data) {
								handleServerError(data, new Error());
							}
						});
						/*
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
		  			makeSubmitPopup('Delete Rental Type','<p style="color:red;">Deleting: '+toDelete+'</p><p>Select a replacement rental type for equipment that currently have '+toDelete+'.</p>'+list,deleteRentalTypeListener,[$(this).closest('tr')]);*/
					});
				}

				let resetDefault = function () {
					for (let item in updatedRentalTypes) {
						updatedRentalTypes[item]['default'] = 0;
					}
				}

				var initSubmitRentalTypeListener = function () {
					$('.iam-rental-types-submit').click(function(event) {
						submissionStart();
						var newTypes = [];

						$('.rental-period-container').each(function(index, el) {
							if ($(this).data('id')=='' &&
								$(this).find('.rental-label').val().length>0 &&
								$(this).find('.rental-duration').val().length>0) {
								let duration = $(this).find('.rental-duration').val();
								let isDefault =  $(this).find('.default-rental-type').is(':checked') ? 1 : 0;
								if (isDefault)
									resetDefault();
								newTypes.push({
											'label':$(this).find('.rental-label').val(),
											'duration': duration,
											'default': isDefault
										});
							}
						});

						let checked = $('.default-rental-type:checked').closest('.rental-period-container').data('id');
						if (checked in updatedRentalTypes) {
							resetDefault();
							updatedRentalTypes[checked]['default'] = 1;
						}

						$.ajax({
							url: ajaxurl,
							type: 'POST',
							data: {	'action': 'admin_update_rental_type',
											'updated_rental_types': updatedRentalTypes,
											'new_rental_types': newTypes},
							success: function (data) {
								handleServerResponse(data);
								submissionEnd();
								window.location.reload();
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

				var updateEquipmentEvents = function (newData) {
					for (var i in newData) {
						var c = newData[i];
						$('.iam-reservations-equipment-list-item[data-nid='+i+']').data('calevents', c);
					}
				}

				var initCheckinCheckout = function () {
						userEmails = $('.iam-on-load-data').data('users').split(',');
						console.log(userEmails)
						$('.iam-er-user-emails').autocomplete({
				      source: userEmails
				    });

						userBalances = $('.iam-on-load-data').data('balances');

						eqLateFee = $('.iam-on-load-data').data('fee');

						$('.iam-on-load-data').remove();
				}

				var makeRelevantReservation = function (event) {
					releventRes = event._id;
					refreshResCal();
				}

				let updateEventsModified = function (event) {
					if (typeof event.nid != 'undefined')
						eventsModified[event.nid] = {start:event.start.format('YYYY-MM-DD HH:mm:ss'), end: event.end.format('YYYY-MM-DD HH:mm:ss')};
				}

				var initRentalButton = function () {
					var erInfo = $('.iam-facility-data').data('facility');

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

							let relRes = $('.relevant-res'), chosen = null;
							if (typeof relRes.data('nid') != 'undefined') {

								chosen = {nid: relRes.data('nid'),
													equipment: equip_name.split('_').join(' ')};
							} else {
								var events = $('.iam-cal').fullCalendar('clientEvents');

								for (var i = 0; i < events.length; i++) {
									if (events[i]._id==releventRes) {
										releventResEventStart = events[i].start.format('YYYY-MM-DD')
										chosen = {
											user: useremail,
											equipment: equip_name.split('_').join(' '),
											start: events[i].start.format('YYYY-MM-DD HH:mm:ss'),
											end: events[i].end.format('YYYY-MM-DD HH:mm:ss')
										}
									}
								}
							}

							if (chosen===null || releventResEventStart===null) {
								alert("Error selecting reservation.");
								return;
							}
							console.log(releventResEventStart)
							console.log(moment().format('YYYY-MM-DD'))

							if (releventResEventStart!=moment().format('YYYY-MM-DD')) {
								alert("Please choose a rental period that begins today.");
								return;
							}

							submissionStart();
							$('#myModal').modal('hide');
							$.ajax({
							  url: ajaxurl,
							  type: 'POST',
							  data: {action: 'admin_update_reservations', to_delete: eventsToDelete, modified: eventsModified, sendEmails: false, reason: '', facility: $('.iam-reservation-wrap').data('facility'), load_all: didLoadAllRes},
							  success: function (data) {
							    updateEquipmentEvents( handleServerResponse(data) );
							    makeCalendarReservationsMulti();
							    submissionEnd();
							  },
							  error: function (data) {
							    handleServerError(data, new Error());
							  }
							});

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
						thisRentalDays = $('.iam-rental-types-list').data('onload-duration');

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
							defaultAllDayEventDuration: {days: parseInt(thisRentalDays)},
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
									releventResEventStart = moment( event.start.format('YYYY-MM-DD'), 'YYYY-MM-DD' ).format('YYYY-MM-DD');
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

									if (
									ev.email!=useremail && typeof ev.nid != 'undefined' && (ev.editable==true || typeof ev.editable == 'undefined')
									||
									ev.status!='upcoming' && typeof ev.status != 'undefined' && (ev.editable==true || typeof ev.editable == 'undefined')
									) {

										ev.editable = false;
										toUpdate.push(ev);
									}
								}
								if (toUpdate.length>0) {
									$('.iam-cal').fullCalendar('updateEvents', toUpdate);
								}
								initContextMenu('rental');
							},
							eventDrop: function (event, d ,revert) {
								adminCalEventDrop(event, d ,revert);
							},
							eventResize: function (event, d ,revert, jsevent) {
								adminCalEventResize(event, d ,revert, jsevent);
							},
							eventReceive: function (e) {
								adminCalEventReceive(e);
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
					  data: {action: 'admin_update_reservations', to_delete: eventsToDelete, modified: eventsModified, sendEmails: false, reason: '', facility: $('.iam-reservation-wrap').data('facility'), load_all: didLoadAllRes},
					  success: function (data) {
					    updateEquipmentEvents( handleServerResponse(data) );
					    makeCalendarReservationsMulti();
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

			function adminCalEventDrop(event, d ,revert) {
				if (eventFallsOnWeekend(event)) {
					overridePrompt({
						title: 'Confirm Override',
						body: ERinvalidTimePrompt,
						cancel: () => { revert(); },
						override: () => { updateEventsModified(event); }
					});
				} else {
					updateEventsModified(event);
				}
			}

			function adminCalEventResize(event, d ,revert, jsevent) {
				if (eventIsLongerThan(event, parseInt(thisRentalDays))) {
					overridePrompt({
						title: 'Confirm Override',
						body: ERinvalidTimePrompt,//'The maximum rental time for this equipment is ' + thisRentalDays + ' days.',
						cancel: () => {
							revert();
						},
						override: () => { updateEventsModified(event); }
					});
				} else {
					updateEventsModified(event);
				}
			}

			function adminCalEventReceive(e) {
				if (eventFallsOnWeekend(e)) {
					$('.iam-res-cal').fullCalendar('removeEvents',e._id);
					return false;
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

			    $('.fc-event:not(.event-not-editable)').contextMenu(menuOfChoice,{triggerOn:'click',mouseClick:'right'});
			}

			var updateResSource = function () {
				var selectedEquipment = $('.iam-reservations-equipment-list-item.iam-highlighted');
				var newEventResource = [];
				$(selectedEquipment).each(function(index, el) {
					newEventResource = newEventResource.concat( $(this).data('calevents') );
				});
				lastReservationResource = newEventResource;
			}

			var makeCalendarReservationsMulti = function () {
				submissionStart();

				if ($('.iam-res-cal-placeholder').length) {
					$('.iam-res-cal-placeholder').remove();
					updateResSource();
					initAdminResCal();
				} else {
					$('.iam-res-cal').fullCalendar( 'removeEventSource', lastReservationResource);
					updateResSource();
          $('.iam-res-cal').fullCalendar( 'addEventSource', lastReservationResource);
				}

			}

			var initAdminResCal = function () {
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
						if (event.status=='completed' || event.status=='was-late') {
							$(element).addClass('event-not-editable');
						}
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
					eventDrop: function (event, d ,revert) {
						eventsModified[event.nid] = {start:event.start.format('YYYY-MM-DD HH:mm:ss'), end: event.end.format('YYYY-MM-DD HH:mm:ss')};
						if (resFacilityType=='rental')
							adminCalEventDrop(event, d ,revert);
					},
					eventResize: function (event, d ,revert, jsevent) {
						eventsModified[event.nid] = {start:event.start.format('YYYY-MM-DD HH:mm:ss'), end: event.end.format('YYYY-MM-DD HH:mm:ss')};
						thisRentalDays = event.period;
						if (resFacilityType=='rental')
							adminCalEventResize(event, d ,revert, jsevent);
					},
					events: lastReservationResource
				});
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

			var eventFallsOnWeekend = function (e) {
				let dayOfWeekStart = e.start.format('ddd').toLowerCase();
				let dayOfWeekEnd = e.end.format('ddd').toLowerCase();

				//for now it ends at midnight of the following day
				return (dayOfWeekStart=='sat' || dayOfWeekStart=='sun'
						|| dayOfWeekEnd=='sun' || dayOfWeekEnd=='mon');
			}

			var eventIsLongerThan = function (e, days) {
				let start = moment( e.start.format('MM-DD-YYYY HH:mm'), 'MM-DD-YYYY HH:mm' );
				let end = moment( e.end.format('MM-DD-YYYY HH:mm'), 'MM-DD-YYYY HH:mm' );
				return end.diff(start, 'days') > days;
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

				var settingsAdmin = new SettingsAdmin();

				initAddAccountTypeButtonListener();
		    initAccountTypeRowListener();
		    initSubmitAccountTypeListener();

		    initAddRentalTypeButtonListener();
		    initRentalTypeRowListener();
		    initSubmitRentalTypeListener();

			} else if ( $('.iam-reservation-wrap').length>0 ) {
				resetEvents();
				console.log($('.iam-reservation-wrap').data('facility-type'));
				var resFacilityType = $('.iam-reservation-wrap').data('facility-type');
				$('.iam-load-all-reservations').click(function(event) {
					if ($('.iam-res-cal-placeholder').length>0)
						return;

					submissionStart();
					$.ajax({
							url: ajaxurl,
							type: 'GET',
							data: {action: 'load_all_events_admin_res_cal', facility: $('.iam-reservation-wrap').data('facility')},
							success: function (data) {
								var newData = handleServerResponse(data);
								for (var i in newData) {
									var c = newData[i];
									$('.iam-reservations-equipment-list-item[data-nid='+i+']').data('calevents', c);
								}
								makeCalendarReservationsMulti();
								submissionEnd();
							},
							error: function (data) {
								handleServerError(data, new Error());
							}
						});
				});

        $('.iam-res-select-all').click(function(event) {
            $(this).toggleClass('iam-highlighted');
            if ($(this).hasClass('iam-highlighted')) {
                $('.iam-reservation-list div:not(.iam-highlighted)').each(function(index, el) {
                    if (!$(this).hasClass('iam-ninja')) {
                        $(this).addClass('iam-highlighted');
                    }
                });
                makeCalendarReservationsMulti();
            } else {
                $('.iam-reservation-list div.iam-highlighted').each(function(index, el) {
                    $(this).removeClass('iam-highlighted');
                });
                makeCalendarReservationsMulti();
            }
        });

				$('.iam-reservation-list div').click(function(event) {
					$(this).toggleClass('iam-highlighted');
					makeCalendarReservationsMulti();
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
				initCheckinCheckout();
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
			} else if ( $('.iam-users-wrap').length>0 ) {
				var useradmin = new UserAdmin();
				initSearchListener('.iam-search','.iam-users-list li',0);

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
			}
	 });
	 debugWarn();
})( jQuery );
