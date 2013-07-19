define(['jquery', 'underscore', 'backbone', 'views/shared/subsidebaritem'], function ($, _, Backbone, SubSidebarItemView) {
    var sideBarItemView = Backbone.View.extend({
        tagName: 'li',
        parent: null,
        vent: null,
        template: _.template([
            '<% if(menu.hasChild) { %>',
                '<a class="dropdown-toggle" href="#">',
            '<% } else { %>',
                '<% if(null == menu.uri) { %>',
                    '<a href="#">',
                '<% } else { %>',
                    '<a href="#" data-uri="<%= menu.uri.uri %>" data-uricode="<%= menu.uri.uriCode %>">',
                '<% } %>',
            '<% } %>',
                    '<i class="icon-dashboard"></i>',
                    '<span class="menu-text"><%= menu.menuCaption %></span>',
                '<% if(menu.hasChild) { %>',
                    '<b class="arrow icon-angle-down"></b>',
                '<% } %>',
                '</a>',
            '<% if(menu.hasChild) { %>',
                '<ul class="submenu" id="<%= menu.nodeid %>">',
                '</ul>',
            '<% } %>'
        ].join('')),
        events:{
            "click a[data-uricode]": "openTab"
        },
        openTab: function(evt){
            var clickTarget = $(evt.target);

            var target = null;

            switch (clickTarget[0].tagName) {
                case "SPAN":
                    target = clickTarget.parent();
                    break;
                case "A":
                    target = clickTarget;
                    break;
                case "I":
                    target = clickTarget.parent();
                    break;
            }

            this.vent.trigger("openTab", target);

            return false;
        },
        initialize: function (options) {
            $.extend(this, options);
        },
        render: function () {
            this.$el.html(this.template({
                menu: this.model.toJSON()
            }));

            var context = this;

            if (this.model.hasChild()) {
                this.model.childs().each(function (subitem, index) {
                    var subView = new sideBarItemView({
                        model: subitem,
                        parent: context,
                        vent: context.vent
                    });

                    $("#" + context.model.get("nodeid"), context.$el).append(subView.render().el);
                });
            }
            return this;
        }
    });

    return sideBarItemView;
});