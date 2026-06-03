using System.Net;
using System.Text;

namespace MoneyMapper.Api.Tests;

public sealed class FakeFrankfurterHandler : HttpMessageHandler
{
    protected override Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request,
        CancellationToken cancellationToken)
    {
        var response = new HttpResponseMessage(HttpStatusCode.OK)
        {
            Content = new StringContent(
                """
                {
                  "amount": 100,
                  "base": "EUR",
                  "date": "2026-06-03",
                  "rates": {
                    "SEK": 1120
                  }
                }
                """,
                Encoding.UTF8,
                "application/json"),
        };

        return Task.FromResult(response);
    }
}
