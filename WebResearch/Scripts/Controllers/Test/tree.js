define(['jquery', 'backbone', 'underscore', 'views/shared/MPTTATree', 'models/menus', 'models/menu', 'appcontext', 'messagebox'],
    function ($, Backbone, _, TreeView, menus, menu, pagecontext, messageBox) {
        return {
            initialize: function (options) {
                var mymenus = new menus({
                    url: options.treeDataUrl
                });

                var tree = null;
                var treeid = (new Date()).getTime();

                mymenus.fetch({
                    success: function (data) {
                        mymenus.buildTree();
                        tree = new TreeView({
                            el: $(options.el),
                            model: mymenus,
                            treeid: treeid,
                            editable: true,
                            checkable: true,
                            spanclass: "span11",
                            vent: pagecontext.current().vent,
                            imgUrl: options.imgUrl,
                            editDlgTemplate: options.editDlgTemplate,
                            modelFactory: function () {
                                return new menu();
                            },
                            textField: "menuCaption"
                        });

                        tree.render();
                    },
                    error: function (jqXHR, statusText, error) {
                        messageBox.error(jqXHR.responseText);
                    }
                });

                pagecontext.current().vent.bind("refreshtreedata", function (ptreeid) {
                    if (treeid == ptreeid) {
                        mymenus.fetch({
                            success: function (data) {
                                mymenus.buildTree();
                                tree.render();
                            }
                        });
                    }
                });
            }
        }
    }
);