import { useEffect, useState } from "react";
import { CategoryChart } from "../components/CategoryChart";
import { DashboardCard } from "../components/DashboardCard";
import { TransactionList } from "../components/TransactionList";
import { TransactionForm } from "../components/TransactionForm";
import {
  createTransaction,
  deleteTransaction,
  fetchTransactions,
} from "../features/transactions/transactionApi";
import type { Transaction } from "../features/transactions/transactionTypes";
import {
  formatCurrency,
  getBalance,
  getTotalExpenses,
  getTotalIncome,
} from "../features/transactions/transactionUtils";

export function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadTransactions() {
      try {
        const apiTransactions = await fetchTransactions();

        if (!ignore) {
          setTransactions(apiTransactions);
          setErrorMessage(null);
        }
      } catch (error) {
        console.error(error);
        if (!ignore) {
          setErrorMessage("Could not connect to the MoneyMapper API.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadTransactions();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleAddTransaction(transaction: Omit<Transaction, "id">) {
    try {
      const savedTransaction = await createTransaction(transaction);

      setTransactions((currentTransactions) => [
        savedTransaction,
        ...currentTransactions,
      ]);
      setErrorMessage(null);
    } catch (error) {
      console.error(error);
      setErrorMessage("Could not save the transaction.");
    }
  }

  async function handleDeleteTransaction(transactionId: string) {
    try {
      await deleteTransaction(transactionId);
    } catch (error) {
      console.error(error);
      setErrorMessage("Could not delete the transaction.");
      return;
    }

    setTransactions((currentTransactions) =>
      currentTransactions.filter(
        (transaction) => transaction.id !== transactionId,
      ),
    );
    setErrorMessage(null);
  }

  const income = getTotalIncome(transactions);
  const expenses = getTotalExpenses(transactions);
  const balance = getBalance(transactions);

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-sm font-medium text-indigo-600">MoneyMapper</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Your money at a glance
          </h1>
          <p className="mt-2 text-slate-600">
            Track income, expenses, budgets, and spending patterns.
          </p>
          <p className="mt-3 text-sm text-slate-500">
            Data source: MySQL API
          </p>
        </header>

        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
            {errorMessage}
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-3">
          <DashboardCard
            label="Balance"
            value={formatCurrency(balance)}
            helperText="Income minus expenses"
          />
          <DashboardCard
            label="Income"
            value={formatCurrency(income)}
            helperText="This month"
          />
          <DashboardCard
            label="Expenses"
            value={formatCurrency(expenses)}
            helperText="This month"
          />
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {isLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
              Loading transactions...
            </div>
          ) : (
            <TransactionList
              transactions={transactions}
              onDeleteTransaction={handleDeleteTransaction}
            />
          )}

          <div className="space-y-6">
            <TransactionForm onAddTransaction={handleAddTransaction} />

            <CategoryChart transactions={transactions} />
          </div>
        </section>
      </div>
    </main>
  );
}
