const BRONZE = "BRONZE";
const SILVER = "SILVER";
const GOLD = "GOLD";

export const Ranking = { BRONZE, SILVER, GOLD } as const;
export type TRanking = (typeof Ranking)[keyof typeof Ranking];

export const PAYMENT_FOR_SILVER = 100;
export const PAYMENT_FOR_GOLD = 500;
