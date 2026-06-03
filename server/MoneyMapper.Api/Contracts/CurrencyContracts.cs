namespace MoneyMapper.Api.Contracts;

public sealed record CurrencyConversionDto(
    decimal Amount,
    string From,
    string To,
    decimal ConvertedAmount);

public sealed record FrankfurterLatestResponse(
    decimal Amount,
    string Base,
    string Date,
    Dictionary<string, decimal> Rates);
