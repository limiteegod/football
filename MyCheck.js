var ssq = require("ssq");
var feo = require("feo");

/*
var gameGrades = [400000000, 100000000, 300000, 20000, 1000, 500];
var gl = ssq.gl(gameGrades.length);
gl.setBonus(gameGrades);
console.log(gl.getBonus(0));

var check = ssq.check();
check.setRedBall([9,14,17,18,21,25]);
check.setBlueBall(15);
check.setGl(gl);
console.log(check.count());

var ticket = {playTypeCode:'00', betTypeCode:'00', numbers:"09,14,17,18,21,25|15"};
var handle = 'count' + ticket.playTypeCode + ticket.betTypeCode;
console.log(check[handle](ticket.numbers));*/

var stringUtil = feo.stringUtil();
console.log(stringUtil.getIntArray("123,456,321"));

var check = feo.check();
check.setDrawNum("1,2,3,4");
console.log(check.getDrawNum());