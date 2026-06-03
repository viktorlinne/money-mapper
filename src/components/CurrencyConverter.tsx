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
        `https://api.frankfurter.app/latest?amount=${parsedAmount}&from=${currency}&to=SEK`,
      );

      if (!response.ok) {
        throw new Error("Failed to convert currency.");
      }

      const data = (await response.json()) as { rates?: { SEK?: number } };
      const sekAmount = data.rates?.SEK;

      if (typeof sekAmount !== "number") {
        throw new Error("Frankfurter response did not include SEK.");
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">
        Currency conversion
      </h2>
      <p className="mt-2 text-sm text-slate-500">
        Convert common currencies to SEK with Frankfurter.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="grid gap-3 sm:grid-cols-[1fr_8rem]">
          <input
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            type="number"
            min="0"
            step="0.01"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          <select
            value={currency}
            onChange={(event) => setCurrency(event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          {isConverting ? "Converting..." : "Convert"}
        </button>
      </div>

      {convertedAmount !== null && (
        <p className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          {formatCurrency(convertedAmount)}
        </p>
      )}

      {errorMessage && (
        <p className="mt-4 rounded-xl bg-rose-50 p-4 text-sm font-medium text-rose-700">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
