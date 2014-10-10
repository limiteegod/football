var async = require('async');
var esut = require('easy_util');
var log = esut.log;
var digestUtil = esut.digestUtil;
var pageUtil = esut.pageUtil;
var dc = require('../config/DbCenter.js');
var ec = require('../config/ErrCode.js');
var prop = require('../config/Prop.js');
var digestService = require('../service/DigestService.js');

var AdminControl = function(){
    var self = this;
    self.cmd = {'AD01':0, 'AD02':1, 'AD03':2, 'AD04':3, 'AD05':4, 'AD06':5,
    'AD07':6};
    self.cmdArray = [{id:0, code:'AD01', fromType:prop.digestFromType.CACHE, des:"权限查询"},
        {id:1, code:'AD02', fromType:prop.digestFromType.CACHE, des:'添加地域'},
        {id:2, code:'AD03', fromType:prop.digestFromType.CACHE, des:'添加联赛'},
        {id:3, code:'AD04', fromType:prop.digestFromType.CACHE, des:'修改联赛'},
        {id:4, code:'AD05', fromType:prop.digestFromType.CACHE, des:'删除赛季'},
        {id:5, code:'AD06', fromType:prop.digestFromType.CACHE, des:'添加赛季'},
        {id:6, code:'AD07', fromType:prop.digestFromType.CACHE, des:'添加球队'}];
};

AdminControl.prototype.handle = function(headNode, bodyStr, userCb)
{
    var self = this;
    async.waterfall([
        //是否是支持的cmd
        function(cb)
        {
            var cmd = self.cmd[headNode.cmd];
            if(cmd == undefined)
            {
                cb(ec.E9000);
            }
            else
            {
                cb(null);
            }
        },
        //校验头的用户类型是否合法
        function(cb)
        {
            var userTypeId = prop.userType[headNode.userType];
            if(userTypeId == undefined)
            {
                cb(ec.E9005);
            }
            else
            {
                cb(null);
            }
        },
        //获得密钥
        function(cb)
        {
            var cmd = self.cmdArray[self.cmd[headNode.cmd]];
            digestService.getKey({fromType:cmd.fromType, userId:headNode.userId}, function(err, key){
                headNode.key = key;
                cb(err, key);
            });
        },
        //先解密
        function(key, cb)
        {
            log.info(key);
            var decodedBodyStr = digestUtil.check(headNode, key, bodyStr);
            try {
                var bodyNode = JSON.parse(decodedBodyStr);
                cb(null, bodyNode);
            }
            catch (err)
            {
                cb(ec.E9003);
            }
        },
        //check the param
        function(bodyNode, cb){
            var method = 'check' + headNode.cmd;
            self[method](null, headNode, bodyNode, function(err){
                cb(err, bodyNode);
            });
        },
        //业务处理
        function(bodyNode, cb){
            var cmd = 'handle' + headNode.cmd;
            self[cmd](null, headNode, bodyNode, cb);
        }
    ], function (err, bodyNode) {
        userCb(err, bodyNode);
    });
};


AdminControl.prototype.checkAD01 = function(user, headNode, bodyNode, cb)
{
    cb(null);
};

AdminControl.prototype.checkAD02 = function(user, headNode, bodyNode, cb)
{
    cb(null);
};

AdminControl.prototype.checkAD03 = function(user, headNode, bodyNode, cb)
{
    cb(null);
};

AdminControl.prototype.checkAD04 = function(user, headNode, bodyNode, cb)
{
    cb(null);
};

AdminControl.prototype.checkAD05 = function(user, headNode, bodyNode, cb)
{
    cb(null);
};

AdminControl.prototype.checkAD06 = function(user, headNode, bodyNode, cb)
{
    cb(null);
};

AdminControl.prototype.checkAD07 = function(user, headNode, bodyNode, cb)
{
    cb(null);
};


/**
 * find one's all operations
 * @param user
 * @param headNode
 * @param bodyNode
 * @param cb
 */
AdminControl.prototype.handleAD01 = function(user, headNode, bodyNode, cb)
{
    var backBodyNode = {};
    var cond = bodyNode.cond;
    if(cond == undefined)
    {
        cond = {};
    }
    var operationTable = dc.main.get("operation");
    operationTable.find(cond, {}).toArray(function(err, data){
        if(data)
        {
            backBodyNode.rst = data;
        }
        cb(null, backBodyNode);
    });
};

/**
 * save area
 * @param user
 * @param headNode
 * @param bodyNode
 * @param cb
 */
AdminControl.prototype.handleAD02 = function(user, headNode, bodyNode, cb)
{
    var backBodyNode = {};
    var areaTable = dc.main.get("area");
    areaTable.save(bodyNode.area, [], function(err, data){
        if(err)
        {
            cb(ec.E9999);
        }
        else
        {
            cb(err, backBodyNode);
        }
    });
};

/**
 * save area
 * @param user
 * @param headNode
 * @param bodyNode
 * @param cb
 */
AdminControl.prototype.handleAD03 = function(user, headNode, bodyNode, cb)
{
    var backBodyNode = {};
    var leagueTable = dc.main.get("league");
    leagueTable.save(bodyNode.league, [], function(err, data){
        if(err)
        {
            cb(ec.E9999);
        }
        else
        {
            cb(err, backBodyNode);
        }
    });
};

/**
 * @param user
 * @param headNode
 * @param bodyNode
 * @param cb
 */
AdminControl.prototype.handleAD04 = function(user, headNode, bodyNode, cb)
{
    var backBodyNode = {};
    var leagueTable = dc.main.get("league");
    leagueTable.update(bodyNode.cond, bodyNode.data, [], function(err, data){
        cb(null, backBodyNode);
    });
};

/**
 * @param user
 * @param headNode
 * @param bodyNode
 * @param cb
 */
AdminControl.prototype.handleAD05 = function(user, headNode, bodyNode, cb)
{
    var backBodyNode = {};
    var seasonTable = dc.main.get("season");
    seasonTable.remove({id:bodyNode.id}, [], function(err, data){
        cb(err, backBodyNode);
    });
};

/**
 * 添加赛季
 * @param user
 * @param headNode
 * @param bodyNode
 * @param cb
 */
AdminControl.prototype.handleAD06 = function(user, headNode, bodyNode, cb)
{
    var backBodyNode = {};
    var seasonTable = dc.main.get("season");
    seasonTable.save(bodyNode.season, [], function(err, data){
        cb(err, backBodyNode);
    });
};

/**
 * 添加球队
 * @param user
 * @param headNode
 * @param bodyNode
 * @param cb
 */
AdminControl.prototype.handleAD07 = function(user, headNode, bodyNode, cb)
{
    var backBodyNode = {};
    var teamTable = dc.main.get("team");
    teamTable.save(bodyNode.team, [], function(err, data){
        cb(err, backBodyNode);
    });
};

var adminControl = new AdminControl();
module.exports = adminControl;