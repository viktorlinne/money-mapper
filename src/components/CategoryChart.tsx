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
  "#4f46e5",
  "#f59e0b",
  "#10b981",
  "#f43f5e",
  "#8b5cf6",
  "#06b6d4",
  "#64748b",
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">
        Spending by category
      </h2>
      <p className="mt-2 text-sm text-slate-500">
        See where your expenses are going.
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

          <p className="mt-4 text-center text-sm text-slate-500">
            Total expenses:{" "}
            <span className="font-semibold text-slate-700">
              {formatCurrency(totalExpenses)}
            </span>
          </p>
        </div>
      ) : (
        <p className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
          Add an expense to see your spending chart.
        </p>
      )}
    </div>
  );
}
