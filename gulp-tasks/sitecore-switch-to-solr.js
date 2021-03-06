/*jslint node: true */
"use strict";

var gulp = require("gulp");
var build = require("../build.js");
var config = build.config;
var powershell = require("../modules/powershell");
var path = require("path");
var fs = require("fs")
var nopt = require("nopt");

var args = nopt({
  "env"     : [String, null]
});

build.setEnvironment(args.env);

gulp.task("sitecore-switch-to-solr", function (callback) { 
  // Can be done with gulp-run? https://www.npmjs.com/package/gulp-run
  var taskDir = path.dirname(fs.realpathSync(__filename));
  build.logEvent("builder", "Switching Sitecore instance on  " + config.websiteRoot + " to use Solr");
  var psFile = path.join(taskDir, "../powershell-scripts/configure-sitecore-solr.ps1");
  var websiteRoot = config.websiteRoot;
  if(!path.isAbsolute(config.websiteRoot))
    websiteRoot = path.join(process.cwd(),config.websiteRoot);

  var sitecoreVersion = "8.2.161221"
  if (build.sitecoreVersion )
	  sitecoreVersion = build.sitecoreVersion

  powershell.runSync(psFile, " -webRootPath " + websiteRoot + " -solrExtractLocation " + config.solrExtractLocation + " -sitecoreVersion " + sitecoreVersion, path.join(taskDir, "../powershell-scripts"), callback);
  
  build.logEvent("builder", "Sitecore switch to solr completed successfully, don't forget to rebuild indexes in Sitecores control panel");
  callback();
});
