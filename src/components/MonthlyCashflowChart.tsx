import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { CHART_COLORS } from "../features/charts/chartColors";
import type { Transaction } from "../features/transactions/transactionTypes";
import {
  formatCurrency,
  getMonthlyCashflow,
} from "../features/transactions/transactionUtils";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type MonthlyCashflowChartProps = {
  transactions: Transaction[];
};

export function MonthlyCashflowChart({
  transactions,
}: MonthlyCashflowChartProps) {
  const cashflow = getMonthlyCashflow(transactions);

  const chartData = {
    labels: cashflow.map((item) => item.month),
    datasets: [
      {
        label: "Income",
        data: cashflow.map((item) => item.income),
        backgroundColor: CHART_COLORS.positive,
        borderRadius: 8,
      },
      {
        label: "Expenses",
        data: cashflow.map((item) => item.expenses),
        backgroundColor: CHART_COLORS.negative,
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="rounded-2xl border border-structure bg-surface p-5">
      <h2 className="text-lg font-semibold text-ink">Monthly cashflow</h2>

      {cashflow.length > 0 ? (
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
          Add transactions to see monthly cashflow.
        </p>
      )}
    </div>
  );
}
