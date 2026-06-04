using Microsoft.EntityFrameworkCore;
using MoneyMapper.Api.Contracts;
using MoneyMapper.Api.Data;
using MoneyMapper.Api.Models;
using MoneyMapper.Api.Validation;

namespace MoneyMapper.Api.Endpoints;

public static class BudgetEndpoints
{
    public static RouteGroupBuilder MapBudgetEndpoints(this IEndpointRouteBuilder app)
    {
        var budgets = app.MapGroup("/api/budgets");

        budgets.MapGet(
            "/",
            async (string? month, MoneyMapperDbContext dbContext) =>
            {
                var query = dbContext.Budgets.AsNoTracking();

                if (!string.IsNullOrWhiteSpace(month))
                {
                    query = query.Where(budget => budget.Month == month);
                }

                var results = await query
                    .OrderByDescending(budget => budget.Month)
                    .ThenBy(budget => budget.Category)
                    .Select(budget => new BudgetDto(
                        budget.Id,
                        budget.Month,
                        budget.Category,
                        budget.Amount
                    ))
                    .ToListAsync();

                return Results.Ok(results);
            }
        );

        budgets.MapPost(
            "/",
            async (CreateBudgetRequest request, MoneyMapperDbContext dbContext) =>
            {
                var errors = Validate(request.Month, request.Category, request.Amount);

                if (errors.Count > 0)
                {
                    return Results.ValidationProblem(errors);
                }

                var existingBudget = await dbContext.Budgets.FirstOrDefaultAsync(
                    budget => budget.Month == request.Month && budget.Category == request.Category);

                if (existingBudget is not null)
                {
                    errors["category"] = ["A budget already exists for this month and category."];
                    return Results.ValidationProblem(errors);
                }

                var budget = new Budget
                {
                    Month = request.Month,
                    Category = request.Category,
                    Amount = request.Amount,
                };

                dbContext.Budgets.Add(budget);
                await dbContext.SaveChangesAsync();

                return Results.Created($"/api/budgets/{budget.Id}", ToDto(budget));
            }
        );

        budgets.MapPut(
            "/{id:guid}",
            async (Guid id, UpdateBudgetRequest request, MoneyMapperDbContext dbContext) =>
            {
                var errors = Validate(request.Month, request.Category, request.Amount);

                if (errors.Count > 0)
                {
                    return Results.ValidationProblem(errors);
                }

                var budget = await dbContext.Budgets.FindAsync(id);

                if (budget is null)
                {
                    return Results.NotFound();
                }

                budget.Month = request.Month;
                budget.Category = request.Category;
                budget.Amount = request.Amount;

                await dbContext.SaveChangesAsync();

                return Results.Ok(ToDto(budget));
            }
        );

        budgets.MapDelete(
            "/{id:guid}",
            async (Guid id, MoneyMapperDbContext dbContext) =>
            {
                var budget = await dbContext.Budgets.FindAsync(id);

                if (budget is null)
                {
                    return Results.NotFound();
                }

                dbContext.Budgets.Remove(budget);
                await dbContext.SaveChangesAsync();

                return Results.NoContent();
            }
        );

        return budgets;
    }

    private static BudgetDto ToDto(Budget budget) =>
        new(budget.Id, budget.Month, budget.Category, budget.Amount);

    private static Dictionary<string, string[]> Validate(
        string month,
        string category,
        decimal amount)
    {
        var errors = new Dictionary<string, string[]>();

        if (string.IsNullOrWhiteSpace(month) || month.Length != 7)
        {
            errors["month"] = ["Month must use YYYY-MM format."];
        }

        if (!TransactionValues.Categories.Contains(category))
        {
            errors["category"] =
            [
                $"Category must be one of: {string.Join(", ", TransactionValues.Categories)}.",
            ];
        }

        if (amount <= 0)
        {
            errors["amount"] = ["Amount must be greater than 0."];
        }

        return errors;
    }
}
