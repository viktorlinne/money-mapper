using MoneyMapper.Api.Contracts;

namespace MoneyMapper.Api.Endpoints;

public static class CurrencyEndpoints
{
    public static RouteGroupBuilder MapCurrencyEndpoints(this IEndpointRouteBuilder app)
    {
        var currency = app.MapGroup("/api/currency");

        currency.MapGet("/convert", async (
            decimal amount,
            string from,
            string to,
            IHttpClientFactory httpClientFactory) =>
        {
            if (amount <= 0)
            {
                return Results.BadRequest("Amount must be greater than 0.");
            }

            var fromCurrency = from.Trim().ToUpperInvariant();
            var toCurrency = to.Trim().ToUpperInvariant();

            if (fromCurrency == toCurrency)
            {
                return Results.Ok(new CurrencyConversionDto(
                    amount,
                    fromCurrency,
                    toCurrency,
                    amount));
            }

            var httpClient = httpClientFactory.CreateClient("frankfurter");
            var response = await httpClient.GetFromJsonAsync<FrankfurterLatestResponse>(
                $"latest?amount={amount}&from={fromCurrency}&to={toCurrency}");

            if (response?.Rates.TryGetValue(toCurrency, out var convertedAmount) != true)
            {
                return Results.Problem("Frankfurter did not return a conversion rate.");
            }

            return Results.Ok(new CurrencyConversionDto(
                amount,
                fromCurrency,
                toCurrency,
                convertedAmount));
        });

        return currency;
    }
}
