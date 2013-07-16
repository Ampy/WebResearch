define(['jquery', 'backbone', 'underscore', 'views/shared/MPTTATree', 'models/menus', 'appcontext'],
    function ($, Backbone, _, TreeView, menus, pagecontext) {
        return {
            initialize: function (options) {
                var mymenus = new menus({
                    url: options.treeDataUrl
                });

                mymenus.fetch({
                    success: function (data) {
                        mymenus.buildTree();
                        var tree = new TreeView({
                            el: $(options.el),
                            model: mymenus,
                            editable: true,
                            spanclass: "span11",
                            vent: pagecontext.current().vent,
                            imgUrl: options.imgUrl
                        });

                        tree.render();
                    },
                    error: function (jqXHR, statusText, error) {
                        alert(jqXHR.responseText);
                    }
                });
            }
        }
    }
);