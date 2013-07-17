define(['backbone', 'underscore', 'models/mpttanode'],
function(Backbone, _, mpttanode){
    var MPTTATree = Backbone.Collection.extend({
        model: mpttanode,
        comparator: function (node) {
            return node.get("lftvalue");
        },
        initialize: function(models, options){
        },
        buildTree: function () {
            var context = this;
            this.each(function (node) {
                node.set("tree", context);
                context.calculateNodeLayer(node);
            });
        },
        isRoot: function(node){
            if(null == node){
                return false;
            }

            var root = this.getRoot();

            if(root.get("nodeid") == node.get("nodeid") &&
                root.get("lftvalue") == node.get("lftvalue") &&
                root.get("rgtvalue") == node.get("rgtvalue")){
                return true;
            }

            return false;
        },
        getRoot: function(){
            var targetValue = (this.models.length - 1) * 2 + 1;

            var root = this.models.filter(function(node){
                var v = node.get("rgtvalue") - node.get("lftvalue");
                return  v == targetValue;
            });

            if(1 < root.length){
                throw new Error("存在" + root.length + "个根节点。树构造错误");
            }
            
            if (0 == root.length) {
                throw new Error("不存在根节点，树构造错误");
            }

            return root[0];
        },
        getNode: function(nodeid){
            if(null == nodeid){
                return null;
            }
            var target = _.find(this.models, function(node){
                return nodeid == node.get("nodeid");
            });

            return target;
        },
        getChildNodes: function(targetNode){
            if(null == targetNode){
                return _([]);
            }

            var left = targetNode.get("lftvalue");
            var right = targetNode.get("rgtvalue");

            var targets = this.models.filter(function(node){
                return node.get("lftvalue") > left && node.get("lftvalue") < right;
            });

            targets = _.sortBy(targets, function(node){
                return node.get("lftvalue");
            });

            return new MPTTATree(targets);
        },
        getChildNodesByID: function(nodeid){
            if(null == nodeid){
                return _([]);
            }
            var targetNode = this.getNode(nodeid);
            return this.getChildNodes(targetNode);
        },
        getChildTree: function(targetNode) {
            if (null != targetNode) {
                var left = targetNode.get("lftvalue");
                var right = targetNode.get("rgtvalue");

                var targets = this.models.filter(function(node){
                    return node.get("lftvalue") >= left && node.get("lftvalue") <= right;
                });

                targets = _.sortBy(targets, function(node){
                    return node.get("lftvalue");
                });

                return new MPTTATree(targets);
            } else {
                return _([]);
            }
        },
        getChildTreeByID: function(nodeid){
            if(null == nodeid){
                return _([]);
            }

            var targetNode = this.getNode(nodeid);
            return this.getChildTree(targetNode);
        },
        getParentNodePath: function(targetNode){
            if(null == targetNode){
                return _([]);
            }

            var left = targetNode.get("lftvalue");
            var right = targetNode.get("rgtvalue");

            var targets = this.models.filter(function(node){
                return node.get("lftvalue") < left && node.get("rgtvalue") > right;
            });

            targets = _.sortBy(targets, function(node){
                return node.get("lftvalue");
            });

            return new MPTTATree(targets);
        },
        getParentNodePathByID: function(nodeid){
            if(null == nodeid){
                return _([]);
            }

            var targetNode = this.getNode(nodeid);
            return this.getParentNodePath(targetNode);
        },
        getNextLayer: function(targetNode){
            if(null == targetNode){
                return _([]);
            }

            var left = targetNode.get("lftvalue");
            var right = targetNode.get("rgtvalue");
            var layer = targetNode.get("layer");

            var targets = this.models.filter(function(node){
                return node.get("layer") == layer + 1 && node.get("lftvalue") > left && node.get("rgtvalue") < right;
            });

            targets = _.sortBy(targets, function(node){
                return node.get("lftvalue");
            });

            return new MPTTATree(targets);
        },
        getNextLayerByID: function(nodeid){
            if(null == nodeid){
                return _([]);
            }

            var targetNode = this.getNode(nodeid);
            return this.getNextLayer(targetNode);
        },
        getSiblingNodes: function(targetNode){
            if(null == targetNode){
                return _([]);
            }

            var parents = this.getParentNodePath(targetNode);

            if(parents.isEmpty()){
                return _([]);
            }

            var parent = parents.last();

            var targets = this.getNextLayer(parent);

            return targets;
        },
        getSiblingNodesByID: function(nodeid){
            if(null == nodeid){
                return _([]);
            }

            return this.getSiblingNodes(this.getNode(nodeid));
        },
        getNextNode: function(targetNode){
            if(null == targetNode){
                return null;
            }

            var right = targetNode.get("rgtvalue");
            var layer = targetNode.get("layer");

            var target = _.find(this.models, function(node){
                return node.get("layer") == layer && node.get("lftvalue") == right + 1;
            });

            return target;
        },
        getNextNodeByID: function(nodeid){
            if(null == nodeid){
                return null;
            }

            return this.getNextNode(this.getNode(nodeid));
        },
        getPrevNode: function(targetNode){
            if(null == targetNode){
                return null;
            }

            var left = targetNode.get("lftvalue");
            var layer = targetNode.get("layer");

            var target = _.find(this.models, function(node){
                return node.get("layer") == layer && node.get("rgtvalue") == left - 1;
            });

            return target;
        },
        getPrevNodeByID: function(nodeid){
            if(null == nodeid){
                return null;
            }

            return this.getPrevNode(this.getNode(nodeid));
        },
        isSiblingNode: function(leftNode, rightNode){
            if((null == leftNode || null == rightNode) || (null == leftNode && null == rightNode)){
                return false;
            }

            var siblings = this.getSiblingNodes(leftNode);

            var target = siblings.find(function(node){
                return node.get("nodeid") == rightNode.get("nodeid");
            });

            return null != target;
        },
        isSiblingNodeByID: function(leftNodeID, rightNodeID){
            if((null == leftNodeID || null == rightNodeID) ||
                (null == leftNodeID && null == rightNodeID) ||
                (leftNodeID == rightNodeID)){
                return false;
            }

            var siblings = this.getSiblingNodesByID(leftNodeID);

            var target = siblings.find(function(node){
                return node.get("nodeid") == rightNodeID;
            });

            return null != target;
        },
        calculateNodeLayer: function(targetNode){
            if(null != targetNode){
                var left = targetNode.get("lftvalue");
                var right = targetNode.get("rgtvalue");
                var parents = this.models.filter(function(node){
                    return node.get("lftvalue") <= left && node.get("rgtvalue") >= right;
                });
                targetNode.set("layer", parents.length);
            }
        },
        calculateNodeLayerByID: function(nodeid){
            if(null != nodeid){
                this.calculateNodeLayer(this.getNode(nodeid));
            }
        },
        addNodeByParentID: function(newNode, parentId){
            var parentNode = this.getNode(parentId);

            this.addNode(newNode, parentNode);
        },
        addNode: function(newNode, parentNode){
            if(null == parentNode){
                var root = this.getRoot();
                if(null == root){
                    parentNode = new mpttanode();
                    parentNode.set({lftvalue:0, rgtvalue:1});
                }
                else{
                    parentNode = root;
                }
            }

            var pright = parentNode.get("rgtvalue");

            newNode.set({lftvalue:pright,rgtvalue:pright + 1});

            this.each(function(node){
                if(node.get("rgtvalue") >= pright){
                    node.set({rgtvalue:node.get("rgtvalue") + 2});
                }
            });

            this.each(function(node){
                if(node.get("lftvalue") >= pright){
                    node.set({lftvalue:node.get("lftvalue") + 2})  ;
                }
            });

            newNode.set("tree", this);

            this.add(newNode);

            this.calculateNodeLayer(newNode);

            this.afterAddNode(newNode);

            return newNode;
        },
        addNodeByID: function(newNode, parentNodeID){
            return this.addNode(newNode, this.getNode(parentNodeID));
        },
        afterAddNode: function(newNode){
            this.trigger("afterAddNode", newNode);
        },
        removeNode: function(targetNode){
            if(null != targetNode){
                var left = targetNode.get("lftvalue");
                var right = targetNode.get("rgtvalue");

                var targets1 = this.models.filter(function(node){
                    return node.get("lftvalue") >= left && node.get("rgtvalue") <= right;
                });

                this.remove(targets1);

                _(this.models.filter(function(node){
                    return node.get("lftvalue") > left;
                })).each(function(node){
                        node.set("lftvalue", node.get("lftvalue") - (right - left + 1));
                    });

                _(this.models.filter(function(node){
                    return node.get("rgtvalue") > right;
                })).each(function(node){
                        node.set("rgtvalue", node.get("rgtvalue") - (right - left + 1));
                    });
            }
        },
        removeNodeByID: function(nodeid){
            if(null != nodeid){
                this.removeNode(this.getNode(nodeid));
            }
        },
        moveNodeDown: function(node, targetParent){
            if(null == node || null == targetParent){
                throw new Error("参数不能为空");
            }

            //新的父节点不能是要被移动的节点的子节点
            var parents = this.getParentNodePath(targetParent);

            var parent = _.find(parents.toArray(), function(n){
                return n.get("nodeid") == node.get("nodeid");
            });

            if(null != parent){
                throw new Error("目标父节点不能为要移动的节点的子节点");
            }

            //开始移动
            var left = node.get("lftvalue");
            var right = node.get("rgtvalue");

            var pleft = targetParent.get("lftvalue");
            var pright = targetParent.get("rgtvalue");

            var affectedValue = (node.childCount() + 1) * 2;

            var nodeTree = this.getChildTree(node);

            //找出移动路径中影响的节点
            var count1 = 0;
            _(this.models.filter(function(node){
                return node.get("lftvalue") > left && node.get("lftvalue") < pleft &&
                    node.get("rgtvalue") > right && node.get("rgtvalue") < pright;
            })).each(function(node){
                    count1 += 1;
                    node.set({lftvalue: node.get("lftvalue") - affectedValue, rgtvalue: node.get("rgtvalue") - affectedValue});
                });

            //找出原所有的父节点
            var count2 = 0;
            _(this.models.filter(function(node){
                return node.get("lftvalue") < left && node.get("rgtvalue") < pright &&
                    node.get("rgtvalue") > right;
            })).each(function(node){
                    count2 += 1;
                    node.set({rgtvalue: node.get("rgtvalue") - affectedValue});
                });

            //找出新所有的父节点
            var count3 = 0;
            _(this.models.filter(function(node){
                return node.get("lftvalue") <= pleft && node.get("lftvalue") > left &&
                    node.get("rgtvalue") >= pright;
            })).each(function(node){
                    count3 += 1;
                    node.set({lftvalue:node.get("lftvalue") - affectedValue});
                });

            //找出新的兄弟节点
            var count4 = 0;
            _(this.models.filter(function(node){
                return node.get("lftvalue") > pleft && node.get("rgtvalue") < pright;
            })).each(function(node){
                    count4 += 1;
                    node.set({lftvalue:node.get("lftvalue") - affectedValue,
                        rgtvalue:node.get("rgtvalue") - affectedValue});
                });

            var totalaffected = count1 * 2 + count2 + count3 + count4 * 2;

            nodeTree.each(function(node){
                node.set({lftvalue:node.get("lftvalue") + totalaffected,
                    rgtvalue:node.get("rgtvalue") + totalaffected});
            });

            var that = this;

            nodeTree.each(function(node){
                that.calculateNodeLayer(node);
            });
        },
        moveNodeDownByID: function(nodeID, targetParentID){
            if(null == nodeID || null == targetParentID){
                throw new Error("参数不能为空");
            }

            this.moveNodeDown(this.getNode(nodeID), this.getNode(targetParentID));
        },
        moveNodeUp: function(node, targetParent){
            if(null == node || null == targetParent){
                throw new Error("参数不能为空");
            }

            //新的父节点不能是要被移动的节点的子节点
            var parents = this.getParentNodePath(targetParent);

            var parent = _.find(parents.toArray(), function(n){
                return n.get("nodeid") == node.get("nodeid");
            });

            if(null != parent){
                throw new Error("目标父节点不能为要移动的节点的子节点");
            }

            //开始移动
            var left = node.get("lftvalue");
            var right = node.get("rgtvalue");

            var pleft = targetParent.get("lftvalue");
            var pright = targetParent.get("rgtvalue");

            var affectedValue = (node.childCount() + 1) * 2;

            var nodeTree = this.getChildTree(node);

            //找出移动路径中影响的节点
            var count1 = 0;
            _(this.models.filter(function(node){
                return node.get("lftvalue") > pleft && node.get("lftvalue") < left &&
                    node.get("rgtvalue") > pright && node.get("rgtvalue") < right;
            })).each(function(node){
                    count1 += 1;
                    node.set({lftvalue:node.get("lftvalue") + affectedValue,
                        rgtvalue:node.get("rgtvalue")+affectedValue});
                });

            //找出原所有的父节点
            var count2 = 0;
            _(this.models.filter(function(node){
                return node.get("lftvalue") < left && node.get("lftvalue") > pleft &&
                    node.get("rgtvalue")  > right;
            })).each(function(node){
                    count2 += 1;
                    node.set("lftvalue", node.get("lftvalue") + affectedValue);
                });

            //找出新所有父节点
            var count3 = 0;
            _(this.models.filter(function(node){
                return node.get("lftvalue") <= pleft && node.get("rgtvalue") >= pright &&
                    node.get("rgtvalue") < right;
            })).each(function(node){
                    count3 += 1;
                    node.set("rgtvalue", node.get("rgtvalue") + affectedValue);
                });

            var totalAffected = count1 * 2 + count2 + count3;

            nodeTree.each(function(node){
                node.set({lftvalue:node.get("lftvalue")-totalAffected,
                    rgtvalue:node.get("rgtvalue")-totalAffected});
            });

            var that = this;

            nodeTree.each(function(node){
                that.calculateNodeLayer(node);
            });
        },
        moveNodeUpByID: function(nodeID, targetParentID){
            if(null == nodeID || null == targetParentID){
                throw new Error("参数不能为空");
            }

            this.moveNodeUp(this.getNode(nodeID), this.getNode(targetParentID));
        },
        moveNode2Root: function(node){
            if(null == node){
                throw new Error("要被移动的节点不能为空");
            }

            if(this.isRoot(node)){
                throw new Error("节点已经是根节点");
            }

            var nodeTree = this.getChildTree(node);
            var affectedValue = (node.childCount() + 1) * 2;

            var root = this.getRoot();

            //找出除了根节点以外的父节点路径
            var count1 = 0;
            _(this.models.filter(function(n){
                return n.get("rgtvalue") > node.get("rgtvalue") && n.get("lftvalue") < node.get("lftvalue") &&
                    n.get("lftvalue") > 1;
            })).each(function(n){
                    count1 += 1;
                    n.set("rgtvalue", n.get("rgtvalue") - affectedValue);
                });

            //找出除了自身树以及父节点路径以外的所有其他节点
            var count2 = 0;
            _(this.models.filter(function(n){
                return n.get("rgtvalue") > node.get("rgtvalue") && n.get("rgtvalue") < root.get("rgtvalue") &&
                    n.get("lftvalue") > node.get("lftvalue");
            })).each(function(n){
                    count2 += 1;
                    n.set({lftvalue:n.get("lftvalue") - affectedValue, rgtvalue:n.get("rgtvalue") - affectedValue});
                });

            var totalAffected = count1 + count2 * 2;

            nodeTree.each(function(n){
                n.set({lftvalue:n.get("lftvalue")+totalAffected,rgtvalue:n.get("rgtvalue")+totalAffected});
            });

            var that = this;
            nodeTree.each(function(n){
                that.calculateNodeLayer(n);
            });
        },
        moveNode2RootByID: function(nodeid){
            if(null == nodeid){
                throw new Error("要被移动的节点的编号不能为空");
            }

            this.moveNode2Root(this.getNode(nodeid));
        },
        moveNodePrev: function(node){
            if(null == node){
                throw new Error("要被移动的节点不能为空");
            }

            var prevNode = this.getPrevNode(node);

            if(null != prevNode){
                var nodeTree = this.getChildTree(node);
                var prevNodeTree = this.getChildTree(prevNode);

                var prevAffectedValue = (node.childCount() + 1) * 2;
                var nodeAffectedValue = (prevNode.childCount() + 1) * 2;

                prevNodeTree.each(function(n){
                    n.set({lftvalue:n.get("lftvalue")+prevAffectedValue,rgtvalue:n.get("rgtvalue")+prevAffectedValue});
                });

                nodeTree.each(function(n){
                    n.set({lftvalue:n.get("lftvalue")-nodeAffectedValue,rgtvalue:n.get("rgtvalue")-nodeAffectedValue});
                });

                var that = this;

                nodeTree.each(function(n){
                    that.calculateNodeLayer(n);
                });

                prevNodeTree.each(function(n){
                    that.calculateNodeLayer(n);
                });
            }
        },
        moveNodePrevByID: function(nodeid){
            if(null == nodeid){
                throw new Error("要被移动的节点编号不能为空");
            }

            this.moveNodePrev(this.getNode(nodeid));
        },
        moveNodeNext: function(node){
            if(null == node){
                throw new Error("要被移动的节点不能为空");
            }

            var nextNode = this.getNextNode(node);

            if(null != nextNode){
                var nodeTree = this.getChildTree(node);
                var nextNodeTree = this.getChildTree(nextNode);

                var nodeAffectedValue = (nextNode.childCount() + 1) * 2;
                var nextNodeAffectedValue = (node.childCount() + 1) * 2;

                nodeTree.each(function(n){
                    n.set({lftvalue:n.get("lftvalue")+nodeAffectedValue,rgtvalue:n.get("rgtvalue")+nodeAffectedValue});
                });

                nextNodeTree.each(function(n){
                    n.set({lftvalue:n.get("lftvalue")-nextNodeAffectedValue,
                        rgtvalue:n.get("rgtvalue")-nextNodeAffectedValue});
                });

                var that = this;

                nodeTree.each(function(n){
                    that.calculateNodeLayer(n);
                });

                nextNodeTree.each(function(n){
                    that.calculateNodeLayer(n);
                });
            }
        },
        moveNodeNextByID: function(nodeid){
            if(null == nodeid){
                throw new Error("要被移动的节点编号不能为空");
            }

            this.moveNodeNext(this.getNode(nodeid));
        },
        moveNode: function(node, targetParent){
            if(null == node || null == targetParent){
                throw new Error("要被移动的节点不能为空");
            }

            if(targetParent.get("lftvalue") > node.get("lftvalue") &&
                targetParent.get("rgtvalue") < node.get("rgtvalue")){
                throw new Error("不能从父节点移动到子节点");
            }

            if(this.isRoot(targetParent)){
                this.moveNode2Root(node);
            }
            else if(node.get("lftvalue") > targetParent.get("lftvalue")){
                return this.moveNodeUp(node, targetParent);
            }
            else if(node.get("lftvalue") < targetParent.get("lftvalue")){
                this.moveNodeDown(node, targetParent);
            }
        },
        moveNodeByID: function(nodeID, targetParentID){
            if(null == nodeID || null == targetParentID){
                throw new Error("参数不能为空");
            }

            this.moveNode(this.getNode(nodeID), this.getNode(targetParentID));
        }
    });

    return MPTTATree;
});