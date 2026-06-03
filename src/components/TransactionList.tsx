import type { Transaction } from "../features/transactions/transactionTypes";
import { formatCurrency } from "../features/transactions/transactionUtils";

type TransactionListProps = {
  transactions: Transaction[];
  onDeleteTransaction: (transactionId: string) => void;
};

export function TransactionList({
  transactions,
  onDeleteTransaction,
}: TransactionListProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-950">
          Recent transactions
        </h2>
        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          View all
        </button>
      </div>

      <div className="space-y-3">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 p-4"
            >
              <div>
                <p className="font-medium text-slate-950">
                  {transaction.title}
                </p>
                <p className="text-sm text-slate-500">
                  {transaction.category} · {transaction.date}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <p
                  className={
                    transaction.type === "income"
                      ? "font-semibold text-emerald-600"
                      : "font-semibold text-rose-600"
                  }
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </p>

                <button
                  type="button"
                  onClick={() => onDeleteTransaction(transaction.id)}
                  className="rounded-lg px-2 py-1 text-sm font-medium text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                  aria-label={`Delete ${transaction.title}`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
            No transactions yet. Add one to get started.
          </p>
        )}
      </div>
    </div>
  );
}
