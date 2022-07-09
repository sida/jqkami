console.log("start boot.js");

$(function () {
    axios.get('data/scenario.txt')
    .then(function (response) {
        // handle success
        console.log(response.data);
        let scenario = GF.parser.parse(response.data);
        console.log(scenario);
        GF.core.setScreen(800, 600);
        GF.core.init(scenario);
        GF.core.exec();
    }).catch(function (error) {
        // handle error
        console.log('シナリオデータが読み込めませんでした');
        console.log(error);
        throw new Error('シナリオデータが読み込めませんでした');
    });
});