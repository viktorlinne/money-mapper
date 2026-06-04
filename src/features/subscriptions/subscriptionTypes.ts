import type { TransactionCategory } from "../transactions/transactionTypes";

export type BillingCycle = "monthly" | "yearly";
export type SubscriptionStatus = "active" | "cancelled";

export type Subscription = {
  id: string;
  name: string;
  amount: number;
  billingCycle: BillingCycle;
  renewalDate: string;
  status: SubscriptionStatus;
  category: TransactionCategory;
};

export type SubscriptionInput = Omit<Subscription, "id">;
