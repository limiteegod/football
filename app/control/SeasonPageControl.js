var esut = require('easy_util');
var dc = require('../config/DbCenter.js');
var prop = require('../config/Prop.js');
var digestUtil = esut.digestUtil;
var log = esut.log;
var pageUtil = esut.pageUtil;
var async = require('async');

var SeasonPageControl = function(){};

SeasonPageControl.prototype.handle = function(headNode, bodyNode, cb)
{
    console.log(bodyNode);
    var self = this;
    var cmd = headNode.cmd;
    self[cmd[1]](headNode, bodyNode, cb);
};

SeasonPageControl.prototype.add = function(headNode, bodyNode, cb)
{
    var self = this;
    var backBodyNode = {title:"add season"};
    cb(null, backBodyNode);
};

SeasonPageControl.prototype.detail = function(headNode, bodyNode, cb)
{
    var self = this;
    var backBodyNode = {title:"detail season info"};
    async.waterfall([
        function(cb){
            var seasonTable = dc.main.get("season");
            seasonTable.findOne({id:bodyNode.id}, {}, [], function(err, data){
                backBodyNode.season = data;
                cb(err);
            });
        }
    ], function (err, result) {
        cb(err, backBodyNode);
    });
};

SeasonPageControl.prototype.list = function(headNode, bodyNode, cb)
{
    var self = this;
    var backBodyNode = {title:"view leagues"};
    pageUtil.parse(bodyNode, backBodyNode);
    var seasonTable = dc.main.get("season");
    var cursor = seasonTable.find(backBodyNode.cond, {}, []).sort(backBodyNode.sort).limit(backBodyNode.skip, backBodyNode.limit);
    cursor.toArray(function(err, data){
        backBodyNode.rst = data;
        backBodyNode.count = cursor.count(function(err, count){
            backBodyNode.count = count;
            cb(null, backBodyNode);
        });
    });
};

module.exports = new SeasonPageControl();