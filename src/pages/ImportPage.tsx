import { useEffect, useState } from "react";
import { TransactionImport } from "../components/TransactionImport";
import {
  createTransaction,
  fetchTransactions,
} from "../features/transactions/transactionApi";
import type { Transaction } from "../features/transactions/transactionTypes";

export function ImportPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadTransactions() {
      setTransactions(await fetchTransactions());
    }

    loadTransactions().catch((error) => {
      console.error(error);
      setStatusMessage("Could not load transactions for export.");
    });
  }, []);

  async function handleImportTransactions(
    importedTransactions: Omit<Transaction, "id">[],
  ) {
    const savedTransactions = await Promise.all(
      importedTransactions.map((transaction) => createTransaction(transaction)),
    );
    setTransactions((currentTransactions) => [
      ...savedTransactions,
      ...currentTransactions,
    ]);
    setStatusMessage(`Imported ${savedTransactions.length} transactions.`);
  }

  function exportCsv() {
    const header = ["title", "amount", "type", "expenseType", "category", "date"];
    const rows = transactions.map((transaction) =>
      [
        transaction.title,
        transaction.amount,
        transaction.type,
        transaction.expenseType ?? "",
        transaction.category,
        transaction.date,
      ]
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(","),
    );

    downloadFile(
      [header.join(","), ...rows].join("\n"),
      "moneymapper-transactions.csv",
      "text/csv;charset=utf-8",
    );
  }

  async function exportExcel() {
    const xlsx = await import("xlsx");
    const worksheet = xlsx.utils.json_to_sheet(transactions);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Transactions");
    xlsx.writeFile(workbook, "moneymapper-transactions.xlsx");
  }

  return (
    <section>
      <p className="text-sm font-medium text-ink-muted">Import and export</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">
        Import and export
      </h1>
      <p className="mt-2 text-ink-secondary">
        Bring in CSV/Excel transactions and export your transaction history.
      </p>

      {statusMessage && (
        <div className="mt-6 rounded-2xl border border-structure bg-surface p-4 text-sm font-medium text-ink-muted">
          {statusMessage}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <TransactionImport onImportTransactions={handleImportTransactions} />

        <div className="rounded-2xl border border-structure bg-surface p-5">
          <h2 className="text-lg font-semibold text-ink">Export data</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Export all current transactions as CSV or Excel.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={exportCsv}
              className="rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-deep"
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={exportExcel}
              className="rounded-xl border border-structure px-4 py-3 text-sm font-semibold text-ink transition hover:bg-surface-low"
            >
              Export Excel
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function downloadFile(content: string, fileName: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}
