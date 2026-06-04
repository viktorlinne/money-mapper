using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MoneyMapper.Api.Models;

public sealed class Budget
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [MaxLength(7)]
    public required string Month { get; set; }

    [MaxLength(40)]
    public required string Category { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }
}
