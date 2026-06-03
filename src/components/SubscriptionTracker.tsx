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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            Subscription tracker
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Fixed subscription expenses in your transactions.
          </p>
        </div>
        <p className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
          {formatCurrency(monthlyTotal)}
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {subscriptions.length > 0 ? (
          subscriptions.map((subscription) => (
            <div
              key={subscription.id}
              className="flex items-center justify-between rounded-xl bg-slate-50 p-3"
            >
              <div>
                <p className="font-medium text-slate-950">
                  {subscription.title}
                </p>
                <p className="text-sm text-slate-500">{subscription.date}</p>
              </div>
              <p className="font-semibold text-rose-600">
                {formatCurrency(subscription.amount)}
              </p>
            </div>
          ))
        ) : (
          <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
            Add a fixed expense in Subscriptions to track recurring costs.
          </p>
        )}
      </div>
    </div>
  );
}
