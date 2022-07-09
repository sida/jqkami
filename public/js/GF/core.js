'use strict';

var GF = GF || {
    const: {},
    core: {},
    parser: {},
    util: {},
}

GF.const = (() => {
    return {
        LINETYPE_UNKNOWN: 0,
        LINETYPE_COMMENT: 1,
        LINETYPE_FUNCTION: 2,
        LINETYPE_LABEL: 3,
        LINETYPE_TEXT: 4,
        LINETYPE_SPACE: 5,
        LINETYPE_ERROR: -1,
        LINETYPES_NAME: ["unknow", "comment", "function", "label", "string"],
    };
})();

GF.core = (function () {
    let scenarioData = [];
    // スクリプトの関数は名前をキーにしてクロージャーの連想配列で管理
    let scenarioFuncList = {};
    // スクリプトの変数は名前をキーにして連想配列で管理
    let variableList = {};
    // スクリプト処理終了を待ち合わせしている件数（待ち合わせが必要な場合はattachFunctionW（）で登録する）
    let wait_counter = 0;
    // 実行行のカウンタ
    let execCounter = 0;
    // 戻り値
    let returnValue = 0;

    let _init = (data) => {
        scenarioData = data;
    }

    let screenSize = {
        w: -1,
        h: -1,
    };

    let _setScreen = (w, h) => {
        console.log([w,h]);
        screenSize.w = w;
        screenSize.h = h;
        _resizeScreen();
    }

    function _resizeScreen() {
        if (screenSize == null) {
            return;
        }
        let aspect = screenSize.w / screenSize.h;
        //ウインドウの高さを変数に格納
        let height = $(window).height();
        let width = $(window).width();
        let realAspect = width / height;

        let zoom = width / screenSize.w;

        if (realAspect > aspect) {
            // 横長
            zoom = height / screenSize.h;
        }
        let zoomCss = (zoom * 100) + "%";
        $("#main-screen").css("zoom", zoomCss);
    }

    // スクリプトの関数を登録
    let _attachFunction = function (name, func) {
        scenarioFuncList[name] = (arg) => {
            func(arg);
            return EXEC_CONTINUE;
        };
    };

    // 処理の終了を待つ必要があるスクプトの関数を登録
    let _attachFunctionW = function (name, func) {
        scenarioFuncList[name] = (arg) => {
            wait_counter++;
            func(arg, _continuescenario);
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
        console.log("---exec line---:" + (execCounter - 1));
        console.log(lineData);

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
            case GF.const.LINETYPE_TEXT:
                ret = gf_text(prog);
                break;
            case GF.const.LINETYPE_SPACE:
                gf_space(prog);
                break;
            case GF.const.LINETYPE_FUNCTION:
                ret = gf_func(prog);
                break;
            default:
                console.log("xxx switch default xxx");
                throw new Error('不正な行の種別:' + type);
                break;
        }
        return ret;
    }

    function _execSrenario() {
        while (scenarioData.length > execCounter) {
            let line = scenarioData[execCounter];
            execCounter++;
            if (_execSrenarioLine(line) === EXEC_WAIT) {
                return;
            }
        }
    }

    function _continuescenario(retVal) {
        console.log("callback:" + retVal);
        if (typeof retVal !== 'undefined') {
            returnValue = retVal;
        }
        wait_counter--;
        if (wait_counter <= 0) {
            wait_counter = 0;
            _execSrenario();
            return;
        }
        return;
    }

    function findLabelIdx(labelName) {
        for (let idx = 0; idx < scenarioData.length; idx++) {
            let line = scenarioData[idx];
            if (line[1] === GF.const.LINETYPE_LABEL) {
                if (line[2] === labelName) {
                    return idx;
                }
            }
        }
        return null;
    }

    function _gotoLabel(labelName) {
        console.log("goto :" + labelName);
        let labelIdx = findLabelIdx(labelName);
        if (labelIdx === null) {
            throw new Error(labelName + 'ラベルがありません');
        }
        execCounter = labelIdx;
    }

    function _getReturnValue() {
        return returnValue;
    }

    function gf_comment(prog) {
        console.log("comment:" + prog[0]);
    }

    function gf_label(prog) {
        console.log("label:" + prog);
    }

    var gf_func = (prog) => {
        console.log('--- function ---');
        let funcName = prog[0];
        console.log("#call " + funcName);

        let arg = prog.concat();
        arg.shift();

        if (!(funcName in scenarioFuncList)) {
            console.log(scenarioData);
            console.log("Pcount:" + execCounter);
            throw Error('関数' + funcName + 'が定義されていません');
        }

        return scenarioFuncList[funcName](arg);
    }

    function gf_text(txt) {
        console.log("text:" + txt);
        let funcName = "text";
        return scenarioFuncList[funcName](txt);
    }

    function gf_space(prog) {
        console.log("space:");
    }

    return {
        init: _init,
        setScreen: _setScreen,
        resizeScreen: _resizeScreen,
        gotoLabel: _gotoLabel,
        attachFunction: _attachFunction,
        attachFunctionW: _attachFunctionW,
        getReturnValue: _getReturnValue,
        exec: _exec,
        defineVar: _defineVar,
        setV: _setV,
        getV: _getV
    }
}());

$(function () {
    $(window).resize(function () {
        GF.core.resizeScreen();
    });
});