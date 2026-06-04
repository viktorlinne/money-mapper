import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import type {
  ExpenseType,
  Transaction,
  TransactionCategory,
  TransactionType,
} from "../features/transactions/transactionTypes";

type TransactionFormProps = {
  onAddTransaction: (
    transaction: Omit<Transaction, "id">,
  ) => void | Promise<void>;
  initialTransaction?: Transaction;
  submitLabel?: string;
  onCancel?: () => void;
};

const categories: TransactionCategory[] = [
  "Salary",
  "Food",
  "Transport",
  "Housing",
  "Entertainment",
  "Health",
  "Subscriptions",
  "Other",
];

const getToday = () => new Date().toISOString().slice(0, 10);

const inputClass =
  "mt-1 w-full rounded-xl border border-structure bg-surface px-3 py-2 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-ring";

export function TransactionForm({
  onAddTransaction,
  initialTransaction,
  submitLabel = "Add transaction",
  onCancel,
}: TransactionFormProps) {
  const [title, setTitle] = useState(initialTransaction?.title ?? "");
  const [amount, setAmount] = useState(
    initialTransaction ? String(initialTransaction.amount) : "",
  );
  const [type, setType] = useState<TransactionType>(
    initialTransaction?.type ?? "expense",
  );
  const [expenseType, setExpenseType] = useState<ExpenseType>(
    initialTransaction?.expenseType ?? "variable",
  );
  const [category, setCategory] = useState<TransactionCategory>(
    initialTransaction?.category ?? "Food",
  );
  const [date, setDate] = useState(initialTransaction?.date ?? getToday());
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedAmount = Number(amount);

    if (
      !title.trim() ||
      !date ||
      Number.isNaN(parsedAmount) ||
      parsedAmount <= 0
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onAddTransaction({
        title: title.trim(),
        amount: parsedAmount,
        type,
        expenseType: type === "expense" ? expenseType : null,
        category,
        date,
      });

      if (!initialTransaction) {
        setTitle("");
        setAmount("");
        setType("expense");
        setExpenseType("variable");
        setCategory("Food");
        setDate(getToday());
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-structure bg-surface p-5"
    >
      <div>
        <h2 className="text-lg font-semibold text-ink">
          {initialTransaction ? "Edit transaction" : "Add transaction"}
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          Add income or expenses to update your dashboard.
        </p>
      </div>

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-ink-label">Title</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            type="text"
            placeholder="e.g. Groceries"
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-ink-label">Amount</span>
          <input
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            className={inputClass}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-ink-label">Type</span>
            <select
              value={type}
              onChange={(event) =>
                setType(event.target.value as TransactionType)
              }
              className={inputClass}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-ink-label">Category</span>
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as TransactionCategory)
              }
              className={inputClass}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>
        </div>

        <AnimatePresence initial={false}>
          {type === "expense" && (
            <motion.div
              key="expense-type"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <label className="block">
                <span className="text-sm font-medium text-ink-label">
                  Expense type
                </span>
                <select
                  value={expenseType}
                  onChange={(event) =>
                    setExpenseType(event.target.value as ExpenseType)
                  }
                  className={inputClass}
                >
                  <option value="variable">Variable</option>
                  <option value="fixed">Fixed</option>
                </select>
              </label>
            </motion.div>
          )}
        </AnimatePresence>

        <label className="block">
          <span className="text-sm font-medium text-ink-label">Date</span>
          <input
            value={date}
            onChange={(event) => setDate(event.target.value)}
            type="date"
            className={inputClass}
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full rounded-xl border border-structure px-4 py-3 text-sm font-semibold text-ink-muted transition hover:bg-surface-low hover:text-ink"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
