var esut = require('easy_util');
var dc = require('../config/DbCenter.js');
var prop = require('../config/Prop.js');
var digestUtil = esut.digestUtil;
var log = esut.log;
var pageUtil = esut.pageUtil;
var async = require('async');

var StagePageControl = function(){};

StagePageControl.prototype.handle = function(headNode, bodyNode, cb)
{
    console.log(bodyNode);
    var self = this;
    var cmd = headNode.cmd;
    self[cmd[1]](headNode, bodyNode, cb);
};

StagePageControl.prototype.add = function(headNode, bodyNode, cb)
{
    var self = this;
    var backBodyNode = {title:"add stage"};
    async.waterfall([
        function(cb){
            var leagueTable = dc.main.get("league");
            leagueTable.find({}, {}).toArray(function(err, data){
                backBodyNode.leagues = data;
                cb(err);
            });
        },
        function(cb){
            var seasonTable = dc.main.get("season");
            seasonTable.find({}, {}).sort({id:1}).toArray(function(err, data){
                backBodyNode.seasons = data;
                cb(err);
            });
        }
    ], function (err, result) {
        cb(err, backBodyNode);
    });
};

StagePageControl.prototype.detail = function(headNode, bodyNode, cb)
{
    var self = this;
    var backBodyNode = {title:"detail team info"};
    async.waterfall([
        function(cb){
            var leagueTable = dc.main.get("league");
            leagueTable.find({}, {}).toArray(function(err, data){
                backBodyNode.leagues = data;
                cb(err);
            });
        },
        function(cb){
            var seasonTable = dc.main.get("season");
            seasonTable.find({}, {}).sort({id:1}).toArray(function(err, data){
                backBodyNode.seasons = data;
                cb(err);
            });
        },
        function(cb){
            var stageTable = dc.main.get("stage");
            stageTable.findOne({id:bodyNode.id}, {}, [], function(err, data){
                backBodyNode.stage = data;
                cb(err);
            });
        }
    ], function (err, result) {
        cb(err, backBodyNode);
    });
};

StagePageControl.prototype.list = function(headNode, bodyNode, cb)
{
    var self = this;
    var backBodyNode = {title:"view leagues"};
    if(bodyNode.sort == undefined)
    {
        backBodyNode.sort = {leagueId:1, seasonId:1, code:1};
    }
    pageUtil.parse(bodyNode, backBodyNode);
    var stageTable = dc.main.get("stage");
    var cursor = stageTable.find(backBodyNode.cond, {}, []).sort(backBodyNode.sort).limit(backBodyNode.skip, backBodyNode.limit);
    cursor.toArray(function(err, data){
        backBodyNode.rst = data;
        backBodyNode.count = cursor.count(function(err, count){
            backBodyNode.count = count;
            cb(null, backBodyNode);
        });
    });
};

StagePageControl.prototype.select = function(headNode, bodyNode, cb)
{
    var self = this;
    var backBodyNode = {title:"view leagues"};
    if(bodyNode.sort == undefined)
    {
        backBodyNode.sort = {leagueId:1, seasonId:1, code:1};
    }
    if(bodyNode.limit == undefined)
    {
        backBodyNode.limit = 10;
    }
    pageUtil.parse(bodyNode, backBodyNode);
    backBodyNode.select = bodyNode.select;
    var stageTable = dc.main.get("stage");
    var cursor = stageTable.find(backBodyNode.cond, {}, []).sort(backBodyNode.sort).limit(backBodyNode.skip, backBodyNode.limit);
    cursor.toArray(function(err, data){
        backBodyNode.rst = data;
        backBodyNode.count = cursor.count(function(err, count){
            backBodyNode.count = count;
            cb(null, backBodyNode);
        });
    });
};

module.exports = new StagePageControl();