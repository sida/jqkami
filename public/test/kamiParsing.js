var JqKami = JqKami || {
    parseing: {},
    data: {
        int: {}
    }
};

JqKami.parseing = (function () {

    expressionDisassembly = function (text) {

    },
    disassembly = function () {

    },
    changeArray = function () {

    }

    return {
        expressionDisassembly: expressionDisassembly,
        disassembly: disassembly
    }

}());






var text = "1+2+(3+4)";
var ret = JqKami.parseing.expressionDisassembly(text);