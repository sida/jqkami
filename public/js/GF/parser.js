(()=>{
    if (typeof GF === 'undefined') {
        document.body.innerHTML = "coreライブラリが読み込まれていません"
        throw new Error("coreライブラリが読み込まれていません");
    }
})();

GF.parser = (function () {

    let senarioData = [];

    let _parse = (text) => {
        senarioData = _parseSenario(text);
        return senarioData;
    };

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
            let parseFuncRet = _parseFunc(lineText);
            if (parseFuncRet.length ===1 && (/^[^\x01-\x7E\uFF61-\uFF9F]+$/.test(parseFuncRet[0].substr(0, 1)))) {
                // 先頭が全角なら文字列として扱う
                type = LINETYPE_STRING;
                arg.push(parseFuncRet[0]);
            } else {
                type = LINETYPE_FUNCTION;
                arg = parseFuncRet;
            }
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

    return {
        parse: _parse,
    }
}());
