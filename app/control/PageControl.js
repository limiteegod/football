var esut = require('easy_util');
var digestUtil = esut.digestUtil;
var adminPageControl = require("./AdminPageControl.js");
var testPageControl = require("./TestPageControl.js");
var leaguePageControl = require("./LeaguePageControl.js");
var seasonPageControl = require("./SeasonPageControl.js");
var teamPageControl = require("./TeamPageControl.js");
var termPageControl = require("./TermPageControl.js");
var stagePageControl = require("./StagePageControl.js");

var PageControl = function(){};

PageControl.prototype.handle = function(headNode, bodyNode, cb)
{
    console.log(bodyNode);
    var self = this;
    var cmd = headNode.cmd;
    self[cmd[0]](headNode, bodyNode, function(err, backBodyNode){
        backBodyNode.frameId = bodyNode.frameId;
        backBodyNode.parentFrameId = bodyNode.parentFrameId;
        cb(err, backBodyNode);
    });
};


PageControl.prototype.admin = function(headNode, bodyNode, cb)
{
    adminPageControl.handle(headNode, bodyNode, cb);
};

PageControl.prototype.test = function(headNode, bodyNode, cb)
{
    testPageControl.handle(headNode, bodyNode, cb);
};

PageControl.prototype.league = function(headNode, bodyNode, cb)
{
    leaguePageControl.handle(headNode, bodyNode, cb);
};

PageControl.prototype.season = function(headNode, bodyNode, cb)
{
    seasonPageControl.handle(headNode, bodyNode, cb);
};

PageControl.prototype.team = function(headNode, bodyNode, cb)
{
    teamPageControl.handle(headNode, bodyNode, cb);
};

PageControl.prototype.term = function(headNode, bodyNode, cb)
{
    termPageControl.handle(headNode, bodyNode, cb);
};

PageControl.prototype.stage = function(headNode, bodyNode, cb)
{
    stagePageControl.handle(headNode, bodyNode, cb);
};

var pageControl = new PageControl();
module.exports = pageControl;