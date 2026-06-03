using MoneyMapper.Api.Contracts;

namespace MoneyMapper.Api.Validation;

public static class TransactionValidator
{
    public static Dictionary<string, string[]> Validate(CreateTransactionRequest request) =>
        Validate(
            request.Title,
            request.Amount,
            request.Type,
            request.ExpenseType,
            request.Category
        );

    public static Dictionary<string, string[]> Validate(UpdateTransactionRequest request) =>
        Validate(
            request.Title,
            request.Amount,
            request.Type,
            request.ExpenseType,
            request.Category
        );

    private static Dictionary<string, string[]> Validate(
        string title,
        decimal amount,
        string type,
        string? expenseType,
        string category
    )
    {
        var errors = new Dictionary<string, string[]>();

        if (string.IsNullOrWhiteSpace(title))
        {
            errors["title"] = ["Title is required."];
        }
        else if (title.Trim().Length > 120)
        {
            errors["title"] = ["Title must be 120 characters or fewer."];
        }

        if (amount <= 0)
        {
            errors["amount"] = ["Amount must be greater than 0."];
        }

        if (!TransactionValues.Types.Contains(type))
        {
            errors["type"] =
            [
                $"Type must be one of: {string.Join(", ", TransactionValues.Types)}.",
            ];
        }

        if (type == "expense")
        {
            if (string.IsNullOrWhiteSpace(expenseType))
            {
                errors["expenseType"] = ["Expense type is required for expenses."];
            }
            else if (!TransactionValues.ExpenseTypes.Contains(expenseType))
            {
                errors["expenseType"] =
                [
                    $"Expense type must be one of: {string.Join(", ", TransactionValues.ExpenseTypes)}.",
                ];
            }
        }
        else if (!string.IsNullOrWhiteSpace(expenseType))
        {
            errors["expenseType"] = ["Expense type can only be set for expenses."];
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
