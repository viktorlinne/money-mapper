using Microsoft.EntityFrameworkCore;
using MoneyMapper.Api.Contracts;
using MoneyMapper.Api.Data;
using MoneyMapper.Api.Extensions;
using MoneyMapper.Api.Models;
using MoneyMapper.Api.Validation;

namespace MoneyMapper.Api.Endpoints;

public static class TransactionEndpoints
{
    public static RouteGroupBuilder MapTransactionEndpoints(this IEndpointRouteBuilder app)
    {
        var transactions = app.MapGroup("/api/transactions");

        transactions.MapGet("/", async (MoneyMapperDbContext dbContext) =>
        {
            var results = await dbContext.Transactions
                .AsNoTracking()
                .OrderByDescending(transaction => transaction.Date)
                .ThenByDescending(transaction => transaction.Id)
                .Select(transaction => new TransactionDto(
                    transaction.Id,
                    transaction.Title,
                    transaction.Amount,
                    transaction.Type,
                    transaction.Category,
                    transaction.Date))
                .ToListAsync();

            return Results.Ok(results);
        });

        transactions.MapGet("/{id:guid}", async (Guid id, MoneyMapperDbContext dbContext) =>
        {
            var transaction = await dbContext.Transactions.FindAsync(id);

            return transaction is null
                ? Results.NotFound()
                : Results.Ok(transaction.ToDto());
        });

        transactions.MapPost("/", async (
            CreateTransactionRequest request,
            MoneyMapperDbContext dbContext) =>
        {
            var errors = TransactionValidator.Validate(request);

            if (errors.Count > 0)
            {
                return Results.ValidationProblem(errors);
            }

            var transaction = new Transaction
            {
                Title = request.Title.Trim(),
                Amount = request.Amount,
                Type = request.Type,
                Category = request.Category,
                Date = request.Date,
            };

            dbContext.Transactions.Add(transaction);
            await dbContext.SaveChangesAsync();

            return Results.Created($"/api/transactions/{transaction.Id}", transaction.ToDto());
        });

        transactions.MapPut("/{id:guid}", async (
            Guid id,
            UpdateTransactionRequest request,
            MoneyMapperDbContext dbContext) =>
        {
            var errors = TransactionValidator.Validate(request);

            if (errors.Count > 0)
            {
                return Results.ValidationProblem(errors);
            }

            var transaction = await dbContext.Transactions.FindAsync(id);

            if (transaction is null)
            {
                return Results.NotFound();
            }

            transaction.Title = request.Title.Trim();
            transaction.Amount = request.Amount;
            transaction.Type = request.Type;
            transaction.Category = request.Category;
            transaction.Date = request.Date;

            await dbContext.SaveChangesAsync();

            return Results.Ok(transaction.ToDto());
        });

        transactions.MapDelete("/{id:guid}", async (Guid id, MoneyMapperDbContext dbContext) =>
        {
            var transaction = await dbContext.Transactions.FindAsync(id);

            if (transaction is null)
            {
                return Results.NotFound();
            }

            dbContext.Transactions.Remove(transaction);
            await dbContext.SaveChangesAsync();

            return Results.NoContent();
        });

        return transactions;
    }
}
