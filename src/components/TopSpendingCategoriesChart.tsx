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
        backgroundColor: "#f59e0b",
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">
        Top spending categories
      </h2>
      <p className="mt-2 text-sm text-slate-500">
        Your largest expense categories.
      </p>

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
        <p className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
          Add expenses to see top categories.
        </p>
      )}
    </div>
  );
}
