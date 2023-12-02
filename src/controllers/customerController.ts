import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import { CustomerService } from "../services/customerService";
import { RankingService } from "../services/rankingService";

const router = Router();
const prisma = new PrismaClient();
const customerService = new CustomerService();
const rankingService = new RankingService();

// GET /customer/:id
router.get("/:id", async (req: Request, res: Response) => {
  // TODO: 認証
  const customer = await customerService.findOne(prisma, parseInt(req.params?.id));

  if (customer === null) {
    throw new Error("customer not found");
  }

  // calculate ranking
  const rankingInfo = await rankingService.getRankingInfo(prisma, customer);
  res.json({ customer, rankingInfo });
});

export default router;
