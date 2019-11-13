# OWASP Juice Shopの脆弱性を防ぐWAF
脆弱性を内包しているWebアプリケーション（OWASP Juice Shop）を攻撃から防ぐWAF（リバースプロキシ）を開発した。

## 概要
Webサーバの前にWAFとしてリバースプロキシを設置した。WAFはクエリを解析し、攻撃を検知した場合はWebサーバへ渡す前にブロックする。WAFの開発には、Node.jsを用いた。
<br>ソースコード: `https://github.com/haku-noir/waf-for-OWASP_Juice_Shop`

## 使い方
### 初期設定
```
git clone https://github.com/haku-noir/waf-for-OWASP_Juice_Shop
cd waf-for-OWASP_Juice_Shop
docker-compose up -d --build
docker exec -it wojs_waf npm install
```

### WAFの起動
```
docker exec -it wojs_waf npm start
```
- WAFを通してWebサーバにアクセス: `http://localhost`
- Webサーバに直接アクセス: `http://localhost:3000`

<div style="page-break-before:always"/>

### ブロックするクエリの追加
`waf/datas/query-check.csv`に攻撃クエリの情報を記述することで、WAFは攻撃クエリを検知してブロックする。
1. `waf/datas/query-check.csv`の編集
- pathname: クエリの送信先（URLに含まれるホスト名の後の部分）
- query: チェックするクエリのパラメータ名
- value: 攻撃と判断するクエリの中身

2. CSVファイルからJSONファイルに変換
```
docker exec -it wojs_waf npm run setup
```

3. WAFの再起動
```
docker exec -it wojs_waf npm start
```

### チェッカーの追加
Webアプリケーションに対する攻撃を検知するチェッカーを追加できる。現状は、クエリのパラメータを解析して攻撃を検知する`queryChecker`のみである。

1. `waf/my_modules/checker.js`の編集
<br>チェッカー関数を作成し、`checkers`オブジェクトに関数を追加する。なお、チェッカー関数はtrueまたはfalseを返す必要がある。

```
const newChecker = (req) => {
  if(〜〜〜){
    return true;
  }

  return false;
}

const checkers = {
  queryChecker,
  newChecker
};
```

2. WAFの再起動
```
docker exec -it wojs_waf npm start
```

<div style="page-break-before:always"/>

## 例: SQLインジェクションのブロック
OWASP Juice Shopでは商品検索で使われているクエリを利用することで、SQLインジェクションを引き起こすことが可能である。以下のクエリをWebサーバ（:3000）に直接送信することで、ユーザ情報をJSONで入手することが可能である。
<br>`http://localhost:3000/rest/products/search?q=!')) UNION SELECT id, username, email, password, role, lastLoginIp, profileImage, totpSecret, isActive FROM Users--`
- pathname: `/rest/products/search`
- query: `q`
- value: `!')) UNION SELECT id, username, email, password, role, lastLoginIp, profileImage, totpSecret, isActive FROM Users--`

<div align="center"><img alt="attack" src="https://user-images.githubusercontent.com/52265154/68771290-1ca40500-066b-11ea-9ecb-a5a0164f1245.png"></div>

UNION文を利用しているため、カラム名は別のものになっているが、ユーザのメールアドレスやパスワードなどが入手できる。パスワードはmd5のハッシュ値となっているが、ハッシュのデータベースなどで元のパスワードを探すことができれば、他人のユーザでログインが可能である。

### SQLインジェクションを防ぐためにブロックするクエリを追加
#### waf/datas/query-check.csv
```
pathname,query,value
/rest/products/search,q,'
```
<div align="center">
<table>
	<tr align="center">
		<td>pathname</td>
		<td>query</td>
		<td>value</td>
	</tr>
	<tr align="center">
		<td>/rest/products/search</td>
		<td>q</td>
		<td>'</td>
	</tr>
</table>
</div>

『`http://localhost/rest/products/search`』へのクエリで、『`q`』というパラメータの中身に、『`'`』が含まれているときブロックする

<div style="page-break-before:always"/>

### WAFを通して攻撃クエリを送信
`http://localhost/rest/products/search?q=!')) UNION SELECT id, username, email, password, role, lastLoginIp, profileImage, totpSecret, isActive FROM Users--`

<div align="center"><img alt="block" src="https://user-images.githubusercontent.com/52265154/68771325-2c234e00-066b-11ea-8e2c-a9e26f28a755.png"></div>

WAFによって攻撃クエリがブロックされた。
