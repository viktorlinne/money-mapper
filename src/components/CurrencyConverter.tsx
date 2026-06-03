import { useState } from "react";
import { formatCurrency } from "../features/transactions/transactionUtils";

const currencies = ["EUR", "USD", "GBP", "NOK", "DKK", "PLN", "SEK"];

export function CurrencyConverter() {
  const [amount, setAmount] = useState("100");
  const [currency, setCurrency] = useState("EUR");
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleConvert() {
    const parsedAmount = Number(amount);

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage("Enter an amount greater than 0.");
      return;
    }

    if (currency === "SEK") {
      setConvertedAmount(parsedAmount);
      setErrorMessage(null);
      return;
    }

    setIsConverting(true);
    setErrorMessage(null);

    try {
      const response = await fetch(
        `/api/currency/convert?amount=${parsedAmount}&from=${currency}&to=SEK`,
      );

      if (!response.ok) {
        throw new Error("Failed to convert currency.");
      }

      const data = (await response.json()) as { convertedAmount?: number };
      const sekAmount = data.convertedAmount;

      if (typeof sekAmount !== "number") {
        throw new Error("Currency API response did not include SEK.");
      }

      setConvertedAmount(sekAmount);
    } catch (error) {
      console.error(error);
      setErrorMessage("Could not convert right now.");
    } finally {
      setIsConverting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-structure bg-surface p-5">
      <h2 className="text-lg font-semibold text-ink">
        Currency conversion
      </h2>
      <p className="mt-2 text-sm text-ink-muted">
        Convert common currencies to SEK with live rates.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="grid gap-3 sm:grid-cols-[1fr_8rem]">
          <label className="sr-only" htmlFor="converter-amount">
            Amount
          </label>
          <input
            id="converter-amount"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            type="number"
            min="0"
            step="0.01"
            placeholder="100"
            className="rounded-xl border border-structure bg-surface px-3 py-2 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-ring"
          />
          <label className="sr-only" htmlFor="converter-currency">
            Currency
          </label>
          <select
            id="converter-currency"
            value={currency}
            onChange={(event) => setCurrency(event.target.value)}
            className="rounded-xl border border-structure bg-surface px-3 py-2 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-ring"
          >
            {currencies.map((currencyCode) => (
              <option key={currencyCode} value={currencyCode}>
                {currencyCode}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleConvert}
          disabled={isConverting}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isConverting ? "Converting..." : "Convert"}
        </button>
      </div>

      {convertedAmount !== null && (
        <p className="mt-4 rounded-xl bg-surface-low p-4 text-sm font-semibold text-ink">
          {formatCurrency(convertedAmount)}
        </p>
      )}

      {errorMessage && (
        <p className="mt-4 rounded-xl bg-negative-bg p-4 text-sm font-medium text-negative-text">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
