import { useState, type FormEvent } from "react";
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

export function TransactionForm({ onAddTransaction }: TransactionFormProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [expenseType, setExpenseType] = useState<ExpenseType>("variable");
  const [category, setCategory] = useState<TransactionCategory>("Food");
  const [date, setDate] = useState(getToday());

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
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

    onAddTransaction({
      title: title.trim(),
      amount: parsedAmount,
      type,
      expenseType: type === "expense" ? expenseType : null,
      category,
      date,
    });

    setTitle("");
    setAmount("");
    setType("expense");
    setExpenseType("variable");
    setCategory("Food");
    setDate(getToday());
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-semibold text-slate-950">
          Add transaction
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Add income or expenses to update your dashboard.
        </p>
      </div>

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Title</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            type="text"
            placeholder="e.g. Groceries"
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Amount</span>
          <input
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Type</span>
            <select
              value={type}
              onChange={(event) =>
                setType(event.target.value as TransactionType)
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Category</span>
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as TransactionCategory)
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>

        {type === "expense" && (
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Expense type
            </span>
            <select
              value={expenseType}
              onChange={(event) =>
                setExpenseType(event.target.value as ExpenseType)
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="variable">Variable</option>
              <option value="fixed">Fixed</option>
            </select>
          </label>
        )}

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Date</span>
          <input
            value={date}
            onChange={(event) => setDate(event.target.value)}
            type="date"
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Add transaction
        </button>
      </div>
    </form>
  );
}
