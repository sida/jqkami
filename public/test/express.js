var dis = function (text) {
    return "!!" + text;
}

var parray = function (inArr) {
    var ret = [];
    var arr = inArr;
    var val = "";
    while (arr.length) {
        var f = arr.shift();
        if (f === ' ') {
            continue;
        }
        if (numList.includes(f)) {
            val += f;
            continue;
        }
        if (val.length) {
            ret.push(val);
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




let numList = "0123456789.";
let operatorList = ["+", "-", "*", "/"];

var text = "((1 + 2 + ((3.9+4) + 5 * 8w)))";

const arr = Array.from(text);
var retp = parray(arr);

console.log(dis(text));
console.log(arr);
console.log(retp);