define(['jquery', 'backbone'], function ($, Backbone) {
    var customer = Backbone.Model.extend({
        urlRoot: '',
        initialize: function (options) {
            $.extend(this, options);
        }
    });

    return customer;
});