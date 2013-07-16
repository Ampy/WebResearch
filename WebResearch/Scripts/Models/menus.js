define(['jquery', 'underscore', 'models/menu', 'models/mpttatree'], function($, _, menu, MPTTATree){
    var menus = MPTTATree.extend({
        model: menu,
        initialize: function (options) {
            $.extend(this, options);
        }
    });

    return menus;
});