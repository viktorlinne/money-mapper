import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { fetchBudgets } from "../features/budgets/budgetApi";
import type { Budget } from "../features/budgets/budgetTypes";
import { fetchSubscriptions } from "../features/subscriptions/subscriptionApi";
import type { Subscription } from "../features/subscriptions/subscriptionTypes";
import { fetchTransactions } from "../features/transactions/transactionApi";
import type { Transaction } from "../features/transactions/transactionTypes";
import {
  formatCurrency,
  getBudgetActuals,
  getExpensesByCategory,
  getTotalExpenses,
  getTotalIncome,
} from "../features/transactions/transactionUtils";

const currentMonth = () => new Date().toISOString().slice(0, 7);

export function ReportsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [month, setMonth] = useState(currentMonth());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadReportData() {
      try {
        const [apiTransactions, apiBudgets, apiSubscriptions] =
          await Promise.all([
            fetchTransactions(),
            fetchBudgets(month),
            fetchSubscriptions(),
          ]);

        setTransactions(apiTransactions);
        setBudgets(apiBudgets);
        setSubscriptions(apiSubscriptions);
      } catch (error) {
        console.error(error);
        setErrorMessage("Could not load report data.");
      }
    }

    loadReportData();
  }, [month]);

  const report = useMemo(() => {
    const monthTransactions = transactions.filter((transaction) =>
      transaction.date.startsWith(month),
    );
    const income = getTotalIncome(monthTransactions);
    const expenses = getTotalExpenses(monthTransactions);
    const savings = income - expenses;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;
    const budgetActuals = getBudgetActuals(
      monthTransactions,
      budgets.map((budget) => ({
        category: budget.category,
        budget: budget.amount,
      })),
    );
    const budgetWarnings = budgetActuals.filter(
      (budget) => budget.actual >= budget.budget * 0.8,
    );
    const categoryTotals = Object.entries(getExpensesByCategory(monthTransactions))
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
    const monthlySubscriptionCost = subscriptions
      .filter((subscription) => subscription.status === "active")
      .reduce(
        (sum, subscription) =>
          sum +
          (subscription.billingCycle === "yearly"
            ? subscription.amount / 12
            : subscription.amount),
        0,
      );

    return {
      income,
      expenses,
      savings,
      savingsRate,
      budgetWarnings,
      categoryTotals,
      monthlySubscriptionCost,
    };
  }, [budgets, month, subscriptions, transactions]);

  const insights = [
    report.savings >= 0
      ? `You kept ${formatCurrency(report.savings)} after expenses this month.`
      : `You spent ${formatCurrency(Math.abs(report.savings))} more than income this month.`,
    report.budgetWarnings.length > 0
      ? `${report.budgetWarnings.length} budget categories are near limit or over budget.`
      : "No budget warnings for this month.",
    `Active subscriptions cost about ${formatCurrency(report.monthlySubscriptionCost)} per month.`,
  ];

  function exportReportCsv() {
    const rows = [
      ["metric", "value"],
      ["income", report.income],
      ["expenses", report.expenses],
      ["savings", report.savings],
      ["savingsRate", report.savingsRate.toFixed(1)],
      ["monthlySubscriptionCost", report.monthlySubscriptionCost],
    ];

    downloadFile(
      rows.map((row) => row.join(",")).join("\n"),
      `moneymapper-report-${month}.csv`,
      "text/csv;charset=utf-8",
    );
  }

  return (
    <section>
      <p className="text-sm font-medium text-ink-muted">Reports</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">
        Monthly report
      </h1>
      <p className="mt-2 text-ink-secondary">
        Review income, expenses, savings, budget warnings, and subscriptions.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          value={month}
          onChange={(event) => setMonth(event.target.value)}
          type="month"
          className="rounded-xl border border-structure bg-surface px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent-ring"
        />
        <button
          type="button"
          onClick={exportReportCsv}
          className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-deep"
        >
          Export report CSV
        </button>
      </div>

      {errorMessage && (
        <div className="mt-6 rounded-2xl border border-negative-border bg-negative-bg p-4 text-sm font-medium text-negative-text">
          {errorMessage}
        </div>
      )}

      <motion.div
        className="mt-6 grid gap-4 md:grid-cols-4"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.055 } },
        }}
      >
        <ReportCard label="Income" value={formatCurrency(report.income)} />
        <ReportCard label="Expenses" value={formatCurrency(report.expenses)} />
        <ReportCard label="Savings" value={formatCurrency(report.savings)} />
        <ReportCard
          label="Savings rate"
          value={`${report.savingsRate.toFixed(1)}%`}
        />
      </motion.div>

      <motion.div
        className="mt-6 grid gap-6 lg:grid-cols-3"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
        }}
      >
        <motion.section
          className="rounded-2xl border border-structure bg-surface p-5"
          variants={panelVariants}
        >
          <h2 className="text-lg font-semibold text-ink">Written insights</h2>
          <ul className="mt-4 space-y-3">
            {insights.map((insight) => (
              <li
                key={insight}
                className="rounded-xl bg-surface-low p-3 text-sm text-ink-muted"
              >
                {insight}
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.section
          className="rounded-2xl border border-structure bg-surface p-5"
          variants={panelVariants}
        >
          <h2 className="text-lg font-semibold text-ink">Top categories</h2>
          <div className="mt-4 space-y-3">
            {report.categoryTotals.length > 0 ? (
              report.categoryTotals.map(([category, amount]) => (
                <div
                  key={category}
                  className="flex justify-between rounded-xl bg-surface-low p-3 text-sm"
                >
                  <span className="font-medium text-ink">{category}</span>
                  <span className="font-semibold text-negative">
                    {formatCurrency(amount)}
                  </span>
                </div>
              ))
            ) : (
              <p className="rounded-xl bg-surface-low p-3 text-sm text-ink-muted">
                No expense categories for this month.
              </p>
            )}
          </div>
        </motion.section>

        <motion.section
          className="rounded-2xl border border-structure bg-surface p-5"
          variants={panelVariants}
        >
          <h2 className="text-lg font-semibold text-ink">Budget warnings</h2>
          <div className="mt-4 space-y-3">
            {report.budgetWarnings.length > 0 ? (
              report.budgetWarnings.map((budget) => (
                <div
                  key={budget.category}
                  className="rounded-xl bg-negative-bg p-3 text-sm text-negative-text"
                >
                  <span className="font-semibold">{budget.category}</span>{" "}
                  reached {formatCurrency(budget.actual)} of{" "}
                  {formatCurrency(budget.budget)}.
                </div>
              ))
            ) : (
              <p className="rounded-xl bg-surface-low p-3 text-sm text-ink-muted">
                No near-limit or over-budget categories.
              </p>
            )}
          </div>
        </motion.section>
      </motion.div>
    </section>
  );
}

const panelVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

function ReportCard({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      className="rounded-2xl border border-structure bg-surface p-5"
      variants={panelVariants}
      transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="text-sm font-medium text-ink-muted">{label}</p>
      <p className="mt-2 text-2xl font-bold text-ink">{value}</p>
    </motion.div>
  );
}

function downloadFile(content: string, fileName: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}
