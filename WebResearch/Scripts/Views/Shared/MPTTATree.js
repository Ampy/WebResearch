define(['jquery', 'backbone', 'underscore', 'views/shared/mpttatreenode', 'hashtable', 'templates', 'messagebox', 'utils', 'jqueryui'],
    function ($, Backbone, _, MPTTATreeNodeView, Hashtable, templateHelper, messageBox, utils) {
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
                            '<button class="btn btn-mini btn-info btn-up"><i class="icon-chevron-up"></i>上移</button>',
                            '<button class="btn btn-mini btn-info btn-down"><i class="icon-chevron-down"></i>下移</button>',
                            '<button class="btn btn-mini btn-info btn-move"><i class="icon-move"></i>移动节点</button>',
                            '<button class="btn btn-mini btn-info btn-cancel"><i class="icon-ban-circle"></i>取消</button>',
                        '</div>',
                    '</div>',
                '<% } else { %>',
                     '<div class="btn-group">',
                        '<button class="btn btn-mini btn-info btn-refresh"><i class="icon-refresh"></i>刷新</button>',
                     '</div>',
                '<% } %>'
            ].join('')),
            treeid: '',
            dlgid: '',
            dlgformid: '',
            editable: false,
            checkable: false,
            vent: null,
            imgUrl: '',
            treeNodes: null,
            selectedNode: null,
            modelFactory: function () { },
            currentMode: 'view',
            editDlgTemplate: '',
            valueField: 'nodeid',
            textField: 'nodename',
            events:{
                "click button.btn-add": "addingNode",
                "click button.btn-edit": "editingNode",
                "click button.btn-remove": "removeNode",
                "click button.btn-up": "moveUp",
                "click button.btn-down": "moveDown",
                "click button.btn-move": "moveNode",
                "click button.btn-cancel": "cancelMove",
                "click button.btn-refresh": "refreshData"
            },
            initialize: function (options) {
                //_.bindAll(this, "addNode");
                //this.model.bind("remove", this.render, this);
                this.model.bind("afterAddNode", this.addNode, this);
                this.model.bind("reset", this.render, this);

                this.vent = options.vent;
                this.vent.bind("refreshtree", this.refreshTree, this);
                this.vent.bind("nodeselected", this.nodeSelected, this);

                $.extend(this, options);

                this.treeNodes = new Hashtable();
            },
            comparator: function (m) {
                return m.get("lftvalue");
            },
            render: function () {
                this.$el.empty();

                var context = this;

                this.treeNodes.clear();

                this.dlgid = (new Date()).getTime();

                this.currentMode = this.editable ? "edit" : "view";

                $(this.el).html(this.template({
                    dlgid: this.dlgid,
                    editing: context.editable
                }));

                this.disableAllButton();

                $(this.el).addClass(this.options.spanclass);

                if ('' != this.editDlgTemplate) {
                    templateHelper.fetchTemplate(this.editDlgTemplate, function (tmpl) {
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
                                            context.currentMode = "edit";
                                            $("#" + context.dlgid).dialog("close");
                                            break;
                                        case "editing":
                                            var editNode = context.model.getNode(context.selectedNode.get("nodeid"));
                                            $("[data-bindingfield]").each(function (index, c) {
                                                editNode.set($(c).data("bindingfield"), $(c).val());
                                            });
                                            context.vent.trigger("refresh", context.selectedNode.get("nodeid"));
                                            context.currentMode = "edit";
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
            nodeSelected: function (node) {
                if (this.currentMode == "edit" || this.currentMode == "view") {
                    this.selectedNode = node;
                    this.disableAllButton();

                    if (null != this.selectedNode) {
                        if (!this.selectedNode.isRoot()) {
                            $("button.btn-move").removeAttr("disabled");
                            $("button.btn-remove").removeAttr("disabled");
                        }

                        $("button.btn-add").removeAttr("disabled");
                        $("button.btn-edit").removeAttr("disabled");

                        if (!this.selectedNode.isRoot() && this.selectedNode.isFirst()) {
                            $("button.btn-down").removeAttr("disabled");
                        } else if (!this.selectedNode.isRoot() && this.selectedNode.isLast()) {
                            $("button.btn-up").removeAttr("disabled");
                        } else if (!this.selectedNode.isRoot() && !this.selectedNode.isFirst() && !this.selectedNode.isLast()) {
                            if (this.selectedNode.parent().isRoot()) {
                                $("button.btn-down").removeAttr("disabled");
                                $("button.btn-up").removeAttr("disabled");
                            }
                        }
                    }
                }
                else if (this.currentMode == "moving") {
                    var context = this;
                    
                    messageBox.confirm("是否移动节点到选择的节点下？", function (result) {
                        if (result) {
                            node.get("tree").moveNode(context.selectedNode, node);
                            context.refreshTree();
                            context.cancelMove();
                        }
                        else {
                            node.set("selected", false);
                            context.selectedNode.set("selected", true);
                        }
                    });
                }
            },
            disableAllButton: function(){
                $("button", this.$el).each(function (index, b) {
                    if (!$(b).hasClass("btn-refresh"))
                        $(b).attr("disabled", true);
                    if ($(b).hasClass("btn-cancel"))
                        $(b).attr("style", "display:none");
                });
            },
            refreshTree: function () {
                this.treeNodes.each(function (key, value) {
                    //value.delete();
                });

                this.treeNodes.clear();

                this.render();
            },
            refreshData: function(evt){
                this.vent.trigger("refreshtreedata", this.treeid);
            },
            createNodeView: function (model) {
                return new MPTTATreeNodeView({
                    model: model,
                    vent: this.vent,
                    spanclass: this.options.spanclass,
                    imgUrl: this.imgUrl,
                    checkable: this.checkable,
                    valueField: this.valueField,
                    textField: this.textField
                });
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
                var node = this.createNodeView(newNode);

                this.treeNodes.put(newNode.get("nodeid"), newNode);

                parentNode.set("expand", true);

                if (!parentNode.isRoot()) {
                    var lastChild = parentNode.lastChild();
                    if (null == lastChild) {
                        $('#' + parentid, this.$el).after(node.render().el);
                    }
                    else {
                        $('#' + lastChild.get("nodeid"), this.$el).after(node.render().el);
                        var topParent = parentPath.models[1];
                        topParent.allChilds().each(function (item) {
                            if (item.get("nodeid") != newNode.get("nodeid")) {
                                this.vent.trigger("refresh", item.get("nodeid"));
                            }
                        });
                    }
                }
                else {
                    this.$el.append(node.render().el);
                }
            },
            removeNode: function (evt) {
                if (null != this.selectedNode) {
                    var context = this;
                    messageBox.confirm("要删除选中的节点吗？", function (result) {
                        if (result) {
                            var nodeid = context.selectedNode.get("nodeid");
                            //var nodeView = this.treeNodes.get(nodeid);
                            //if (nodeView)
                            //    nodeView.delete();
                            //delNode.destroy();
                            context.selectedNode.get("tree").removeNode(context.selectedNode);
                            context.refreshTree();
                        }
                    });
                }
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
            },
            moveUpLevel: function (evt) {
                if (null != this.selectedNode) {
                    var parent = this.selectedNode.parent();
                    var pparent = null;
                    if (parent.isRoot()) {
                        pparent = parent;
                    }
                    else {
                        pparent = parent.parent();
                    }

                    try {
                        this.selectedNode.get("tree").moveNode(this.selectedNode, pparent);
                        this.refreshTree();
                    }
                    catch (err) {
                        messageBox.error(err.message);
                    }
                }
            },
            moveUp: function (evt) {
                if (null != this.selectedNode) {
                    //var siblineNode = this.selectedNode.get("tree").getPrevNode(this.selectedNode);
                    try {
                        this.selectedNode.get("tree").moveNodePrev(this.selectedNode);
                        this.refreshTree();
                    }
                    catch (err) {
                        messageBox.error(err.message);
                    }
                }
            },
            moveDown: function (evt) {
                if (null != this.selectedNode) {
                    try {
                        this.selectedNode.get("tree").moveNodeNext(this.selectedNode);
                        this.refreshTree();
                    }
                    catch (err) {
                        messageBox.error(err.message);
                    }
                }
            },
            moveNode: function (evt) {
                if (null != this.selectedNode) {
                    $("button", this.$el).each(function (index, btn) {
                        if ($(btn).hasClass("btn-cancel")) {
                            $(btn).removeAttr("disabled");
                            $(btn).removeAttr("style");
                        }
                        else {
                            $(btn).attr("style", "display:none");
                        }
                    });

                    this.currentMode = "moving";
                }
            },
            cancelMove: function (evt) {
                var context = this;
                $("button", this.$el).each(function (index, btn) {
                    if ($(btn).hasClass("btn-cancel")) {
                        $(btn).attr("style", "display:none");
                    }
                    else {
                        $(btn).removeAttr("style");
                    }
                });

                this.disableAllButton();

                this.selectedNode.set("selected", false);
                this.selectedNode = false;

                this.currentMode = "edit";
            }
        });

        return MPTTATreeView;
    }
);