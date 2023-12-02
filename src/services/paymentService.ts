import { Order, PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { PAYMENT_FOR_GOLD, PAYMENT_FOR_SILVER, Ranking, TRanking } from "../constants/ranking";

export class PaymentService {
  constructor() {}

  /**
   * validate
   * 支払い前のバリデーション（未実装）
   */
  private validate() {
    // TODO: validate payment
    return true;
  }

  /**
   * doPayment
   * 支払い処理（未実装）
   */
  public doPayment() {
    const canPay = this.validate();
    if (canPay) {
      // TODO: do payment
    } else {
      throw new Error("Payment failed");
    }
  }

  /**
   * insert
   * 指定した顧客IDに対する支払い情報を追加
   */
  public async insert(prisma: PrismaClient, amount: number, orderId: string, customerId: number) {
    await prisma.payment.create({
      data: { amount, paid_at: new Date(), order_id: orderId, customer_id: customerId },
    });
  }

  /**
   * getThisYearPayment
   * 今年の支払い総額を計算
   */
  public getThisYearPayment(orders: Order[]): number {
    const thisYearOrders = orders.filter((order) => {
      return order.ordered_at.getTime() > dayjs().year();
    });
    const thisYearPayment = thisYearOrders.reduce((acc, order) => {
      return acc + order.total_in_cents;
    }, 0);
    return thisYearPayment;
  }

  /**
   * getRestPaymentForNextRanking
   * 次のランクまでに必要な支払い総額を計算
   */
  public getRestPaymentForNextRanking(totalPayment: number): number | null {
    const restPaymentForBronze = totalPayment - PAYMENT_FOR_SILVER;
    if (restPaymentForBronze < 0) {
      return -restPaymentForBronze;
    }

    const restPaymentForSilver = totalPayment - PAYMENT_FOR_GOLD;
    if (restPaymentForSilver < 0) {
      return -restPaymentForSilver;
    }
    return null;
  }

  /**
   * getRestPaymentToKeepRanking
   * 現在のランクを維持するために必要な支払い総額を計算
   */
  public getRestPaymentToKeepRanking(
    thisYearPayment: number,
    thisYearRanking: TRanking,
    nextYearRanking: TRanking,
  ): number {
    if (thisYearRanking === nextYearRanking) {
      return 0;
    }
    if (thisYearRanking === Ranking.BRONZE) {
      // NOTE: nextYearRanking must be only BRONZE
      if (nextYearRanking === Ranking.SLIVER || nextYearRanking === Ranking.GOLD) {
        throw new Error("invalid nextYearRanking");
      }
      return 0;
    }
    if (thisYearRanking === Ranking.SLIVER) {
      if (nextYearRanking === Ranking.GOLD) {
        throw new Error("invalid nextYearRanking");
      }
      if (nextYearRanking === Ranking.BRONZE) {
        return PAYMENT_FOR_SILVER - thisYearPayment;
      }
    }
    if (thisYearRanking === Ranking.GOLD) {
      return PAYMENT_FOR_GOLD - thisYearPayment;
    }
    return 0;
  }
}
