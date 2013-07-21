define(['jquery', 'underscore', 'backbone', 'jqueryui'],
    function ($, _, Backbone) {
        var tabView = Backbone.View.extend({
            tagName: 'ul',
            tabID: '',
            tabIndex: 1,
            tabTemplate: [
                "<li class='ui-state-default ui-corner-top ui-tabs-active ui-state-active' tabindex='#{index}' role='tab' aria-controls='#{id}' aria-labelledby='#{tabindex}' aria-selected='false'>",
                    "<a id='#{tabindex}' class='ui-tabs-anchor' href='#{href}' role='presentation'>#{label}</a>",
                    "<span class='ui-icon ui-icon-close' role='presentation'>关闭</span>",
                "</li>"].join(""),
            contentTemplate: [
                "<div id='#{id}' class='ui-tabs-panel ui-widget-content ui-corner-bottom' aria-live='polite' aria-labelledby='#{tabindex}' role='tabpanel' style='display: none;' aria-expanded='false' aria-hidden='true'>",
                "</div>"
            ].join(""),
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
                    beforeLoad: function (event, ui) {
                        if (ui.tab.data("loaded")) {
                            event.preventDefault();
                            return;
                        }

                        ui.jqXHR.success(function () {
                            ui.tab.data("loaded", true);
                        });
                    },
                    create: function (event, ui) {
                        //console.log(ui.tab.index());
                    },
                    activate: function (event, ui) {
                        //console.log(ui.newTab.index());
                    }
                });

                var context = this;

                this.currentTab.delegate("span.ui-icon-close", "click", function () {
                    var panelId = $(this).closest( "li" ).remove().attr( "aria-controls" );
                    $("#" + panelId ).remove();
                    context.currentTab.tabs("refresh");
                });
            },
            openTab: function (link) {
                var id = $(link).data("uricode");
                var uri = $(link).data("uri");

                if (0 == $(this.tabID + ' a[href="' + uri + '"]').length) {
                    var tabindex = "ui-tabs-" + this.tabIndex;
                    this.tabIndex += 1;
                    var li = $(this.tabTemplate.replace(/#\{href\}/g, uri).replace(/#\{label\}/g, $(link).html())
                        .replace(/#\{tabindex\}/g, tabindex)
                        .replace(/#\{id\}/g, id)
                        .replace(/#\{index\}/g, tabindex));

                    this.currentTab.find(".ui-tabs-nav").append(li);
                    this.currentTab.tabs("refresh");
                }

                var index = $(this.tabID + ' a[href="' + uri + '"]').parent().index();
                this.currentTab.tabs("option", "active", index);
            }
        });

        return tabView;
    }
);