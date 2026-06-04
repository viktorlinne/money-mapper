import { useEffect, useMemo, useState } from "react";
import { TransactionForm } from "../components/TransactionForm";
import { TransactionList } from "../components/TransactionList";
import {
  deleteTransaction,
  fetchTransactions,
  updateTransaction,
} from "../features/transactions/transactionApi";
import type {
  ExpenseType,
  Transaction,
  TransactionCategory,
  TransactionType,
} from "../features/transactions/transactionTypes";

const categories: Array<"all" | TransactionCategory> = [
  "all",
  "Salary",
  "Food",
  "Transport",
  "Housing",
  "Entertainment",
  "Health",
  "Subscriptions",
  "Other",
];

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [searchText, setSearchText] = useState("");
  const [month, setMonth] = useState("");
  const [category, setCategory] = useState<"all" | TransactionCategory>("all");
  const [type, setType] = useState<"all" | TransactionType>("all");
  const [expenseType, setExpenseType] = useState<"all" | ExpenseType>("all");
  const [sort, setSort] = useState<"newest" | "oldest" | "amount-high">(
    "newest",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadTransactions() {
      try {
        setTransactions(await fetchTransactions());
      } catch (error) {
        console.error(error);
        setErrorMessage("Could not load transactions.");
      }
    }

    loadTransactions();
  }, []);

  const filteredTransactions = useMemo(() => {
    return [...transactions]
      .filter((transaction) => {
        const matchesSearch =
          transaction.title.toLowerCase().includes(searchText.toLowerCase()) ||
          transaction.category.toLowerCase().includes(searchText.toLowerCase());
        const matchesMonth = month ? transaction.date.startsWith(month) : true;
        const matchesCategory =
          category === "all" ? true : transaction.category === category;
        const matchesType = type === "all" ? true : transaction.type === type;
        const matchesExpenseType =
          expenseType === "all"
            ? true
            : transaction.expenseType === expenseType;

        return (
          matchesSearch &&
          matchesMonth &&
          matchesCategory &&
          matchesType &&
          matchesExpenseType
        );
      })
      .sort((a, b) => {
        if (sort === "oldest") {
          return a.date.localeCompare(b.date);
        }

        if (sort === "amount-high") {
          return b.amount - a.amount;
        }

        return b.date.localeCompare(a.date);
      });
  }, [category, expenseType, month, searchText, sort, transactions, type]);

  async function handleDeleteTransaction(transactionId: string) {
    try {
      await deleteTransaction(transactionId);
      setTransactions((currentTransactions) =>
        currentTransactions.filter(
          (transaction) => transaction.id !== transactionId,
        ),
      );
      setErrorMessage(null);
    } catch (error) {
      console.error(error);
      setErrorMessage("Could not delete transaction.");
    }
  }

  async function handleUpdateTransaction(transaction: Omit<Transaction, "id">) {
    if (!editingTransaction) {
      return;
    }

    try {
      const updatedTransaction = await updateTransaction(
        editingTransaction.id,
        transaction,
      );

      setTransactions((currentTransactions) =>
        currentTransactions.map((currentTransaction) =>
          currentTransaction.id === updatedTransaction.id
            ? updatedTransaction
            : currentTransaction,
        ),
      );
      setEditingTransaction(null);
      setErrorMessage(null);
    } catch (error) {
      console.error(error);
      setErrorMessage("Could not update transaction.");
    }
  }

  return (
    <section>
      <p className="text-sm font-medium text-ink-muted">Transactions</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">
        Transactions
      </h1>
      <p className="mt-2 text-ink-secondary">
        Search, filter, sort, edit, and delete your transaction history.
      </p>

      {errorMessage && (
        <div className="mt-6 rounded-2xl border border-negative-border bg-negative-bg p-4 text-sm font-medium text-negative-text">
          {errorMessage}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-structure bg-surface p-5">
            <div className="grid gap-3 md:grid-cols-3">
              <input
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search transactions..."
                className="rounded-xl border border-structure bg-surface px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent-ring"
              />
              <input
                value={month}
                onChange={(event) => setMonth(event.target.value)}
                type="month"
                className="rounded-xl border border-structure bg-surface px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent-ring"
              />
              <select
                value={sort}
                onChange={(event) =>
                  setSort(event.target.value as "newest" | "oldest" | "amount-high")
                }
                className="rounded-xl border border-structure bg-surface px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent-ring"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="amount-high">Highest amount</option>
              </select>
              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as "all" | TransactionCategory)
                }
                className="rounded-xl border border-structure bg-surface px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent-ring"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item === "all" ? "All categories" : item}
                  </option>
                ))}
              </select>
              <select
                value={type}
                onChange={(event) =>
                  setType(event.target.value as "all" | TransactionType)
                }
                className="rounded-xl border border-structure bg-surface px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent-ring"
              >
                <option value="all">All types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <select
                value={expenseType}
                onChange={(event) =>
                  setExpenseType(event.target.value as "all" | ExpenseType)
                }
                className="rounded-xl border border-structure bg-surface px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent-ring"
              >
                <option value="all">All expense types</option>
                <option value="fixed">Fixed</option>
                <option value="variable">Variable</option>
              </select>
            </div>
          </div>

          <TransactionList
            transactions={filteredTransactions}
            onDeleteTransaction={handleDeleteTransaction}
            onEditTransaction={setEditingTransaction}
          />
        </div>

        <div>
          {editingTransaction ? (
            <TransactionForm
              key={editingTransaction.id}
              initialTransaction={editingTransaction}
              onAddTransaction={handleUpdateTransaction}
              submitLabel="Save changes"
              onCancel={() => setEditingTransaction(null)}
            />
          ) : (
            <div className="rounded-2xl border border-structure bg-surface p-5">
              <h2 className="text-lg font-semibold text-ink">
                Select a transaction
              </h2>
              <p className="mt-2 text-sm text-ink-muted">
                Use Edit on a transaction to update its details.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
