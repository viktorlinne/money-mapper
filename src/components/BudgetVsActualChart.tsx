import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { Budget } from "../features/budgets/budgetTypes";
import type { Transaction } from "../features/transactions/transactionTypes";
import {
  formatCurrency,
  getBudgetActuals,
} from "../features/transactions/transactionUtils";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type BudgetVsActualChartProps = {
  transactions: Transaction[];
  budgets: Budget[];
};

export function BudgetVsActualChart({
  transactions,
  budgets,
}: BudgetVsActualChartProps) {
  const budgetActuals = getBudgetActuals(
    transactions,
    budgets.map((budget) => ({
      category: budget.category,
      budget: budget.amount,
    })),
  );

  const chartData = {
    labels: budgetActuals.map((item) => item.category),
    datasets: [
      {
        label: "Budget",
        data: budgetActuals.map((item) => item.budget),
        backgroundColor: "#dde1ef",
        borderRadius: 8,
      },
      {
        label: "Actual",
        data: budgetActuals.map((item) => item.actual),
        backgroundColor: "#0062ff",
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="rounded-2xl border border-structure bg-surface p-5">
      <h2 className="text-lg font-semibold text-ink">Budget vs actual</h2>
      <p className="mt-2 text-sm text-ink-muted">
        Compare category budgets with current spending.
      </p>

      <div className="mt-6">
        {budgetActuals.length > 0 ? (
          <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "bottom",
              },
              tooltip: {
                callbacks: {
                  label(context) {
                    const value =
                      typeof context.parsed.y === "number"
                        ? context.parsed.y
                        : 0;

                    return `${context.dataset.label}: ${formatCurrency(value)}`;
                  },
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback(value) {
                    return formatCurrency(Number(value));
                  },
                },
              },
            },
          }}
          />
        ) : (
          <p className="rounded-xl bg-surface-low p-4 text-sm text-ink-muted">
            Add budgets to compare planned and actual spending.
          </p>
        )}
      </div>
    </div>
  );
}
