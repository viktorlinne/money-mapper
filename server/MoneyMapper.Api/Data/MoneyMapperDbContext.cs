using Microsoft.EntityFrameworkCore;
using MoneyMapper.Api.Models;

namespace MoneyMapper.Api.Data;

public sealed class MoneyMapperDbContext(DbContextOptions<MoneyMapperDbContext> options)
    : DbContext(options)
{
    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<Budget> Budgets => Set<Budget>();
    public DbSet<Subscription> Subscriptions => Set<Subscription>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.ToTable("transactions");

            entity.HasKey(transaction => transaction.Id);

            entity.Property(transaction => transaction.Id).HasColumnName("id");

            entity
                .Property(transaction => transaction.Title)
                .HasColumnName("title")
                .IsRequired()
                .HasMaxLength(120);

            entity
                .Property(transaction => transaction.Amount)
                .HasColumnName("amount")
                .HasPrecision(18, 2);

            entity
                .Property(transaction => transaction.Type)
                .HasColumnName("type")
                .IsRequired()
                .HasMaxLength(20);

            entity
                .Property(transaction => transaction.ExpenseType)
                .HasColumnName("expense_type")
                .HasMaxLength(20);

            entity
                .Property(transaction => transaction.Category)
                .HasColumnName("category")
                .IsRequired()
                .HasMaxLength(40);

            entity.Property(transaction => transaction.Date).HasColumnName("date");
        });

        modelBuilder.Entity<Budget>(entity =>
        {
            entity.ToTable("budgets");

            entity.HasKey(budget => budget.Id);

            entity.Property(budget => budget.Id).HasColumnName("id");

            entity
                .Property(budget => budget.Month)
                .HasColumnName("month")
                .IsRequired()
                .HasMaxLength(7);

            entity
                .Property(budget => budget.Category)
                .HasColumnName("category")
                .IsRequired()
                .HasMaxLength(40);

            entity
                .Property(budget => budget.Amount)
                .HasColumnName("amount")
                .HasPrecision(18, 2);

            entity.HasIndex(budget => new { budget.Month, budget.Category }).IsUnique();
        });

        modelBuilder.Entity<Subscription>(entity =>
        {
            entity.ToTable("subscriptions");

            entity.HasKey(subscription => subscription.Id);

            entity.Property(subscription => subscription.Id).HasColumnName("id");

            entity
                .Property(subscription => subscription.Name)
                .HasColumnName("name")
                .IsRequired()
                .HasMaxLength(120);

            entity
                .Property(subscription => subscription.Amount)
                .HasColumnName("amount")
                .HasPrecision(18, 2);

            entity
                .Property(subscription => subscription.BillingCycle)
                .HasColumnName("billing_cycle")
                .IsRequired()
                .HasMaxLength(20);

            entity.Property(subscription => subscription.RenewalDate).HasColumnName("renewal_date");

            entity
                .Property(subscription => subscription.Status)
                .HasColumnName("status")
                .IsRequired()
                .HasMaxLength(20);

            entity
                .Property(subscription => subscription.Category)
                .HasColumnName("category")
                .IsRequired()
                .HasMaxLength(40);
        });
    }
}
