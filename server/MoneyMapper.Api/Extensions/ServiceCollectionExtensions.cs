using Microsoft.EntityFrameworkCore;
using MoneyMapper.Api.Data;

namespace MoneyMapper.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public const string ViteCorsPolicy = "ViteDevServer";

    public static IServiceCollection AddMoneyMapperApi(
        this IServiceCollection services,
        IConfiguration configuration,
        IHostEnvironment environment)
    {
        services.AddCors(options =>
        {
            options.AddPolicy(ViteCorsPolicy, policy =>
            {
                policy
                    .WithOrigins("http://localhost:5173")
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });

        if (!environment.IsEnvironment("Testing"))
        {
            var connectionString = configuration.GetConnectionString("MoneyMapperDb")
                ?? throw new InvalidOperationException(
                    "Missing ConnectionStrings:MoneyMapperDb. Set it with user-secrets or an environment variable.");
            var mySqlVersion = configuration["Database:MySqlVersion"] ?? "8.0.36";

            services.AddDbContext<MoneyMapperDbContext>(options =>
                options.UseMySql(connectionString, ServerVersion.Parse(mySqlVersion)));
        }

        services.AddHttpClient("frankfurter", httpClient =>
        {
            httpClient.BaseAddress = new Uri("https://api.frankfurter.app/");
        });

        services.AddOpenApi();

        return services;
    }
}
