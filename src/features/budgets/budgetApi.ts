import type { Budget, BudgetInput } from "./budgetTypes";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api";

export async function fetchBudgets(month?: string) {
  const searchParams = new URLSearchParams();

  if (month) {
    searchParams.set("month", month);
  }

  const query = searchParams.toString();
  const response = await fetch(`${apiBaseUrl}/budgets${query ? `?${query}` : ""}`);

  if (!response.ok) {
    throw new Error("Failed to fetch budgets.");
  }

  return response.json() as Promise<Budget[]>;
}

export async function createBudget(budget: BudgetInput) {
  const response = await fetch(`${apiBaseUrl}/budgets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(budget),
  });

  if (!response.ok) {
    throw new Error("Failed to create budget.");
  }

  return response.json() as Promise<Budget>;
}

export async function updateBudget(budgetId: string, budget: BudgetInput) {
  const response = await fetch(`${apiBaseUrl}/budgets/${budgetId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(budget),
  });

  if (!response.ok) {
    throw new Error("Failed to update budget.");
  }

  return response.json() as Promise<Budget>;
}

export async function deleteBudget(budgetId: string) {
  const response = await fetch(`${apiBaseUrl}/budgets/${budgetId}`, {
    method: "DELETE",
  });

  if (!response.ok && response.status !== 404) {
    throw new Error("Failed to delete budget.");
  }
}
