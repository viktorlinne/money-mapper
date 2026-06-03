export type TransactionType = "income" | "expense";

export type TransactionCategory =
  | "Salary"
  | "Food"
  | "Transport"
  | "Housing"
  | "Entertainment"
  | "Health"
  | "Subscriptions"
  | "Other";

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
};
