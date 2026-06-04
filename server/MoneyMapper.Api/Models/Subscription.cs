using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MoneyMapper.Api.Models;

public sealed class Subscription
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [MaxLength(120)]
    public required string Name { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }

    [MaxLength(20)]
    public required string BillingCycle { get; set; }

    public DateOnly RenewalDate { get; set; }

    [MaxLength(20)]
    public required string Status { get; set; }

    [MaxLength(40)]
    public required string Category { get; set; }
}
