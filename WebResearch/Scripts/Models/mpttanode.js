define(['backbone', 'underscore'],
function(Backbone, _){
    var MPTTANode = Backbone.Model.extend({
        defaults:{
            nodename:"",
            lftvalue:0,
            rgtvalue:1,
            nodeid:"",
            layer: 1,
            expand: false,
            visible: true,
            checked: false,
            selected: false,
            editable: false,
            tree: null
        },
        toJSON: function() {
            var j = _(this.attributes).clone();
            j.hasChild = this.hasChild();
            j.isLast = this.isLast();
            j.parentPath = this.parentPath();
            j.isRoot = this.isRoot();
            j.parent = this.parent();
            return j;
        },
        childCount: function(){
            return (this.get("rgtvalue") - this.get("lftvalue") - 1) / 2;
        },
        hasChild: function(){
            return 0 != this.childCount();
        },
        childs: function(){
            var tree = this.get("tree");
            if(tree){
                return tree.getNextLayer(this);
            }
            else{
                return null;
            }
        },
        allChilds:function(){
            if(null == this.get("tree")){
                return new Backbone.Collection();
            }
            else{
                return this.get("tree").getChildNodes(this);
            }
        },
        isLast: function(){
            return null != this.get("tree")?null == this.get("tree").getNextNode(this):false;
        },
        isFirst: function(){
            return null != this.get("tree")?null == this.get("tree").getPrevNode(this):false;
        },
        parentPath: function(){
            var tree = this.get("tree");
            if(null != tree){
                var parentPath = tree.getParentNodePath(this);
                return parentPath;
            }
            else{
                return new Backbone.Collection();
            }
        },
        parent: function(){
            var tree = this.get("tree");

            if(null != tree){
                var parentPath = tree.getParentNodePath(this);

                if(0 == parentPath.length){
                    return null;
                }
                else{
                    return parentPath.last();
                }
            }
            else{
                return null;
            }
        },
        isRoot: function(){
            return 1 == this.get("lftvalue");
        },
        lastChild: function(){
            var tree = this.get("tree");

            if(null != tree){
                var childs = tree.getChildNodes(this);

                if(null == childs || 0 == childs.length){
                    return null;
                }
                else{
                    return childs.models[childs.length - 2];
                }
            }
            else{
                return null;
            }
        }
    });

    return MPTTANode;
});
