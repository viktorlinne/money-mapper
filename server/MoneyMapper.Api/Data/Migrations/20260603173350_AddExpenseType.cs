using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MoneyMapper.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddExpenseType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder
                .AddColumn<string>(
                    name: "expense_type",
                    table: "transactions",
                    type: "varchar(20)",
                    maxLength: 20,
                    nullable: true
                )
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.Sql(
                "UPDATE transactions SET expense_type = 'variable' WHERE type = 'expense' AND expense_type IS NULL;"
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "expense_type", table: "transactions");
        }
    }
}
