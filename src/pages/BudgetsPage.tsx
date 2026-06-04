import { useEffect, useMemo, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  createBudget,
  deleteBudget,
  fetchBudgets,
  updateBudget,
} from "../features/budgets/budgetApi";
import type { Budget } from "../features/budgets/budgetTypes";
import {
  fetchTransactions,
} from "../features/transactions/transactionApi";
import type {
  Transaction,
  TransactionCategory,
} from "../features/transactions/transactionTypes";
import {
  formatCurrency,
  getBudgetActuals,
} from "../features/transactions/transactionUtils";

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

const currentMonth = () => new Date().toISOString().slice(0, 7);

export function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [month, setMonth] = useState(currentMonth());
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [category, setCategory] = useState<TransactionCategory>("Food");
  const [amount, setAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [apiBudgets, apiTransactions] = await Promise.all([
          fetchBudgets(month),
          fetchTransactions(),
        ]);
        setBudgets(apiBudgets);
        setTransactions(apiTransactions);
      } catch (error) {
        console.error(error);
        setErrorMessage("Could not load budgets.");
      }
    }

    loadData();
  }, [month]);

  const monthTransactions = useMemo(
    () =>
      transactions.filter((transaction) => transaction.date.startsWith(month)),
    [month, transactions],
  );

  const budgetActuals = useMemo(
    () =>
      getBudgetActuals(
        monthTransactions,
        budgets.map((budget) => ({
          category: budget.category,
          budget: budget.amount,
        })),
      ),
    [budgets, monthTransactions],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedAmount = Number(amount);

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      return;
    }

    try {
      if (editingBudget) {
        const updatedBudget = await updateBudget(editingBudget.id, {
          month,
          category,
          amount: parsedAmount,
        });

        setBudgets((currentBudgets) =>
          currentBudgets.map((budget) =>
            budget.id === updatedBudget.id ? updatedBudget : budget,
          ),
        );
      } else {
        const createdBudget = await createBudget({
          month,
          category,
          amount: parsedAmount,
        });
        setBudgets((currentBudgets) => [...currentBudgets, createdBudget]);
      }

      setEditingBudget(null);
      setCategory("Food");
      setAmount("");
      setErrorMessage(null);
    } catch (error) {
      console.error(error);
      setErrorMessage("Could not save budget. Check for duplicates.");
    }
  }

  async function handleDeleteBudget(budgetId: string) {
    try {
      await deleteBudget(budgetId);
      setBudgets((currentBudgets) =>
        currentBudgets.filter((budget) => budget.id !== budgetId),
      );
    } catch (error) {
      console.error(error);
      setErrorMessage("Could not delete budget.");
    }
  }

  function startEditing(budget: Budget) {
    setEditingBudget(budget);
    setCategory(budget.category);
    setAmount(String(budget.amount));
  }

  return (
    <section>
      <p className="text-sm font-medium text-ink-muted">Budgets</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">
        Monthly budgets
      </h1>
      <p className="mt-2 text-ink-secondary">
        Create category budgets and spot near-limit or over-budget spending.
      </p>

      {errorMessage && (
        <div className="mt-6 rounded-2xl border border-negative-border bg-negative-bg p-4 text-sm font-medium text-negative-text">
          {errorMessage}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        <motion.form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-structure bg-surface p-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-lg font-semibold text-ink">
            {editingBudget ? "Edit budget" : "Add budget"}
          </h2>
          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-ink-label">Month</span>
              <input
                value={month}
                onChange={(event) => setMonth(event.target.value)}
                type="month"
                className="mt-1 w-full rounded-xl border border-structure bg-surface px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent-ring"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink-label">
                Category
              </span>
              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as TransactionCategory)
                }
                className="mt-1 w-full rounded-xl border border-structure bg-surface px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent-ring"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink-label">Amount</span>
              <input
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                type="number"
                min="0"
                step="0.01"
                className="mt-1 w-full rounded-xl border border-structure bg-surface px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent-ring"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-deep"
            >
              {editingBudget ? "Save budget" : "Create budget"}
            </button>
          </div>
        </motion.form>

        <motion.div
          className="rounded-2xl border border-structure bg-surface p-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-lg font-semibold text-ink">Budget status</h2>
          <motion.div
            className="mt-5 space-y-3"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.045 } },
            }}
          >
            {budgetActuals.length > 0 ? (
              <AnimatePresence initial={false}>
                {budgetActuals.map((item) => {
                const budget = budgets.find(
                  (currentBudget) => currentBudget.category === item.category,
                );
                const percentage = (item.actual / item.budget) * 100;
                const status =
                  percentage >= 100
                    ? "Over budget"
                    : percentage >= 80
                      ? "Near limit"
                      : "On track";

                return (
                  <motion.div
                    key={item.category}
                    layout
                    variants={{
                      hidden: { opacity: 0, y: 8 },
                      show: { opacity: 1, y: 0 },
                    }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col gap-3 rounded-xl bg-surface-low p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-ink">{item.category}</p>
                      <p className="text-sm text-ink-muted">
                        {formatCurrency(item.actual)} of{" "}
                        {formatCurrency(item.budget)} spent
                      </p>
                      <p className="mt-1 text-xs font-semibold text-negative">
                        {status}
                      </p>
                    </div>
                    {budget && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEditing(budget)}
                          className="rounded-lg px-3 py-2 text-sm font-semibold text-accent-deep hover:bg-accent-subtle"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBudget(budget.id)}
                          className="rounded-lg px-3 py-2 text-sm font-semibold text-negative hover:bg-negative-bg"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
              </AnimatePresence>
            ) : (
              <p className="rounded-xl bg-surface-low p-4 text-sm text-ink-muted">
                No budgets for {month}. Create one to start tracking.
              </p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
