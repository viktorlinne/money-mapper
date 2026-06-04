namespace MoneyMapper.Api.Contracts;

public sealed record SubscriptionDto(
    Guid Id,
    string Name,
    decimal Amount,
    string BillingCycle,
    DateOnly RenewalDate,
    string Status,
    string Category
);

public sealed record CreateSubscriptionRequest(
    string Name,
    decimal Amount,
    string BillingCycle,
    DateOnly RenewalDate,
    string Status,
    string Category
);

public sealed record UpdateSubscriptionRequest(
    string Name,
    decimal Amount,
    string BillingCycle,
    DateOnly RenewalDate,
    string Status,
    string Category
);
