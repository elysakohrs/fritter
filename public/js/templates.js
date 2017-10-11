(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['header'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"row\">\n  <div class=\"col-sm-3 col-sm-offset-3\">\n  	<h2>Hi, <span id=\"full-name-span\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.fullName : stack1), depth0))
    + "</span>!</h2>\n  </div>\n  <div class=\"col-sm-3\">\n      <button id=\"logout-btn\" type=\"button\" class=\"btn btn-secondary\">Log out</button>\n  </div>\n</div>\n<div class=\"row\">\n  <div class=\"col-sm-6 col-sm-offset-3\">\n  	<div class=\"form-group\">\n  		<textarea class=\"form-control\" rows=\"3\" id=\"new-freet\" placeholder=\"What's happening?\"></textarea>\n  	</div>\n  	<button id=\"freet-button\" type=\"button\" class=\"btn btn-success\">Publish Freet!</button>\n  </div>\n</div>  \n<div class=\"row\">\n  <div class=\"col-sm-6 col-sm-offset-3\">\n    <ul class=\"nav nav-tabs\">\n      <li id=\"all-freets-tab\" role=\"presentation\" class=\"active\"><a id=\"all-freets-btn\" href=\"#\">All Freets</a></li>\n      <li id=\"following-freets-tab\" role=\"presentation\"><a id=\"following-freets-btn\" href=\"#\">Following Freets</a></li>\n      <li id=\"users-tab\" role=\"presentation\"><a id=\"users-btn\" href=\"#\">Users</a></li>\n    </ul>\n  </div>\n</div>";
},"useData":true});
templates['freets'] = template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = container.invokePartial(partials.freet,depth0,{"name":"freet","hash":{"user":(depths[1] != null ? depths[1].user : depths[1])},"data":data,"indent":"  ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.freets : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"usePartial":true,"useData":true,"useDepths":true});
templates['freet'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "	<a class=\"remove-link\" href=\"#\">Remove</a>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "	<a class=\"refreet-link\" href=\"#\">Refreet</a>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression;

  return "	<div class=\"panel panel-default refreet-panel\">\n  		<div class=\"panel-body refreet-panel-body\">		\n	  		<span class=\"username-cell\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.originalFreetAuthor : depth0)) != null ? stack1.fullName : stack1), depth0))
    + "</span> @"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.originalFreetAuthor : depth0)) != null ? stack1.username : stack1), depth0))
    + "</br>\n			"
    + alias2(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"message","hash":{},"data":data}) : helper)))
    + "\n  		</div>\n	</div>\n";
},"7":function(container,depth0,helpers,partials,data) {
    var helper;

  return "	</br>"
    + container.escapeExpression(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"message","hash":{},"data":data}) : helper)))
    + "\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4=container.lambda;

  return "<li val=\""
    + alias3(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"_id","hash":{},"data":data}) : helper)))
    + "\" class=\"list-group-item tweet-li\">\n	<span class=\"username-cell\">"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.author : depth0)) != null ? stack1.fullName : stack1), depth0))
    + "</span> @"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.author : depth0)) != null ? stack1.username : stack1), depth0))
    + "\n	<span class=\"dot-and-time\"> &middot "
    + alias3((helpers.formatRelative || (depth0 && depth0.formatRelative) || alias2).call(alias1,(depth0 != null ? depth0.timestamp : depth0),{"name":"formatRelative","hash":{},"data":data}))
    + "</span>\n"
    + ((stack1 = (helpers.equal || (depth0 && depth0.equal) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.username : stack1),((stack1 = (depth0 != null ? depth0.author : depth0)) != null ? stack1.username : stack1),{"name":"equal","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isRefreet : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + "</li>\n";
},"useData":true});
templates['fritter'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"row\" id=\"welcome-row\"></div>\n\n<div class=\"row\">\n	<div class=\"col-sm-6 col-sm-offset-3\">\n		<div id=\"freet-table\" class=\"panel panel-default\">\n			<ul id=\"freet-table-list-group\" class=\"list-group\">\n			</ul>\n		</div>\n	</div>\n</div>";
},"useData":true});
templates['login'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"row login-row\">\n	<div class=\"col-sm-4 col-sm-offset-4\">\n		<div class=\"panel panel-default\" id=\"login-panel\">\n			<div class=\"panel-heading\">\n				<h3 class=\"panel-title\">Log in to Fritter</h3>\n			</div>\n			<div class=\"panel-body\">\n                <form>\n					<div>\n						<div class=\"login-group\">\n							<div class=\"form-group\">\n								<input type=\"text\" class=\"form-control\" id=\"login-username\" placeholder=\"Username\">\n							</div>\n							<div class=\"form-group\">\n								<input type=\"password\" class=\"form-control\" id=\"login-password\" placeholder=\"Password\">\n							</div>\n						</div>\n						<button id=\"login-submit-btn\" class=\"btn btn-primary\">Log in</button>\n					</div>\n					<div class=\"switch-login-signup\">\n						Don't have an account? <a href=\"#\" id=\"signup-page-btn\">Sign up</a>\n					</div>\n				</form>\n            </div>\n		</div>\n		<div class=\"error-msg\"></div>\n	</div>\n</div>";
},"useData":true});
templates['signup'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"row register-row\">\n	<div class=\"col-sm-4 col-sm-offset-4\">\n		<div class=\"panel panel-default\" id=\"signup-panel\">\n			<div class=\"panel-heading\">\n				<h3 class=\"panel-title\">Join Fritter today</h3>\n			</div>\n			<div class=\"panel-body\">\n                <form>\n					<div class=\"login-form-main-message\"></div>\n					<div class=\"main-login-form\">\n						<div class=\"login-group\">\n							<div class=\"form-group\">\n								<input type=\"text\" class=\"form-control\" id=\"signup-fullname\" placeholder=\"Full Name\">\n							</div>\n							<div class=\"form-group\">\n								<input type=\"text\" class=\"form-control\" id=\"signup-username\" placeholder=\"Username\">\n							</div>\n							<div class=\"form-group\">\n								<input type=\"password\" class=\"form-control\" id=\"signup-password\" placeholder=\"Password\">\n							</div>\n						</div>\n						<button id=\"signup-submit-btn\" class=\"btn btn-primary\">Sign up</button>\n					</div>\n					<div class=\"switch-login-signup\">\n						Already have an account? <a href=\"#\" id=\"login-page-btn\">Log in</a>\n					</div>\n				</form>\n            </div>\n		</div>\n		<div class=\"error-msg\"></div>\n	</div>\n</div>";
},"useData":true});
templates['users'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression, alias2=container.lambda;

  return "		<li val=\""
    + alias1(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"_id","hash":{},"data":data}) : helper)))
    + "\" class=\"list-group-item\">\n			<span class=\"username-cell\">"
    + alias1(alias2((depth0 != null ? depth0.fullName : depth0), depth0))
    + "</span> @"
    + alias1(alias2((depth0 != null ? depth0.username : depth0), depth0))
    + "\n		</li>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression, alias2=container.lambda;

  return "		<li val=\""
    + alias1(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"_id","hash":{},"data":data}) : helper)))
    + "\" class=\"list-group-item\">\n			<span class=\"username-cell\">"
    + alias1(alias2((depth0 != null ? depth0.fullName : depth0), depth0))
    + "</span> @"
    + alias1(alias2((depth0 != null ? depth0.username : depth0), depth0))
    + "		\n			<button type=\"button\" class=\"follow-btn btn btn-success\">Follow</button>\n		</li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<li class=\"list-group-item following-users-li\">\n	Following Users\n	<ul id=\"following-list-group\" class=\"list-group\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.following : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "	</ul>\n</li>\n\n<li class=\"list-group-item non-following-users-li\">\n	Non-Following Users\n	<ul id=\"non-following-list-group\" class=\"list-group\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.nonFollowing : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "	</ul>\n</li>\n\n";
},"useData":true});
})();