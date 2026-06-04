using Microsoft.EntityFrameworkCore;
using MoneyMapper.Api.Contracts;
using MoneyMapper.Api.Data;
using MoneyMapper.Api.Models;
using MoneyMapper.Api.Validation;

namespace MoneyMapper.Api.Endpoints;

public static class SubscriptionEndpoints
{
    private static readonly string[] BillingCycles = ["monthly", "yearly"];
    private static readonly string[] Statuses = ["active", "cancelled"];

    public static RouteGroupBuilder MapSubscriptionEndpoints(this IEndpointRouteBuilder app)
    {
        var subscriptions = app.MapGroup("/api/subscriptions");

        subscriptions.MapGet(
            "/",
            async (MoneyMapperDbContext dbContext) =>
            {
                var results = await dbContext
                    .Subscriptions.AsNoTracking()
                    .OrderBy(subscription => subscription.RenewalDate)
                    .ThenBy(subscription => subscription.Name)
                    .Select(subscription => new SubscriptionDto(
                        subscription.Id,
                        subscription.Name,
                        subscription.Amount,
                        subscription.BillingCycle,
                        subscription.RenewalDate,
                        subscription.Status,
                        subscription.Category
                    ))
                    .ToListAsync();

                return Results.Ok(results);
            }
        );

        subscriptions.MapPost(
            "/",
            async (CreateSubscriptionRequest request, MoneyMapperDbContext dbContext) =>
            {
                var errors = Validate(
                    request.Name,
                    request.Amount,
                    request.BillingCycle,
                    request.Status,
                    request.Category);

                if (errors.Count > 0)
                {
                    return Results.ValidationProblem(errors);
                }

                var subscription = new Subscription
                {
                    Name = request.Name.Trim(),
                    Amount = request.Amount,
                    BillingCycle = request.BillingCycle,
                    RenewalDate = request.RenewalDate,
                    Status = request.Status,
                    Category = request.Category,
                };

                dbContext.Subscriptions.Add(subscription);
                await dbContext.SaveChangesAsync();

                return Results.Created($"/api/subscriptions/{subscription.Id}", ToDto(subscription));
            }
        );

        subscriptions.MapPut(
            "/{id:guid}",
            async (Guid id, UpdateSubscriptionRequest request, MoneyMapperDbContext dbContext) =>
            {
                var errors = Validate(
                    request.Name,
                    request.Amount,
                    request.BillingCycle,
                    request.Status,
                    request.Category);

                if (errors.Count > 0)
                {
                    return Results.ValidationProblem(errors);
                }

                var subscription = await dbContext.Subscriptions.FindAsync(id);

                if (subscription is null)
                {
                    return Results.NotFound();
                }

                subscription.Name = request.Name.Trim();
                subscription.Amount = request.Amount;
                subscription.BillingCycle = request.BillingCycle;
                subscription.RenewalDate = request.RenewalDate;
                subscription.Status = request.Status;
                subscription.Category = request.Category;

                await dbContext.SaveChangesAsync();

                return Results.Ok(ToDto(subscription));
            }
        );

        subscriptions.MapDelete(
            "/{id:guid}",
            async (Guid id, MoneyMapperDbContext dbContext) =>
            {
                var subscription = await dbContext.Subscriptions.FindAsync(id);

                if (subscription is null)
                {
                    return Results.NotFound();
                }

                dbContext.Subscriptions.Remove(subscription);
                await dbContext.SaveChangesAsync();

                return Results.NoContent();
            }
        );

        return subscriptions;
    }

    private static SubscriptionDto ToDto(Subscription subscription) =>
        new(
            subscription.Id,
            subscription.Name,
            subscription.Amount,
            subscription.BillingCycle,
            subscription.RenewalDate,
            subscription.Status,
            subscription.Category);

    private static Dictionary<string, string[]> Validate(
        string name,
        decimal amount,
        string billingCycle,
        string status,
        string category)
    {
        var errors = new Dictionary<string, string[]>();

        if (string.IsNullOrWhiteSpace(name))
        {
            errors["name"] = ["Name is required."];
        }
        else if (name.Trim().Length > 120)
        {
            errors["name"] = ["Name must be 120 characters or fewer."];
        }

        if (amount <= 0)
        {
            errors["amount"] = ["Amount must be greater than 0."];
        }

        if (!BillingCycles.Contains(billingCycle))
        {
            errors["billingCycle"] =
            [
                $"Billing cycle must be one of: {string.Join(", ", BillingCycles)}.",
            ];
        }

        if (!Statuses.Contains(status))
        {
            errors["status"] =
            [
                $"Status must be one of: {string.Join(", ", Statuses)}.",
            ];
        }

        if (!TransactionValues.Categories.Contains(category))
        {
            errors["category"] =
            [
                $"Category must be one of: {string.Join(", ", TransactionValues.Categories)}.",
            ];
        }

        return errors;
    }
}
