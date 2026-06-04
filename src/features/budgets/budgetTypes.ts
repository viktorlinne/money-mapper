import type { TransactionCategory } from "../transactions/transactionTypes";

export type Budget = {
  id: string;
  month: string;
  category: TransactionCategory;
  amount: number;
};

export type BudgetInput = Omit<Budget, "id">;
