import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import { CustomerService } from "../services/customerService";
import { OrderService } from "../services/orderService";
import { PaymentService } from "../services/paymentService";

const router = Router();
const prisma = new PrismaClient();
const orderService = new OrderService();
const paymentService = new PaymentService();
const customerService = new CustomerService();

type OrderPostRequest = {
  customerId: number;
  customerName: string;
  orderId: string;
  totalInCents: number;
  date: string;
};

// POST /api/v1/order
router.post("/", async (req: Request, res: Response) => {
  try {
    // TODO: check CSRF token

    // TODO: need validation
    const { customerId, orderId, totalInCents, date: orderedAt } = req.body as OrderPostRequest;

    // validation
    const canOrder = orderService.validate();
    if (!canOrder) {
      throw new Error("can not order");
    }

    await prisma.$transaction(async (tx) => {
      // payment
      // add await
      paymentService.doPayment();
      await paymentService.insert(tx, totalInCents, orderId, customerId);

      // order
      await orderService.insert(tx, totalInCents, orderedAt, customerId, orderId);

      // customer
      const updatedCustomer = customerService.updateTotalPayment(tx, customerId, totalInCents);

      res.json({ customer: updatedCustomer });
    });
  } catch (e) {
    // TODO: don't need rollback
  }
});

export default router;
