import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type {
  Transaction,
  TransactionCategory,
} from "../features/transactions/transactionTypes";
import {
  formatCurrency,
  getCategorySpendingTrend,
} from "../features/transactions/transactionUtils";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type CategorySpendingTrendChartProps = {
  transactions: Transaction[];
};

const categoryColors: Record<TransactionCategory, string> = {
  Salary: "#6b6f8a",
  Food: "#0062ff",
  Transport: "#d97706",
  Housing: "#059669",
  Entertainment: "#e11d48",
  Health: "#7c3aed",
  Subscriptions: "#0d9488",
  Other: "#84cc16",
};

const expenseCategories = Object.keys(categoryColors) as TransactionCategory[];

export function CategorySpendingTrendChart({
  transactions,
}: CategorySpendingTrendChartProps) {
  const trend = getCategorySpendingTrend(transactions);
  const activeCategories = expenseCategories.filter((category) =>
    trend.some((item) => (item.categories[category] ?? 0) > 0),
  );

  const chartData = {
    labels: trend.map((item) => item.month),
    datasets: activeCategories.map((category) => ({
      label: category,
      data: trend.map((item) => item.categories[category] ?? 0),
      backgroundColor: categoryColors[category],
      borderRadius: 6,
    })),
  };

  return (
    <div className="rounded-2xl border border-structure bg-surface p-5">
      <h2 className="text-lg font-semibold text-ink">
        Category spending trend
      </h2>

      {trend.length > 0 ? (
        <div className="mt-6">
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
                x: {
                  stacked: true,
                },
                y: {
                  stacked: true,
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
          Add expenses across months to see category trends.
        </p>
      )}
    </div>
  );
}
