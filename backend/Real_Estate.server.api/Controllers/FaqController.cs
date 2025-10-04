using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Real_Estate.server.api.DTOs;
using Real_Estate.server.api.Models;
using Real_Estate.server.api.services.Implementations;
using Real_Estate.server.api.services.Interfaces;

namespace Real_Estate.server.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FaqController : ControllerBase
    {
        private readonly IFaqServices _faqRepository;

        public FaqController(IFaqServices faqRepository)
        {
            _faqRepository = faqRepository;
        }

        // GET: api/faq
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FaqDto>>> GetFaqs()
        {
            var faqs = await _faqRepository.GetAllAsync();
            var faqDtos = faqs.Select(f => new FaqDto
            {
                Id = f.Id,
                Question = f.Question,
                Answer = f.Answer
            }).ToList();
            return Ok(faqDtos);
        }

        // GET: api/faq/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FaqDto>> GetFaq(int id)
        {
            try
            {
                var faq = await _faqRepository.GetByIdAsync(id);
                var faqDto = new FaqDto
                {
                    Id = faq.Id,
                    Question = faq.Question,
                    Answer = faq.Answer
                };
                return Ok(faqDto);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        // POST: api/faq
        [HttpPost]
        public async Task<ActionResult<FaqDto>> CreateFaq([FromBody] FaqDto faqDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var faq = new Faq
            {
                Question = faqDto.Question,
                Answer = faqDto.Answer
            };
            var createdFaq = await _faqRepository.AddAsync(faq);
            var createdFaqDto = new FaqDto
            {
                Id = createdFaq.Id,
                Question = createdFaq.Question,
                Answer = createdFaq.Answer
            };
            return CreatedAtAction(nameof(GetFaq), new { id = createdFaqDto.Id }, createdFaqDto);
        }

        // PUT: api/faq/5
        [HttpPut("{id}")]
        public async Task<ActionResult<FaqDto>> UpdateFaq(int id, [FromBody] FaqDto faqDto)
        {
            if (id != faqDto.Id)
            {
                return BadRequest("FAQ ID mismatch.");
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var faq = new Faq
                {
                    Id = faqDto.Id,
                    Question = faqDto.Question,
                    Answer = faqDto.Answer
                };
                var updatedFaq = await _faqRepository.UpdateAsync(faq);
                var updatedFaqDto = new FaqDto
                {
                    Id = updatedFaq.Id,
                    Question = updatedFaq.Question,
                    Answer = updatedFaq.Answer
                };
                return Ok(updatedFaqDto);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        // DELETE: api/faq/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteFaq(int id)
        {
            var result = await _faqRepository.DeleteAsync(id);
            if (!result)
            {
                return NotFound($"FAQ with ID {id} not found.");
            }
            return NoContent();
        }
    }
}
