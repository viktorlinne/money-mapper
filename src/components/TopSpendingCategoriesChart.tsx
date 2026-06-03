import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { Transaction } from "../features/transactions/transactionTypes";
import {
  formatCurrency,
  getExpensesByCategory,
} from "../features/transactions/transactionUtils";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

type TopSpendingCategoriesChartProps = {
  transactions: Transaction[];
};

export function TopSpendingCategoriesChart({
  transactions,
}: TopSpendingCategoriesChartProps) {
  const topCategories = Object.entries(getExpensesByCategory(transactions))
    .filter(([, amount]) => amount > 0)
    .sort(([, amountA], [, amountB]) => amountB - amountA)
    .slice(0, 5);

  const chartData = {
    labels: topCategories.map(([category]) => category),
    datasets: [
      {
        label: "Spending",
        data: topCategories.map(([, amount]) => amount),
        backgroundColor: "#d97706",
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="rounded-2xl border border-structure bg-surface p-5">
      <h2 className="text-lg font-semibold text-ink">
        Top spending categories
      </h2>

      {topCategories.length > 0 ? (
        <div className="mt-6">
          <Bar
            data={chartData}
            options={{
              indexAxis: "y",
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  callbacks: {
                    label(context) {
                      const value =
                        typeof context.parsed.x === "number"
                          ? context.parsed.x
                          : 0;

                      return formatCurrency(value);
                    },
                  },
                },
              },
              scales: {
                x: {
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
        </div>
      ) : (
        <p className="mt-6 rounded-xl bg-surface-low p-4 text-sm text-ink-muted">
          Add expenses to see top categories.
        </p>
      )}
    </div>
  );
}
