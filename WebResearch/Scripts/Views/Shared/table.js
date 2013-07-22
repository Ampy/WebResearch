define(['jquery', 'underscore', 'backbone', 'views/shared/tablerow', 'templates', 'hashtable', 'messagebox', 'blockui', 'jqueryui', 'colresizable'],
function ($, _, Backbone, tableRowView, templateHelper, Hashtable, messageBox) {
    var tableView = Backbone.View.extend({
        columns: null,
        rows: null,
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
        dlgformid: null,
        currentEdit: null,
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
                    '<button class="btn btn-mini btn-info btn-refresh"><i class="icon-refresh"></i>刷新</button>',
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
            "click button.btn-refresh": "refreshByHand",
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
                else {
                    this.model.set("order", "asc");
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

            this.vent.bind("refreshtable", this.refreshTable, this);

            this.rows = new Hashtable();
        },
        refreshTable: function(formid, target){
            if (this.dlgformid == formid) {
                if (null == target) {
                    this.render();
                }
                else {
                    if (this.formatKeyValue(target) == this.currentEdit) {
                        this.rows.get(this.currentEdit).refresh();
                    }
                }
            }
        },
        refreshByHand: function(evt){
            this.render();
        },
        render: function () {
            $(this.el).html('');

            $(this.el).block({
                message: "正在加载数据……"
            });

            var context = this;

            this.rows.clear();

            this.dlgid = (new Date()).getTime();

            this.model.fetch({
                cache: false,
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

                        context.rows.put(context.formatKeyValue(data), row);

                        $("#tablebody", $(context.el)).append(row.render().el);
                    });

                    $("table", $(context.el)).colResizable();

                    $(".table").resizable({
                        containment: ".ui-resizable"
                    });

                    context.dlgformid = (new Date()).getTime();

                    templateHelper.fetchTemplate(context.editDlgTemplateUrl, function (tmp) {
                        $("#" + context.dlgid, $(context.el)).html(tmp({
                            formid: context.dlgformid
                        }));

                        $("#" + context.dlgid).dialog({
                            autoOpen: false,
                            modal: true,
                            buttons: {
                                "保存": function () {
                                    context.vent.trigger("dialogsave", context.dlgformid, context.dlgid);
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
            this.vent.trigger("resetform", this.dlgformid, "add", null);
            $("#" + this.dlgid).dialog("open");
        },
        editData: function () {
            var checkedBox =  $(':checkbox[data-keyvalue]:checked');
            if (0 != checkedBox.length) {
                if (1 != checkedBox.length) {
                    messageBox.alert("只能选择一条数据进行编辑");
                }
                else {
                    this.currentEdit = $(checkedBox[0]).data("keyvalue");
                    this.vent.trigger("resetform", this.dlgformid, "edit", this.rows.get(this.currentEdit).model);
                    $("#" + this.dlgid).dialog("open");
                }
            }
            else {
                messageBox.alert("请选择一条数据进行编辑");
            }
        },
        removeData: function () {
            var context = this;
            var checkedBox = $(':checkbox[data-keyvalue]:checked');
            if (0 == checkedBox.length) {
                messageBox.alert("请选择数据用于删除");
            }
            else {
                messageBox.confirm("您确定要删除选择的数据？", function (result) {
                    if (result) {
                        var deleteTargets = new Array();
                        checkedBox.each(function (index, item) {
                            deleteTargets[index] = $(item).data("keyvalue");
                        });

                        context.vent.trigger("deletedata", context.dlgformid, deleteTargets);
                    }
                    else {
                        $("#" + context.dlgid).dialog("close");
                    }
                });
            }
        }
    });

    return tableView;
});