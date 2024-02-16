namespace Core.Interfaces
{
    public interface IResponseCacheService
    {
        Task CasheResponseAsync(string cacheKey, object response, TimeSpan timeToLive);
        Task<string> GetCashedResponseAsync(string cacheKey);

    }
}