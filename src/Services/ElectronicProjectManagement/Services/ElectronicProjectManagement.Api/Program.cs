using AutoMapper;
using ElectronicProjectManagement.Api.Startups;
using VnPostLib.Startup;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCustomService(builder.Configuration);
builder.Services.AddStartupService(builder.Configuration);
builder.Services.AddDebugCustomService(builder.Configuration);

// AutoMapper
var config = new MapperConfiguration(cfg =>
{
    cfg.AddProfile(new AutoMapperProfile());
});
var mapper = config.CreateMapper();
builder.Services.AddSingleton(mapper);

builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.Limits.MaxRequestBodySize = 1024 * 1024 * 1024; // 1GB
});


//builder.WebHost.ConfigureKestrel(options => options.ListenLocalhost(8002));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.Services.GetRequiredService<ILoggerFactory>();

app.UseStartupService(builder.Configuration);
app.UseProductionStartupService(builder.Configuration);
app.UseCustomService(builder.Configuration);

app.UseAuthorization();

app.MapControllers();

app.Run();

