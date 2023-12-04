import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import { RankingService } from "../services/rankingService";

const router = Router();
const prisma = new PrismaClient();
const rankingService = new RankingService();

// POST /api/v1/ranking
router.post("/", async (req: Request, res: Response) => {
  // TODO: 認証
  try {
    await rankingService.updateTotalPayment(prisma);
    res.status(204).send();
  } catch (err) {
    // TODO: error handling
    // res.status(500).send();
  }
});

export default router;
