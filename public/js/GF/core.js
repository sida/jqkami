
var GF = GF || {
    core: {},
}

GF.core = (function () {

    let senarioData = [];
    let senarioFuncList = {};
    let variableList = {};
    let wait_counter = 0;

    let _attachScenarioText = function (text) {
        senarioData = _parseSenario(text);
    };

    let _attachFunction = function (name, func) {
        senarioFuncList[name] = (arg) => {
            func(arg);
            return EXEC_CONTINUE;
        };
    };

    let _attachFunctionW = function (name, func) {
        senarioFuncList[name] = (arg) => {
            wait_counter++;
            func(arg, _continueSenario);
            return EXEC_WAIT;
        };
    };

    let _exec = function () {
        _execSrenario(senarioData);
    };

    let _defineVar = (name, val) => {
        variableList[name] = val;
    }

    let _setV = (name, val) => {
        if (name in variableList) {
            variableList[name] = val;
            return;
        }
        throw new Error(name + "は未定義の変数です");
    };

    let _getV = (name) => {
        if (name in variableList) {
            return variableList[name];
        }
        throw new Error(name + "は未定義の変数です");
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

    const EXEC_CONTINUE = 0;
    const EXEC_WAIT = 1;

    let execCounter = 0;

    function _execSrenarioLine(lineData) {
        let lineNo = lineData[0];
        let type = lineData[1];
        let prog = lineData[2];

        let ret = EXEC_CONTINUE;
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
                ret = gf_func(prog);
                console.log("func return:" + ret);
                break;
        }
        return ret;
    }

    function _execSrenario() {
        while (senarioData.length > execCounter) {
            let line = senarioData[execCounter];
            execCounter++;
            if (_execSrenarioLine(line) === EXEC_WAIT) {
                return;
            }
        }
    }

    function _continueSenario() {
        wait_counter--;
        if (wait_counter <= 0) {
            wait_counter=0;
            _execSrenario();
        }
        return;
    }

    function gf_comment(prog) {
        console.log("comment:" + prog.shift());
    }

    function gf_label(prog) {
        console.log("label:" + prog.shift());
    }

    var gf_func = (prog) => {
        funcName = prog.shift();
        console.log("#call " + funcName);
        arg = prog;
        return senarioFuncList[funcName](arg);
    }

    function gf_string(prog) {
        console.log("string:" + prog.shift());
    }

    function gf_space(prog) {
        console.log("space:");
    }

    return {
        attachScenarioText: _attachScenarioText,
        attachFunction: _attachFunction,
        attachFunctionW: _attachFunctionW,
        exec: _exec,
        defineVar: _defineVar,
        setV: _setV,
        getV:_getV
    }

}());

console.log("defined core");

// module.exports = {
//     core: GF.core
// };
