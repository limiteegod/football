var async = require('async');
var esut = require('easy_util');
var log = esut.log;

var dao = require('dao');
var dc = dao.dc;

var config = require('config');
var prop = config.prop;

var cons = require('cons');
var userType = cons.userType;

var Helper = function(){};

Helper.prototype.addOperation = function()
{
    async.waterfall([
        function(cb){
            dc.init(function(err){
                cb(err);
            });
        },
        function(cb){
            var operationTable = dc.main.get("operation");
            operationTable.drop(function(err, data){
                cb(null);
            });
        },
        function(cb)
        {
            var operationTable = dc.main.get("operation");
            operationTable.create(function(err, data){
                cb(err);
            });
        },
        function(cb)
        {
            var operationTable = dc.main.get("operation");
            operationTable.save({userType:userType.ADMIN, id:'ADMIN_POPEDOM', name:'权限管理', url:'', hasChildren:1}, [], function(err, data){
                operationTable.save({userType:userType.ADMIN, id:'ADMIN_ADD_OPERATION', parent:'ADMIN_POPEDOM', name:'新增菜单', url:'admin_addOperation.html'}, [], function(err, data){
                });
                operationTable.save({userType:userType.ADMIN, id:'ADMIN_USER_OPERATION', parent:'ADMIN_POPEDOM', name:'用户权限', url:'admin_setOperation.html', hasChildren:0}, [], function(err, data){
                });
                operationTable.save({userType:userType.ADMIN, id:'ADMIN_LIST_OPERATION', parent:'ADMIN_POPEDOM', name:'权限列表', url:'admin_listOperation.html', hasChildren:0}, [], function(err, data){
                });
            });
            operationTable.save({userType:userType.ADMIN, id:'ADMIN_AREA', name:'地区管理', url:'', hasChildren:1}, [], function(err, data){
                operationTable.save({userType:userType.ADMIN, id:'ADMIN_ADD_AREA', parent:'ADMIN_AREA', name:'添加地区', url:'admin_addArea.html', hasChildren:0}, [], function(err, data){
                });
                operationTable.save({userType:userType.ADMIN, id:'ADMIN_LIST_AREA', parent:'ADMIN_AREA', name:'地区列表', url:'admin_listArea.html', hasChildren:0}, [], function(err, data){
                });
            });
            operationTable.save({userType:userType.ADMIN, id:'ADMIN_LEAGUE', name:'联赛管理', url:'', hasChildren:1}, [], function(err, data){
                operationTable.save({userType:userType.ADMIN, id:'ADMIN_LIST_LEAGUE', parent:'ADMIN_LEAGUE', name:'联赛列表', url:'league_list.html', hasChildren:0}, [], function(err, data){
                });
                operationTable.save({userType:userType.ADMIN, id:'ADMIN_LIST_SEASON', parent:'ADMIN_LEAGUE', name:'赛季列表', url:'season_list.html', hasChildren:0}, [], function(err, data){
                });
                operationTable.save({userType:userType.ADMIN, id:'ADMIN_LIST_STAGE', parent:'ADMIN_LEAGUE', name:'阶段列表', url:'stage_list.html', hasChildren:0}, [], function(err, data){
                });
                operationTable.save({userType:userType.ADMIN, id:'ADMIN_LIST_TEAM', parent:'ADMIN_LEAGUE', name:'球队列表', url:'team_list.html', hasChildren:0}, [], function(err, data){
                });
                operationTable.save({userType:userType.ADMIN, id:'ADMIN_LIST_MATCH', parent:'ADMIN_LEAGUE', name:'比赛列表', url:'match_list.html', hasChildren:0}, [], function(err, data){
                });
            });
            operationTable.save({userType:userType.ADMIN, id:'ADMIN_GAME', name:'游戏管理', url:'', hasChildren:1}, [], function(err, data){
                operationTable.save({userType:userType.ADMIN, id:'ADMIN_LIST_GAME', parent:'ADMIN_GAME', name:'游戏列表', url:'game_list.html', hasChildren:0}, [], function(err, data){
                });
                operationTable.save({userType:userType.ADMIN, id:'ADMIN_LIST_TERM', parent:'ADMIN_GAME', name:'期次列表', url:'term_list.html', hasChildren:0}, [], function(err, data){
                });
            });
            cb(null, "success");
        }
    ], function (err, result) {
        log.info(err);
        log.info("end...........");
    });
};

var h = new Helper();
h.addOperation();
