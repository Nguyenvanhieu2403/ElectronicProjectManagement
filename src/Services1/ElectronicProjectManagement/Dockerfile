# Sử dụng .NET 8 SDK để build ứng dụng
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy file solution và restore các gói phụ thuộc
COPY *.sln ./
COPY ElectronicProjectManagement.Authentication/*.csproj ./ElectronicProjectManagement.Authentication/
COPY ElectronicProjectManagement.Base/*.csproj ./ElectronicProjectManagement.Base/
COPY ElectronicProjectManagement.OcelotGateway/*.csproj ./ElectronicProjectManagement.OcelotGateway/

# Restore các gói phụ thuộc cho toàn bộ solution
RUN dotnet restore

# Copy toàn bộ mã nguồn vào container
COPY . ./

# Chỉ rõ file solution hoặc csproj và build
RUN dotnet publish ElectronicProjectManagement.sln -c Release -o /out

# Sử dụng .NET 8 runtime để chạy ứng dụng
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Thiết lập chuỗi kết nối qua biến môi trường
ENV ConnectionStrings__DefaultConnection="Server=SQL8020.site4now.net;Database=db_aad061_electronicproject;User Id=db_aad061_electronicproject_admin;Password=Hieu2003@;Trusted_Connection=False;TrustServerCertificate=False;MultipleActiveResultSets=true;"

COPY --from=build /out .
ENTRYPOINT ["dotnet", "ElectronicProjectManagement.Authentication.dll"]
