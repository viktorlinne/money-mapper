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
  getBalanceOverTime,
} from "../features/transactions/transactionUtils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
);

type BalanceOverTimeChartProps = {
  transactions: Transaction[];
};

export function BalanceOverTimeChart({
  transactions,
}: BalanceOverTimeChartProps) {
  const balancePoints = getBalanceOverTime(transactions);

  const chartData = {
    labels: balancePoints.map((point) => point.date),
    datasets: [
      {
        label: "Balance",
        data: balancePoints.map((point) => point.balance),
        borderColor: "#0062ff",
        backgroundColor: "#0062ff",
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  return (
    <div className="rounded-2xl border border-structure bg-surface p-5">
      <h2 className="text-lg font-semibold text-ink">
        Balance over time
      </h2>

      {balancePoints.length > 0 ? (
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

                      return `Balance: ${formatCurrency(value)}`;
                    },
                  },
                },
              },
              scales: {
                y: {
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
          Add transactions to see balance history.
        </p>
      )}
    </div>
  );
}
