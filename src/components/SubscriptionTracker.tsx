import type { Transaction } from "../features/transactions/transactionTypes";
import { formatCurrency } from "../features/transactions/transactionUtils";

type SubscriptionTrackerProps = {
  transactions: Transaction[];
};

export function SubscriptionTracker({
  transactions,
}: SubscriptionTrackerProps) {
  const subscriptions = transactions
    .filter(
      (transaction) =>
        transaction.type === "expense" &&
        transaction.expenseType === "fixed" &&
        transaction.category === "Subscriptions",
    )
    .sort((a, b) => b.date.localeCompare(a.date));

  const monthlyTotal = subscriptions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0,
  );

  return (
    <div className="rounded-2xl border border-structure bg-surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-ink">
            Subscription tracker
          </h2>
          <p className="mt-2 text-sm text-ink-muted">
            Fixed subscription expenses in your transactions.
          </p>
        </div>
        <p className="rounded-full bg-accent-subtle px-3 py-1 text-sm font-semibold text-accent-deep">
          {formatCurrency(monthlyTotal)}
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {subscriptions.length > 0 ? (
          subscriptions.map((subscription) => (
            <div
              key={subscription.id}
              className="flex items-center justify-between rounded-xl bg-surface-low p-3"
            >
              <div>
                <p className="font-medium text-ink">
                  {subscription.title}
                </p>
                <p className="text-sm text-ink-muted">{subscription.date}</p>
              </div>
              <p className="font-semibold tabular-nums text-negative">
                −{formatCurrency(subscription.amount)}
              </p>
            </div>
          ))
        ) : (
          <p className="rounded-xl bg-surface-low p-4 text-sm text-ink-muted">
            Add a fixed expense in Subscriptions to track recurring costs.
          </p>
        )}
      </div>
    </div>
  );
}
