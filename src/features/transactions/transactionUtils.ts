import type {
  ExpenseType,
  Transaction,
  TransactionCategory,
} from "./transactionTypes";

export type MonthlyCashflow = {
  month: string;
  income: number;
  expenses: number;
};

export type BalancePoint = {
  date: string;
  balance: number;
};

export type CategorySpendingTrend = {
  month: string;
  categories: Partial<Record<TransactionCategory, number>>;
};

export type DailyAmount = {
  date: string;
  amount: number;
};

export type SavingsRatePoint = {
  month: string;
  savingsRate: number;
};

export type CategoryBudget = {
  category: TransactionCategory;
  budget: number;
};

export type BudgetActual = CategoryBudget & {
  actual: number;
};

export type ExpenseTypeTotal = {
  expenseType: ExpenseType;
  amount: number;
};

export function getTotalIncome(transactions: Transaction[]) {
  return transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
}

export function getTotalExpenses(transactions: Transaction[]) {
  return transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
}

export function getBalance(transactions: Transaction[]) {
  return getTotalIncome(transactions) - getTotalExpenses(transactions);
}

export function getExpensesByCategory(transactions: Transaction[]) {
  return transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce<Record<TransactionCategory, number>>(
      (totals, transaction) => {
        totals[transaction.category] =
          (totals[transaction.category] ?? 0) + transaction.amount;

        return totals;
      },
      {} as Record<TransactionCategory, number>,
    );
}

export function getMonthlyCashflow(transactions: Transaction[]) {
  const monthlyTotals = transactions.reduce<Record<string, MonthlyCashflow>>(
    (totals, transaction) => {
      const month = transaction.date.slice(0, 7);

      totals[month] ??= {
        month,
        income: 0,
        expenses: 0,
      };

      if (transaction.type === "income") {
        totals[month].income += transaction.amount;
      } else {
        totals[month].expenses += transaction.amount;
      }

      return totals;
    },
    {},
  );

  return Object.values(monthlyTotals).sort((a, b) =>
    a.month.localeCompare(b.month),
  );
}

export function getBalanceOverTime(transactions: Transaction[]) {
  let runningBalance = 0;

  return [...transactions]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map<BalancePoint>((transaction) => {
      runningBalance +=
        transaction.type === "income"
          ? transaction.amount
          : -transaction.amount;

      return {
        date: transaction.date,
        balance: runningBalance,
      };
    });
}

export function getCategorySpendingTrend(transactions: Transaction[]) {
  const monthlyCategoryTotals = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce<Record<string, CategorySpendingTrend>>((totals, transaction) => {
      const month = transaction.date.slice(0, 7);

      totals[month] ??= {
        month,
        categories: {},
      };

      totals[month].categories[transaction.category] =
        (totals[month].categories[transaction.category] ?? 0) +
        transaction.amount;

      return totals;
    }, {});

  return Object.values(monthlyCategoryTotals).sort((a, b) =>
    a.month.localeCompare(b.month),
  );
}

export function getLatestTransactionMonth(transactions: Transaction[]) {
  return [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .at(0)
    ?.date.slice(0, 7);
}

export function getDailySpending(transactions: Transaction[], month: string) {
  const dailyTotals = transactions
    .filter(
      (transaction) =>
        transaction.type === "expense" && transaction.date.startsWith(month),
    )
    .reduce<Record<string, DailyAmount>>((totals, transaction) => {
      totals[transaction.date] ??= {
        date: transaction.date,
        amount: 0,
      };

      totals[transaction.date].amount += transaction.amount;

      return totals;
    }, {});

  return Object.values(dailyTotals).sort((a, b) =>
    a.date.localeCompare(b.date),
  );
}

export function getIncomeByCategory(transactions: Transaction[]) {
  return transactions
    .filter((transaction) => transaction.type === "income")
    .reduce<Record<TransactionCategory, number>>(
      (totals, transaction) => {
        totals[transaction.category] =
          (totals[transaction.category] ?? 0) + transaction.amount;

        return totals;
      },
      {} as Record<TransactionCategory, number>,
    );
}

export function getSavingsRateOverTime(transactions: Transaction[]) {
  return getMonthlyCashflow(transactions).map<SavingsRatePoint>((cashflow) => ({
    month: cashflow.month,
    savingsRate:
      cashflow.income > 0
        ? ((cashflow.income - cashflow.expenses) / cashflow.income) * 100
        : 0,
  }));
}

export function getCumulativeMonthlySpending(
  transactions: Transaction[],
  month: string,
) {
  let cumulativeAmount = 0;

  return getDailySpending(transactions, month).map<DailyAmount>(
    (dailyTotal) => {
      cumulativeAmount += dailyTotal.amount;

      return {
        date: dailyTotal.date,
        amount: cumulativeAmount,
      };
    },
  );
}

export function getBudgetActuals(
  transactions: Transaction[],
  budgets: CategoryBudget[],
) {
  const expensesByCategory = getExpensesByCategory(transactions);

  return budgets.map<BudgetActual>((budget) => ({
    ...budget,
    actual: expensesByCategory[budget.category] ?? 0,
  }));
}

export function getExpensesByType(transactions: Transaction[]) {
  const totals = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce<Record<ExpenseType, number>>(
      (expenseTypeTotals, transaction) => {
        const expenseType = transaction.expenseType ?? "variable";

        expenseTypeTotals[expenseType] += transaction.amount;

        return expenseTypeTotals;
      },
      {
        fixed: 0,
        variable: 0,
      },
    );

  return Object.entries(totals).map<ExpenseTypeTotal>(
    ([expenseType, amount]) => ({
      expenseType: expenseType as ExpenseType,
      amount,
    }),
  );
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  }).format(amount);
}
