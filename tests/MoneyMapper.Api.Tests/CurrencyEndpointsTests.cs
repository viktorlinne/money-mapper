using System.Net.Http.Json;
using MoneyMapper.Api.Contracts;

namespace MoneyMapper.Api.Tests;

public sealed class CurrencyEndpointsTests(MoneyMapperApiFactory factory)
    : IClassFixture<MoneyMapperApiFactory>
{
    private readonly HttpClient _client = factory.CreateClient();

    [Fact]
    public async Task ConvertCurrency_ReturnsConvertedAmount()
    {
        var result = await _client.GetFromJsonAsync<CurrencyConversionDto>(
            "/api/currency/convert?amount=100&from=EUR&to=SEK");

        Assert.NotNull(result);
        Assert.Equal(100, result.Amount);
        Assert.Equal("EUR", result.From);
        Assert.Equal("SEK", result.To);
        Assert.Equal(1120, result.ConvertedAmount);
    }
}
