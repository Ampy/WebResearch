define(['jquery', 'backbone', 'underscore', 'views/shared/mpttatreenode'],
    function ($, Backbone, _, MPTTATreeNodeView) {
        var MPTTATreeView = Backbone.View.extend({
            editable: false,
            vent: null,
            imgUrl: '',
            initialize: function (options) {
                _.bindAll(this, "addNode");
                this.model.bind("remove", this.removeNode, this);
                this.model.bind("afterAddNode", this.addNode, this);
                this.model.bind("reset", this.render, this);
                this.vent = options.vent;
                this.vent.bind("refreshtree", this.refreshTree, this);
                this.editable = options.editable;
                this.labelTemplate = options.labelTemplate;
                this.imgUrl = options.imgUrl;
            },
            attributes: function () {
                return {
                    class: this.options.spanclass
                }
            },
            comparator: function (m) {
                return m.get("lftvalue");
            },
            render: function () {
                this.$el.empty();

                var root = this.model.getRoot();

                root.set({ "editable": this.editable });
                var node = this.createNodeView(root);

                this.$el.append(node.render().el);

                if (root.hasChild()) {
                    var that = this;
                    root.childs().each(function (item) {
                        that.appendNode(node, item);
                    });
                }
            },
            refreshTree: function () {
                this.model.sort();
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

                this.$el.append(subnode.render().el);

                if (cnode.hasChild()) {
                    var that = this;
                    cnode.childs().each(function (item) {
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