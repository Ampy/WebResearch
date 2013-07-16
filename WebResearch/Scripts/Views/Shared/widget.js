define(['backbone', 'underscore'], function (Backbone, _) {
    var widgetView = Backbone.View.extend({
        template: _.template([
            '<div class="widget-box">',
                '<div class="widget-header header-color-blue">',
                    '<h5><i class="icon-tasks icon-2x"></i><%= title %></h5>',
                    '<div class="widget-toolbar">',
                        '<a href="#" id="newlink"><i class="icon-edit"></i>添加</a>',
                    '</div>',
                '</div>',
                '<div class="widget-body">',
                    '<div class="widget-body-inner" style="display: block">',
                        '<div class="widget-main no-padding" id="widget-plugin">',
                        '</div>',
                    '</div>',
                '</div>',
            '</div>'
        ].join('')),
        title: '',
        plugin: null,
        vent: null,
        toolBarAddEvents: '',
        events:{
            "click a#newlink": "toolbarAdd"
        },
        toolbarAdd: function(evt){
            this.vent.trigger(this.toolBarAddEvents, '');
        },
        initialize: function (options) {
            $.extend(this, options);
        },
        render: function () {
            $(this.el).html(
                this.template({
                    title: this.title
                })
            );

            if (null != this.plugin) {
                //this.plugin.el = $("#widget-plugin");
                //this.plugin.render();
                $("#widget-plugin", this.$el).html(this.plugin.render().el);
            }

            return this;
        }
    });

    return widgetView;
});