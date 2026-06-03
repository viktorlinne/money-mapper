using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using MoneyMapper.Api.Data;

namespace MoneyMapper.Api.Tests;

public sealed class MoneyMapperApiFactory : WebApplicationFactory<Program>
{
    private readonly string _databaseName = $"money-mapper-tests-{Guid.NewGuid()}";

    public MoneyMapperApiFactory()
    {
        Environment.SetEnvironmentVariable("ASPNETCORE_ENVIRONMENT", "Testing");
        Environment.SetEnvironmentVariable(
            "ConnectionStrings__MoneyMapperDb",
            "server=localhost;database=money_mapper_tests;user=root;password=test"
        );
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureAppConfiguration(config =>
        {
            config.AddInMemoryCollection(
                new Dictionary<string, string?>
                {
                    ["ConnectionStrings:MoneyMapperDb"] =
                        "server=localhost;database=money_mapper_tests;user=root;password=test",
                }
            );
        });

        builder.ConfigureServices(services =>
        {
            services.RemoveAll<DbContextOptions<MoneyMapperDbContext>>();

            services.AddDbContext<MoneyMapperDbContext>(options =>
                options.UseInMemoryDatabase(_databaseName)
            );

            using var scope = services.BuildServiceProvider().CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<MoneyMapperDbContext>();
            dbContext.Database.EnsureCreated();
        });
    }
}
