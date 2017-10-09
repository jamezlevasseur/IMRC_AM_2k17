import $ from 'jquery';

import { handleServerResponse, handleServerError } from '../module/serverresponse';
import { submissionStart, submissionEnd } from '../module/userfeedback';

export default class BreadCrumb {

  constructor (resPage) {
    this.resPage = resPage;
    this.breadcrumbTrail = [];
    this.initCrumbListener();
    this.initCrumbButtonListener();
    this.initRootCrumbListener();
  }

  initRootCrumbListener () {
    let that = this;
    $('#iam-crumb-root').click(function(event) {
      that.popToCrumbRoot();
    });
  }

   updateTrail () {
    $('#iam-res-crumb').empty();
    for (let i = 0; i < this.breadcrumbTrail.length; i++) {
      $('#iam-res-crumb').append('<div class="iam-crumb">'+this.breadcrumbTrail[i]+'</div>');
    }
  }

   initCrumbListener () {
     let that = this;

    $('.iam-crumb').click(function(event) {
      let crumbIndex = that.breadcrumbTrail.indexOf($(this).text());
      if (crumbIndex==-1 || crumbIndex==that.breadcrumbTrail.length-1)
        return;
      let rem = that.breadcrumbTrail.length-1-crumbIndex;
      for (let i = 0; i < rem; i++) {
        that.breadcrumbTrail.pop();
      }
     that.updateTrail();
     that.updatePageForCrumb();
     that.updateCrumbButtons();
     that.initCrumbListener();
     that.initCrumbButtonListener();
    });
  }

   initCrumbButtonListener () {
     let that = this;
    $('.iam-crumb-button').click(function(event) {
      that.breadcrumbTrail.push($(this).text());
      that.updateTrail();
      that.updatePageForCrumb();
      that.updateCrumbButtons();
      that.initCrumbListener();
      that.initCrumbButtonListener();
    });
  }

   updateCrumbButtons () {
    $.ajax({
      url: ajaxurl,
      type: 'GET',
      async: false,
      data: {action: 'get_child_tags',parent_tag: this.breadcrumbTrail[this.breadcrumbTrail.length-1]},
      success: function (data) {
        data = handleServerResponse(data);
        $('#iam-res-crumb-buttons').empty();
        if (!Array.isArray(data))
          data = [data];
        for (let crumbButton in data) {
          $('#iam-res-crumb-buttons').append('<button class="iam-crumb-button">'+data[crumbButton]+'</button>');
        }
      },
      error: function (data) {
        handleServerError(data, new Error());
      }
    });
  }

  newDataToResLeft (data, empty) {
    if (empty===true)
      $('.iam-res-left').empty();
    $('.iam-res-left').append(data);
    this.resPage.initEquipmentButtonListener();
  }

  updatePageForCrumb () {
    let that = this;
    if (this.breadcrumbTrail.length<1)
      return;
    $('.iam-res-left').empty();
    $.ajax({
      url: ajaxurl,
      type: 'GET',
      async: false,
      data: {action: 'get_equipment_for_tags', tags: this.breadcrumbTrail[this.breadcrumbTrail.length-1]},
      success: function (data) {
        data = handleServerResponse(data);
        that.newDataToResLeft(data);
      },
      error: function (data) {
        handleServerError(data, new Error());
      }
    });
  }

  popToCrumbRoot () {
    let that = this;
    //clear crumbs
    this.breadcrumbTrail = [];
    $('#iam-res-crumb').empty();
    //new stuff
    $.ajax({
      url: ajaxurl,
      type: 'GET',
      async: false,
      data: {action: 'get_equipment_for_tags',tags: that.resPage.rootTags},
      success: function (data) {
        that.newDataToResLeft(handleServerResponse(data, true), true);
      },
      error: function (data) {
        handleServerError(data, new Error());
      }
    });
    //empty buttons
    $('#iam-res-crumb-buttons').empty();

    for (let i = 0; i < that.resPage.rootTags.length; i++) {
      $('#iam-res-crumb-buttons').append('<button class="iam-crumb-button">'+that.resPage.rootTags[i]+'</button>');
    }

     this.initCrumbListener();
     this.initCrumbButtonListener();
  }

}
