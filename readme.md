# lendbox

## これは何？
物品の貸し出し状況を把握しておくためのwebサービス。\
トータルの物品数を記録しておき、貸し出しチケットの発行を通じて物品の残量などを管理する。

## 開発環境
* runtime\
    deno v1.15.2
* editor\
    vscode
* DB\
    mongodb-community v5.0.3

## MongoDB
MongoDBの初回設定
```sh
$ cd mongodb
$ mongod --port 27017 --dbpath ./data/

# detachしてから、mongoコマンドを使う。
# ユーザとdbの初期データを作成
$ mongo --port 27017 create_user.js
$ mongo --port 27017 initialize_db.js

# DBをいったん終了
$ mongo --port 27017 --eval 'db.getSiblingDB("admin").shutdownServer();'
```

初回設定が終わったらDBを起動する。
```sh
$ sh start_db.sh
```

## usage
サービス起動
```sh
$ sh run.sh
```
