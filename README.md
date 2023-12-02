# customer-ranking

# 構築時の参考資料

- https://reffect.co.jp/node-js/express-typescript

# DB操作方法

## DB立ち上げ

```
docker-compose up -d
```

## マイグレーション

```
npm run prism:migrate
```

## データ流し込み

```
npm run prism:seed
```

## データベースの中身をGUIで確認

```
npx prisma studio
```

# 設計

## REST API End Point

### Requirements

3. 顧客のIDが与えられたときに、その顧客に関する情報を返すエンドポイント。

| Method | Path                 | Description                       |
| ------ | -------------------- | --------------------------------- |
| GET    | /api/v1/customer/:id | show customer ranking information |

```
curl -X POST http://localhost:3000/api/v1/customer/1
```

### Requirements

4. 注文ID、日付、および注文を含む、昨年開始以降の顧客の注文を一覧表示するエンドポイント
   ※ queryの対応は未実装

| Method | Path & Query             | Description                |
| ------ | ------------------------ | -------------------------- |
| GET    | /api/v1/orders?from=2022 | show orders from last year |

```
curl -X POST http://localhost:3000/api/v1/orders
```

### Requirements

1. 注文を完了するためのエンドポイントは、データベースに注文を保存し、顧客のランクをその時点で再計算する必要があります。

| Method | Path          | Description      |
| ------ | ------------- | ---------------- |
| POST   | /api/v1/order | do post to order |

#### Request Body

```
curl -X POST http://localhost:3000/api/v1/order \
-H 'content-type: application/json' \
-d '{ "customer_id": 123, "customerName": "Taro Suzuki", "orderId": "A123", "totalInCents": 3450, "date": "2022-03-04T05:29:59.850Z" }'
```

### Requirements

2. 毎年末に各顧客の現在のランクを再計算する

| Method | Path            | Description                  |
| ------ | --------------- | ---------------------------- |
| POST   | /api/v1/ranking | update all customers ranking |

```
curl -X POST http://localhost:3000/api/v1/ranking
```

## Table

### Payment

| Field           | Type      | Desc                             |
| --------------- | --------- | -------------------------------- |
| id              | BIGINT    | 決済ID                           |
| (credit_number) | TEXT      | クレジットカード番号(暗号化済み) |
| amount          | BIGINT    | 決済金額                         |
| paid_at         | TIMESTAMP | 決済時間                         |
| customer_id     | BIGINT    | 顧客ID                           |
| order_id        | BIGINT    | 注文ID                           |

### Order

| Field          | Type      | Desc     |
| -------------- | --------- | -------- |
| id             | BIGINT    | 注文ID   |
| total_in_cents | NUMERIC   | 合計金額 |
| ordered_at     | TIMESTAMP | 注文時間 |
| customer_id    | BIGINT    | 顧客ID   |
| payment_id     | BIGINT    | 決済ID   |

### Customer

| Field                        | Type      | Desc                   |
| ---------------------------- | --------- | ---------------------- |
| id                           | BIGINT    | 顧客ID                 |
| name                         | TEXT      | 名前                   |
| email                        | TEXT      | メールアドレス         |
| address                      | TEXT      | 住所                   |
| registered_at                | TIMESTAMP | 登録日                 |
| total_payment_from_last_year | BIGINT    | この一年での合計支払額 |
