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

Helper.prototype.clear = function()
{
    async.waterfall([
        function(cb){
            dc.init(function(err){
                cb(err);
            });
        },
        function(cb){
            var table = dc.main.get("jmatch");
            table.drop(function(err, data){
                cb(null);
            });
        },
        function(cb)
        {
            var table = dc.main.get("jmatch");
            table.create(function(err, data){
                cb(err);
            });
        },
        function(cb)
        {
            cb(null, "success");
        }
    ], function (err, result) {
        log.info(err);
        log.info("end...........");
    });
};

var h = new Helper();
h.clear();
