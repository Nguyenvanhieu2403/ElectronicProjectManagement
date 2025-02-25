using Ocelot.DependencyInjection;
using Ocelot.Middleware;

var builder = WebApplication.CreateBuilder(args);
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

// Config Ocetlot
IConfiguration configuration = new ConfigurationBuilder()
    .AddJsonFile("ocelot.json")
    .Build();

// CORS
builder.Services.AddCors(options => options.AddPolicy(name: MyAllowSpecificOrigins, builder =>
{
    builder.WithOrigins(
        "https://localhost:7269"
        )
    .AllowCredentials()
    .AllowAnyHeader().AllowAnyMethod()
    .SetIsOriginAllowed(origin => true);
}));
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddOcelot(configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(MyAllowSpecificOrigins);
app.UseOcelot().Wait();
app.UseAuthorization();

app.MapControllers();

app.Run();
