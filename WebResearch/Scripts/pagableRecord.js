var pagableRecord = Backbone.Model.extend({
    defaults: {
        page: 1,
        rows: 1,
        totalRows: 0,
        pages: 1,
        orderby: "",
        order: "desc",
        target: null,
        records: null
    },
    initialize: function(options){
        this.set("records", options.records);
        this.set("rows", options.rows);
        this.set("orderby", options.orderby);
        this.set("order", options.order);
        this.set("target", options.records);
    },
    url: function () {
        var startIndex = (this.get("page") - 1) * this.get("rows");
        var urlRoot = "";
        if ($.isFunction(this.get("target").url))
            urlRoot = this.get("target").url();
        else
            urlRoot = this.get("target").url;
        return urlRoot + "/" + startIndex + "/" + this.get("rows") + "/" + this.get("orderby") + "/" + this.get("order");
    }
});