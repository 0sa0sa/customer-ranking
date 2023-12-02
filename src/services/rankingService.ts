import { Customer, PrismaClient } from "@prisma/client";
import { PAYMENT_FOR_GOLD, PAYMENT_FOR_SILVER, Ranking, TRanking } from "../constants/ranking";

import dayjs from "dayjs";
import { OrderService } from "./orderService";
import { PaymentService } from "./paymentService";

type RankingResponse = {
  currentRankingColor: TRanking;
  downGradDate: string;
  firstOrderDate: string | null;
  nextRanking: TRanking;
  restPaymentForNextRanking: number | null;
  restPaymentToKeepRanking: number;
  thisYearPayment: number;
};

type TotalPaymentPerCustomer = {
  [customerId: number]: number;
};

type CustomerAndOrderJoined = {
  customer_id: number;
  name: string;
  email: string;
  address: string;
  registered_at: Date;
  total_payment_from_last_year: number;
  order_id: string;
  ordered_at: Date;
  total_in_cents: number;
}[];

export class RankingService {
  constructor() {}

  /**
   * getRanking
   * 指定した顧客IDの顧客情報のランキング情報を取得
   */
  public async getRankingInfo(prisma: PrismaClient, customer: Customer): Promise<RankingResponse> {
    const orderService = new OrderService();
    const paymentService = new PaymentService();

    const orders = await orderService.findAll(prisma, customer.id);

    // Date.
    const firstOrderDate =
      orders
        .sort((a, b) => {
          return a.ordered_at.getTime() - b.ordered_at.getTime();
        })[0]
        .ordered_at.toDateString() ?? null;
    const downGradDate = `${dayjs().year()}-12-31`;

    // Ranking & Payment.
    const currentRankingColor = this.getRankingColor(customer.total_payment_from_last_year);

    const restPaymentForNextRanking = paymentService.getRestPaymentForNextRanking(
      customer.total_payment_from_last_year,
    );

    const thisYearPayment = paymentService.getThisYearPayment(orders);

    const nextRanking = this.getNextYearRanking(thisYearPayment);

    const restPaymentToKeepRanking = paymentService.getRestPaymentToKeepRanking(
      thisYearPayment,
      currentRankingColor,
      nextRanking,
    );

    return {
      currentRankingColor,
      downGradDate,
      firstOrderDate,
      nextRanking,
      restPaymentForNextRanking,
      restPaymentToKeepRanking,
      thisYearPayment,
    };
  }

  /**
   * updateTotalPayment
   * 今年の支払い総額を計算して更新
   */
  public async updateTotalPayment(prisma: PrismaClient) {
    const totalPaymentPerCustomer: TotalPaymentPerCustomer = {};

    const customerAndOrderJoined = await prisma.$queryRaw<CustomerAndOrderJoined>`
    SELECT
    "Customer".id AS customer_id,
    "Customer".name,
    "Customer".email,
    "Customer".address,
    "Customer".registered_at,
    "Customer".total_payment_from_last_year,
    "Order".order_id AS order_id,
    "Order".ordered_at,
    "Order".total_in_cents
    FROM
    "Customer"
    LEFT JOIN
    "Order"
    ON
    "Customer".id = "Order".customer_id;`;

    customerAndOrderJoined.forEach((row) => {
      const isThisYearOrder = row.ordered_at.getTime() > dayjs().year();
      if (!isThisYearOrder) {
        return;
      }
      const customerId = row.customer_id;
      totalPaymentPerCustomer[customerId] = totalPaymentPerCustomer[customerId] ?? 0 + row.total_in_cents;
    });

    await Promise.all(
      Object.entries(totalPaymentPerCustomer).map(async ([customerId, thisYearPayment]) => {
        await prisma.customer.update({
          where: { id: parseInt(customerId) },
          data: { total_payment_from_last_year: thisYearPayment },
        });
      }),
    );
  }

  /**
   * getRankingColor
   * 支払い総額からランキングを計算
   */
  private getRankingColor(totalPayment: number): TRanking {
    if (totalPayment < PAYMENT_FOR_SILVER) {
      return Ranking.BRONZE;
    } else if (totalPayment < PAYMENT_FOR_GOLD) {
      return Ranking.SLIVER;
    } else {
      return Ranking.GOLD;
    }
  }

  /**
   * getNextYearRanking
   * 今年の支払い総額から来年のランキングを計算
   */
  private getNextYearRanking(thisYearPayment: number): TRanking {
    const nextYearRanking = this.getRankingColor(thisYearPayment);
    return nextYearRanking;
  }
}
