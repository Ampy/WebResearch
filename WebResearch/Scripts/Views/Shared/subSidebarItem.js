define(['jquery', 'underscore', 'backbone', 'views/shared/sidebarItem'], function ($, _, Backbone) {
    var subSidebarItemView = Backbone.View.extend({
        tagName: 'ul',
        parent: null,
        template: _.template([
        ].join()),
        initialize: function (options) {
            $.extend(this, options);
        },
        render: function () {
            this.$el.html(this.template());

            var context = this;

            if (0 != this.model.length) {
                this.model.each(function (item, index) {
                    var itemView = new SidebarItemView({
                        model: item,
                        parent: context
                    });

                    context.$el.append(itemView.render().el);
                });
            }

            return this;
        }
    });

    return subSidebarItemView;
});