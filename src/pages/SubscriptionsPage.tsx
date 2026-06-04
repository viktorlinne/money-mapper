import { useEffect, useMemo, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  createSubscription,
  deleteSubscription,
  fetchSubscriptions,
  updateSubscription,
} from "../features/subscriptions/subscriptionApi";
import type {
  BillingCycle,
  Subscription,
  SubscriptionStatus,
} from "../features/subscriptions/subscriptionTypes";
import type { TransactionCategory } from "../features/transactions/transactionTypes";
import { formatCurrency } from "../features/transactions/transactionUtils";

const categories: TransactionCategory[] = [
  "Subscriptions",
  "Entertainment",
  "Health",
  "Transport",
  "Housing",
  "Other",
];

const today = () => new Date().toISOString().slice(0, 10);

export function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [renewalDate, setRenewalDate] = useState(today());
  const [status, setStatus] = useState<SubscriptionStatus>("active");
  const [category, setCategory] =
    useState<TransactionCategory>("Subscriptions");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadSubscriptions() {
      try {
        setSubscriptions(await fetchSubscriptions());
      } catch (error) {
        console.error(error);
        setErrorMessage("Could not load subscriptions.");
      }
    }

    loadSubscriptions();
  }, []);

  const totals = useMemo(() => {
    const monthly = subscriptions
      .filter((subscription) => subscription.status === "active")
      .reduce(
        (sum, subscription) =>
          sum +
          (subscription.billingCycle === "yearly"
            ? subscription.amount / 12
            : subscription.amount),
        0,
      );

    return {
      monthly,
      yearly: monthly * 12,
    };
  }, [subscriptions]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedAmount = Number(amount);

    if (!name.trim() || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      return;
    }

    const input = {
      name: name.trim(),
      amount: parsedAmount,
      billingCycle,
      renewalDate,
      status,
      category,
    };

    try {
      if (editingSubscription) {
        const updatedSubscription = await updateSubscription(
          editingSubscription.id,
          input,
        );
        setSubscriptions((currentSubscriptions) =>
          currentSubscriptions.map((subscription) =>
            subscription.id === updatedSubscription.id
              ? updatedSubscription
              : subscription,
          ),
        );
      } else {
        const createdSubscription = await createSubscription(input);
        setSubscriptions((currentSubscriptions) => [
          ...currentSubscriptions,
          createdSubscription,
        ]);
      }

      resetForm();
      setErrorMessage(null);
    } catch (error) {
      console.error(error);
      setErrorMessage("Could not save subscription.");
    }
  }

  async function handleDeleteSubscription(subscriptionId: string) {
    try {
      await deleteSubscription(subscriptionId);
      setSubscriptions((currentSubscriptions) =>
        currentSubscriptions.filter(
          (subscription) => subscription.id !== subscriptionId,
        ),
      );
    } catch (error) {
      console.error(error);
      setErrorMessage("Could not delete subscription.");
    }
  }

  function startEditing(subscription: Subscription) {
    setEditingSubscription(subscription);
    setName(subscription.name);
    setAmount(String(subscription.amount));
    setBillingCycle(subscription.billingCycle);
    setRenewalDate(subscription.renewalDate);
    setStatus(subscription.status);
    setCategory(subscription.category);
  }

  function resetForm() {
    setEditingSubscription(null);
    setName("");
    setAmount("");
    setBillingCycle("monthly");
    setRenewalDate(today());
    setStatus("active");
    setCategory("Subscriptions");
  }

  return (
    <section>
      <p className="text-sm font-medium text-ink-muted">Subscriptions</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">
        Subscriptions
      </h1>
      <p className="mt-2 text-ink-secondary">
        Manage recurring costs with renewal dates, billing cycles, and status.
      </p>

      <motion.div
        className="mt-6 grid gap-4 md:grid-cols-2"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.06 } },
        }}
      >
        <motion.div
          className="rounded-2xl border border-structure bg-surface p-5"
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-sm font-medium text-ink-muted">Monthly cost</p>
          <p className="mt-2 text-3xl font-bold text-ink">
            {formatCurrency(totals.monthly)}
          </p>
        </motion.div>
        <motion.div
          className="rounded-2xl border border-structure bg-surface p-5"
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-sm font-medium text-ink-muted">Yearly cost</p>
          <p className="mt-2 text-3xl font-bold text-ink">
            {formatCurrency(totals.yearly)}
          </p>
        </motion.div>
      </motion.div>

      {errorMessage && (
        <div className="mt-6 rounded-2xl border border-negative-border bg-negative-bg p-4 text-sm font-medium text-negative-text">
          {errorMessage}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        <motion.form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-structure bg-surface p-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-lg font-semibold text-ink">
            {editingSubscription ? "Edit subscription" : "Add subscription"}
          </h2>
          <div className="mt-5 space-y-4">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Netflix, Spotify, gym..."
              className="w-full rounded-xl border border-structure bg-surface px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent-ring"
            />
            <input
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              type="number"
              min="0"
              step="0.01"
              placeholder="Amount"
              className="w-full rounded-xl border border-structure bg-surface px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent-ring"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <select
                value={billingCycle}
                onChange={(event) =>
                  setBillingCycle(event.target.value as BillingCycle)
                }
                className="rounded-xl border border-structure bg-surface px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent-ring"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              <input
                value={renewalDate}
                onChange={(event) => setRenewalDate(event.target.value)}
                type="date"
                className="rounded-xl border border-structure bg-surface px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent-ring"
              />
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as SubscriptionStatus)
                }
                className="rounded-xl border border-structure bg-surface px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent-ring"
              >
                <option value="active">Active</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as TransactionCategory)
                }
                className="rounded-xl border border-structure bg-surface px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent-ring"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-deep"
            >
              {editingSubscription ? "Save subscription" : "Create subscription"}
            </button>
          </div>
        </motion.form>

        <motion.div
          className="rounded-2xl border border-structure bg-surface p-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-lg font-semibold text-ink">
            Managed subscriptions
          </h2>
          <motion.div
            className="mt-5 space-y-3"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.045 } },
            }}
          >
            {subscriptions.length > 0 ? (
              <AnimatePresence initial={false}>
                {subscriptions.map((subscription) => (
                <motion.div
                  key={subscription.id}
                  layout
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    show: { opacity: 1, y: 0 },
                  }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col gap-3 rounded-xl bg-surface-low p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-semibold text-ink">
                      {subscription.name}
                    </p>
                    <p className="text-sm text-ink-muted">
                      {subscription.billingCycle} · renews{" "}
                      {subscription.renewalDate} · {subscription.status}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold tabular-nums text-negative">
                      {formatCurrency(subscription.amount)}
                    </p>
                    <button
                      type="button"
                      onClick={() => startEditing(subscription)}
                      className="rounded-lg px-3 py-2 text-sm font-semibold text-accent-deep hover:bg-accent-subtle"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSubscription(subscription.id)}
                      className="rounded-lg px-3 py-2 text-sm font-semibold text-negative hover:bg-negative-bg"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
              </AnimatePresence>
            ) : (
              <p className="rounded-xl bg-surface-low p-4 text-sm text-ink-muted">
                Add your first subscription to track recurring spending.
              </p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
