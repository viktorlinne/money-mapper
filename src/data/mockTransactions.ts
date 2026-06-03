import type { Transaction } from "../features/transactions/transactionTypes";

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    title: "Salary",
    amount: 32000,
    type: "income",
    category: "Salary",
    date: "2026-06-01",
  },
  {
    id: "2",
    title: "ICA groceries",
    amount: 650,
    type: "expense",
    expenseType: "variable",
    category: "Food",
    date: "2026-06-02",
  },
  {
    id: "3",
    title: "Rent",
    amount: 8500,
    type: "expense",
    expenseType: "fixed",
    category: "Housing",
    date: "2026-06-01",
  },
  {
    id: "4",
    title: "Spotify",
    amount: 119,
    type: "expense",
    expenseType: "fixed",
    category: "Subscriptions",
    date: "2026-06-03",
  },
  {
    id: "5",
    title: "Bus card",
    amount: 1020,
    type: "expense",
    expenseType: "fixed",
    category: "Transport",
    date: "2026-06-01",
  },
];
