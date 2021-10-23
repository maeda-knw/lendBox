# lendbox

## これは何？
物品の貸し出し状況を把握しておくためのwebサービス。
トータルの物品数をmasterとして記録しておき、
貸し出しチケットの発行を通じて、物品の残量などを管理する。

## 開発環境
* runtime
	deno 1.15.2
* editor
	vscode
* DB
	mongodb-community

## usage
mongodbの起動。
```sh
$ cd mongodb/
$ mongod --config mongodb.config
```
初回起動の場合は`mongodb/initialize.txt`と`mongodb/itemdata.txt`に従って初期化すること。

アプリ起動
```sh
$ sh run.sh
```
