define(['jquery', 'backbone', 'underscore'], function ($, Backbone, _) {
    var tableRowView = Backbone.View.extend({
        tagName: "tr",
        getPropValue: null,
        columns: null,
        table: null,
        rowIndex: -1,
        template: _.template([
            '<% _.each(columns, function(c, index) { %>',
                '<% if(c.visible) { %>',
                    '<% if(0==index) { %>',
                        '<% if(rowIndex == rowCount - 1) { %>',
                            '<td class="left bottom" data-field="<%= c.field %>">',
                        '<% } else { %>',
                            '<td class="left" data-field="<%= c.field %>">',
                        '<% } %>',
                    '<% } else if(index == columns.length - 1) { %>',
                        '<% if(rowIndex == rowCount - 1) { %>',
                            '<td class="right bottom" data-field="<%= c.field %>">',
                        '<% } else { %>',
                            '<td class="right" data-field="<%= c.field %>">',
                        '<% } %>',
                    '<% } else {%>',
                        '<% if(rowIndex == rowCount - 1) { %>',
                            '<td class="bottom" data-field="<%= c.field %>">',
                        '<% } else { %>',
                            '<td data-field="<%= c.field %>">',
                        '<% } %>',
                    '<% } %>',
                            '<div class="table-cell table-cell-nowrap"><%= getPropValue(item, c.field) %></div>',
                    '</td>',
                '<% } %>',
            '<% }) %>'
        ].join('')),
        initialize: function (options) {
            $.extend(this, options);
        },
        render: function () {
            $(this.el).html(this.template({
                columns: this.columns,
                getPropValue: this.getPropValue,
                item: this.model,
                rowIndex: this.rowIndex,
                rowCount: this.table.rowCount
            }));

            return this;
        }
    });

    return tableRowView;
});