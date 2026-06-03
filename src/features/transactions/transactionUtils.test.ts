import { describe, expect, it } from "vitest";
import type { Transaction } from "./transactionTypes";
import {
  getBalance,
  getBalanceOverTime,
  getBudgetActuals,
  getCategorySpendingTrend,
  getCumulativeMonthlySpending,
  getDailySpending,
  getExpensesByCategory,
  getExpensesByType,
  getIncomeByCategory,
  getLatestTransactionMonth,
  getMonthlyCashflow,
  getSavingsRateOverTime,
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
    expenseType: "variable",
    category: "Food",
    date: "2026-06-02",
  },
  {
    id: "3",
    title: "Bus card",
    amount: 1020,
    type: "expense",
    expenseType: "fixed",
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

  it("groups income and expenses by month", () => {
    expect(getMonthlyCashflow(transactions)).toEqual([
      {
        month: "2026-06",
        income: 32000,
        expenses: 1670,
      },
    ]);
  });

  it("calculates running balance over time", () => {
    expect(getBalanceOverTime(transactions)).toEqual([
      {
        date: "2026-06-01",
        balance: 32000,
      },
      {
        date: "2026-06-01",
        balance: 30980,
      },
      {
        date: "2026-06-02",
        balance: 30330,
      },
    ]);
  });

  it("groups spending by category and month", () => {
    expect(getCategorySpendingTrend(transactions)).toEqual([
      {
        month: "2026-06",
        categories: {
          Food: 650,
          Transport: 1020,
        },
      },
    ]);
  });

  it("gets latest transaction month", () => {
    expect(getLatestTransactionMonth(transactions)).toBe("2026-06");
  });

  it("groups daily spending for a month", () => {
    expect(getDailySpending(transactions, "2026-06")).toEqual([
      {
        date: "2026-06-01",
        amount: 1020,
      },
      {
        date: "2026-06-02",
        amount: 650,
      },
    ]);
  });

  it("groups income by category", () => {
    expect(getIncomeByCategory(transactions)).toMatchObject({
      Salary: 32000,
    });
  });

  it("calculates savings rate by month", () => {
    expect(getSavingsRateOverTime(transactions)).toEqual([
      {
        month: "2026-06",
        savingsRate: 94.78125,
      },
    ]);
  });

  it("calculates cumulative monthly spending", () => {
    expect(getCumulativeMonthlySpending(transactions, "2026-06")).toEqual([
      {
        date: "2026-06-01",
        amount: 1020,
      },
      {
        date: "2026-06-02",
        amount: 1670,
      },
    ]);
  });

  it("compares budgets with actual spending", () => {
    expect(
      getBudgetActuals(transactions, [
        {
          category: "Food",
          budget: 3000,
        },
      ]),
    ).toEqual([
      {
        category: "Food",
        budget: 3000,
        actual: 650,
      },
    ]);
  });

  it("groups expenses by fixed and variable type", () => {
    expect(getExpensesByType(transactions)).toEqual([
      {
        expenseType: "fixed",
        amount: 1020,
      },
      {
        expenseType: "variable",
        amount: 650,
      },
    ]);
  });
});
