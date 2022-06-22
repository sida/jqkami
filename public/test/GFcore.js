
var GF = GF || {
    core: {},
}

GF.core = (function () {
    //"use strict";

    let senarioData = [];
    let senarioFuncList = [];

    attachScenarioText = function (text) {
        senarioData = _parseSenario(text);
    },
    attachFunction = function (name, func) {
        senarioFuncList[name] = func;
    }
    exec = function () {
        _execSrenario(senarioData);
    }

    const LINETYPE_UNKNOWN = 0;
    const LINETYPE_COMMENT = 1;
    const LINETYPE_FUNCTION = 2;
    const LINETYPE_LABEL = 3;
    const LINETYPE_STRING = 4;
    const LINETYPE_SPACE = 5;
    const LINETYPE_ERROR = -1;

    const LINETYPES_NAME = ["unknow", "comment", "function", "label", "string"];

    function _parseLine(lineNum, inText) {
        let lineText = inText.trim();
        let faistC = lineText.substr(0, 1);

        let type = LINETYPE_UNKNOWN;
        let arg = [];

        if (faistC.trim().length == 0) {
            type = LINETYPE_SPACE;
            arg = "";
        } else if (faistC === ":") {
            // label
            type = LINETYPE_LABEL;
            let ret = lineText.substr(1).trim();
            arg.push(ret);
        } else if (faistC === "#") {
            // comment
            type = LINETYPE_COMMENT;
            let ret = lineText.substr(1).trim();
            arg.push(ret);
        } else if (/^[^\x01-\x7E\uFF61-\uFF9F]+$/.test(faistC)) {
            // 全角
            type = LINETYPE_STRING;
            arg.push(lineText);
        } else {
            // func
            type = LINETYPE_FUNCTION;
            let parseFuncRet = _parseFunc(lineText);
            arg = parseFuncRet;
        }
        return [lineNum, type, arg];
    }

    function _parseFunc(lineText) {
        const arrText = Array.from(lineText);
        let ret = [];
        let item = "";
        let wqFlag = 0;
        while (arrText.length) {
            let c = arrText.shift();

            if (c === '"') {
                if (wqFlag == 0) {
                    wqFlag++;
                    continue;
                }
                wqFlag--;
                ret.push(item);
                item = "";
                continue;
            }

            if (wqFlag) {
                item += c;
                continue;
            }

            if (c === " ") {
                if (item.length) {
                    ret.push(item);
                    item = "";
                }
                continue;
            }
            item += c;
        }
        if (item.length) {
            ret.push(item);
        }
        return ret;
    }

    function _parseSenario(novel) {
        // 改行コードで分割
        let lineArr = novel.split(/\r\n|\n|\r/);
        let lineCount = 0;
        let ret = [];
        while (lineArr.length) {
            let line = lineArr.shift();
            ret.push(_parseLine(lineCount, line));
            lineCount++;
        }
        return ret;
    }

    function _execSrenario(data) {
        console.log("-----start-----");
        while (data.length) {
            let line = data.shift();
            let lineNo = line[0];
            let type = line[1];
            let prog = line[2];

            console.log("##" + line);

            switch (type) {
                case LINETYPE_COMMENT:
                    gf_comment(prog)
                    break;
                case LINETYPE_LABEL:
                    gf_label(prog);
                    break;
                case LINETYPE_STRING:
                    gf_string(prog);
                    break;
                case LINETYPE_SPACE:
                    gf_space(prog);
                    break;
                case LINETYPE_FUNCTION:
                    gf_func(prog);
                    break;
            }
        }
        console.log("-----end-----");
    }

    function gf_comment(prog) {
        console.log("comment:" + prog.shift());
    }

    function gf_label(prog) {
        console.log("label:" + prog.shift());

    }

    function gf_func(prog) {
        funcName = prog.shift();
        arg = prog;
        senarioFuncList[funcName](arg);
    }

    function gf_string(prog) {
        console.log("string:" + prog.shift());
    }

    function gf_space(prog) {
        console.log("space:");
    }
    return {
        attachScenarioText: attachScenarioText,
        attachFunction: attachFunction,
        exec: exec
    }

}());

module.exports = {
    GF: GF
};

