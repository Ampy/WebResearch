define(['jquery', 'underscore', 'backbone', 'views/shared/subsidebaritem'], function ($, _, Backbone, SubSidebarItemView) {
    var sideBarItemView = Backbone.View.extend({
        tagName: 'li',
        parent: null,
        template: _.template([
            '<% if(menu.hasChild) { %>',
                '<a class="dropdown-toggle" href="#">',
            '<% } else { %>',
                '<a href="<%= menu.uri %>">',
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
                        parent: context
                    });

                    $("#" + context.model.get("nodeid"), context.$el).append(subView.render().el);
                });
            }
            return this;
        }
    });

    return sideBarItemView;
});