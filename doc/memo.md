* HTML
** 表示順
テキストウインドウ(#text-window)    z-index: 500;
人物(.character)    z-index: 500;
背景(.background)    z-index: 300;
シーン(.scene)    z-index: 200;


* シナリオデータ（JSON）
  GF.parser.parse({シナリオテキスト})で変換後の形式
[
    [{行番号}, {行の種類}, {引数の配列}],
    [{行番号}, 3/*ラベル*/, "{ラベル名}"],
    [{行番号}, 3/*ラベル*/, "{ラベル名}"],
    [{行番号}, {行の種類}, {引数の配列}],
    [{行番号}, {行の種類}, {引数の配列}],
     :
     :
     :
]


** 行の種類
LINETYPE_UNKNOWN : 0,
LINETYPE_COMMENT : 1,
LINETYPE_FUNCTION : 2,
LINETYPE_LABEL : 3,
LINETYPE_TEXT : 4,
LINETYPE_SPACE : 5,
LINETYPE_ERROR : -1,


* シナリオデータ（テキスト）
** 空白について
行先頭と最後尾の空白（TAB、改行を含む）は無視される

** 空行
無視される

** コメント
先頭が#の行はコメント

** ラベル
先頭が:の行はラベル

** セリフ
後ろに空白＋wを追加「 w」すると待ち合わせをする

- ""で囲った文字列
"testテスト"

- 全角文字で始まる文字列
テストテスト

- ""で囲った文字列待ち合わせあり
"testテスト" w
"testテスト w"

- 全角文字で始まる文字列
テストテストtest w

** 命令
行先頭が半角英字で始まる行
空白区切りで最初の項目が命令名、以降引数

func arg1 arg2 arg3
goto {label名}

*** 変数
先頭が半角英字文字列
実行時に未定義の場合は例外が発生


* ライブラリ
JQuery https://jquery.com/
sprintf.js https://github.com/alexei/sprintf.js

* 素材
みんちりえ https://min-chi.material.jp/
いらすとや https://www.irasutoya.com/
icooon mono https://icooon-mono.com/