var async = require('async');
var db = require('./app/config/Database.js');
var operationTable = db.get("operation");
var userTypeTable = db.get("userType");
var userOperation = db.get("userOperation");

var InitDatabase = function(){};

InitDatabase.prototype.saveUserType = function(data, outerCb){
    var rstArray = new Array();
    async.each(data, function(row, callback) {
        userTypeTable.save(row, function(rows, data){
            rstArray[data.code] = rows.insertId;
            callback();
        });
    }, function(err){
        if( err ) {
            console.log('A file failed to process');
        } else {
            outerCb(rstArray);
        }
    });
};

InitDatabase.prototype.saveOneOperation = function(data, cb)
{
    operationTable.save(data, function(rows){
        cb({"code":data["code"], "_id":rows.insertId});
        var children = data["children"];
        for(var key in children)
        {
            var child = children[key];
            child["parentId"] = rows.insertId;
            var childFunc = function(child){
                operationTable.save(child, function(rows){
                    cb({"code":child["code"], "_id":rows.insertId});
                });
            };
            childFunc(child);
        }
    });
};

InitDatabase.prototype.saveOperation = function(data, cb){
    var self = this;
    var count = 0;
    for(var key in data)
    {
        count++;
        count += data[key]["children"].length;
    }
    var finishedCount = 0;
    var backData = new Array();
    var scb = function(data){
        finishedCount++;
        backData[data.code] = data._id;
        if(finishedCount >= count)
        {
            cb(backData);
        }
    };
    for(var key in data)
    {
        self.saveOneOperation(data[key], scb);
    }
};

var init = new InitDatabase();

async.waterfall([
    //重新创建表结构
    function(cb){
        db.create(function(){
            cb(null);
        });
    },
    //保存可用操作
    function(cb) {
        var operationData = [
            {"name":"权限管理", "code":"manOp",
                "children":[
                    {"name":"添加项目", "code":"addOperation", "url":""},
                    {"name":"角色权限", "code":"userOperation", "url":""}
                ]
            },
            {"name":"期次管理", "code":"manTerm",
                "children":[
                    {"name":"在售期次", "code":"termOnSale", "url":""},
                    {"name":"期次详情", "code":"termDetail", "url":""}
                ]
            }
        ];
        init.saveOperation(operationData, function(data){
            cb(null, data);
        });
    },
    //保存用户类型
    function(opdata, cb) {
        var userTypeList = [{"name":"游客", "code":"guest"}, {"name":"用户", "code":"user"}, {"name":"管理员", "code":"manager"}];
        init.saveUserType(userTypeList, function(data){
            cb(null, opdata, data);
        });
    },
    //保存用户可用操作
    function(opdata, typedata, cb) {
        console.log(opdata);
        console.log(typedata);
        var userTypeId = typedata['manager'];
        for(var key in opdata)
        {
            var operationId = opdata[key];
            userOperation.save({"userTypeId":userTypeId, "operationId":operationId});
        }
        cb(null, typedata);
    },
    //保存用户
    function(typedata, cb){
        var userTable = db.get("user");
        userTable.save({"name":"admin", "password":"123456", "typeId":typedata["manager"]});
        userTable.save({"name":"liming", "password":"123456", "typeId":typedata["user"]});
        cb(null, typedata);
    },
    //系统可用的cmd码
    function(typedata, cb)
    {
        var cmdTable = db.get("cmd");
        cmdTable.save({"code":"A01", "des":"用户登录"});
        cmdTable.save({"code":"A02", "des":"用户查询"});
        cmdTable.save({"code":"admin/login", des:"manager login page"});
        cb(null, typedata);
    },
    //角色可用cmd码对应表
    function(typedata, cb)
    {
        var userCmdTable = db.get("userCmd");
        userCmdTable.save({"cmdCode":"A01", "userTypeId":typedata["manager"]});
        userCmdTable.save({"cmdCode":"A02", "userTypeId":typedata["manager"]});
        cb(null);
    }
], function (err, result) {
    console.log('err: ', err); // -> null
    console.log('result: ', result); // -> 16
});


