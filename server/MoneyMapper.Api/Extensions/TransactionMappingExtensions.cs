using MoneyMapper.Api.Contracts;
using MoneyMapper.Api.Models;

namespace MoneyMapper.Api.Extensions;

public static class TransactionMappingExtensions
{
    public static TransactionDto ToDto(this Transaction transaction) =>
        new(
            transaction.Id,
            transaction.Title,
            transaction.Amount,
            transaction.Type,
            transaction.ExpenseType,
            transaction.Category,
            transaction.Date
        );
}
