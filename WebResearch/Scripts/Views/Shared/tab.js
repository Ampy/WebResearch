define(['jquery', 'underscore', 'backbone', 'jqueryui'],
    function ($, _, Backbone) {
        var tabView = Backbone.View.extend({
            tagName: 'ul',
            tabID: '',
            tabTemplate: "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>",
            template: _.template([
                '<ul></ul>'
            ].join('')),
            vent: null,
            currentTab: null,
            initialize: function (options) {
                $.extend(this, options);

                this.vent.bind("openTab", this.openTab, this);
            },
            render: function () {
                var context = this;

                $(this.tabID).html(this.template());

                this.currentTab = $(this.tabID).tabs({
                    //tabTemplate: "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'>关闭</span></li>",
                    //add: function (event, ui) {
                    //    context.tabs("select", "#" + ui.panel.id);
                    //}
                });
            },
            openTab: function (link) {
                //$(this.tabID + " li").removeClass("current");
                //$(this.tabID + " p").hide();

                //$(this.tabID).append("<li class='current'><a class='tab' id='" +
                //    $(link).data("uriCode") + "' href='#'>" + $(link).html() +
                //    "</a><a href='#' class='remove'>x</a></li>");

                //$("#content").append("<p id='" + $(link).attr("rel") + "_content'>" +
                //    $(link).attr("title") + "</p>");

                //$("#" + $(link).attr("rel") + "_content").show();
                var id = $(link).data("uricode");
                var uri = $(link).data("uri");
                var li = $(this.tabTemplate.replace(/#\{href\}/g, uri).replace(/#\{label\}/g, $(link).html()));

                this.currentTab.find(".ui-tabs-nav").append(li);
                //this.currentTab.tabs("add", $(link).data("uri"), $(link).html());
            }
        });

        return tabView;
    }
);