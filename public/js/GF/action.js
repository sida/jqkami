
(function () {
    "use strict"

    var f1 = function (args) {
        for (let ii = 0; ii < args.length; ii++) {
            console.log("func1: arg" + ":" + args[ii]);
        }
    };

    var f2 = function (args) {
        for (let ii = 0; ii < args.length; ii++) {
            console.log("func2: arg" + ":" + args[ii]);
        }
    };

    var key_wait = function (args, callback) {
        $('body').on('keyup',
            ()=>{
                console.log("callback");
                callback();
                // keyupイベントを削除
                $('body').off('keyup');
            }
        );
    };

    var out_txt = (args, callback) => {
        let elem = args[0];
        let txt = args[1];
        $(elem).text(txt);
        callback();
    };

    var set_size = (args) => {
        let name = args[0];
        let h = args[1];
        let w = args[2];
        console.log("#setSize:" + name)
        $(name).height(h).width(w);
    };

    var set_loc = (args) => {
        let name = args[0];
        let parentPos = $(name).parent().offset();
        let x = Number(args[1]);
        let y = Number(args[2]);
        $(name).offset({top: parentPos.top + y,  left: parentPos.left + x});
    };

    var set_locX = (args) => {
        let name = args[0];
        let parentPos = $(name).parent().offset();
        console.log("parent pos:" + name);
        console.log(parentPos);
        let x = Number(args[1]);
        console.log(parentPos.left + x);

        $(name).offset({left: parentPos.left + x});
    };

    var set_locY = (args) => {
        let name = args[0];
        let parentPos = $(name).parent().offset();
        let y = Number(args[1]);
        $(name).offset({top: parentPos.top + y});
    };

    var append = (args) => {
        let ele = args[0];
        let to = args[1];
        $(to).append($(ele));
    };

    var show = (args) => {
        let ele = args[0];
        let f = Number(args[1]);
        console.log(['show',ele ,f] );
        if (f) {
            $(ele).show();
        } else {
            $(ele).hide();
        }
    };

    let stackValues = [];

    var pushV = (args) => {
        stackValues.push(args[0]);
    };

    var popV = (args) => {
        return stackValues.pop();
    };

    GF.core.attachFunction("f1",f1);
    GF.core.attachFunction("f2",f2);
    GF.core.attachFunctionW("w",key_wait);
    GF.core.attachFunctionW("out",out_txt);

    GF.core.attachFunction("setElementSize",set_size);
    GF.core.attachFunction("setElementLocate",set_loc);
    GF.core.attachFunction("setElementLocateX", set_locX);
    GF.core.attachFunction("setElementLocateY", set_locY);
    GF.core.attachFunction("appendElement",append);
    GF.core.attachFunction("showElement",show);

    GF.core.attachFunction("push",pushV);
    GF.core.attachFunction("pop",popV);
    GF.core.attachFunction("log", (args)=>{console.log(args)});
    GF.core.attachFunction("poplog", ()=>{console.log("pop:" + stackValues.pop())});

})();
