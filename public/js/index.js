
console.log("start index.js");

//GF.action.attachFunctions(GF.core);

var senarioTxt =
    "# comment1 comment2  \n" +
    ": label1 label2  \n" +
    "f1 arg1 arg2 arg3 \n\n" +
    'f2 "arg1 arg2" arg3 \n' +
    'log log1 log2 log3\n' +
    'push 200\n' +
    'push 200\n' +
    '#setElementSize #scene1 110 120\n' +
    '#setElementLocate #scene1 10 20\n' +
    '#setElementSize #scene2 160 170\n' +
    '#setElementLocate #scene2 11 22\n' +
    '#appendElement #yandere #scene2\n' +

    'showElement #yandere 1\n' +
    'setElementSize #yandere auto 300\n' +
    '##setElementLocateX #yandere 500\n' +
    'setElementLocate #yandere 500 120\n' +
    'showElement #yandere 0\n' +

    'showElement #gao-man 1\n' +
    'setElementSize #gao-man auto 340\n' +
    'setElementLocate #gao-man 30 130\n' +

    'showElement #gao-woman 0\n' +
    'showElement #pistol 0\n' +
    'showElement #syani-woman 0\n' +


    'out #text-window "てすてすてすてすてす" \n' +
    "w\n" +

    'showElement #yandere 1\n' +
    'showElement #gao-man 0\n' +

    'out #text-window "テステステステス！！" \n' +
    "w\n" +

    '#select {変数} 1 はい 2 いいえ 3 どちらでもない\n' +
    '#if {変数名} 1 label1\n' +
    '#if {変数名} 2 label2\n' +
    '#goto label2\n' +
    "あいうえお\n" +
    "w\n" +
    "さしすせそ\n" +
    "かきくけこ\n";


// GF.core.attachFunction("f1",f1);
// GF.core.attachFunction("f2",f2);

console.log('-----attach text-----');
console.log(senarioTxt);
console.log('-----');

GF.core.attachScenarioText(senarioTxt);
console.log('-----start text-----');
GF.core.exec();
