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
  Salary: "#64748b",
  Food: "#4f46e5",
  Transport: "#f59e0b",
  Housing: "#10b981",
  Entertainment: "#f43f5e",
  Health: "#8b5cf6",
  Subscriptions: "#06b6d4",
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">
        Category spending trend
      </h2>
      <p className="mt-2 text-sm text-slate-500">
        See how expense categories change month to month.
      </p>

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
        <p className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
          Add expenses across months to see category trends.
        </p>
      )}
    </div>
  );
}
