using Real_Estate.server.api.Models;

namespace Real_Estate.server.api.services.Interfaces
{
    public interface IFaqServices
    {
        Task<IEnumerable<Faq>> GetAllAsync();
        Task<Faq> GetByIdAsync(int id);
        Task<Faq> UpdateAsync(Faq faq);
        Task<Faq> AddAsync(Faq faq);
        Task<bool> DeleteAsync(int id);
    }
}
