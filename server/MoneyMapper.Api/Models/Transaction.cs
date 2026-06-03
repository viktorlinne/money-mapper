using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MoneyMapper.Api.Models;

public sealed class Transaction
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [MaxLength(120)]
    public required string Title { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }

    [MaxLength(20)]
    public required string Type { get; set; }

    [MaxLength(40)]
    public required string Category { get; set; }

    public DateOnly Date { get; set; }
}
