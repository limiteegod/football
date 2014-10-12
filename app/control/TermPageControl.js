var esut = require('easy_util');
var dc = require('../config/DbCenter.js');
var prop = require('../config/Prop.js');
var game = require('../config/Game.js');
var termStatus = require('../config/TermStatus.js');
var digestUtil = esut.digestUtil;
var log = esut.log;
var pageUtil = esut.pageUtil;
var dateUtil = esut.dateUtil;
var async = require('async');

var TermPageControl = function(){};

TermPageControl.prototype.handle = function(headNode, bodyNode, cb)
{
    console.log(bodyNode);
    var self = this;
    var cmd = headNode.cmd;
    self[cmd[1]](headNode, bodyNode, cb);
};

TermPageControl.prototype.add = function(headNode, bodyNode, cb)
{
    var self = this;
    var backBodyNode = {title:"add term"};
    backBodyNode.games = game.getInfo();
    backBodyNode.termStatus = termStatus.getInfo();
    backBodyNode.curTime = dateUtil.getCurTime();
    cb(null, backBodyNode);
};

TermPageControl.prototype.detail = function(headNode, bodyNode, cb)
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

TermPageControl.prototype.list = function(headNode, bodyNode, cb)
{
    var self = this;
    var backBodyNode = {title:"期次管理"};
    pageUtil.parse(bodyNode, backBodyNode);
    var table = dc.main.get("term");
    var cursor = table.find(backBodyNode.cond, {}, []).sort(backBodyNode.sort).limit(backBodyNode.skip, backBodyNode.limit);
    cursor.dateToString();
    cursor.toArray(function(err, data){
        backBodyNode.rst = data;
        backBodyNode.count = cursor.count(function(err, count){
            backBodyNode.count = count;
            cb(null, backBodyNode);
        });
    });
};

module.exports = new TermPageControl();