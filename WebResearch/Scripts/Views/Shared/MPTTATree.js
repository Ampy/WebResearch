define(['jquery', 'backbone', 'underscore', 'views/shared/mpttatreenode', 'hashtable', 'templates', 'jqueryui'],
    function ($, Backbone, _, MPTTATreeNodeView, Hashtable, templateHelper) {
        var MPTTATreeView = Backbone.View.extend({
            template: _.template([
                '<div id="<%= dlgid %>"></div>',
                '<% if(editing) { %>',
                    '<div class="btn-toolbar">',
                        '<div class="btn-group">',
                            '<button class="btn btn-mini btn-primary btn-add"><i class="icon-plus"></i>添加子节点</button>',
                            '<button class="btn btn-mini btn-yellow btn-edit"><i class="icon-edit"></i>编辑节点</button>',
                            '<button class="btn btn-mini btn-danger btn-remove"><i class="icon-remove"></i>删除节点</button>',
                        '</div>',
                        '<div class="btn-group">',
                            '<button class="btn btn-mini btn-info btn-refresh"><i class="icon-refresh"></i>刷新</button>',
                        '</div>',
                        '<div class="btn-group">',
                            '<button class="btn btn-mini btn-info btn-uplevel"><i class="icon-double-angle-up"></i>上移一级</button>',
                            '<button class="btn btn-mini btn-info btn-up"><i class="icon-chevron-up"></i>上移</button>',
                            '<button class="btn btn-mini btn-info btn-down"><i class="icon-chevron-down"></i>下移</button>',
                            '<button class="btn btn-mini btn-info btn-downlevel"><i class="icon-double-angle-down"></i>下移一级</button>',
                        '</div>',
                    '</div>',
                '<% } %>'
            ].join('')),
            editorTemplateUrl: '',
            dlgid: '',
            dlgformid: '',
            editable: false,
            vent: null,
            imgUrl: '',
            treeNodes: null,
            selectedNode: null,
            modelFactory: function () { },
            currentMode: 'view',
            initialize: function (options) {
                _.bindAll(this, "addNode");
                this.model.bind("remove", this.removeNode, this);
                this.model.bind("afterAddNode", this.addNode, this);
                this.model.bind("reset", this.render, this);

                this.vent = options.vent;
                this.vent.bind("refreshtree", this.refreshTree, this);
                this.vent.bind("nodeselected", this.nodeSelected, this);
                this.vent.bind("addingnode", this.addingNode, this);
                this.vent.bind("editingnode", this.editingNode, this);

                this.editable = options.editable;
                this.labelTemplate = options.labelTemplate;
                this.imgUrl = options.imgUrl;
                this.editorTemplateUrl = options.editorTemplateUrl;
                this.modelFactory = options.modelFactory;

                this.treeNodes = new Hashtable();
            },
            comparator: function (m) {
                return m.get("lftvalue");
            },
            render: function () {
                this.$el.empty();

                var context = this;

                this.dlgid = (new Date()).getTime();

                $(this.el).html(this.template({
                    dlgid: this.dlgid,
                    editing: context.editable
                }));

                this.disableAllButton();

                $(this.el).addClass(this.options.spanclass);

                if ('' != this.editorTemplateUrl) {
                    templateHelper.fetchTemplate(this.editorTemplateUrl, function (tmpl) {
                        context.dlgformid = (new Date()).getTime();

                        $("#" + context.dlgid).html(tmpl({
                            formid: context.dlgformid
                        }));

                        $("#" + context.dlgid).dialog({
                            autoOpen: false,
                            modal: true,
                            buttons: {
                                "保存": function () {
                                    switch (context.currentMode) {
                                        case "adding":
                                            var newNode = context.modelFactory();
                                            $("[data-bindingfield]").each(function (index, c) {
                                                newNode.set($(c).data("bindingfield"), $(c).val());
                                            });
                                            context.model.addNodeByParentID(newNode, context.selectedNode.get("nodeid"));
                                            context.vent.trigger("refresh", context.selectedNode.get("nodeid"));
                                            $("#" + context.dlgid).dialog("close");
                                            break;
                                        case "editing":
                                            var editNode = context.model.getNode(context.selectedNode.get("nodeid"));
                                            $("[data-bindingfield]").each(function (index, c) {
                                                editNode.set($(c).data("bindingfield"), $(c).val());
                                            });
                                            context.vent.trigger("refresh", context.selectedNode.get("nodeid"));
                                            $("#" + context.dlgid).dialog("close");
                                            break;
                                    }
                                },
                                "取消": function () {
                                    $("#" + context.dlgid).dialog("close");
                                }
                            }
                        });
                    });
                }

                var root = this.model.getRoot();

                root.set({ "editable": this.editable });
                var node = this.createNodeView(root);

                this.$el.append(node.render().el);

                if (root.hasChild()) {
                    var that = this;
                    root.childs().each(function (item) {
                        if (!root.get("expand"))
                            item.set("visible", false);
                        that.appendNode(node, item);
                    });
                }
            },
            editingNode: function(){
                this.currentMode = 'editing';
                if (null != this.selectedNode) {
                    var editNode = this.selectedNode;
                    $("[data-bindingfield]").each(function (index, c) {
                        $(c).val(editNode.get($(c).data("bindingfield")));
                    });
                    $("#" + this.dlgid).dialog("open");
                }
                else {
                    alert('必须选择一个要编辑的节点');
                }
            },
            addingNode: function () {
                this.currentMode = 'adding';
                this.vent.trigger("resetform", this.dlgformid);
                $("#" + this.dlgid).dialog("open");
            },
            nodeSelected: function(node){
                this.selectedNode = node;
                this.disableAllButton();

                if (null != this.selectedNode) {
                    $("button.btn-add").removeAttr("disabled");
                    $("button.btn-edit").removeAttr("disabled");
                    
                    if (!this.selectedNode.isRoot() && this.selectedNode.isFirst()) {
                        $("button.btn-down").removeAttr("disabled");
                        $("button.btn-downlevel").removeAttr("disabled");
                        if (!this.selectedNode.parent().isRoot()) {
                            $("button.btn-uplevel").removeAttr("disabled");
                        }
                    } else if (!this.selectedNode.isRoot() && this.selectedNode.isLast()) {
                        $("button.btn-up").removeAttr("disabled");
                        $("button.btn-uplevel").removeAttr("disabled");
                    } else if (!this.selectedNode.isRoot() && !this.selectedNode.isFirst() && !this.selectedNode.isLast()) {
                        $("button.btn-down").removeAttr("disabled");
                        $("button.btn-downlevel").removeAttr("disabled");
                        $("button.btn-up").removeAttr("disabled");
                        $("button.btn-uplevel").removeAttr("disabled");
                    }
                }
            },
            disableAllButton: function(){
                $("button", this.$el).each(function (index, b) {
                    if (!$(b).hasClass("btn-refresh"))
                        $(b).attr("disabled", true);
                });
            },
            refreshTree: function () {
                this.treeNodes.each(function (key, value) {
                    //value.delete();
                });

                this.treeNodes.clear();

                this.render();
            },
            createNodeView: function (model) {
                if (this.labelTemplate) {
                    return new MPTTATreeNodeView({
                        model: model,
                        vent: this.vent,
                        spanclass: this.options.spanclass,
                        labelTemplate: this.labelTemplate,
                        imgUrl: this.imgUrl
                    });
                }
                else {
                    return new MPTTATreeNodeView({
                        model: model,
                        vent: this.vent,
                        spanclass: this.options.spanclass,
                        imgUrl: this.imgUrl
                    });
                }
            },
            appendNode: function (pnodeview, cnode) {
                cnode.set({ "editable": this.editable });
                var subnode = this.createNodeView(cnode);

                this.treeNodes.put(cnode.get("nodeid"), subnode);

                this.$el.append(subnode.render().el);

                if (cnode.hasChild()) {
                    var that = this;
                    cnode.childs().each(function (item) {
                        if (!cnode.get("expand"))
                            item.set("visible", false);
                        that.appendNode(pnodeview, item);
                    });
                }
            },
            addNode: function (newNode) {
                var parentPath = newNode.parentPath();
                var parentNode = parentPath.models[parentPath.length - 1];
                var parentid = parentNode.get("nodeid");
                newNode.set({ "editable": this.editable });
                var node = this.createNodeView(newNode);

                this.treeNodes.put(newNode.get("nodeid"), newNode);

                if (!parentNode.isRoot()) {
                    var lastChild = parentNode.lastChild();
                    if (null == lastChild) {
                        $('#' + parentid, this.$el).after(node.render().el);
                        node.edit(null);
                    }
                    else {
                        $('#' + lastChild.get("nodeid"), this.$el).after(node.render().el);
                        var topParent = parentPath.models[1];
                        topParent.allChilds().each(function (item) {
                            if (item.get("nodeid") != newNode.get("nodeid")) {
                                this.vent.trigger("refresh", item.get("nodeid"));
                            }
                        });

                        node.edit(null);
                    }
                }
                else {
                    this.$el.append(node.render().el);
                }
            },
            removeNode: function (delNode) {
                var nodeid = delNode.get("nodeid");

                var nodeView = this.treeNodes.get(nodeid);

                //if (nodeView)
                //    nodeView.delete();

                delNode.destroy();

                $('#' + nodeid, this.$el).remove();
            },
            getSelected: function () {
                var selectedNode = this.model.filter(function (item) {
                    return item.get("selected");
                });

                if (0 != selectedNode.length) {
                    return selectedNode[0];
                }
                else {
                    return null;
                }
            },
            switchMode: function (mode) {
                this.editable = mode;
                this.model.each(function (node) {
                    node.set({ "editable": mode });
                });
            }
        });

        return MPTTATreeView;
    }
);