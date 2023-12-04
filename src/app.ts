import cors from "cors";
import type { Express } from "express";
import express from "express";
import customerController from "./controllers/customerController";
import orderController from "./controllers/orderController";
import ordersController from "./controllers/ordersController";
import rankingController from "./controllers/rankingController";

const corsOptions = {
  origin: "http://localhost:3001",
  optionsSuccessStatus: 200,
};

const app: Express = express();
app.use(express.json());
app.use(cors(corsOptions));
// TODO: 認証のミドルウェア導入 app.use()

app.use("/api/v1/customer", customerController);
app.use("/api/v1/order", orderController);
app.use("/api/v1/orders", ordersController);
app.use("/api/v1/ranking", rankingController);

export default app;
