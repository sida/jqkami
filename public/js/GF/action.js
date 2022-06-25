'use strict';

// スクリプトの関数を定義
(()=>{
    if (typeof GF === 'undefined') {
        document.body.innerHTML = "coreライブラリが読み込まれていません"
        throw new Error("coreライブラリが読み込まれていません");
    }
})();

// 右クリック禁止
$(document).on("contextmenu", function(){
    return false;
});

(function () {
    "use strict"

    var goto_label = (args) => {
        let labelName = args[0];
        GF.core.gotoLabel(labelName);
    }

    var jump_label = (args) => {
        let idx = GF.core.getReturnValue();
        if (idx > args.length || idx < 0) {
            throw new Error("選択数とラベル数に不整合があります");
        }
        let labelName = args[idx];
        GF.core.gotoLabel(labelName);
    }

    // キー入力まで実行を停止する
    var key_wait = function (args, callback) {
        $(document).off('click.txw');
        let elem = get_default_output();
        let txt = args[0];

        console.log(["print",elem,txt]);
        $(elem).text(txt);

        $(document).off('click.txw');
        let onClickFlag = true;
        setTimeout(()=>{onClickFlag = false;},500); // イベントハンドラを定義して0.5sはスキップする（残ったイベント消費）
        $(document).on('click.txw',
            ()=>{
                if (onClickFlag) {
                    return;
                }
                onClickFlag = true;
                callback();  // スクリプトの実行を再開する
            }
        );
    };

    var select_wait = (arg, callback) => {
        // arg = message item0 item1 item2 ...
        let elem = get_default_select_window(); //シナリオシステムとaction.jsは連動するので決め打ちでもいいかも？
        let itemList = arg.concat();
        let mess = itemList.shift();
        $(elem).empty();
        $(elem).append(`<div id="select-message">${mess}</div>`);
        let onClickFlag = false;
        setTimeout(()=>{onClickFlag = false;},500); // イベントハンドラを定義して0.5sはスキップする（残ったイベント消費）
        $.each(itemList, function(index, item) {
            let itemId = `select-${index}`;
            $(elem).append(`<div id="${itemId}" class="select-item">${item}</div>`);
            $('#' + itemId).off('click');
            $('#' + itemId).on('click',
                ()=>{
                    if (onClickFlag) {
                        return;
                    }
                    onClickFlag = true;
                    GF.util.showElement(elem, 0);
                    // 戻り値は？
                    callback(index);
                }
            );
        });

        // window表示
        GF.util.showElement(elem, true);
    }

    var set_default_output = (args) => {
        let elem = args[0];
        GF.core.defineVar('GF_DEFAULT_OUTPUT_ID',elem);
    };

    function get_default_output() {
        return GF.core.getV('GF_DEFAULT_OUTPUT_ID', '#text-window');
    };

    var set_default_select_window = (args) => {
        let elem = args[0];
        GF.core.defineVar('GF_DEFAULT_SELECT_WINDOW_ID',elem);
    };

    function get_default_select_window() {
        return GF.core.getV('GF_DEFAULT_OUTPUT_ID', '#select-window');
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
        let elem = args[0];
        let f = Number(args[1]);
        GF.util.showElement(elem, f);
    };

    function _showMenu (showf) {
        GF.util.showElement("#bt-menu");
    }

    // function showElement(elem, showf) {
    //     if (showf) {
    //         $(elem).css("visibility", "visible");
    //     } else {
    //         $(elem).css("visibility", "hidden");
    //     }
    // }

    let stackValues = [];

    var pushV = (args) => {
        stackValues.push(args[0]);
    };

    var popV = (args) => {
        return stackValues.pop();
    };

    GF.core.attachFunctionW("outw", key_wait);
    GF.core.attachFunction("goto", goto_label);
    GF.core.attachFunction("jump", jump_label);
    GF.core.attachFunctionW("select", select_wait);

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
