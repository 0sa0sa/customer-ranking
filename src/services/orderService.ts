import { Order, PrismaClient } from "@prisma/client";

export class OrderService {
  constructor() {}

  /**
   * validate
   * 注文前のバリデーション（未実装） 
   */
  public validate() {
    // TODO: validation
    return true;
  }

  /**
   * getAll
   * 全ての注文情報を取得
   */
  public async getAll(prisma: PrismaClient): Promise<Order[]> {
    const orders = await prisma.order.findMany();
    return orders;
  }

  /**
   * findAll
   * 指定した顧客IDの注文情報を取得
   */
  public async findAll(prisma: PrismaClient, customerId: number): Promise<Order[]> {
    const orders = await prisma.order.findMany({
      where: { customer_id: customerId },
    });
    return orders;
  }

  /**
   * insert
   * 指定した顧客IDの注文情報を追加
   */
  public async insert(
    prisma: PrismaClient,
    totalInCents: number,
    orderedAt: string,
    customerId: number,
    orderId: string,
  ) {
    await prisma.order.create({
      data: { customer_id: customerId, total_in_cents: totalInCents, ordered_at: orderedAt, order_id: orderId },
    });
  }
}
