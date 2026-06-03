import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { categoryBudgets } from "../features/budgets/budgetData";
import type { Transaction } from "../features/transactions/transactionTypes";
import {
  formatCurrency,
  getBudgetActuals,
} from "../features/transactions/transactionUtils";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type BudgetVsActualChartProps = {
  transactions: Transaction[];
};

export function BudgetVsActualChart({
  transactions,
}: BudgetVsActualChartProps) {
  const budgetActuals = getBudgetActuals(transactions, categoryBudgets);

  const chartData = {
    labels: budgetActuals.map((item) => item.category),
    datasets: [
      {
        label: "Budget",
        data: budgetActuals.map((item) => item.budget),
        backgroundColor: "#cbd5e1",
        borderRadius: 8,
      },
      {
        label: "Actual",
        data: budgetActuals.map((item) => item.actual),
        backgroundColor: "#4f46e5",
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">Budget vs actual</h2>
      <p className="mt-2 text-sm text-slate-500">
        Compare category budgets with current spending.
      </p>

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
    </div>
  );
}
