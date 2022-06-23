'use strict';

(()=>{
    if (typeof GF === 'undefined') {
        document.body.innerHTML = "coreライブラリが読み込まれていません"
        throw new Error("coreライブラリが読み込まれていません");
    }
})();

GF.parser = (function () {
    let scenarioData = [];

    let _parse = (text) => {
        scenarioData = _parsescenario(text);
        return scenarioData;
    };

    function _parseLine(lineNum, inText) {
        let lineText = inText.trim();
        let faistC = lineText.substr(0, 1);

        let type = GF.const.LINETYPE_UNKNOWN;
        let arg = [];

        if (faistC.trim().length == 0) {
            type = GF.const.LINETYPE_SPACE;
            arg = "";
        } else if (faistC === ":") {
            // label
            type = GF.const.LINETYPE_LABEL;
            let ret = lineText.substr(1).trim();
            arg = ret;
        } else if (faistC === "#") {
            // comment
            type = GF.const.LINETYPE_COMMENT;
            let ret = lineText.substr(1).trim();
            arg.push(ret);
        } else if (/^[^\x01-\x7E\uFF61-\uFF9F]+$/.test(faistC)) {
            // 全角
            type = GF.const.LINETYPE_STRING;
            arg.push(lineText);
        } else {
            // func
            let parseFuncRet = _parseFunc(lineText);
            if (parseFuncRet.length ===1 && (/^[^\x01-\x7E\uFF61-\uFF9F]+$/.test(parseFuncRet[0].substr(0, 1)))) {
                // 先頭が全角なら文字列として扱う
                type = GF.const.LINETYPE_STRING;
                arg.push(parseFuncRet[0]);
            } else {
                type = GF.const.LINETYPE_FUNCTION;
                arg = parseFuncRet;
            }
        }
        console.log("---arg---");
        console.log(arg);
        return [lineNum, type, arg];
    }

    function _parseFunc(lineText) {
        console.log("_parseFunc:" + lineText)
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
        console.log("--- _parseFunc result ---")
        console.log(ret)

        return ret;
    }

    function _parsescenario(novel) {
        // 改行コードで分割
        let lineArr = novel.split(/\r\n|\n|\r/);
        let lineCount = 0;
        let ret = [];
        while (lineArr.length) {
            let line = lineArr.shift();
            console.log("--- line input ---");
            console.log(line)
            let retline = _parseLine(lineCount, line)
            console.log("--- line result ---");
            console.log(retline)
            ret.push(retline);
            lineCount++;
        }
        return ret;
    }

    return {
        parse: _parse,
    }
}());
