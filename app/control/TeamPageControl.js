var esut = require('easy_util');
var dc = require('../config/DbCenter.js');
var prop = require('../config/Prop.js');
var digestUtil = esut.digestUtil;
var log = esut.log;
var pageUtil = esut.pageUtil;
var async = require('async');

var TeamPageControl = function(){};

TeamPageControl.prototype.handle = function(headNode, bodyNode, cb)
{
    console.log(bodyNode);
    var self = this;
    var cmd = headNode.cmd;
    self[cmd[1]](headNode, bodyNode, cb);
};

TeamPageControl.prototype.add = function(headNode, bodyNode, cb)
{
    var self = this;
    var backBodyNode = {title:"add team"};
    var areaTable = dc.main.get("area");
    areaTable.find({}, {}).toArray(function(err, data){
        backBodyNode.rst = data;
        cb(null, backBodyNode);
    });
};

TeamPageControl.prototype.detail = function(headNode, bodyNode, cb)
{
    var self = this;
    var backBodyNode = {title:"detail team info"};
    async.waterfall([
        function(cb){
            var areaTable = dc.main.get("area");
            areaTable.find({}, {}).toArray(function(err, data){
                backBodyNode.rst = data;
                cb(err);
            });
        },
        function(cb){
            var teamTable = dc.main.get("team");
            teamTable.findOne({id:bodyNode.id}, {}, [], function(err, data){
                backBodyNode.team = data;
                cb(err);
            });
        }
    ], function (err, result) {
        cb(err, backBodyNode);
    });
};

TeamPageControl.prototype.list = function(headNode, bodyNode, cb)
{
    var self = this;
    var backBodyNode = {title:"view leagues"};
    pageUtil.parse(bodyNode, backBodyNode);
    var teamTable = dc.main.get("team");
    var cursor = teamTable.find(backBodyNode.cond, {}, []).sort(backBodyNode.sort).limit(backBodyNode.skip, backBodyNode.limit);
    cursor.toArray(function(err, data){
        backBodyNode.rst = data;
        backBodyNode.count = cursor.count(function(err, count){
            backBodyNode.count = count;
            cb(null, backBodyNode);
        });
    });
};

TeamPageControl.prototype.select = function(headNode, bodyNode, cb)
{
    var self = this;
    var backBodyNode = {title:"选择球队"};
    pageUtil.parse(bodyNode, backBodyNode);
    backBodyNode.select = bodyNode.select;
    var teamTable = dc.main.get("team");
    var cursor = teamTable.find(backBodyNode.cond, {}, []).sort(backBodyNode.sort).limit(backBodyNode.skip, backBodyNode.limit);
    cursor.toArray(function(err, data){
        backBodyNode.rst = data;
        backBodyNode.count = cursor.count(function(err, count){
            backBodyNode.count = count;
            cb(null, backBodyNode);
        });
    });
};

module.exports = new TeamPageControl();