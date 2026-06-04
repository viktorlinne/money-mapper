namespace MoneyMapper.Api.Contracts;

public sealed record BudgetDto(
    Guid Id,
    string Month,
    string Category,
    decimal Amount
);

public sealed record CreateBudgetRequest(
    string Month,
    string Category,
    decimal Amount
);

public sealed record UpdateBudgetRequest(
    string Month,
    string Category,
    decimal Amount
);
