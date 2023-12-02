import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import { OrderService } from "../services/orderService";

const router = Router();
const prisma = new PrismaClient();
const orderService = new OrderService();

// GET /api/v1/orders
router.get("/", async (req: Request, res: Response) => {
  try {
    // TODO: 認証

    const orders = await orderService.getAll(prisma);
    console.log("orders", orders);

    res.json({ orders });
  } catch (e) {
    throw new Error("can not get orders");
  }
});

export default router;
