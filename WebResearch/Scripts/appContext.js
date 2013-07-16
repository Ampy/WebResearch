define(['underscore', 'backbone'], function (_, Backbone) {
    var _current = {
        vent: _.extend({}, Backbone.Events),
        router: undefined,
        menus: undefined,
        currentPanelID: undefined
    };

    return {
        current: function () {
            return _current;
        }
    };
});