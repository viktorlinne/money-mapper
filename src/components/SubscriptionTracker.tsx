import type { Subscription } from "../features/subscriptions/subscriptionTypes";
import type { Transaction } from "../features/transactions/transactionTypes";
import { formatCurrency } from "../features/transactions/transactionUtils";

type SubscriptionTrackerProps = {
  transactions: Transaction[];
  subscriptions?: Subscription[];
};

export function SubscriptionTracker({
  transactions,
  subscriptions = [],
}: SubscriptionTrackerProps) {
  const activeSubscriptions = subscriptions.filter(
    (subscription) => subscription.status === "active",
  );
  const derivedSubscriptions = transactions
    .filter(
      (transaction) =>
        transaction.type === "expense" &&
        transaction.expenseType === "fixed" &&
        transaction.category === "Subscriptions",
    )
    .sort((a, b) => b.date.localeCompare(a.date));

  const monthlyTotal = activeSubscriptions.reduce(
    (sum, subscription) =>
      sum +
      (subscription.billingCycle === "yearly"
        ? subscription.amount / 12
        : subscription.amount),
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
            Active recurring subscriptions and transaction-derived suggestions.
          </p>
        </div>
        <p className="rounded-full bg-accent-subtle px-3 py-1 text-sm font-semibold text-accent-deep">
          {formatCurrency(monthlyTotal)}
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {activeSubscriptions.length > 0 ? (
          activeSubscriptions.map((subscription) => (
            <div
              key={subscription.id}
              className="flex items-center justify-between rounded-xl bg-surface-low p-3"
            >
              <div>
                <p className="font-medium text-ink">
                  {subscription.name}
                </p>
                <p className="text-sm text-ink-muted">
                  Renews {subscription.renewalDate} · {subscription.billingCycle}
                </p>
              </div>
              <p className="font-semibold tabular-nums text-negative">
                −{formatCurrency(subscription.amount)}
              </p>
            </div>
          ))
        ) : derivedSubscriptions.length > 0 ? (
          derivedSubscriptions.map((subscription) => (
            <div
              key={subscription.id}
              className="flex items-center justify-between rounded-xl bg-surface-low p-3"
            >
              <div>
                <p className="font-medium text-ink">{subscription.title}</p>
                <p className="text-sm text-ink-muted">
                  Suggested from transaction · {subscription.date}
                </p>
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
