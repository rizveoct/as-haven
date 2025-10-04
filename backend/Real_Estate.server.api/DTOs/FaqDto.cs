using System.ComponentModel.DataAnnotations;

namespace Real_Estate.server.api.DTOs
{
    public class FaqDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Question is required")]
        [MaxLength(500, ErrorMessage = "Question cannot exceed 500 characters")]
        public string Question { get; set; } = string.Empty;

        [Required(ErrorMessage = "Answer is required")]
        [MaxLength(2000, ErrorMessage = "Answer cannot exceed 2000 characters")]
        public string Answer { get; set; } = string.Empty;
    }
}
