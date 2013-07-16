define(['underscore', 'models/mpttanode'],
function(_, MPTTANode){
    var menu = MPTTANode.extend({
        defaults:{
            menuUrl: "",
            urlType: ""
        }
    });

    _.extend(menu.prototype.defaults, MPTTANode.prototype.defaults);

    return menu;
});