import type { Transaction } from "./transactionTypes";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api";

export async function fetchTransactions() {
  const response = await fetch(`${apiBaseUrl}/transactions`);

  if (!response.ok) {
    throw new Error("Failed to fetch transactions.");
  }

  return response.json() as Promise<Transaction[]>;
}

export async function createTransaction(transaction: Omit<Transaction, "id">) {
  const response = await fetch(`${apiBaseUrl}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
  });

  if (!response.ok) {
    throw new Error("Failed to create transaction.");
  }

  return response.json() as Promise<Transaction>;
}

export async function updateTransaction(
  transactionId: string,
  transaction: Omit<Transaction, "id">,
) {
  const response = await fetch(`${apiBaseUrl}/transactions/${transactionId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
  });

  if (!response.ok) {
    throw new Error("Failed to update transaction.");
  }

  return response.json() as Promise<Transaction>;
}

export async function deleteTransaction(transactionId: string) {
  const response = await fetch(`${apiBaseUrl}/transactions/${transactionId}`, {
    method: "DELETE",
  });

  if (!response.ok && response.status !== 404) {
    throw new Error("Failed to delete transaction.");
  }
}
