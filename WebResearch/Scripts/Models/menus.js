define(['underscore', 'models/menu', 'models/mpttatree'], function(_, menu, MPTTATree){
    var menus = MPTTATree.extend({
        model: menu,
        url: "/menus"
    });

    return menus;
});