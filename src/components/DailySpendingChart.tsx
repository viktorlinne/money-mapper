import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { CHART_COLORS } from "../features/charts/chartColors";
import type { Transaction } from "../features/transactions/transactionTypes";
import {
  formatCurrency,
  getDailySpending,
  getLatestTransactionMonth,
} from "../features/transactions/transactionUtils";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

type DailySpendingChartProps = {
  transactions: Transaction[];
};

export function DailySpendingChart({ transactions }: DailySpendingChartProps) {
  const month = getLatestTransactionMonth(transactions);
  const dailySpending = month ? getDailySpending(transactions, month) : [];

  const chartData = {
    labels: dailySpending.map((item) => item.date),
    datasets: [
      {
        label: "Daily spending",
        data: dailySpending.map((item) => item.amount),
        backgroundColor: CHART_COLORS.negative,
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="rounded-2xl border border-structure bg-surface p-5">
      <h2 className="text-lg font-semibold text-ink">Daily spending</h2>
      <p className="mt-2 text-sm text-ink-muted">
        Expense totals by day for {month ?? "the latest month"}.
      </p>

      {dailySpending.length > 0 ? (
        <div className="mt-6">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  callbacks: {
                    label(context) {
                      const value =
                        typeof context.parsed.y === "number"
                          ? context.parsed.y
                          : 0;

                      return formatCurrency(value);
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
        </div>
      ) : (
        <p className="mt-6 rounded-xl bg-surface-low p-4 text-sm text-ink-muted">
          Add expenses to see daily spending.
        </p>
      )}
    </div>
  );
}
