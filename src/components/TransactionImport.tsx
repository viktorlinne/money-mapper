import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import type {
  ExpenseType,
  Transaction,
  TransactionCategory,
  TransactionType,
} from "../features/transactions/transactionTypes";

type TransactionImportProps = {
  onImportTransactions: (
    transactions: Omit<Transaction, "id">[],
  ) => void | Promise<void>;
};

const transactionTypes: TransactionType[] = ["income", "expense"];
const expenseTypes: ExpenseType[] = ["fixed", "variable"];
const categories: TransactionCategory[] = [
  "Salary",
  "Food",
  "Transport",
  "Housing",
  "Entertainment",
  "Health",
  "Subscriptions",
  "Other",
];

function normalize(value: unknown) {
  return String(value ?? "").trim();
}

function parseImportedTransaction(
  row: Record<string, unknown>,
): Omit<Transaction, "id"> | null {
  const title = normalize(row.title ?? row.Title);
  const amount = Number(row.amount ?? row.Amount);
  const type = normalize(row.type ?? row.Type).toLowerCase() as TransactionType;
  const category = normalize(
    row.category ?? row.Category,
  ) as TransactionCategory;
  const date = normalize(row.date ?? row.Date);
  const expenseTypeValue = normalize(
    row.expenseType ??
      row.expense_type ??
      row["Expense type"] ??
      row.ExpenseType,
  ).toLowerCase() as ExpenseType;

  if (!title || Number.isNaN(amount) || amount <= 0 || !date) {
    return null;
  }

  if (!transactionTypes.includes(type) || !categories.includes(category)) {
    return null;
  }

  const expenseType =
    type === "expense" && expenseTypes.includes(expenseTypeValue)
      ? expenseTypeValue
      : type === "expense"
        ? "variable"
        : null;

  return {
    title,
    amount,
    type,
    expenseType,
    category,
    date,
  } satisfies Omit<Transaction, "id">;
}

export function TransactionImport({
  onImportTransactions,
}: TransactionImportProps) {
  const [importedCount, setImportedCount] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const buffer = await file.arrayBuffer();
    const XLSX = await import("xlsx");
    const workbook = XLSX.read(buffer);
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet);
    const transactions = rows
      .map(parseImportedTransaction)
      .filter((transaction): transaction is Omit<Transaction, "id"> =>
        Boolean(transaction),
      );

    if (transactions.length > 0) {
      await onImportTransactions(transactions);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setImportedCount(transactions.length);
      timeoutRef.current = setTimeout(() => setImportedCount(null), 3000);
    }

    event.target.value = "";
  }

  return (
    <div className="rounded-2xl border border-structure bg-surface p-5">
      <h2 className="text-lg font-semibold text-ink">
        Excel / CSV import
      </h2>
      <p className="mt-2 text-sm text-ink-muted">
        Import rows with title, amount, type, category, date, and optional
        expenseType.
      </p>

      <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-structure bg-surface-low p-6 text-center transition hover:border-accent hover:bg-accent-subtle">
        <span className="text-sm font-semibold text-ink-label">
          Choose .xlsx or .csv file
        </span>
        <span className="mt-1 text-xs text-ink-muted">
          Invalid rows are skipped.
        </span>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileChange}
          className="sr-only"
        />
      </label>

      <AnimatePresence>
        {importedCount !== null && (
          <motion.p
            key="import-success"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mt-3 text-sm font-medium text-positive"
          >
            {importedCount} transaction{importedCount !== 1 ? "s" : ""} imported.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
