define(['jquery', 'backbone', 'underscore', 'bootstrap'],
    function ($, Backbone, _) {
        var MPTTATreeNodeView = Backbone.View.extend({
            imgUrl: '',
            vent: null,
            template: _.template([
                "<% if(data.visible) { %>",
                    "<% if(data.selected) {%>",
                        "<div class='nodeselect' id='inner<%= data.nodeid %>'>",
                    "<% } else { %>",
                        "<div class='node' id='inner<%= data.nodeid %>'>",
                    "<% } %>",
                "<% } else { %>",
                    "<div style='display:none' id='inner<%= data.nodeid %>'>",
                "<% } %>",
                    "<span>",
                        "<% if(null != data.parentPath) { %>",
                            "<% data.parentPath.each(function(p) { %>",
                                "<% if(p.isLast()) { %>",
                                    "<img src='<%= img.empty %>' />",
                                "<% } else { %>",
                                    "<img src='<%= img.line %>' />",
                                "<% } %>",
                            "<% }) %>",
                        "<% } %>",
                    "</span>",
                    "<% if(data.hasChild) { %>",
                            "<% if(data.expand) { %>",
                                "<% if(data.isLast) { %>",
                                    "<img id='toggle<%= data.nodeid %>' class='btntoggle' src='<%= img.minusbottom %>' />",
                                "<% } else { %>",
                                    "<img id='toggle<%= data.nodeid %>' class='btntoggle' src='<%= img.minus %>' />",
                                "<% } %>",
                            "<% } else { %>",
                                "<% if(data.isLast) { %>",
                                    "<img id='toggle<%= data.nodeid %>' class='btntoggle' src='<%= img.plusbottom %>' />",
                                "<% } else { %>",
                                    "<img id='toggle<%= data.nodeid %>' class='btntoggle' src='<%= img.plus %>' />",
                                "<% } %>",
                            "<% } %>",
                    "<% } else { %>",
                        "<% if(data.isLast) { %>",
                            "<img src='<%= img.joinbottom %>' />",
                        "<% } else { %>",
                            "<img src='<%= img.join %>' />",
                        "<% } %>",
                    "<% } %>",
                    "<% if(data.hasChild) { %>",
                        "<% if(data.expand) { %>",
                            "<img src='<%= img.folderopen %>' id='imgselector' />",
                        "<% } else { %>",
                            "<img src='<%= img.folder %>' id='imgselector' />",
                        "<% } %>",
                    "<% } else { %>",
                        "<img src='<%= img.page %>' id='imgselector' />",
                    "<% } %>",
                    "<%= labelTemplate(data) %>",
                    "<% if(data.editable && data.selected) { %>",
                        "<% if(!data.isRoot) { %>",
                            "<% if(data.isLast) { %>",
                                "<a class='btnMove'><i class='icon-arrow-up' data-type='up'></i></a>",
                                "<a class='btnMove'><i class='icon-circle-arrow-up' data-type='upin'></i></a>",
                            "<% } else if(data.parent.toJSON().isRoot) { %>",
                                "<a class='btnMove'><i class='icon-arrow-down'  data-type='down'></i></a>",
                                "<a class='btnMove'><i class='icon-circle-arrow-down' data-type='downin'></i></a>",
                            "<% } else { %>",
                                "<a class='btnMove'><i class='icon-circle-arrow-up' data-type='upin'></i></a>",
                                "<a class='btnMove'><i class='icon-arrow-up'  data-type='up'></i></a>",
                                "<a class='btnMove'><i class='icon-arrow-down'  data-type='down'></i></a>",
                                "<a class='btnMove'><i class='icon-circle-arrow-down' data-type='downin'></i></a>",
                            "<% } %>",
                            "<a class='btnEdit'><i class='icon-edit'></i></a>",
                            "<a class='btnAdd'><i class='icon-plus'></i></a>",
                        "<% } %>",
                    "<% } %>",
                "</div>"
            ].join('')),
            events:{
                "click img.btntoggle": "toggleClick",
                "change :checkbox": "checkedChanged",
                "click img#imgselector": "selectNode",
                "click a.btnMove": "moveNode",
                "click a.btnEdit": "edit",
                "click a.btnAdd": "addSubNode"
            },
            labelTemplate:_.template([
                "<% if(editable) { %>",
                    "<% if(checked) { %>",
                        "<input type='checkbox' checked='true' id='chk<%= nodeid %>' />",
                    "<% } else { %>",
                        "<input type='checkbox' id='chk<%= nodeid %>' />",
                    "<% } %>",
                "<% } %>",
                "<label for='chk<%= nodeid %>' title='<%= menuCaption %>'><%= menuCaption %></label>"
            ].join('')),
            imgs: function(){
                return{
                    "minusbottom": this.imgUrl + "/minusbottom.gif",
                    "minus": this.imgUrl + "/minus.gif",
                    "plusbottom": this.imgUrl + "/plusbottom.gif",
                    "plus": this.imgUrl + "/plus.gif",
                    "joinbottom": this.imgUrl + "/joinbottom.gif",
                    "join": this.imgUrl + "/join.gif",
                    "folderopen": this.imgUrl + "/folderopen.gif",
                    "page": this.imgUrl + "/page.gif",
                    "folder": this.imgUrl + "/folder.gif",
                    "empty": this.imgUrl + "/empty.gif",
                    "line": this.imgUrl + "/line.gif"
                }
            },
            render: function () {
                this.$el.html(this.template({ data: this.model.toJSON(),
                    labelTemplate: this.labelTemplate,
                    editorTemplate: this.editorTemplate,
                    img: this.imgs()}
                ));

                this.txtNodeID = this.$("#txtNodeID_" + this.model.get("nodeid"));
                this.txtNodeName = this.$("#txtNodeName_" + this.model.get("nodeid"));

                this.$el.attr("id", this.model.get("nodeid"));

                this.$el.attr("style", this.model.get("visible") ? "display:block" : "display:none");

                this.$el.addClass(this.options.spanclass);

                return this;
            },
            initialize: function(options){
                this.model.bind('change:expand', this.render, this);
                this.model.bind('change:visible', this.render, this);
                this.model.bind('change:nodename', this.render, this);
                this.model.bind('change:checked', this.render, this);
                this.model.bind('change:selected', this.render, this);
                this.model.bind('change:editable', this.render, this);
                this.model.bind('destroy', this.deleteMySelf, this);

                this.vent = options.vent;

                this.vent.bind("refresh", this.refresh, this);

                if(options.labelTemplate){
                    this.labelTemplate = options.labelTemplate;
                }

                this.imgUrl = options.imgUrl;
            },
            deleteMySelf: function(){
                //this.undelegateEvents();
                //$(this.el).removeData().unbind();

                //this.remove();
                //Backbone.View.prototype.remove.call(this);
            },
            edit: function(ev){
                this.vent.trigger("editingnode");
            },
            addSubNode: function(ev){
                //var newNode = new QuantumCode.MPTTANode();
                //this.model.get("tree").addNode(newNode, this.model);
                this.vent.trigger("addingnode");
            },
            buttonCommand: function(ev){
                var commandType = $(ev.target).data("type");
                switch(commandType){
                    case "OK":
                        if('' == this.model.get("nodeid")){
                            this.model.set({"nodeid":this.txtNodeID.val(), "nodename":this.txtNodeName.val()});
                        }
                        else{
                            this.model.set({"nodename":this.txtNodeName.val()});
                        }
                        this.$el.removeClass("nodeediting");
                        break;
                    case "CANCEL":
                        this.$el.removeClass("nodeediting");
                        break;
                }
            },
            SelectAll: function(selected){
                this.model.get("tree").each(function(item){
                    item.set({"selected":selected});
                });
            },
            selectNode:function(ev){
                var isSelected = this.model.get("selected");
                this.SelectAll(false);
                if(isSelected)
                {
                    this.model.set({ "selected": false });
                    this.vent.trigger("nodeselected", "");
                }
                else{
                    this.model.set({ "selected": true });
                    this.vent.trigger("nodeselected", this.model.get("nodeid"));
                }
            },
            toggleClick: function(ev){
                if(this.model.get("expand")){
                    this.toggleNodes(this.model, false);
                }
                else{
                    this.toggleNodes(this.model, true);
                }
            },
            toggleNodes: function(item, expand){
                item.set({"expand":expand});
                if(item.hasChild()){
                    var context = this;
                    item.childs().each(function(subItem){
                        context.toggleChilds(subItem, expand);
                    });
                }
            },
            toggleChilds: function(item, visible){
                if(visible){
                    if(item.parent().get("expand")){
                        item.set({"visible":visible});
                        if(item.hasChild()){
                            var context = this;
                            item.childs().each(function(subItem){
                                context.toggleChilds(subItem, visible);
                            });
                        }
                    }
                }
                else{
                    item.set({"visible":visible});
                    if(item.hasChild()){
                        var context = this;
                        item.childs().each(function(subItem){
                            context.toggleChilds(subItem, visible);
                        });
                    }
                }
            },
            checkedChanged: function(ev){
                this.model.set({"checked": $(ev.target).attr("checked")});
                var context = $(ev.target);
                this.model.allChilds().each(function(item){
                    item.set({"checked":context.attr("checked")});
                });
            },
            refresh: function(nodeid){
                if(null != nodeid){
                    if(nodeid == this.model.get("nodeid")){
                        this.render();
                    }
                }
            },
            moveNode: function (ev) {
                var moveType = $(ev.target).data("type");
                switch (moveType) {
                    case "up":
                        if (this.model.isFirst()) {
                            var parent = this.model.parent();
                            var pparent = null;
                            if (parent.isRoot()) {
                                pparent = parent;
                            }
                            else {
                                pparent = parent.parent();
                            }

                            try {
                                this.model.get("tree").moveNode(this.model, pparent);
                                this.vent.trigger("refreshtree");
                            }
                            catch (err) {
                                alert(err);
                            }
                        }
                        else {
                            try {
                                this.model.get("tree").moveNodePrev(this.model);
                                this.vent.trigger("refreshtree");
                            }
                            catch (err) {
                                alert(err);
                            }
                        }
                        break;
                    case "down":
                        if (this.model.isLast()) {
                            var parent = this.model.parent();
                            var pparent = null;
                            if (parent.isRoot()) {
                                pparent = parent;
                            }
                            else {
                                pparent = parent.parent();
                            }

                            try {
                                this.model.get("tree").moveNode(this.model, pparent);
                                this.vent.trigger("refreshtree");
                            }
                            catch (err) {
                                alert(err.message);
                            }
                        }
                        else {
                            try {
                                this.model.get("tree").moveNodeNext(this.model);
                                this.vent.trigger("refreshtree");
                            }
                            catch (err) {
                                alert(err.message);
                            }
                        }
                        break;
                    case "upin":
                        var siblineNode = this.model.get("tree").getPrevNode(this.model);
                        try {
                            this.model.get("tree").moveNode(this.model, siblineNode);
                            this.vent.trigger("refreshtree");
                        }
                        catch (err) {
                            alert(err.message);
                        }
                        break;
                    case "downin":
                        var siblineNode = this.model.get("tree").getNextNode(this.model);
                        try {
                            this.model.get("tree").moveNode(this.model, siblineNode);
                            this.vent.trigger("refreshtree");
                        }
                        catch (err) {
                            alert(err.message);
                        }
                        break;
                }
            }
        });

        return MPTTATreeNodeView;
    }
);