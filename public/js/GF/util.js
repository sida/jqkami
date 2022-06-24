'use strict';

(()=>{
    if (typeof GF === 'undefined') {
        document.body.innerHTML = "coreライブラリが読み込まれていません"
        throw new Error("coreライブラリが読み込まれていません");
    }
})();

GF.util = (function () {
    function _showElement(elem, showf) {
        if (showf) {
            $(elem).css("visibility", "visible");
        } else {
            $(elem).css("visibility", "hidden");
        }
    }

    return {
        showElement: _showElement,
    }
}());
