using Microsoft.EntityFrameworkCore;
using MoneyMapper.Api.Models;

namespace MoneyMapper.Api.Data;

public sealed class MoneyMapperDbContext(DbContextOptions<MoneyMapperDbContext> options)
    : DbContext(options)
{
    public DbSet<Transaction> Transactions => Set<Transaction>();

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
    }
}
