console.log("start boot.js");

$(function(){
    $.ajax('../data/scenario.txt')
    .done( (data) => {
        let senario = GF.parser.parse(data);
        GF.core.init(senario);
        GF.core.exec();
    });
});
