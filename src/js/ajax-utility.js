/*! Utility script for working with ASP.NET MVC Ajax forms
 * 
 * Geocrest.Web.AjaxUtility v1.0.1 (https://github.com/geocrest/jquery-ajax-utility)
 * Copyright 2013, 2014 Geocrest Mapping, LLC.
 * Licensed under GPL v2.0 (https://github.com/geocrest/jquery-ajax-utility/blob/master/LICENSE)
 *
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], function ($) {
            root.AjaxUtility = factory($);
        });
    } else {
        root.AjaxUtility = factory(root.$);
    }
}(this, function ($) {
    var ajaxUtilityElementId = 'ajaxresult';
    if ($.fn.alert == null) throw new Error('AjaxUtility requires the Bootstrap Alert plugin.');
    var bootstrapVersion = $.fn.alert.Constructor.VERSION;
    var AjaxUtility = {
        VERSION: '1.0.1',
        /** Displays a success message within an alert
         * @param {object} a - a JSON object returned from the server containing a boolean value
         *  for success, a string value for a message, and the content for the updatetargetid.
         *  * It is up to you to return this object from your controller! *
         * @param {string} [b] - the jQuery selector of the element to receive the updated content (i.e. updatetargetid).
         * @param {string} [c] - the jQuery Selector of the modal displaying the content.
         * @param {string} [d] - the jQuery selector of the submit button element.
         */
        onSuccess: function (a, b, c, d) {
            var $container = addContainer(ajaxUtilityElementId);
            $(d).button('reset');
            if (a.success) {
                $(c).modal('hide');
                $(b).html(a.content);
                $container.append(a.message)
                    .addClass('alert alert-success fade in')
                    .alert()
                    .one(bootstrapVersion ? 'closed.bs.alert' : 'closed', emptyAlert);
                setTimeout(function () {
                    $container.alert('close');
                }, 5000);
            }
            else {
                $container.append(a.message)
                    .addClass('alert alert-error fade in')
                    .alert()
                    .one(bootstrapVersion ? 'closed.bs.alert' : 'closed', emptyAlert);
            }
        },
        /** Removes an element from the DOM after it has been deleted. 
         * @param {object} a - a JSON object returned from the server containing a boolean value
         * for success, a string value for message, and the id of the object deleted.
         * * It is up to you to return this object from your controller! *
         * @param {string} b - the jQuery selector of the element to remove from display (e.g. '#row3').
         */
        onDelete: function (a, b) {
            var $container = addContainer(ajaxUtilityElementId);
            if (a.success) {
                $(b).fadeOut(1000, function () {
                    $container.append(a.message)
                        .addClass('alert alert-success fade in')
                        .alert()
                        .one(bootstrapVersion ? 'closed.bs.alert' : 'closed', emptyAlert);
                    setTimeout(function () {
                        $container.alert('close');
                    }, 5000);
                });
            }
            else {
                $container.append(a.message)
                    .addClass('alert alert-error fade in')
                    .alert()
                    .one(bootstrapVersion ? 'closed.bs.alert' : 'closed', emptyAlert);
            }
        },
        /** Displays an alert with a failure message.
         * @param {object} a - the XMLHttpRequest object 
         * @param {string} b - a string describing the type of error
         * @param {string} c - the text portion of an Http error
         * @param {string} d - the jQuery selector of the submit button element.
         */
        onFailure: function (a, b, c, d) {
            var $container = addContainer(ajaxUtilityElementId);
            $(d).button('reset');
            $container.append(c)
                .addClass('alert alert-error fade in')
                .alert()
                .one(bootstrapVersion ? 'closed.bs.alert' : 'closed', emptyAlert);
        },
        /* parameter a is the XMLHttpRequest object. 
           parameter b is the status of the request.
           */
        onComplete: function (a, b) {
            $().tooltip('hide');
        },
        /** Sets the button with the specified selector to a loading state.
         * @param {object} a - the XMLHttpRequest object. 
         * @param {string} b - the jQuery selector of the button element.
         */
        onBegin: function (a, b) {
            var $container = addContainer(ajaxUtilityElementId);
            $(b).button('loading');
            $container.removeClass('in');
        }
    };
    /** Removes the content from the alert */
    function emptyAlert() {
        var $container = addContainer(ajaxUtilityElementId);
        $container.remove();
    }
    ///** Adds a close button to the alert message */
    //function addClose() {
    //    return "<button type='button' class='close' data-dismiss='alert'>&times;</button>";
    //}
    /** Adds the element to the DOM that will hold the alert messages.
     * @param {string} id - the element id for the messages.
     */
    function addContainer(id) {
        var container = $('#' + id);
        if (container.length === 0) {
            $('body').append("<div id='" + id + "' class='alert fade'><button type='button' class='close' data-dismiss='alert'>&times;</button></div>");
            return $('#' + id);
        } else {
            return container;
        }
    }
    return AjaxUtility;
}));
