using MoneyMapper.Api.Endpoints;
using MoneyMapper.Api.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddMoneyMapperApi(builder.Configuration, builder.Environment);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors(ServiceCollectionExtensions.ViteCorsPolicy);

app.MapTransactionEndpoints();
app.MapCurrencyEndpoints();
app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }));

app.Run();

public partial class Program;
