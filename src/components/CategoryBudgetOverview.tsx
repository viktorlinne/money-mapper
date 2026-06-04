import type { Budget } from "../features/budgets/budgetTypes";
import type { Transaction } from "../features/transactions/transactionTypes";
import {
  formatCurrency,
  getBudgetActuals,
} from "../features/transactions/transactionUtils";

type CategoryBudgetOverviewProps = {
  transactions: Transaction[];
  budgets: Budget[];
};

export function CategoryBudgetOverview({
  transactions,
  budgets,
}: CategoryBudgetOverviewProps) {
  const budgetActuals = getBudgetActuals(
    transactions,
    budgets.map((budget) => ({
      category: budget.category,
      budget: budget.amount,
    })),
  );

  return (
    <div className="rounded-2xl border border-structure bg-surface p-5">
      <h2 className="text-lg font-semibold text-ink">Category budgets</h2>
      <p className="mt-2 text-sm text-ink-muted">
        Track spending against your monthly category budgets.
      </p>

      <div className="mt-6 space-y-4">
        {budgetActuals.length > 0 ? budgetActuals.map((item) => {
          const percentage = Math.min((item.actual / item.budget) * 100, 100);
          const isOverBudget = item.actual > item.budget;
          const isNearLimit = !isOverBudget && percentage >= 80;

          return (
            <div key={item.category}>
              <div className="mb-2 flex justify-between gap-3 text-sm">
                <span className="font-medium text-ink-label">
                  {item.category}
                </span>
                <span
                  className={
                    isOverBudget || isNearLimit ? "text-negative" : "text-ink-muted"
                  }
                >
                  {formatCurrency(item.actual)} / {formatCurrency(item.budget)}
                </span>
              </div>
              <div className="h-3 rounded-full bg-canvas">
                <div
                  className={
                    isOverBudget || isNearLimit
                      ? "h-3 rounded-full bg-negative"
                      : "h-3 rounded-full bg-accent"
                  }
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        }) : (
          <p className="rounded-xl bg-surface-low p-4 text-sm text-ink-muted">
            No budgets yet. Add monthly budgets from the Budgets page.
          </p>
        )}
      </div>
    </div>
  );
}
