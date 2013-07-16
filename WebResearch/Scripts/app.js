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
    'quantumcodee'],
    function ($, Backbone, _, Router, global, appcontext) {
        return {
            initialize: function () {
                appcontext.current().router = Router.initialize();
            }
        }
    }
);