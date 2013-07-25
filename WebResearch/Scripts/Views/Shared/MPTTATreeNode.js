define(['jquery', 'backbone', 'underscore', 'utils', 'bootstrap'],
    function ($, Backbone, _, utils) {
        var MPTTATreeNodeView = Backbone.View.extend({
            imgUrl: '',
            checkable: false,
            vent: null,
            template: _.template([
                "<% if(data.visible) { %>",
                    "<% if(data.selected) {%>",
                        "<div class='nodeselect' id='inner<%= getPropValue(data, valueField) %>'>",
                    "<% } else { %>",
                        "<div class='node' id='inner<%= getPropValue(data, valueField) %>'>",
                    "<% } %>",
                "<% } else { %>",
                    "<div style='display:none' id='inner<%= getPropValue(data, valueField) %>'>",
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
                                    "<img id='toggle<%= getPropValue(data, valueField) %>' class='btntoggle' src='<%= img.minusbottom %>' />",
                                "<% } else { %>",
                                    "<img id='toggle<%= getPropValue(data, valueField) %>' class='btntoggle' src='<%= img.minus %>' />",
                                "<% } %>",
                            "<% } else { %>",
                                "<% if(data.isLast) { %>",
                                    "<img id='toggle<%= getPropValue(data, valueField) %>' class='btntoggle' src='<%= img.plusbottom %>' />",
                                "<% } else { %>",
                                    "<img id='toggle<%= getPropValue(data, valueField) %>' class='btntoggle' src='<%= img.plus %>' />",
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
                    "<% if(checkable) { %>",
                        "<% if(data.checked) { %>",
                            "<input type='checkbox' checked='true' id='chk<%= getPropValue(data, valueField) %>' />",
                        "<% } else { %>",
                            "<input type='checkbox' id='chk<%= getPropValue(data, valueField) %>' />",
                        "<% } %>",
                    "<% } %>",
                    "<label for='chk<%= getPropValue(data, valueField) %>' title='<%= getPropValue(data, textField) %>'><%= getPropValue(data, textField) %></label>",
                "</div>"
            ].join('')),
            events:{
                "click img.btntoggle": "toggleClick",
                "change :checkbox": "checkedChanged",
                "click img#imgselector": "selectNode"
            },
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
                    img: this.imgs(),
                    checkable: this.checkable,
                    valueField: this.valueField,
                    textField: this.textField,
                    getPropValue: utils.getValueByProperty
                }
                ));

                this.txtNodeID = this.$("#txtNodeID_" + this.model.get("nodeid"));
                this.txtNodeName = this.$("#txtNodeName_" + this.model.get("nodeid"));

                this.$el.attr("id", this.model.get("nodeid"));

                this.$el.attr("style", this.model.get("visible") ? "display:block" : "display:none");

                this.$el.addClass(this.options.spanclass);

                if (this.model.get("moving")) {
                    $("div.nodeselect", this.$el).addClass("nodemoving");
                }

                return this;
            },
            initialize: function(options){
                this.model.bind('change:expand', this.render, this);
                this.model.bind('change:visible', this.render, this);
                this.model.bind('change:nodename', this.render, this);
                this.model.bind('change:checked', this.render, this);
                this.model.bind('change:selected', this.render, this);
                this.model.bind('change:moving', this.render, this);
                this.model.bind('destroy', this.deleteMySelf, this);

                this.vent = options.vent;
                this.checkable = options.checkable;

                this.vent.bind("refresh", this.refresh, this);

                $.extend(this, options);
            },
            deleteMySelf: function(){
                //this.undelegateEvents();
                //$(this.el).removeData().unbind();

                //this.remove();
                //Backbone.View.prototype.remove.call(this);
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
                    this.vent.trigger("nodeselected", null);
                }
                else{
                    this.model.set({ "selected": true });
                    this.vent.trigger("nodeselected", this.model);
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
            checkedChanged: function (ev) {
                this.model.set({ "checked": ev.currentTarget.checked }, { silent: true });
                this.model.allChilds().each(function (item) {
                    item.set({ "checked": ev.currentTarget.checked });
                });
                if (null != this.model.parent()) {
                    this.checkedParent(this.model.parent(), ev.currentTarget.checked);
                }
            },
            checkedParent: function(node, checkState){
                var allChildeCheckedSame = true;
                node.allChilds().each(function (item) {
                    if (item.get("checked") != checkState)
                        allChildeCheckedSame = false;
                });

                if (allChildeCheckedSame) {
                    node.set({ "checked": checkState });
                    if (null != node.parent()) {
                        this.checkedParent(node.parent(), checkState);
                    }
                }
            },
            refresh: function(nodeid){
                if(null != nodeid){
                    if(nodeid == this.model.get("nodeid")){
                        this.render();
                    }
                }
            }
        });

        return MPTTATreeNodeView;
    }
);