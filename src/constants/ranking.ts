const BRONZE = "BRONZE";
const SLIVER = "SLIVER";
const GOLD = "GOLD";

export const Ranking = { BRONZE, SLIVER, GOLD } as const;
export type TRanking = (typeof Ranking)[keyof typeof Ranking];

export const PAYMENT_FOR_SILVER = 100;
export const PAYMENT_FOR_GOLD = 500;
