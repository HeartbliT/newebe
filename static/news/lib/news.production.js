(function(){var ConfirmationDialog,InfoDialog,LoadingIndicator,MicroPost,MicroPostCollection,MicroPostRow,NewsView,confirmationDialog,loadingIndicator,newsApp,updater,__hasProp=Object.prototype.hasOwnProperty,__extends=function(a,b){function d(){this.constructor=a}for(var c in b)__hasProp.call(b,c)&&(a[c]=b[c]);d.prototype=b.prototype,a.prototype=new d,a.__super__=b.prototype;return a};InfoDialog=function(){function a(){var a;a=document.createElement("div"),a.id="info-dialog",a.className="dialog",a.innerHTML="Test",$("body").prepend(a),this.element=$("#info-dialog"),this.element.hide()}a.prototype.display=function(a){this.element.empty(),this.element.append(a),this.element.show();return this.element.fadeOut(4e3)};return a}(),ConfirmationDialog=function(){function a(a){var b;b=document.createElement("div"),b.id="confirmation-dialog",b.className="dialog",b.innerHTML='<div id="confirmation-text"></div>',b.innerHTML+='<div id="confirmation-buttons"><span href="" id="confirmation-yes">Yes</span><span href="" id="confirmation-no">No</span></div>',$("body").prepend(b),this.element=$("#confirmation-dialog"),this.element.hide(),this.setNoButton()}a.prototype.setNoButton=function(){var a;a=this.element;return $("#confirmation-no").click(function(){a.fadeOut();return!1})},a.prototype.display=function(a,b){$("#confirmation-text").empty(),$("#confirmation-text").append("<span>"+a+"</span>"),$("#confirmation-yes").click(b);return this.element.show()},a.prototype.hide=function(){return this.element.fadeOut()};return a}(),LoadingIndicator=function(){function a(){var a;a=document.createElement("div"),a.id="loading-indicator",a.innerHTML='<img src="/static/images/clock_32.png" />',$("body").prepend(a),this.element=$("#loading-indicator"),this.element.hide()}a.prototype.display=function(){return this.element.show()},a.prototype.hide=function(){return this.element.hide()};return a}(),MicroPost=function(){function a(b){var c,d,e,f,g;a.__super__.constructor.apply(this,arguments),this.set("author",b.author),this.set("authorKey",b.authorKey),this.set("micropostId",b._id),this.set("content",b.content),this.id=b._id,c=b.content.replace(/<(?:.|\s)*?>/g,""),d=new Showdown.converter,e=d.makeHtml(c),this.set("contentHtml",e),this.attributes.contentHtml=e,b.date&&(f=Date.parseExact(b.date,"yyyy-MM-ddTHH:mm:ssZ"),g=f.toString("yyyy-MM-dd-HH-mm-ss/"),this.attributes.urlDate=g)}__extends(a,Backbone.Model),a.prototype.url="/news/microposts/",a.prototype.getDisplayDate=function(){return this.attributes.displayDate},a.prototype.setDisplayDate=function(){var a;a=this.attributes.date;return this.setDisplayDateFromDbDate(a)},a.prototype.setDisplayDateFromDbDate=function(a){var b,c;b=Date.parseExact(a,"yyyy-MM-ddTHH:mm:ssZ"),c=b.toString("dd MMM yyyy, HH:mm"),this.attributes.displayDate=c;return b},a.prototype.getUrlDate=function(){return this.attributes.urlDate},a.prototype.getAuthor=function(){return this.get("author")},a.prototype.getAuthorKey=function(){return this.get("authorKey")},a.prototype.getDate=function(){return this.get("date")},a.prototype.getContent=function(){return this.get("content")},a.prototype["delete"]=function(){this.url="/news/micropost/"+this.id+"/",this.destroy();return this.view.remove()},a.prototype.isNew=function(){return!this.getAuthor()};return a}(),MicroPostCollection=function(){function a(){a.__super__.constructor.apply(this,arguments)}__extends(a,Backbone.Collection),a.prototype.model=MicroPost,a.prototype.url="/news/microposts/all/",a.prototype.comparator=function(a){return a.getDate()},a.prototype.parse=function(a){return a.rows};return a}(),MicroPostRow=function(){function a(b){this.model=b,a.__super__.constructor.apply(this,arguments),this.id=this.model.id,this.model.view=this}__extends(a,Backbone.View),a.prototype.tagName="div",a.prototype.className="news-micropost-row",a.prototype.template=_.template('<a class="news-micropost-delete">X</a>\n<a href="#" class="news-micropost-author"><%= author %></a>\n<%= contentHtml %>\n<p class="news-micropost-date">\n <%= displayDate %>     \n</p>'),a.prototype.events={"click .news-micropost-delete":"onDeleteClicked",mouseover:"onMouseOver",mouseout:"onMouseOut","click .news-micropost-author":"onAuthorClicked"},a.prototype.onMouseOver=function(){return this.$(".news-micropost-delete").show()},a.prototype.onMouseOut=function(){return this.$(".news-micropost-delete").hide()},a.prototype.onDeleteClicked=function(){var a;a=this.model;return confirmationDialog.display("Are you sure you want to delete this post ?",function(){confirmationDialog.hide();return a["delete"]()})},a.prototype.onAuthorClicked=function(a){$.get("/contacts/render/"+this.model.getAuthorKey()+"/",function(a){return $("#news-preview").html(a)}),a.preventDefault();return!1},a.prototype.remove=function(){return $(this.el).remove()},a.prototype.render=function(){this.model.getDisplayDate()||this.model.setDisplayDate(),$(this.el).html(this.template(this.model.toJSON())),this.$(".news-micropost-delete").button(),this.$(".news-micropost-delete").hide();return this.el};return a}(),NewsView=function(){function a(){a.__super__.constructor.apply(this,arguments)}__extends(a,Backbone.View),a.prototype.el=$("#news"),a.prototype.isCtrl=!1,a.prototype.events={"click #news-post-button":"onPostClicked","submit #news-post-button":"onPostClicked","click #news-my-button":"onMineClicked","click #news-all-button":"onAllClicked","click #news-more":"onMoreNewsClicked"},a.prototype.initialize=function(){_.bindAll(this,"postNewPost","appendOne","prependOne","addAll"),_.bindAll(this,"displayMyNews","onMoreNewsClicked","addAllMore"),_.bindAll(this,"onDatePicked"),this.tutorialOn=!0,this.microposts=new MicroPostCollection,this.microposts.bind("add",this.prependOne),this.microposts.bind("refresh",this.addAll),this.moreMicroposts=new MicroPostCollection,this.moreMicroposts.bind("refresh",this.addAllMore);return this.currentPath="/news/microposts/all/"},a.prototype.onKeyUp=function(a){a.keyCode===17&&(this.isCtrl=!1);return a},a.prototype.onKeyDown=function(a){a.keyCode===17&&(this.isCtrl=!0),a.keyCode===13&&this.isCtrl&&(this.isCtrl=!1,this.postNewPost());return a},a.prototype.onPostClicked=function(a){a.preventDefault(),this.postNewPost();return a},a.prototype.onMineClicked=function(a){$("#news-my-button").button("disable"),$("#news-all-button").button("enable"),this.clearNews(null),$("#news-from-datepicker").val(null),this.currentPath="/news/microposts/mine/",this.reloadMicroPosts(null);return a},a.prototype.onAllClicked=function(a){$("#news-all-button").button("disable"),$("#news-my-button").button("enable"),this.clearNews(null),$("#news-from-datepicker").val(null),this.currentPath="/news/microposts/all/",this.reloadMicroPosts(null);return a},a.prototype.onDatePicked=function(a,b){var c,d;c=Date.parse(a),d=c.toString("yyyy-MM-dd"),this.clearNews();return this.reloadMicroPosts(d)},a.prototype.clearNews=function(){$("#micro-posts").empty();return $("#news-more").show()},a.prototype.addAllMore=function(){var a;a=this.moreMicroposts.toArray().reverse(),a=_.rest(a),_.each(a,this.appendOne),this.lastDate=this.moreMicroposts.last().getUrlDate(),a.length<10&&$("#news-more").hide(),loadingIndicator.hide();return this.lastDate},a.prototype.addAll=function(){this.microposts.length>0?(this.tutorialOn=!1,this.lastDate=this.microposts.first().getUrlDate(),this.microposts.length<10&&$("#news-more").hide()):(this.tutorialOn?this.displayTutorial(1):$("#tutorial").html(null),$("#news-more").hide()),this.microposts.each(this.prependOne),loadingIndicator.hide();return this.microposts.length},a.prototype.appendOne=function(a){var b,c;c=new MicroPostRow(a),b=c.render(),$("#micro-posts").append(b);return c},a.prototype.prependOne=function(a){var b,c;c=new MicroPostRow(a),b=c.render(),$("#micro-posts").prepend(b),loadingIndicator.hide(),this.tutorialOn&&(this.displayTutorial(2),this.tutorialOn=!1);return c},a.prototype.displayTutorial=function(a){return $.get("/news/tutorial/"+a+"/",function(a){return $("#tutorial-news").html(a)})},a.prototype.clearPostField=function(){$("#id_content").val(null),$("#id_content").focus();return $("#id_content")},a.prototype.reloadMicroPosts=function(a,b){loadingIndicator.display(),this.microposts.url=this.currentPath,a&&(this.microposts.url=this.currentPath+a+"-23-59-00/"),this.microposts.fetch();return this.microposts},a.prototype.fetch=function(){this.microposts.fetch();return this.microposts},a.prototype.postNewPost=function(){var a,b,c,d;loadingIndicator.display(),a=$("#id_content").val(),b=/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,d=a.match(b),d&&(c=d[0],a=a.replace(b,"["+c+"]"+"("+c+")")),this.microposts.create({content:a},{success:function(a,b){loadingIndicator.hide(),a.view.el.id=b._id;return a.id=b._id}}),$("#id_content").val(null),$("#id_content").focus();return!1},a.prototype.onMoreNewsClicked=function(){loadingIndicator.display(),this.lastDate?this.moreMicroposts.url=this.currentPath+this.lastDate:this.moreMicroposts.url=this.currentPath,this.moreMicroposts.fetch();return this.moreMicroposts},a.prototype.setListeners=function(){$("#id_content").keyup(function(a){return newsApp.onKeyUp(a)}),$("#id_content").keydown(function(a){return newsApp.onKeyDown(a)});return $("input#news-from-datepicker").datepicker({onSelect:this.onDatePicked})},a.prototype.setWidgets=function(){$("input#news-post-button").button(),$("#news-my-button").button(),$("#news-all-button").button(),$("#news-all-button").button("disable"),$("#news-more").button(),$("#news-from-datepicker").val(null);return $("#news-a").addClass("disabled")};return a}(),newsApp=new NewsView,loadingIndicator=new LoadingIndicator,confirmationDialog=new ConfirmationDialog,newsApp.setWidgets(),newsApp.setListeners(),newsApp.clearPostField(),newsApp.fetch(),updater={errorSleepTime:500,cursor:null,poll:function(){return $.ajax({url:"/news/suscribe/",type:"GET",dataType:"text",success:updater.onSuccess,error:updater.onError})},onSuccess:function(response){var micropost;try{response&&(micropost=new MicroPost(eval("("+response+")")),newsApp.prependOne(micropost))}catch(e){updater.onError();return}updater.errorSleepTime=500;return window.setTimeout(updater.poll,0)},onError:function(a){updater.errorSleepTime*=2;return window.setTimeout(updater.poll,updater.errorSleepTime)}},updater.poll()}).call(this)