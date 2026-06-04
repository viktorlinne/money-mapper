import { lazy, Suspense, useCallback, useEffect, useMemo, useState, type ComponentType } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AnimatedCurrency } from "../components/AnimatedCurrency";
import { CategoryBudgetOverview } from "../components/CategoryBudgetOverview";
import { CurrencyConverter } from "../components/CurrencyConverter";
import { DashboardCard } from "../components/DashboardCard";
import { SubscriptionTracker } from "../components/SubscriptionTracker";
import { TransactionForm } from "../components/TransactionForm";
import { TransactionImport } from "../components/TransactionImport";
import { TransactionList } from "../components/TransactionList";
import { fetchBudgets } from "../features/budgets/budgetApi";
import type { Budget } from "../features/budgets/budgetTypes";
import { fetchSubscriptions } from "../features/subscriptions/subscriptionApi";
import type { Subscription } from "../features/subscriptions/subscriptionTypes";
import {
  createTransaction,
  deleteTransaction,
  fetchTransactions,
} from "../features/transactions/transactionApi";
import type { Transaction } from "../features/transactions/transactionTypes";
import {
  getBalance,
  getTotalExpenses,
  getTotalIncome,
} from "../features/transactions/transactionUtils";

const CategoryChart = lazy(() =>
  import("../components/CategoryChart").then((m) => ({ default: m.CategoryChart })),
);
const BalanceOverTimeChart = lazy(() =>
  import("../components/BalanceOverTimeChart").then((m) => ({ default: m.BalanceOverTimeChart })),
);
const BudgetVsActualChart = lazy(() =>
  import("../components/BudgetVsActualChart").then((m) => ({ default: m.BudgetVsActualChart })),
);
const CategorySpendingTrendChart = lazy(() =>
  import("../components/CategorySpendingTrendChart").then((m) => ({ default: m.CategorySpendingTrendChart })),
);
const CumulativeMonthlySpendingChart = lazy(() =>
  import("../components/CumulativeMonthlySpendingChart").then((m) => ({ default: m.CumulativeMonthlySpendingChart })),
);
const DailySpendingChart = lazy(() =>
  import("../components/DailySpendingChart").then((m) => ({ default: m.DailySpendingChart })),
);
const ExpenseTypeRatioChart = lazy(() =>
  import("../components/ExpenseTypeRatioChart").then((m) => ({ default: m.ExpenseTypeRatioChart })),
);
const IncomeBreakdownChart = lazy(() =>
  import("../components/IncomeBreakdownChart").then((m) => ({ default: m.IncomeBreakdownChart })),
);
const MonthlyCashflowChart = lazy(() =>
  import("../components/MonthlyCashflowChart").then((m) => ({ default: m.MonthlyCashflowChart })),
);
const SavingsRateChart = lazy(() =>
  import("../components/SavingsRateChart").then((m) => ({ default: m.SavingsRateChart })),
);
const TopSpendingCategoriesChart = lazy(() =>
  import("../components/TopSpendingCategoriesChart").then((m) => ({ default: m.TopSpendingCategoriesChart })),
);

function ChartSkeleton() {
  return (
    <div className="rounded-2xl border border-structure bg-surface p-5 animate-pulse">
      <div className="h-5 w-36 rounded-lg bg-surface-low" />
      <div className="mt-6 h-52 rounded-xl bg-surface-low" />
    </div>
  );
}

export function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadTransactions() {
      try {
        const [apiTransactions, apiBudgets, apiSubscriptions] = await Promise.all([
          fetchTransactions(),
          fetchBudgets(),
          fetchSubscriptions(),
        ]);

        if (!ignore) {
          setTransactions(apiTransactions);
          setBudgets(apiBudgets);
          setSubscriptions(apiSubscriptions);
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

  const handleAddTransaction = useCallback(
    async (transaction: Omit<Transaction, "id">) => {
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
    },
    [],
  );

  const handleDeleteTransaction = useCallback(async (transactionId: string) => {
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
  }, []);

  const handleImportTransactions = useCallback(
    async (importedTransactions: Omit<Transaction, "id">[]) => {
      try {
        const savedTransactions = await Promise.all(
          importedTransactions.map((transaction) =>
            createTransaction(transaction),
          ),
        );

        setTransactions((currentTransactions) => [
          ...savedTransactions,
          ...currentTransactions,
        ]);
        setErrorMessage(null);
      } catch (error) {
        console.error(error);
        setErrorMessage("Could not import transactions.");
      }
    },
    [],
  );

  const income = useMemo(() => getTotalIncome(transactions), [transactions]);
  const expenses = useMemo(() => getTotalExpenses(transactions), [transactions]);
  const balance = useMemo(() => getBalance(transactions), [transactions]);

  return (
    <>
        <div className="mb-8">
          <p className="text-sm font-medium text-ink-muted">Dashboard</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">
            Your money at a glance
          </h1>
          <p className="mt-2 text-ink-secondary">
            Track income, expenses, budgets, and spending patterns.
          </p>
        </div>
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              key="error-banner"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mb-6 rounded-2xl border border-negative-border bg-negative-bg p-4 text-sm font-medium text-negative-text"
            >
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <section className="grid gap-4 md:grid-cols-3">
          <DashboardCard
            label="Balance"
            value={<AnimatedCurrency amount={balance} />}
            helperText="Income minus expenses"
            delay={0}
          />
          <DashboardCard
            label="Income"
            value={<AnimatedCurrency amount={income} />}
            helperText="This month"
            delay={0.08}
          />
          <DashboardCard
            label="Expenses"
            value={<AnimatedCurrency amount={expenses} />}
            helperText="This month"
            delay={0.16}
          />
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {isLoading ? (
            <div className="rounded-2xl border border-structure bg-surface p-5 text-sm text-ink-muted">
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

            <Suspense fallback={<ChartSkeleton />}>
              <CategoryChart transactions={transactions} />
            </Suspense>

            <TransactionImport
              onImportTransactions={handleImportTransactions}
            />
            <CurrencyConverter />
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <CategoryBudgetOverview transactions={transactions} budgets={budgets} />
          <SubscriptionTracker
            transactions={transactions}
            subscriptions={subscriptions}
          />
        </section>

        <section className="mt-8">
          <div className="mb-4">
            <p className="text-sm font-medium text-ink-muted">Insights</p>
          </div>

          <Suspense
            fallback={
              <div className="grid gap-6 xl:grid-cols-2">
                {Array.from({ length: 10 }, (_, i) => (
                  <ChartSkeleton key={i} />
                ))}
              </div>
            }
          >
            <motion.div
              className="grid gap-6 xl:grid-cols-2"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
            >
              {([
                MonthlyCashflowChart,
                BalanceOverTimeChart,
                TopSpendingCategoriesChart,
                CategorySpendingTrendChart,
                DailySpendingChart,
                CumulativeMonthlySpendingChart,
                IncomeBreakdownChart,
                ExpenseTypeRatioChart,
                SavingsRateChart,
              ] as ComponentType<{ transactions: Transaction[] }>[]).map((Chart, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
                  }}
                >
                  <Chart transactions={transactions} />
                </motion.div>
              ))}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
                }}
              >
                <BudgetVsActualChart transactions={transactions} budgets={budgets} />
              </motion.div>
            </motion.div>
          </Suspense>
        </section>
    </>
  );
}
