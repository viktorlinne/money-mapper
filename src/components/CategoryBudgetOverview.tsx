import { categoryBudgets } from "../features/budgets/budgetData";
import type { Transaction } from "../features/transactions/transactionTypes";
import {
  formatCurrency,
  getBudgetActuals,
} from "../features/transactions/transactionUtils";

type CategoryBudgetOverviewProps = {
  transactions: Transaction[];
};

export function CategoryBudgetOverview({
  transactions,
}: CategoryBudgetOverviewProps) {
  const budgetActuals = getBudgetActuals(transactions, categoryBudgets);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">Category budgets</h2>
      <p className="mt-2 text-sm text-slate-500">
        Track spending against starter monthly budgets.
      </p>

      <div className="mt-6 space-y-4">
        {budgetActuals.map((item) => {
          const percentage = Math.min((item.actual / item.budget) * 100, 100);
          const isOverBudget = item.actual > item.budget;

          return (
            <div key={item.category}>
              <div className="mb-2 flex justify-between gap-3 text-sm">
                <span className="font-medium text-slate-700">
                  {item.category}
                </span>
                <span
                  className={isOverBudget ? "text-rose-600" : "text-slate-500"}
                >
                  {formatCurrency(item.actual)} / {formatCurrency(item.budget)}
                </span>
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div
                  className={
                    isOverBudget
                      ? "h-3 rounded-full bg-rose-500"
                      : "h-3 rounded-full bg-indigo-600"
                  }
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
