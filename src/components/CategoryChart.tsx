import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import type { Transaction } from "../features/transactions/transactionTypes";
import {
  formatCurrency,
  getExpensesByCategory,
} from "../features/transactions/transactionUtils";

ChartJS.register(ArcElement, Tooltip, Legend);

type CategoryChartProps = {
  transactions: Transaction[];
};

const categoryColors = [
  "#0062ff",
  "#d97706",
  "#059669",
  "#e11d48",
  "#7c3aed",
  "#0d9488",
  "#6b6f8a",
  "#84cc16",
];

export function CategoryChart({ transactions }: CategoryChartProps) {
  const expensesByCategory = getExpensesByCategory(transactions);
  const chartItems = Object.entries(expensesByCategory).filter(
    ([, amount]) => amount > 0,
  );

  const chartData = {
    labels: chartItems.map(([category]) => category),
    datasets: [
      {
        data: chartItems.map(([, amount]) => amount),
        backgroundColor: categoryColors,
        borderColor: "#ffffff",
        borderWidth: 3,
      },
    ],
  };

  const totalExpenses = chartItems.reduce((sum, [, amount]) => sum + amount, 0);

  return (
    <div className="rounded-2xl border border-structure bg-surface p-5">
      <h2 className="text-lg font-semibold text-ink">
        Spending by category
      </h2>

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
                        const label = context.label ?? "Category";
                        const value =
                          typeof context.parsed === "number"
                            ? context.parsed
                            : 0;

                        return `${label}: ${formatCurrency(value)}`;
                      },
                    },
                  },
                },
                cutout: "62%",
              }}
            />
          </div>

          <p className="mt-4 text-center text-sm text-ink-muted">
            Total expenses:{" "}
            <span className="font-semibold text-ink-label">
              {formatCurrency(totalExpenses)}
            </span>
          </p>
        </div>
      ) : (
        <p className="mt-6 rounded-xl bg-surface-low p-4 text-sm text-ink-muted">
          Add an expense to see your spending chart.
        </p>
      )}
    </div>
  );
}
