import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TransactionList } from "./TransactionList";
import type { Transaction } from "../features/transactions/transactionTypes";

const transactions: Transaction[] = [
  {
    id: "transaction-1",
    title: "Groceries",
    amount: 650,
    type: "expense",
    category: "Food",
    date: "2026-06-02",
  },
];

describe("TransactionList", () => {
  it("renders transactions", () => {
    render(
      <TransactionList transactions={transactions} onDeleteTransaction={vi.fn()} />,
    );

    expect(screen.getByText("Groceries")).toBeInTheDocument();
    expect(screen.getByText("Food · 2026-06-02")).toBeInTheDocument();
  });

  it("calls delete handler with the transaction id", async () => {
    const user = userEvent.setup();
    const onDeleteTransaction = vi.fn();

    render(
      <TransactionList
        transactions={transactions}
        onDeleteTransaction={onDeleteTransaction}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Delete Groceries" }));

    expect(onDeleteTransaction).toHaveBeenCalledWith("transaction-1");
  });
});
