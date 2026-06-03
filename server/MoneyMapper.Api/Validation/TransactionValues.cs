namespace MoneyMapper.Api.Validation;

public static class TransactionValues
{
    public static readonly string[] Types =
    [
        "income",
        "expense",
    ];

    public static readonly string[] Categories =
    [
        "Salary",
        "Food",
        "Transport",
        "Housing",
        "Entertainment",
        "Health",
        "Subscriptions",
        "Other",
    ];
}
