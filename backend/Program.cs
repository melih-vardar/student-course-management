using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using backend.Data;
using backend.Models;
using backend.Services;
using backend.Exceptions;
using backend.Middleware;

var builder = WebApplication.CreateBuilder(args);

// PostgreSQL DateTime UTC konfigürasyonu
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

// Database Configuration - @EnableJpaRepositories
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Identity Configuration - Spring Security UserDetailsService
builder.Services.AddIdentity<User, IdentityRole>(options =>
{
    // Password requirements - PasswordEncoder
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;
    
    // User requirements
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// JWT Authentication - @EnableWebSecurity
var jwtKey = builder.Configuration["Jwt:Key"] ?? "SuperSecretKeyThatIsAtLeast32CharactersLong!";
var key = Encoding.ASCII.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

// Authorization - @PreAuthorize
builder.Services.AddAuthorization();

// Service Dependencies - @Service auto-registration
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICourseService, CourseService>();
builder.Services.AddScoped<IEnrollmentService, EnrollmentService>();
builder.Services.AddScoped<IBusinessRuleService, BusinessRuleService>();

// Controllers - @RestController
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo 
    { 
        Title = "Student Management API", 
        Version = "v1",
        Description = "A .NET 8 Web API for Student and Course Management with JWT Authentication by Melih Vardar"
    });
    
    // JWT Bearer Authentication konfigürasyonu
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });
    
    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// CORS Configuration - @CrossOrigin
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline - SecurityFilterChain
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Global Exception Handler - @ControllerAdvice
app.UseMiddleware<GlobalExceptionMiddleware>();

// CORS middleware
app.UseCors("AllowReactApp");

// Authentication & Authorization middleware - Spring Security filter chain
app.UseAuthentication();
app.UseAuthorization();

// Controllers - @RequestMapping
app.MapControllers();

// Database Migration - @SpringBootApplication run
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    
    var maxRetries = 5;
    var delay = TimeSpan.FromSeconds(5);
    
    for (int i = 0; i < maxRetries; i++)
    {
        try
        {
            // Database oluştur
            context.Database.EnsureCreated();
            break;
        }
        catch (Exception ex)
        {
            if (i == maxRetries - 1)
            {
                throw; // Son deneme başarısızsa exception fırlat
            }
            
            Console.WriteLine($"Database connection failed (attempt {i + 1}/{maxRetries}). Retrying in {delay.TotalSeconds} seconds...");
            Console.WriteLine($"Error: {ex.Message}");
            Thread.Sleep(delay);
        }
    }
    
    // Rolleri oluştur - @PostConstruct
    if (!await roleManager.RoleExistsAsync("Admin"))
    {
        await roleManager.CreateAsync(new IdentityRole("Admin"));
    }
    if (!await roleManager.RoleExistsAsync("Student"))
    {
        await roleManager.CreateAsync(new IdentityRole("Student"));
    }
    
    // Admin kullanıcı oluştur
    if (await userManager.FindByEmailAsync("admin@admin.com") == null)
    {
        var adminUser = new User
        {
            UserName = "admin@admin.com",
            Email = "admin@admin.com",
            FirstName = "Kerem",
            LastName = "Erdoğmuş",
            DateOfBirth = new DateTime(1990, 1, 1, 0, 0, 0, DateTimeKind.Utc), // PostgreSQL için UTC
            Role = UserRole.Admin,
            EmailConfirmed = true
        };
        
        await userManager.CreateAsync(adminUser, "Admin123!");
        await userManager.AddToRoleAsync(adminUser, "Admin");
    }
}

app.Run();

public partial class Program { }
