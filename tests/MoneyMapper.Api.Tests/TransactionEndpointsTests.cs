using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Http;
using MoneyMapper.Api.Contracts;

namespace MoneyMapper.Api.Tests;

public sealed class TransactionEndpointsTests(MoneyMapperApiFactory factory)
    : IClassFixture<MoneyMapperApiFactory>
{
    private readonly HttpClient _client = factory.CreateClient();

    [Fact]
    public async Task PostTransaction_CreatesTransaction()
    {
        var request = new CreateTransactionRequest(
            "Salary",
            32000,
            "income",
            null,
            "Salary",
            new DateOnly(2026, 6, 1)
        );

        var response = await _client.PostAsJsonAsync("/api/transactions", request);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var created = await response.Content.ReadFromJsonAsync<TransactionDto>();
        Assert.NotNull(created);
        Assert.NotEqual(Guid.Empty, created.Id);
        Assert.Equal(request.Title, created.Title);
        Assert.Null(created.ExpenseType);
    }

    [Fact]
    public async Task GetTransactions_ReturnsCreatedTransactions()
    {
        var request = new CreateTransactionRequest(
            "Groceries",
            650,
            "expense",
            "variable",
            "Food",
            new DateOnly(2026, 6, 2)
        );

        var createResponse = await _client.PostAsJsonAsync("/api/transactions", request);

        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);

        var transactions = await _client.GetFromJsonAsync<TransactionDto[]>("/api/transactions");

        Assert.NotNull(transactions);
        Assert.Contains(transactions, transaction => transaction.Title == request.Title);
    }

    [Fact]
    public async Task PostTransaction_WithInvalidFields_ReturnsValidationProblem()
    {
        var request = new CreateTransactionRequest(
            "",
            0,
            "transfer",
            "fixed",
            "Invalid",
            new DateOnly(2026, 6, 1)
        );

        var response = await _client.PostAsJsonAsync("/api/transactions", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        var problem = await response.Content.ReadFromJsonAsync<HttpValidationProblemDetails>();
        Assert.NotNull(problem);
        Assert.Contains("title", problem.Errors.Keys);
        Assert.Contains("amount", problem.Errors.Keys);
        Assert.Contains("type", problem.Errors.Keys);
        Assert.Contains("expenseType", problem.Errors.Keys);
        Assert.Contains("category", problem.Errors.Keys);
    }
}
