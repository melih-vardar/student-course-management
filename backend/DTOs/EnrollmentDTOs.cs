using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class EnrollmentRequestDto
    {
        [Required]
        public int CourseId { get; set; }
    }

    public class EnrollmentResponseDto
    {
        public int Id { get; set; }
        public string StudentId { get; set; } = string.Empty;
        public string StudentName { get; set; } = string.Empty;
        public string StudentEmail { get; set; } = string.Empty;
        public int CourseId { get; set; }
        public string CourseName { get; set; } = string.Empty;
        public DateTime EnrollmentDate { get; set; }
    }

    public class AdminEnrollmentRequestDto
    {
        [Required]
        public string StudentId { get; set; } = string.Empty;

        [Required]
        public int CourseId { get; set; }
    }
} 