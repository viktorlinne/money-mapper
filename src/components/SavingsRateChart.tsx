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
import { CHART_COLORS } from "../features/charts/chartColors";
import type { Transaction } from "../features/transactions/transactionTypes";
import { getSavingsRateOverTime } from "../features/transactions/transactionUtils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
);

type SavingsRateChartProps = {
  transactions: Transaction[];
};

export function SavingsRateChart({ transactions }: SavingsRateChartProps) {
  const savingsRatePoints = getSavingsRateOverTime(transactions);

  const chartData = {
    labels: savingsRatePoints.map((point) => point.month),
    datasets: [
      {
        label: "Savings rate",
        data: savingsRatePoints.map((point) => point.savingsRate),
        borderColor: CHART_COLORS.positive,
        backgroundColor: CHART_COLORS.positive,
        tension: 0.35,
        pointRadius: 4,
      },
    ],
  };

  return (
    <div className="rounded-2xl border border-structure bg-surface p-5">
      <h2 className="text-lg font-semibold text-ink">Savings rate</h2>
      <p className="mt-2 text-sm text-ink-muted">
        Percentage of income left after expenses.
      </p>

      {savingsRatePoints.length > 0 ? (
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

                      return `Savings rate: ${value.toFixed(1)}%`;
                    },
                  },
                },
              },
              scales: {
                y: {
                  ticks: {
                    callback(value) {
                      return `${Number(value).toFixed(0)}%`;
                    },
                  },
                },
              },
            }}
          />
        </div>
      ) : (
        <p className="mt-6 rounded-xl bg-surface-low p-4 text-sm text-ink-muted">
          Add income and expenses to see savings rate.
        </p>
      )}
    </div>
  );
}
