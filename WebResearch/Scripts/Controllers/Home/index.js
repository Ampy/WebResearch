define(['jquery', 'underscore', 'views/shared/sidebarItem', 'models/menus', 'views/shared/tab', 'appcontext'],
    function ($, _, SidebarItemView, Menus, tabView, pageContext) {
        return {
            initialize: function (options) {
                var menus = new Menus({
                    url: options.menuDataUrl
                });

                var tv = new tabView({
                    tabID: options.tabID,
                    vent: pageContext.current().vent
                });

                tv.render();

                menus.fetch({
                    success: function (data) {
                        menus.buildTree();
                        try {
                            var root = menus.getRoot();
                            if (null == root) {
                                alert("错误的树结构，找不到根节点");
                            }

                            root.childs().each(function (item, index) {
                                var sidebarItem = new SidebarItemView({
                                    model: item,
                                    vent: pageContext.current().vent
                                });

                                $(options.el).append(sidebarItem.render().el);
                            });
                        }
                        catch (err) {
                            alert(err.message);
                        }
                    },
                    error: function (jqXHR, statusText, err) {
                        alert(jqXHR.responseText);
                    }
                });
            }
        }
    });