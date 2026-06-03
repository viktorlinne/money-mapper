export type TransactionType = "income" | "expense";

export type ExpenseType = "fixed" | "variable";

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
  expenseType?: ExpenseType | null;
  category: TransactionCategory;
  date: string;
};
