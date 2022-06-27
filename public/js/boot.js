console.log("start boot.js");

$(function () {
    $.ajax('data/scenario.txt')
        .done((data) => {
            let scenario = GF.parser.parse(data);
            console.log(scenario);
            GF.core.setScreen(800, 600);
            GF.core.init(scenario);
            GF.core.exec();
        });
});