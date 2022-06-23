'use strict';

var GF = GF || {
    const:{},
    core: {},
    parser: {}
}

GF.const = (()=>{
    return {
        LINETYPE_UNKNOWN : 0,
        LINETYPE_COMMENT : 1,
        LINETYPE_FUNCTION : 2,
        LINETYPE_LABEL : 3,
        LINETYPE_STRING : 4,
        LINETYPE_SPACE : 5,
        LINETYPE_ERROR : -1,
        LINETYPES_NAME : ["unknow", "comment", "function", "label", "string"],
    };
})();

GF.core = (function () {
    let senarioData = [];
    // スクリプトの関数は名前をキーにしてクロージャーの連想配列で管理
    let senarioFuncList = {};
    // スクリプトの変数は名前をキーにして連想配列で管理
    let variableList = {};
    // スクリプト処理終了を待ち合わせしている件数（待ち合わせが必要な場合はattachFunctionW（）で登録する）
    let wait_counter = 0;
    // 実行行のカウンタ
    let execCounter = 0;

    let _init = (data) => {
        senarioData = data;
    }

    // スクリプトの関数を登録
    let _attachFunction = function (name, func) {
        senarioFuncList[name] = (arg) => {
            func(arg);
            return EXEC_CONTINUE;
        };
    };

    // 処理の終了を待つ必要があるスクプトの関数を登録
    let _attachFunctionW = function (name, func) {
        senarioFuncList[name] = (arg) => {
            wait_counter++;
            func(arg, _continueSenario);
            return EXEC_WAIT;
        };
    };

    let _exec = function () {
        _execSrenario();
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

    let _getV = (name, defaultV) => {
        if (name in variableList) {
            return variableList[name];
        }
        return defaultV;
    }

    const EXEC_CONTINUE = 0;
    const EXEC_WAIT = 1;

    function _execSrenarioLine(lineData) {
        let lineNo = lineData[0];
        let type = lineData[1];
        let prog = lineData[2];

        let ret = GF.const.EXEC_CONTINUE;
        switch (type) {
            case GF.const.LINETYPE_COMMENT:
                gf_comment(prog)
                break;
            case GF.const.LINETYPE_LABEL:
                gf_label(prog);
                break;
            case GF.const.LINETYPE_STRING:
                ret = gf_string(prog);
                break;
            case GF.const.LINETYPE_SPACE:
                gf_space(prog);
                break;
            case GF.const.LINETYPE_FUNCTION:
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
        let funcName = prog.shift();
        console.log("#call " + funcName);
        let arg = prog;
        return senarioFuncList[funcName](arg);
    }

    function gf_string(txt) {
        console.log("string:" + txt);
        let funcName = "outw";
        return senarioFuncList[funcName](txt);
    }

    function gf_space(prog) {
        console.log("space:");
    }

    return {
        init: _init,
        attachFunction: _attachFunction,
        attachFunctionW: _attachFunctionW,
        exec: _exec,
        defineVar: _defineVar,
        setV: _setV,
        getV:_getV
    }
}());
