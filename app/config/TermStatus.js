var TermStatus = function(){
    var self = this;
    self.info = [
        {id:1000, code:'INIT', des:'初始状态'},
        {id:1100, code:'NOT_ON_SALE', des:'未开售'},
        {id:1200, code:'ON_SALE', des:'销售中'},
        {id:1300, code:'STOP', des:'销售暂停'},
        {id:1400, code:'CLOSE', des:'已停售'}
    ];
    self.init();
};

TermStatus.prototype.init = function()
{
    var self = this;
    for(var key in self.info)
    {
        var set = self.info[key];
        self.info[set.code] = set;
    };
};

TermStatus.prototype.getInfo = function(code)
{
    var self = this;
    var obj = self.info;
    if(code != undefined)
    {
        obj = obj[code];
    }
    return obj;
};

module.exports = new TermStatus();

