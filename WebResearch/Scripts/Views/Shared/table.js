define(['jquery', 'underscore', 'backbone', 'views/shared/tablerow', 'templates', 'blockui', 'jqueryui', 'colresizable'],
function ($, _, Backbone, tableRowView, templateHelper) {
    var tableView = Backbone.View.extend({
        columns: null,
        rowCount: 0,
        vent: null,
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
            '<div id="edtDlg"></div>',
            //'<div class="tablecontainer">',
                '<div class="btn-group">',
                    '<button id="btnAdd" class="btn btn-mini btn-primary"><i class="icon-plus"></i>添加</button>',
                    '<button id="btnEdit" class="btn btn-mini btn-yellow"><i class="icon-eidt"></i>编辑</button>',
                    '<button id="btnRemove" class="btn btn-mini btn-danger"><i class="icon-remove"></i>删除</button>',
                '</div>',
                '<div class="ui-resizable" style="width:100%;height:100%">',
                    '<table class="table table-bordered table-striped table-hover table-nonfluid">',
                        '<thead>',
                            '<tr>',
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
            "click a[data-command='page'][data-page]": "pageChanged"
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

            this.vent.bind("addCustomer", this.addCustomer, this);
        },
        render: function () {
            $(this.el).block({
                message: "正在加载数据……"
            });

            var context = this;

            this.model.fetch({
                success: function (datas) {
                    $(context.el).html(context.template({
                        columns: context.columns,
                        pageInfo: context.model.pageInfo()
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
                            rowIndex: index
                        });

                        $("#tablebody", $(context.el)).append(row.render().el);
                    });

                    $("table", $(context.el)).colResizable();

                    $(".table").resizable({
                        containment: ".ui-resizable"
                    });

                    //$(".tablecontainer").resizable();

                    templateHelper.fetchTemplate(context.editDlgTemplateUrl, function (tmp) {
                        $("#edtDlg", $(context.el)).html(tmp());

                        $("#edtDlg").dialog({
                            autoOpen: false,
                            modal: true,
                            width: 470,
                            buttons: {
                                "保存": function () {
                                    context.save();
                                },
                                "取消": function () {
                                    $("#edtDlg").dialog("close");
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
        addCustomer: function () {
            $("#edtDlg").dialog("open");
        }
    });

    return tableView;
});