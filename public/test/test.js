
var GF = require("./core");
GF.action = require("./action_test").action;

console.log("-----core-----");
console.log(GF);
console.log("-----");

console.log("-----action-----");
//console.log(action);
// console.log(action.attachFunction);
console.log("-----");

GF.action.attachFunctions(GF.core);
//------------------
// var f1 = function (args) {
//     for (let ii = 0; ii < args.length; ii++) {
//         console.log("func1: arg" + ":" + args[ii]);
//     }
// }

// var f2 = function (args) {
//     for (let ii = 0; ii < args.length; ii++) {
//         console.log("func1: arg" + ":" + args[ii]);
//     }
// }

var senarioTxt =
    "# comment1 comment2  \n" +
    ": label1 label2  \n" +
    "f1 arg1 arg2 arg3 \n\n" +
    'f2 "arg1 arg2" arg3 \n' +
    "あいうえお\n";


// GF.core.attachFunction("f1",f1);
// GF.core.attachFunction("f2",f2);

console.log('-----attach text-----');
console.log(senarioTxt);
console.log('-----');

GF.core.attachScenarioText(senarioTxt);
console.log('-----start text-----');
GF.core.exec();
