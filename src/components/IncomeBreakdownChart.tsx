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
  "#059669",
  "#0062ff",
  "#0d9488",
  "#84cc16",
  "#d97706",
  "#7c3aed",
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
    <div className="rounded-2xl border border-structure bg-surface p-5">
      <h2 className="text-lg font-semibold text-ink">Income breakdown</h2>

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
            Total income:{" "}
            <span className="font-semibold text-ink-label">
              {formatCurrency(totalIncome)}
            </span>
          </p>
        </div>
      ) : (
        <p className="mt-6 rounded-xl bg-surface-low p-4 text-sm text-ink-muted">
          Add income to see your income breakdown.
        </p>
      )}
    </div>
  );
}