/*
//------------------
var f1 = function (args) {
    for (let ii = 0; ii < args.length; ii++) {
        console.log("func1: arg" + ":" + args[ii]);
    }
}

var f2 = function (args) {
    for (let ii = 0; ii < args.length; ii++) {
        console.log("func1: arg" + ":" + args[ii]);
    }
}

var senarioTxt =
    "# comment1 comment2  \n" +
    ": label1 label2  \n" +
    "f1 arg1 arg2 arg3 \n\n" +
    'f2 "arg1 arg2" arg3 \n' +
    "あいうえお\n";


scenario.core.attachFunction("f1",f1);
scenario.core.attachFunction("f2",f2);


console.log('-----attach text-----');
console.log(senarioTxt);
console.log('-----');

scenario.core.attachScenarioText(senarioTxt);
console.log('-----start text-----');
scenario.core.exec();







const LINETYPE_UNKNOWN = 0;
const LINETYPE_COMMENT = 1;
const LINETYPE_FUNCTION = 2;
const LINETYPE_LABEL = 3;
const LINETYPE_STRING = 4;
const LINETYPE_SPACE = 5;
const LINETYPE_ERROR = -1;


const LINETYPES_NAME = ["unknow", "comment", "function", "label", "string"];

function parseLine(lineNum, inText) {
    let lineText = inText.trim();
    let faistC = lineText.substr(0, 1);

    let type = LINETYPE_UNKNOWN;
    let arg = [];

    if (faistC.trim().length == 0) {
        type = LINETYPE_SPACE;
        arg = "";
    } else if (faistC === ":") {
        // label
        type = LINETYPE_LABEL;
        let ret = lineText.substr(1).trim();
        arg.push(ret);
    } else if (faistC === "#") {
        // comment
        type = LINETYPE_COMMENT;
        let ret = lineText.substr(1).trim();
        arg.push(ret);
    } else if (/^[^\x01-\x7E\uFF61-\uFF9F]+$/.test(faistC)) {
        // 全角
        type = LINETYPE_STRING;
        arg.push(lineText);
    } else {
        // func
        type = LINETYPE_FUNCTION;
        let parseFuncRet = parseFunc(lineText);
        arg = parseFuncRet;
    }

    return [lineNum, type, arg];
}

function parseFunc(lineText) {
    const arrText = Array.from(lineText);
    let ret = [];
    let item = "";
    let wqFlag = 0;
    while (arrText.length) {
        let c = arrText.shift();

        if (c === '"') {
            if (wqFlag == 0) {
                wqFlag++;
                continue;
            }
            wqFlag--;
            ret.push(item);
            item = "";
            continue;
        }

        if (wqFlag) {
            item += c;
            continue;
        }

        if (c === " ") {
            if (item.length) {
                ret.push(item);
                item = "";
            }
            continue;
        }
        item += c;
    }
    if (item.length) {
        ret.push(item);
    }
    return ret;
}

function parseSenario(novel) {
    let lineArr = novel.split(/\r\n|\n|\r/);
    let lineCount = 0;
    let ret = [];
    while (lineArr.length) {
        let line = lineArr.shift();
        ret.push(parseLine(lineCount, line));
        lineCount++;
    }
    return ret;
}



// console.log(parseLine(1,"# comment1 comment2  "));
// console.log(parseLine(2,": label1 label2  "));
// console.log(parseLine(3,"functionA arg1 arg2 arg3 "));
// console.log(parseLine(4,'functionB "arg1 arg2" arg3 '));

// console.log(parseLine(4,'functionC "arg1 "arg2"" arg3 '));

// console.log(parseLine(5,"あいうえお"));


// var text = "# comment1 comment2  \n" +
// ": label1 label2  \n" +
// "functionA arg1 arg2 arg3 \n" +
// 'functionB "arg1 arg2" arg3 \n' +
// 'functionC "arg1 "arg2"" arg3 \n' +
// "あいうえお\n";

// console.log("----");

// console.log(parse(text));



var senarioTxt =
    "# comment1 comment2  \n" +
    ": label1 label2  \n" +
    "f1 arg1 arg2 arg3 \n\n" +
    'f2 "arg1 arg2" arg3 \n' +
    "あいうえお\n";

var senarioFuncList = [];

function addSenarioFunc(name, func) {
    senarioFuncList[name] = func;
}

var f1 = function (args) {
    for (let ii = 0; ii < args.length; ii++) {
        console.log("func1: arg" + ":" + args[ii]);
    }
}

var f2 = function (args) {
    for (let ii = 0; ii < args.length; ii++) {
        console.log("func1: arg" + ":" + args[ii]);
    }
}

addSenarioFunc("f1", f1);
addSenarioFunc("f2", f2);

var senarioData = parseSenario(senarioTxt);
console.log("-----start text-----");
console.log(senarioTxt);
console.log("-----end text-----");
console.log("-----start data-----");
console.log(senarioData);
console.log("-----end data-----");
execSrenario(senarioData);

function execSrenario(data) {
    console.log("-----start-----");
    while (data.length) {
        let line = data.shift();
        let lineNo = line[0];
        let type = line[1];
        let prog = line[2];

        console.log("##" + line);

        switch (type) {
            case LINETYPE_COMMENT:
                gf_comment(prog)
                break;
            case LINETYPE_LABEL:
                gf_label(prog);
                break;
            case LINETYPE_STRING:
                gf_string(prog);
                break;
            case LINETYPE_SPACE:
                gf_space(prog);
                break;
            case LINETYPE_FUNCTION:
                gf_func(prog);
                break;
        }
    }
    console.log("-----end-----");
}

function gf_comment(prog) {
    console.log("comment:" + prog.shift());
}

function gf_label(prog) {
    console.log("label:" + prog.shift());

}

function gf_func(prog) {
    funcName = prog.shift();
    arg = prog;
    senarioFuncList[funcName](arg);
}

function gf_string(prog) {
    console.log("string:" + prog.shift());
}

function gf_space(prog) {
    console.log("space:");
}
*/
