import type { Subscription, SubscriptionInput } from "./subscriptionTypes";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api";

export async function fetchSubscriptions() {
  const response = await fetch(`${apiBaseUrl}/subscriptions`);

  if (!response.ok) {
    throw new Error("Failed to fetch subscriptions.");
  }

  return response.json() as Promise<Subscription[]>;
}

export async function createSubscription(subscription: SubscriptionInput) {
  const response = await fetch(`${apiBaseUrl}/subscriptions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  });

  if (!response.ok) {
    throw new Error("Failed to create subscription.");
  }

  return response.json() as Promise<Subscription>;
}

export async function updateSubscription(
  subscriptionId: string,
  subscription: SubscriptionInput,
) {
  const response = await fetch(`${apiBaseUrl}/subscriptions/${subscriptionId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  });

  if (!response.ok) {
    throw new Error("Failed to update subscription.");
  }

  return response.json() as Promise<Subscription>;
}

export async function deleteSubscription(subscriptionId: string) {
  const response = await fetch(`${apiBaseUrl}/subscriptions/${subscriptionId}`, {
    method: "DELETE",
  });

  if (!response.ok && response.status !== 404) {
    throw new Error("Failed to delete subscription.");
  }
}
