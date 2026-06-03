import { describe, expect, it } from "vitest";
import type { Transaction } from "./transactionTypes";
import {
  getBalance,
  getExpensesByCategory,
  getTotalExpenses,
  getTotalIncome,
} from "./transactionUtils";

const transactions: Transaction[] = [
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
    title: "Groceries",
    amount: 650,
    type: "expense",
    category: "Food",
    date: "2026-06-02",
  },
  {
    id: "3",
    title: "Bus card",
    amount: 1020,
    type: "expense",
    category: "Transport",
    date: "2026-06-01",
  },
];

describe("transactionUtils", () => {
  it("calculates income, expenses, and balance", () => {
    expect(getTotalIncome(transactions)).toBe(32000);
    expect(getTotalExpenses(transactions)).toBe(1670);
    expect(getBalance(transactions)).toBe(30330);
  });

  it("groups expenses by category", () => {
    expect(getExpensesByCategory(transactions)).toMatchObject({
      Food: 650,
      Transport: 1020,
    });
  });
});
