using backend.Exceptions;
using backend.Models;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public interface IBusinessRuleService
    {
        Task ValidateUserAgeAsync(DateTime dateOfBirth);
        Task ValidateCourseDeletionAsync(int courseId);
        Task ValidateUniqueEmailAsync(string email, string? excludeUserId = null);
        Task ValidateUniqueCourseNameAsync(string courseName, int? excludeCourseId = null);
    }

    public class BusinessRuleService : IBusinessRuleService
    {
        private readonly ApplicationDbContext _context;

        public BusinessRuleService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task ValidateUserAgeAsync(DateTime dateOfBirth)
        {
            var age = DateTime.Now.Year - dateOfBirth.Year;
            if (dateOfBirth > DateTime.Now.AddYears(-age)) age--;

            if (age < 18)
            {
                throw new BusinessException("User must be at least 18 years old");
            }

            if (age > 100)
            {
                throw new BusinessException("Invalid birth date");
            }
        }



        public async Task ValidateCourseDeletionAsync(int courseId)
        {
            var hasActiveEnrollments = await _context.Enrollments
                .AnyAsync(e => e.CourseId == courseId);

            if (hasActiveEnrollments)
            {
                throw new BusinessException("Cannot delete course with active enrollments");
            }
        }

        public async Task ValidateUniqueEmailAsync(string email, string? excludeUserId = null)
        {
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email && u.Id != excludeUserId);

            if (existingUser != null)
            {
                throw new BusinessException("Email address is already in use");
            }
        }

        public async Task ValidateUniqueCourseNameAsync(string courseName, int? excludeCourseId = null)
        {
            var existingCourse = await _context.Courses
                .FirstOrDefaultAsync(c => c.Name == courseName && c.Id != excludeCourseId);

            if (existingCourse != null)
            {
                throw new BusinessException("Course name already exists");
            }
        }
    }
} 