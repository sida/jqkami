
var GF = GF || {
    action: {}
}

GF.action = (function () {
    attachFunctions = function (GFcore) {
        GFcore.attachFunction("f1",f1);
        GFcore.attachFunction("f2",f2);
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

    return {
        attachFunctions: attachFunctions,
    }

}());

module.exports = {
    action: GF.action
};