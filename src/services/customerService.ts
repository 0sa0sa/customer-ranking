import { Customer, PrismaClient } from "@prisma/client";

export class CustomerService {
  constructor() {}

  /**
   * findOne
   * 指定した顧客IDの顧客情報を取得
   */
  public async findOne(prisma: PrismaClient, id: number): Promise<Customer | null> {
    try {
      const customer = await prisma.customer.findUnique({
        where: { id },
      });
      return customer;
    } catch (e) {
      console.error("customer not found", id);
      return null;
    }
  }

  /**
   * updateTotalPayment
   * 指定した顧客IDの顧客情報の支払い総額を更新
   */
  public async updateTotalPayment(prisma: PrismaClient, id: number, totalInCents: number): Promise<Customer> {
    const customer = await prisma.customer.findUnique({
      where: { id },
    });

    if (customer === null) {
      throw new Error("customer not found");
    } else {
      const totalPaymentFromLastYear = customer?.total_payment_from_last_year ?? 0 + totalInCents;

      const updatedCustomer = await prisma.customer.update({
        where: { id },
        data: { total_payment_from_last_year: totalPaymentFromLastYear },
      });

      return updatedCustomer;
    }
  }
}
