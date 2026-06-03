namespace MoneyMapper.Api.Contracts;

public sealed record TransactionDto(
    Guid Id,
    string Title,
    decimal Amount,
    string Type,
    string? ExpenseType,
    string Category,
    DateOnly Date
);

public sealed record CreateTransactionRequest(
    string Title,
    decimal Amount,
    string Type,
    string? ExpenseType,
    string Category,
    DateOnly Date
);

public sealed record UpdateTransactionRequest(
    string Title,
    decimal Amount,
    string Type,
    string? ExpenseType,
    string Category,
    DateOnly Date
);
