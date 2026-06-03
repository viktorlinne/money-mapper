import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { Transaction } from "../features/transactions/transactionTypes";
import {
  formatCurrency,
  getCumulativeMonthlySpending,
  getLatestTransactionMonth,
} from "../features/transactions/transactionUtils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
);

type CumulativeMonthlySpendingChartProps = {
  transactions: Transaction[];
};

export function CumulativeMonthlySpendingChart({
  transactions,
}: CumulativeMonthlySpendingChartProps) {
  const month = getLatestTransactionMonth(transactions);
  const cumulativeSpending = month
    ? getCumulativeMonthlySpending(transactions, month)
    : [];

  const chartData = {
    labels: cumulativeSpending.map((item) => item.date),
    datasets: [
      {
        label: "Cumulative spending",
        data: cumulativeSpending.map((item) => item.amount),
        borderColor: "#f59e0b",
        backgroundColor: "#f59e0b",
        tension: 0.35,
        pointRadius: 4,
      },
    ],
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">
        Cumulative monthly spending
      </h2>
      <p className="mt-2 text-sm text-slate-500">
        Running expense total for {month ?? "the latest month"}.
      </p>

      {cumulativeSpending.length > 0 ? (
        <div className="mt-6">
          <Line
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

                      return `Spent: ${formatCurrency(value)}`;
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
        <p className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
          Add expenses to see cumulative spending.
        </p>
      )}
    </div>
  );
}
