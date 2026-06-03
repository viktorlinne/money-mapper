import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import type { Transaction } from "../features/transactions/transactionTypes";
import {
  formatCurrency,
  getExpensesByType,
} from "../features/transactions/transactionUtils";

ChartJS.register(ArcElement, Tooltip, Legend);

type ExpenseTypeRatioChartProps = {
  transactions: Transaction[];
};

const labels = {
  fixed: "Fixed",
  variable: "Variable",
};

export function ExpenseTypeRatioChart({
  transactions,
}: ExpenseTypeRatioChartProps) {
  const chartItems = getExpensesByType(transactions).filter(
    (item) => item.amount > 0,
  );

  const chartData = {
    labels: chartItems.map((item) => labels[item.expenseType]),
    datasets: [
      {
        data: chartItems.map((item) => item.amount),
        backgroundColor: ["#0062ff", "#d97706"],
        borderColor: "#ffffff",
        borderWidth: 3,
      },
    ],
  };

  const totalExpenses = chartItems.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="rounded-2xl border border-structure bg-surface p-5">
      <h2 className="text-lg font-semibold text-ink">
        Expense type ratio
      </h2>
      <p className="mt-2 text-sm text-ink-muted">
        Compare fixed and variable spending.
      </p>

      {chartItems.length > 0 ? (
        <div className="mt-6">
          <div className="mx-auto max-w-64">
            <Doughnut
              data={chartData}
              options={{
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      boxWidth: 12,
                      padding: 16,
                    },
                  },
                  tooltip: {
                    callbacks: {
                      label(context) {
                        const label = context.label ?? "Expense type";
                        const value =
                          typeof context.parsed === "number"
                            ? context.parsed
                            : 0;
                        const percentage =
                          totalExpenses > 0
                            ? ((value / totalExpenses) * 100).toFixed(1)
                            : "0.0";

                        return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                      },
                    },
                  },
                },
                cutout: "62%",
              }}
            />
          </div>
        </div>
      ) : (
        <p className="mt-6 rounded-xl bg-surface-low p-4 text-sm text-ink-muted">
          Add expenses to compare fixed and variable spending.
        </p>
      )}
    </div>
  );
}
