define([
    'jquery',
    'backbone',
    'underscore',
    'approuter',
    'global',
    'appcontext',
    'blockui',
    'bootstrap',
    'quantumcode',
    'quantumcodee',
    'blockui'],
    function ($, Backbone, _, Router, global, appcontext) {
        return {
            initialize: function () {
                appcontext.current().router = Router.initialize();

                $(document).ajaxStart(function () {
                    $.blockUI({
                        message: '<image src="images/ajax-loader.gif"></image>'
                    });
                });

                $(document).ajaxStop(function () {
                    $.unblockUI();
                });
            }
        }
    }
);