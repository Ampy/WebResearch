define(['jquery', 'backbone', 'underscore', 'views/shared/MPTTATree', 'models/menus', 'models/menu', 'appcontext'],
    function ($, Backbone, _, TreeView, menus, menu, pagecontext) {
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
                            imgUrl: options.imgUrl,
                            editorTemplateUrl: options.editorTemplateUrl,
                            modelFactory: function () {
                                return new menu();
                            }
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