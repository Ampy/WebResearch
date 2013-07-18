define(['jquery', 'underscore', 'views/shared/sidebarItem', 'models/menus'], function($, _, SidebarItemView, Menus){
    return {
        initialize: function(options){
            var menus = new Menus({
                url: options.menuDataUrl
            });

            menus.fetch({
                success: function (data) {
                    menus.buildTree();
                    try
                    {
                        var root = menus.getRoot();
                        if(null == root)
                        {
                            alert("错误的树结构，找不到根节点");
                        }

                        root.childs().each(function (item, index) {
                            var sidebarItem = new SidebarItemView({
                                model: item
                            });

                            $(options.el).append(sidebarItem.render().el);
                        });
                    }
                    catch(err){
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