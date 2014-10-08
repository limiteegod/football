var esut = require('easy_util');
var pageUtil = esut.pageUtil;
var dc = require('../config/DbCenter.js');
var prop = require('../config/Prop.js');
var digestUtil = esut.digestUtil;
var log = esut.log;

var AdminPageControl = function(){};

AdminPageControl.prototype.handle = function(headNode, bodyNode, cb)
{
    console.log(bodyNode);
    var self = this;
    var cmd = headNode.cmd;
    self[cmd[1]](headNode, bodyNode, cb);
};


AdminPageControl.prototype.login = function(headNode, bodyNode, cb)
{
    var self = this;
    var backBodyNode = {title:"login", tip:"Welcome to login at my website."};
    cb(null, backBodyNode);
};

AdminPageControl.prototype.showUserType = function(headNode, bodyNode, cb)
{
    var self = this;
    var backBodyNode = {title:"show user type"};
    var userTypeTable = db.get("userType");
    userTypeTable.find({}, {name:1}).toArray(function(err,data){
        backBodyNode.rst = data;
        //backBodyNode.data = JSON.parse(digestUtil.check({digestType:'3des-empty'}, null, bodyNode.data));
        cb(null, backBodyNode);
    });
};

AdminPageControl.prototype.selectOperation = function(headNode, bodyNode, cb)
{
    var self = this;
    var backBodyNode = {title:"选择权限"};
    var operationTable = dc.main.get("operation");
    var stepInfo = JSON.parse(digestUtil.check({digestType:'3des-empty'}, null, bodyNode.data));
    backBodyNode.userType = prop.userTypeArray[stepInfo[0].userType.id];
    operationTable.find({}, {name:1, url:1, parentId:1}).toArray(function(err,data){
        backBodyNode.rst = data;
        cb(null, backBodyNode);
    });
};

AdminPageControl.prototype.selectUserType = function(headNode, bodyNode, cb)
{
    var self = this;
    var backBodyNode = {title:"选择用户类型"};
    backBodyNode.rst = prop.userTypeArray;
    if(bodyNode.data)
    {
        var fromData = JSON.parse(digestUtil.check({digestType:'3des-empty'}, null, bodyNode.data));
        if(fromData[0])
        {
            backBodyNode.selectedId = fromData[0].userType.id;
        }
    }
    if(!backBodyNode.selectedId)
    {
        backBodyNode.selectedId = backBodyNode.rst[0].id;
    }
    cb(null, backBodyNode);
};

AdminPageControl.prototype.showOperation = function(headNode, bodyNode, cb)
{
    var self = this;
    var backBodyNode = {title:"show operation"};
    var operationTable = db.get("operation");
    operationTable.find({parentId:{$lt:0}}, {name:1, parentId:1, hasChildren:1}).toArray(function(err,data){
        if(err) cb(err, {});
        backBodyNode.rst = data;
        cb(null, backBodyNode);
    });
};

AdminPageControl.prototype.addOperation = function(headNode, bodyNode, cb)
{
    cb(null, {});
};

AdminPageControl.prototype.addArea = function(headNode, bodyNode, cb)
{
    cb(null, {});
};

/**
 * 地区列表
 * @param headNode
 * @param bodyNode
 * @param cb
 */
AdminPageControl.prototype.listArea = function(headNode, bodyNode, cb)
{
    var self = this;

    var backBodyNode = {title:"view areas"};
    pageUtil.parse(bodyNode, backBodyNode);
    var areaTable = dc.main.get("area");
    var cursor = areaTable.find(backBodyNode.cond, {}).sort(backBodyNode.sort).limit(backBodyNode.skip, backBodyNode.limit);
    cursor.toArray(function(err, data){
        backBodyNode.rst = data;
        backBodyNode.count = cursor.count(function(err, count){
            backBodyNode.count = count;
            cb(null, backBodyNode);
        });
    });
};

/**
 * 权限列表
 * @param headNode
 * @param bodyNode
 * @param cb
 */
AdminPageControl.prototype.listOperation = function(headNode, bodyNode, cb)
{
    var self = this;
    var backBodyNode = {title:"view areas"};
    pageUtil.parse(bodyNode, backBodyNode);
    var operationTable = dc.main.get("operation");
    var cursor = operationTable.find(backBodyNode.cond, {}).sort(backBodyNode.sort).limit(backBodyNode.skip, backBodyNode.limit);
    cursor.toArray(function(err, data){
        for(var key in data)
        {
            var set = data[key];
            set.userType = prop.userTypeArray[set.userType];
        }
        backBodyNode.rst = data;
        backBodyNode.count = cursor.count(function(err, count){
            backBodyNode.count = count;
            cb(null, backBodyNode);
        });
    });
};

AdminPageControl.prototype.setOperation = function(headNode, bodyNode, cb)
{
    var self = this;
    cb(null, {});
};

AdminPageControl.prototype.index = function(headNode, bodyNode, cb)
{
    var self = this;
    cb(null, {});
};

AdminPageControl.prototype.top = function(headNode, bodyNode, cb)
{
    var self = this;
    cb(null, {});
};

AdminPageControl.prototype.left = function(headNode, bodyNode, cb)
{
    var self = this;
    var backBodyNode = {title:"左边页"};
    var operationTable = dc.main.get("operation");
    operationTable.find({userType:prop.userType.ADMIN}, {}).toArray(function(err, data)
    {
        log.info(data);
        if(data)
        {
            backBodyNode.rst = data;
        }
        cb(null, backBodyNode);
    });
};

AdminPageControl.prototype.main = function(headNode, bodyNode, cb)
{
    var self = this;
    cb(null, {});
};

var adminPageControl = new AdminPageControl();
module.exports = adminPageControl;