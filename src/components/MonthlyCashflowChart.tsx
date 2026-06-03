import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
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
        backgroundColor: "#10b981",
        borderRadius: 8,
      },
      {
        label: "Expenses",
        data: cashflow.map((item) => item.expenses),
        backgroundColor: "#f43f5e",
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">Monthly cashflow</h2>
      <p className="mt-2 text-sm text-slate-500">
        Compare income and expenses by month.
      </p>

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
        <p className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
          Add transactions to see monthly cashflow.
        </p>
      )}
    </div>
  );
}
