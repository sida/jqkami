var dis = function (text) {
    return "!!" + text;
}

var parray = function (inArr) {
    var ret = [];
    var arr = inArr;
    var val = "";
    while (arr.length) {
        var f = String(arr.shift());
        if (f === ' ') {
            continue;
        }
        if (numList.includes(f)) {
            val += String(f);
            continue;
        }
        if (val.length) {
            ret.push(Number(val));
            val = '';
        }

        if (f === '(') {
            var arrRet = parray(arr);
            ret.push(arrRet);
            continue;
        }
        if (f === ')') {
            return ret;
        }
        // 演算子チェック
        if (operatorList.includes(f)) {
            ret.push(f);
            continue;
        }
        // TODO 変数チェック

        // 不正な文字列
        console.log("syntax error :" + f);
    }
    return ret;
}


var evalExpress = function(inputArr) {
    var state = 0; // 0:左辺 1:演算子 2:右辺
    var arrExpress = inputArr;
    var operator = null;
    var leftItem = null;
    var rightItem = null;
    while (arrExpress.length) {
        var item = null;
        var c = arrExpress.shift();
        if (Array.isArray(c)) {
            item = evalExpress(c);
        } else {
            item = c;
        }
        if (state == 0) {
            leftItem = item;
            state = 1;
        } else if (state == 2) {
            rightItem = item;
            leftItem = calcExpress(operator,leftItem,rightItem);
            state = 1;
        } else if (state == 1) {
            operator = item;
            state = 2;
        }
    }
    return leftItem;        
}

function calcExpress(operator,leftItem,rightItem) {
    console.log(["calc" , operator,leftItem,rightItem]);
    switch(operator) {
        case '+':
            return leftItem + rightItem;
        case '-':
            return leftItem - rightItem;
    }
    // TODO error
    console.log("eroor operator:" + operator);
    return null;
}


let numList = "0123456789.";
let operatorList = ["+", "-", "*", "/"];

var text = "((1 + 2 + ((3.9+4) + 5 - 8)))";

const arr = Array.from(text);
var retp = parray(arr);

console.log(dis(text));
console.log(arr);
console.log(retp);
console.log('-----');
console.log('##' + evalExpress(retp));
