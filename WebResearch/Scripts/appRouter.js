define(['backbone'], function (Backbone) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            "logsource/:date": "showTasks",
            "showpanel/:panelid": "showPanel"
        }
    });

    var initialize = function () {
        var appRouter = new AppRouter;
        Backbone.history.start();
        return appRouter;
    };

    return {
        initialize: initialize
    };
});