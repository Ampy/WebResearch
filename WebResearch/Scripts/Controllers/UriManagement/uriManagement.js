define(['jquery',
        'backbone',
        'underscore',
        'approuter',
        'global',
        'appcontext',
        'views/shared/records',
        'views/shared/table',
        'i18n!nls/localize',
        'nls/localizeUtil',
        'blockui',
        'bootstrap',
        'jqueryui'],
function ($, Backbone, _, Router, global, pageContext, records, tableView, localize, localizUtile) {
    return {
        initialize: function (options) {
            var r = new records({
                apiUrl: options.apiUrl,
                rows: 10,
                orderby: 'uriCode'
            });

            var table = new tableView({
                el: $("#" + options.tableel),
                vent: pageContext.current().vent,
                editDlgTemplateUrl: options.editDlgTemplateUrl,
                columns: [
                    { caption: localize.uricode, field: "uriCode", visible: true, orderable: true, width: '144', isPrimary: true },
                    { caption: localize.uriaddress, field: "uri", visible: true, orderable: true, width: '144' },
                    { caption: localize.uridescription, field: "uriDescription", visible: true, orderable: false, width: '144' }
                ],
                model: r
            });
            table.render();
        }
    }
});