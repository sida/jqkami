console.log("start boot_test.js");

$(function(){
    $('body').before('<input type="file" name="inputFile" id="inputFile">');
    let input = document.getElementById('inputFile');
    let reader = new FileReader();

    input.addEventListener('change', () => {
        for(file of input.files){
            //Fileオブジェクト(テキストファイル)のファイル内容を読み込む
            reader.readAsText(file, 'UTF-8');
            //ファイルの読み込み完了後に内容をコンソールに出力する
            reader.onload = ()=> {
                console.log(reader.result);
                $('#inputFile').remove();
                GF.core.attachScenarioText(reader.result);
                GF.core.exec();
            };
        }
    });
});
