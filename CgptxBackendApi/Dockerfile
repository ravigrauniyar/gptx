FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 5299

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["CgptxBackendApi.csproj", "."]
RUN dotnet restore "./CgptxBackendApi.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "CgptxBackendApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CgptxBackendApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "CgptxBackendApi.dll"]
