using Microsoft.EntityFrameworkCore;
using Real_Estate.server.api.Data;
using Real_Estate.server.api.Models;
using Real_Estate.server.api.services.Interfaces;

namespace Real_Estate.server.api.services.Implementations
{
    public class FaqRepository : IFaqServices
    {
        private readonly ApplicationDbContext _context;

        public FaqRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<Faq> AddAsync(Faq faq)
        {
            _context.Faqers.Add(faq);
            await _context.SaveChangesAsync();
            return faq;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var faq = await _context.Faqers.FindAsync(id);
            if (faq != null)
            {
                _context.Faqers.Remove(faq);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<IEnumerable<Faq>> GetAllAsync()
        {
            var faq = await _context.Faqers.ToListAsync();
            return faq;
        }

        public async Task<Faq> GetByIdAsync(int id)
        {
            return await _context.Faqers.FindAsync(id) ?? throw new KeyNotFoundException($"FAQ with ID {id} not found.");
        }

        public async Task<Faq> UpdateAsync(Faq faq)
        {
            var existingFaq = await _context.Faqers.FindAsync(faq.Id) ?? throw new KeyNotFoundException($"FAQ with ID {faq.Id} not found.");
            existingFaq.Question = faq.Question;
            existingFaq.Answer = faq.Answer;
            await _context.SaveChangesAsync();
            return existingFaq;

        }
    }
}
