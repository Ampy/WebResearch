﻿define(['jquery', 'underscore', 'backbone', 'views/shared/tablerow', 'templates', 'blockui', 'jqueryui', 'colresizable'],
function ($, _, Backbone, tableRowView, templateHelper) {
    var tableView = Backbone.View.extend({
        columns: null,
        formatKeyValue: function (item) {
            var context = this;
            var keys = _.where(this.columns, { isPrimary: true });

            if (0 != keys.length) {
                return context.getPropValue(item, keys[0].field);
            }

            return '';
        },
        rowCount: 0,
        vent: null,
        dlgid: null,
        getPropValue: function (item, prop) {
            for (var p in item) {
                if (p == prop) {
                    return item[p];
                }
            }

            return undefined;
        },
        editDlgTemplateUrl: '',
        template: _.template([
            '<div id="<%= dlgid %>"></div>',
            //'<div class="tablecontainer">',
                '<div class="btn-group">',
                    '<button class="btn btn-mini btn-primary btn-add"><i class="icon-plus"></i>添加</button>',
                    '<button class="btn btn-mini btn-yellow btn-edit"><i class="icon-edit"></i>编辑</button>',
                    '<button class="btn btn-mini btn-danger btn-remove"><i class="icon-remove"></i>删除</button>',
                '</div>',
                '<div class="ui-resizable" style="width:100%;height:100%">',
                    '<table class="table table-bordered table-striped table-hover table-nonfluid">',
                        '<thead>',
                            '<tr>',
                                '<th data-op="checkbox" class="center">',
                                    '<label><input type="checkbox"><span class="lbl"></span></label>',
                                '</th>',
                                '<% _.each(columns, function(c, index) { %>',
                                    '<% if(c.visible) { %>',
                                        '<% if(c.orderable) { %>',
                                            '<th data-orderfield="<%= c.field %>"><%= c.caption %></th>',
                                        '<% } else { %>',
                                            '<th><%= c.caption %></th>',
                                        '<% } %>',
                                    '<% } %>',
                                '<% }) %>',
                            '</tr>',
                        '</thead>',
                        '<tbody id="tablebody">',
                        '</tbody>',
                    '</table>',
                '</div>',
                '<div class="pagination pagination-centered pagination-mini">',
                    '<ul>',
                        '<% for(var i = 1; i <= pageInfo.pages; i++) { %>',
                        '<% if(i == pageInfo.page) { %>',
                            '<li class="active"><a href="#" data-command="page" data-page="<%= i %>"><%= i %></a></li>',
                        '<% } else { %>',
                            '<li><a href="#" data-command="page" data-page="<%= i %>"><%= i %></a></li>',
                        '<% } %>',
                        '<% } %>',
                    '</ul>',
                '</div>'
            //'</div>'
        ].join('')),
        events: {
            "click th[data-orderfield]": "orderChanged",
            "click a[data-command='page'][data-page]": "pageChanged",
            "click button.btn-add": "addData",
            "click button.btn-edit": "editData",
            "click button.btn-remove": "removeData",
            "click th[data-op='checkbox'] :checkbox": "selectAll"
        },
        selectAll: function (evt) {
            $(':checkbox[data-keyvalue]').each(function (index, item) {
                item.checked = !item.checked;
            });
        },
        orderChanged: function (evt) {
            var c = $(evt.target);

            if (c.data("orderfield") != this.model.get("orderby")) {
                $('th[data-orderfield="' + this.model.get("orderby") + '"] i').remove();

                this.model.set("order", "asc", { silent: true });
                this.model.set("orderby", c.data("orderfield"));
            }
            else {
                if (this.model.get("order") == "asc") {
                    this.model.set("order", "desc");
                }
            }
        },
        pageChanged: function (evt) {
            var c = $(evt.target);

            this.model.set("page", c.data("page"));
        },
        initialize: function (options) {
            $.extend(this, options);

            this.model.bind("change:order", this.render, this);
            this.model.bind("change:orderby", this.render, this);
            this.model.bind("change:page", this.render, this);
            this.model.bind("change:values", this.render, this);
        },
        render: function () {
            $(this.el).block({
                message: "正在加载数据……"
            });

            var context = this;

            this.dlgid = (new Date()).getTime();

            this.model.fetch({
                success: function (datas) {
                    $(context.el).html(context.template({
                        columns: context.columns,
                        pageInfo: context.model.pageInfo(),
                        dlgid: context.dlgid
                    }));

                    context.rowCount = context.model.get("records").length;

                    $.each($("th[data-orderfield]", $(context.el)), function (index, c) {
                        if ($(c).data("orderfield") == context.model.get("orderby")) {
                            if ("desc" == context.model.get("order")) {
                                $(c).append('<i class="icon-sort-down pull-right"></i>');
                            }
                            else {
                                $(c).append('<i class="icon-sort-up pull-right"></i>');
                            }
                        }
                        $(c).attr("style", "cursor:pointer");
                    });

                    _.each(context.model.get("records"), function (data, index) {
                        var row = new tableRowView({
                            model: data,
                            table: context,
                            getPropValue: context.getPropValue,
                            columns: context.columns,
                            rowIndex: index,
                            formatKeyValue: context.formatKeyValue
                        });

                        $("#tablebody", $(context.el)).append(row.render().el);
                    });

                    $("table", $(context.el)).colResizable();

                    $(".table").resizable({
                        containment: ".ui-resizable"
                    });

                    templateHelper.fetchTemplate(context.editDlgTemplateUrl, function (tmp) {
                        $("#" + context.dlgid, $(context.el)).html(tmp({
                            dlgid: context.dlgid
                        }));

                        $("#" + context.dlgid).dialog({
                            autoOpen: false,
                            modal: true,
                            buttons: {
                                "保存": function () {
                                    context.vent.trigger("dialogsave", context.dlgid);
                                },
                                "取消": function () {
                                    $("#" + context.dlgid).dialog("close");
                                }
                            }
                        });
                    });

                    $(context.el).unblock();
                },
                error: function (model, response, option) {
                    $(context.el).unblock();
                    alert(response);
                }
            });

            return this;
        },
        addData: function () {
            this.vent.trigger("resetform", this.dlgid);
            $("#" + this.dlgid).dialog("open");
        }
    });

    return tableView;
});