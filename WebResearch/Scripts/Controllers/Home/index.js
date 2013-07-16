define(['jquery',
        'backbone',
        'underscore',
        'approuter',
        'global',
        'appcontext',
        'views/shared/widget',
        'views/shared/records',
        'views/shared/tableRow',
        'views/shared/table',
        'blockui',
        'bootstrap',
        'jqueryui'],
function ($, Backbone, _, Router, global, pageContext, widget, records, tableRowView, tableView) {
    return {
        initialize: function (options) {
            var r = new records({
                apiUrl: options.apiUrl,
                rows: 10,
                orderby: 'custName'
            });
            var table = new tableView({
                el: $("#customerWidget"),
                vent: pageContext.current().vent,
                editDlgTemplateUrl: options.customerDlgUrl,
                columns: [
                    { caption: "客户编号", field: "custNo", visible: true, width:'144' },
                    { caption: "客户名称", field: "custName", visible: true, orderable: true, width: '144' },
                    { caption: "街道", field: "street", visible: true, orderable: true, width: '144' },
                    { caption: "城市", field: "city", visible: true, orderable: true, width: '144' },
                    { caption: "州", field: "state", visible: true, orderable: true, width: '144' },
                    { caption: "ZIP", field: "zip", visible: true, orderable: true, width: '144' },
                    { caption: "电话一", field: "phone1", visible: true, width: '144' },
                    { caption: "电话二", field: "phone2", visible: true, width: '144' },
                    { caption: "电话三", field: "phone3", visible: true, width: '144' }
                ],
                model: r
            });
            table.render();
            //var w = new widget({
            //    vent: pageContext.current().vent,
            //    toolBarAddEvents: "addCustomer",
            //    title: '客户列表',
            //    plugin: table,
            //    el: $("#customerWidget")
            //});

            //w.render();
        }
    }
});