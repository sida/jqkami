console.log("start boot.js");

$(function(){
    $.ajax('../data/scenario.txt')
    .done( (data) => {
        GF.core.attachScenarioText(data);
        GF.core.exec();
    });
});
