import { AnimatePresence, motion } from "motion/react";
import type { Transaction } from "../features/transactions/transactionTypes";
import { formatCurrency } from "../features/transactions/transactionUtils";

type TransactionListProps = {
  transactions: Transaction[];
  onDeleteTransaction: (transactionId: string) => void;
  onEditTransaction?: (transaction: Transaction) => void;
};

export function TransactionList({
  transactions,
  onDeleteTransaction,
  onEditTransaction,
}: TransactionListProps) {
  return (
    <div className="rounded-2xl border border-structure bg-surface p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-ink">
          Recent transactions
        </h2>
      </div>

      <ul className="max-h-[480px] space-y-3 overflow-y-auto">
        {transactions.length > 0 ? (
          <AnimatePresence initial={false}>
            {transactions.map((transaction) => (
              <motion.li
                key={transaction.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -12, transition: { duration: 0.15 } }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-between gap-4 rounded-xl bg-surface-low p-4"
              >
                <div>
                  <p className="font-medium text-ink">
                    {transaction.title}
                  </p>
                  <p className="text-sm text-ink-muted">
                    {transaction.category} · {transaction.date}
                    {transaction.type === "expense" && transaction.expenseType
                      ? ` · ${transaction.expenseType}`
                      : ""}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <p
                    className={
                      transaction.type === "income"
                        ? "font-bold tabular-nums text-positive"
                        : "font-bold tabular-nums text-negative"
                    }
                  >
                    {transaction.type === "income" ? "+" : "−"}
                    {formatCurrency(transaction.amount)}
                  </p>

                  {onEditTransaction && (
                    <button
                      type="button"
                      onClick={() => onEditTransaction(transaction)}
                      className="inline-flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium text-ink-muted transition hover:bg-accent-subtle hover:text-accent-deep"
                      aria-label={`Edit ${transaction.title}`}
                    >
                      Edit
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onDeleteTransaction(transaction.id)}
                    className="inline-flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium text-ink-muted transition hover:bg-negative-bg hover:text-negative"
                    aria-label={`Delete ${transaction.title}`}
                  >
                    Delete
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        ) : (
          <li className="rounded-xl bg-surface-low p-4 text-sm text-ink-muted">
            No transactions yet. Add one to get started.
          </li>
        )}
      </ul>
    </div>
  );
}
