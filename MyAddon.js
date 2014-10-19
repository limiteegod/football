var my = require("hello");

console.log(my.add(1, 10000));

console.log(my.random());


my.runCb(function(msg){
    console.log(msg);
});

var obj = my.createObject("123");
console.log(obj.msg);

var myobj = new my.MyObject(10);
console.log(myobj.plusOne());
console.log(myobj.plusOne());


var myobj2 = my.createMyObject(10);
console.log(myobj2.plusOne());
console.log(myobj2.plusOne());
console.log(myobj2.plusOne());


var myobj3 = myobj.add(myobj2);
console.log(myobj3.plusOne());
console.log(myobj3.plusOne());

var buf = my.createBuffer();
console.log(buf.toString("utf8"));