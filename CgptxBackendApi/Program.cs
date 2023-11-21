using System.Reflection;
using System.Text;
using CgptxBackendApi;
using CgptxBackendApi.Controllers;
using CgptxBackendApi.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        builder =>
        {
            // Allow consume's host to access the API
            builder.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader()
            .SetIsOriginAllowedToAllowWildcardSubdomains();
        });
});

builder.Services.AddEndpointsApiExplorer();

// Add services for Swagger
builder.Services.AddSwaggerGen(c =>
{
    // Documentation of Swagger application
    c.SwaggerDoc("CgptxBackendApi_Swagger", new OpenApiInfo
    {
        Title = "CgptxBackendApi",
    });
    // Adds scheme required for Authorization
    c.AddSecurityDefinition("CgptxBackendApi JWT Authentication",
        new OpenApiSecurityScheme
        {
            Name = "Authorization",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.ApiKey,
            Scheme = "Bearer"
        }
    );
    // Adds Authorization requirement for Controllers/Methods
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "CgptxBackendApi JWT Authentication"
                }
            },
            Array.Empty<string>()
        }
    });
});
// Add Services required for Authentication
builder.Services.AddAuthentication("Bearer").
    // Enables JWT Authentication using Bearer scheme
    AddJwtBearer(options =>
    {
        // Set parameters for validating tokens
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:issuer"],
            ValidAudience = builder.Configuration["Jwt:audience"],

            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:key"]!)),
            ClockSkew = TimeSpan.Zero
        };
    }
);

// Add Logging service
builder.Services.AddLogging(builder =>
{
    builder.AddConsole();
    builder.AddDebug();
});

// MediatR added to service collection
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

// Add DbConnection
builder.Services.AddDbContext<CgptxDbContext>
(    options=>
        options.UseNpgsql(
            builder.Configuration.GetConnectionString("DbConnection")
        )
);
builder.Services.AddScoped<IConversationsRepository, ConversationsRepository>();
builder.Services.AddScoped<IAccessRepository, AccessRepository>();

builder.Services.AddScoped<BaseController>();
builder.Services.AddHttpContextAccessor();

var app = builder.Build();

using var scope = app.Services.CreateScope();

await using var dbContext = scope.ServiceProvider.GetRequiredService<CgptxDbContext>();
if (dbContext.Database.GetPendingMigrations().Any())
{
    dbContext.Database.Migrate();
}
// Adds SwaggerUI Middleware
app.UseSwaggerUI(
    c =>
    {
        c.SwaggerEndpoint("/swagger/CgptxBackendApi_Swagger/swagger.json", "CgptxBackendApi Swagger Endpoint");
    }
);
// Adds Swagger Middleware
app.UseSwagger();

app.UseCors(MyAllowSpecificOrigins);

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
