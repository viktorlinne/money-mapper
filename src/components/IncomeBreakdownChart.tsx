import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import type { Transaction } from "../features/transactions/transactionTypes";
import {
  formatCurrency,
  getIncomeByCategory,
} from "../features/transactions/transactionUtils";

ChartJS.register(ArcElement, Tooltip, Legend);

type IncomeBreakdownChartProps = {
  transactions: Transaction[];
};

const incomeColors = [
  "#10b981",
  "#4f46e5",
  "#06b6d4",
  "#84cc16",
  "#f59e0b",
  "#8b5cf6",
];

export function IncomeBreakdownChart({
  transactions,
}: IncomeBreakdownChartProps) {
  const incomeByCategory = getIncomeByCategory(transactions);
  const chartItems = Object.entries(incomeByCategory).filter(
    ([, amount]) => amount > 0,
  );

  const chartData = {
    labels: chartItems.map(([category]) => category),
    datasets: [
      {
        data: chartItems.map(([, amount]) => amount),
        backgroundColor: incomeColors,
        borderColor: "#ffffff",
        borderWidth: 3,
      },
    ],
  };

  const totalIncome = chartItems.reduce((sum, [, amount]) => sum + amount, 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">Income breakdown</h2>
      <p className="mt-2 text-sm text-slate-500">
        See where income is coming from.
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
            Total income:{" "}
            <span className="font-semibold text-slate-700">
              {formatCurrency(totalIncome)}
            </span>
          </p>
        </div>
      ) : (
        <p className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
          Add income to see your income breakdown.
        </p>
      )}
    </div>
  );
}
