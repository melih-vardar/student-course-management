using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class CourseResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int Credits { get; set; }
        public DateTime CreatedAt { get; set; }
        public int EnrolledStudentsCount { get; set; }
    }

    public class CreateCourseRequestDto
    {
        [Required]
        [StringLength(50)]
        public string Name { get; set; } = string.Empty;

        [StringLength(800)]
        public string? Description { get; set; }

        [Required]
        [Range(1, 10)]
        public int Credits { get; set; }
    }

    public class UpdateCourseRequestDto
    {
        [Required]
        [StringLength(50)]
        public string Name { get; set; } = string.Empty;

        [StringLength(800)]
        public string? Description { get; set; }

        [Required]
        [Range(1, 10)]
        public int Credits { get; set; }
    }

    public class CourseDetailResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int Credits { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<StudentInfoDto> EnrolledStudents { get; set; } = new List<StudentInfoDto>();
    }

    public class StudentInfoDto
    {
        public string Id { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime EnrollmentDate { get; set; }
    }
} 