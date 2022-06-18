var dis = function (text) {
    return "!!" + text;
}

/*
+,- 符号　: 空白、（　: 0-9,a-z,A-Z
!否定演算子 : 空白,( :
演算子　：　空白、）、num,alpha : 空白 ( num,alpha
数値　：　空白、（、符号、演算子、否定演算子　：空白、）、演算子
*/

const T_NONE = 0;
const T_SIGN = 1;
const T_NOT = 2;
const T_OPERATOR = 3;
const T_NUM = 4;

const C_NONE = 0;
const C_SIGN = 1;
const C_INT = 2;
const C_NUM = 3;
const C_ALPHA = 4;
const C_DOT = 5;
const C_SPACE = 6;

const ITEM_UNKNOWN = 0;
const ITEM_VARIABLE = 1;
const ITEM_NUMERIC = 2;
const ITEM_OPERATOR = 3;

function isNumChar(c) {
    return /[0-9]/.test(c);
}

function isAlpha(c) {
    return /[A-Za-z]/.test(c);
}

function isSgin(c) {
    return ["+","-"].includes(c);
}

function isOperator(c) {
    return "+-*/|!^&=".includes(c);
}

// 数式を配列に分解
var parray = function (inArr) {
    var ret = [];
    let arr = inArr;
    var val = "";
    var itemLenCount = 0;
    var itemMode = ITEM_UNKNOWN;
    console.log("start--");
    console.log(arr);
    console.log("--");
 
    while (arr.length) {
        var c = String(arr.shift());
        console.log("--#--");
        console.log(c);
        console.log("--");

        if (c === ' ') {
            if (val.length) {
                ret.push(val);
            }
            val = '';
            itemLenCount = 0;
            itemMode = ITEM_UNKNOWN;
            continue;
        }
        console.log("$1");

        //
        // 取り込み中１項目の終了確認
        //

        if (itemMode == ITEM_NUMERIC) {
            if (!isNumChar(c) && (c!=".")) {
                ret.push(Number(val));
                itemLenCount = 0;
                itemMode = ITEM_UNKNOWN;
            }
        }
        
        if (itemMode == ITEM_VARIABLE) {
            if (!isAlpha(c) && (c!="_") && !isNumChar(c)) {
                ret.push(String(val));
                itemLenCount = 0;
                itemMode = ITEM_UNKNOWN;
            }
        }

        if (itemMode == ITEM_OPERATOR) {
            if (!isOperator(c)) {
                ret.push(String(val));
                itemLenCount = 0;
                itemMode = ITEM_UNKNOWN;
            }
        }
        console.log("$2");

        //
        // １項目取り込み開始＆取り込み
        //

        if (itemMode == ITEM_UNKNOWN || itemMode == ITEM_NUMERIC) {
            if (isNumChar(c) || (c===".") || (itemLenCount == 0 && isSgin(c))) {
                val += String(c);
                itemLenCount++;
                itemMode = ITEM_NUMERIC;
                continue;
            }    
        }
        console.log("$2-1");

        if (itemMode == ITEM_UNKNOWN || itemMode == ITEM_VARIABLE) {
            if ((isAlpha(c) || isNumChar(c) || (c=="_") ) && (itemLenCount == 0 && !isAlpha(c))) {
                console.log("$2-1-2 :" + c);
                val += String(c);
                itemLenCount++;
                itemMode = ITEM_VARIABLE;
                continue;
            }    
        }
        console.log("$2-2");

        if (itemMode == ITEM_UNKNOWN || itemMode == ITEM_OPERATOR) {
            if (isOperator(c)) {
                val += String(c);
                itemLenCount++;
                itemMode = ITEM_OPERATOR;
                continue;
            }    
        }
        console.log("$3");

        if (c === '(') {
            var arrRet = parray(arr);
            ret.push(arrRet);
            val = '';
            itemLenCount = 0;
            itemMode = ITEM_UNKNOWN;
            continue;
        }
        console.log("$4");

        if (c === ')') {
            return ret;
        }
        console.log("$5e");

        // 不正な文字列
        console.log("syntax error :" + c);
        console.log("mode=" + itemMode);
        console.log("count=" + itemLenCount);
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


//let numList = "0123456789.";
//let operatorList = ["+", "-", "*", "/"];


// console.log("a is alpha");
// console.log(isAlpha("a"));
// console.log("0 is alpah");
// console.log(isAlpha("0"));
// console.log("1 is num");
// console.log(isNumChar("1"));
// console.log("b is num");
// console.log(isNumChar("b"));

// console.log(isOperator("a"));
// console.log(isOperator("+"));
// console.log(isOperator("-"));
// console.log(isOperator("/"));


console.log('-----');

var text = "(-1 + -2 + (3.9+4) + -5 - 8 +aa +(cc+bb -dd))";
console.log(text);
console.log('-----');

const arr = Array.from(text);
console.log(arr);
console.log('-----');

var retp = parray(arr);
console.log(retp);
//console.log('##' + evalExpress(retp));


