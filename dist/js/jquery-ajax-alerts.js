/*! Provides some functionality for displaying Bootstrap alert messages when working with jQuery Ajax methods and, in particular, ASP.NET MVC Ajax forms.
 *
 * jquery-ajax-alerts v1.1.0 (https://github.com/geocrest/jquery-ajax-alerts)
 * Copyright 2013-2016 Geocrest Mapping, LLC
 * Licensed under MIT
 */

 (function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'bootstrap'], factory);
    } else {
        root.AjaxAlerts = factory(root.$);
    }
}(this, function ($) {
    var ajaxResultElementId = 'ajaxresult';
    if ($.fn.alert == null) throw new Error('AjaxAlerts requires the Bootstrap Alert plugin.');
    var bootstrapVersion = $.fn.alert.Constructor.VERSION;
    /**
     * The global Ajax Alerts object.
     * @module AjaxAlerts
     */
    var exports =
    {
        VERSION: '1.1.0',
        /** Displays a success message within an alert
         * @param {object} a - a JSON object returned from the server containing a boolean value
         *  for success, a string value for a message, and the content for the updatetargetid.
         *  * It is up to you to return this object from your controller! *
         * @param {string} [b] - the jQuery selector of the element to receive the updated content (i.e. updatetargetid).
         * @param {string} [c] - the jQuery Selector of the modal displaying the content.
         * @param {string} [d] - the jQuery selector of the submit button element.
         */
        onSuccess: function (a, b, c, d) {
            var $container = addContainer(ajaxResultElementId);
            $(d).button('reset');
            if (a.success) {
                $(c).modal('hide');
                $(b).html(a.content);
                $container.html(addClose() + a.message)
                    .addClass('alert alert-success fade in')
                    .alert();
                setTimeout(function () {
                    $container.alert('close');
                }, 5000);
            }
            else {
                $container.html(addClose() + a.message)
                    .addClass('alert alert-error alert-danger fade in')
                    .alert();
            }
            $.validator.unobtrusive.parse(document);
        },
        /** Removes an element from the DOM after it has been deleted. 
         * @param {object} a - a JSON object returned from the server containing a boolean value
         * for success, a string value for message, and the id of the object deleted.
         * * It is up to you to return this object from your controller! *
         * @param {string} b - the jQuery selector of the element to remove from display (e.g. '#row3').
         */
        onDelete: function (a, b) {
            var $container = addContainer(ajaxResultElementId);
            if (a.success) {
                $(b).fadeOut(1000, function () {
                    $container.html(addClose() + a.message)
                        .addClass('alert alert-success fade in')
                        .alert();
                    setTimeout(function () {
                        $container.alert('close');
                    }, 5000);
                });
            }
            else {
                $container.html(addClose() + a.message)
                    .addClass('alert alert-error alert-danger fade in')
                    .alert();
            }
        },
        /** Displays an alert with a failure message.
         * @param {object} a - the XMLHttpRequest object 
         * @param {string} b - a string describing the type of error
         * @param {string} c - the text portion of an Http error
         * @param {string} d - the jQuery selector of the submit button element.
         */
        onFailure: function (a, b, c, d) {
            var $container = addContainer(ajaxResultElementId);
            $(d).button('reset');
            $container.html(addClose() + c)
                .addClass('alert alert-error alert-danger fade in')
                .alert();
        },
        /** Hides all tooltips after the Ajax operation completes.
         * @param {object} a - the XMLHttpRequest object. 
         * @param {string} b - the status of the request.
         */
        onComplete: function (a, b) {
            $().tooltip('hide');
        },
        /** Sets the button with the specified selector to a loading state.
         * @param {object} a - the XMLHttpRequest object. 
         * @param {string} b - the jQuery selector of the button element.
         */
        onBegin: function (a, b) {
            var $container = addContainer(ajaxResultElementId);
            $(b).button('loading');
            $container.removeClass('in');
        }
    };

    /** Adds a close button to the alert message */
    function addClose() {
        return "<button type='button' class='close' data-dismiss='alert'>&times;</button>";
    }
    /** Adds the element to the DOM that will hold the alert messages.
     * @param {string} id - the element id for the messages.
     */
    function addContainer(id) {
        var container = $('#' + id);
        if (container.length === 0) {
            $('body').append("<div id='" + id + "' class='alert fade alert-dismissable'></div>");
            return $('#' + id);
        } else {
            return container;
        }
    }
    return exports;
}));
