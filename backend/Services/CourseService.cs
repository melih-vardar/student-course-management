using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.DTOs;
using backend.Exceptions;

namespace backend.Services
{
    public interface ICourseService
    {
        Task<PagedResponseDto<CourseResponseDto>> GetCoursesAsync(int page, int pageSize);
        Task<CourseDetailResponseDto?> GetCourseByIdAsync(int id);
        Task<CourseResponseDto?> CreateCourseAsync(CreateCourseRequestDto request);
        Task<CourseResponseDto?> UpdateCourseAsync(int id, UpdateCourseRequestDto request);
        Task<bool> DeleteCourseAsync(int id);
        Task<List<CourseResponseDto>> GetAvailableCoursesForStudentAsync(string studentId);
    }

    public class CourseService : ICourseService
    {
        private readonly ApplicationDbContext _context;
        private readonly IBusinessRuleService _businessRuleService;

        public CourseService(ApplicationDbContext context, IBusinessRuleService businessRuleService)
        {
            _context = context;
            _businessRuleService = businessRuleService;
        }

        public async Task<PagedResponseDto<CourseResponseDto>> GetCoursesAsync(int page, int pageSize)
        {
            var query = _context.Courses.AsQueryable();
            
            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);
            
            var courses = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(c => new CourseResponseDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    Credits = c.Credits,
                    CreatedAt = c.CreatedAt,
                    EnrolledStudentsCount = c.Enrollments.Count()
                })
                .ToListAsync();

            return new PagedResponseDto<CourseResponseDto>
            {
                Data = courses,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = totalPages,
                HasNextPage = page < totalPages,
                HasPreviousPage = page > 1
            };
        }

        public async Task<CourseDetailResponseDto?> GetCourseByIdAsync(int id)
        {
            var course = await _context.Courses
                .Include(c => c.Enrollments)
                    .ThenInclude(e => e.User)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (course == null)
                return null;

            return new CourseDetailResponseDto
            {
                Id = course.Id,
                Name = course.Name,
                Description = course.Description,
                Credits = course.Credits,
                CreatedAt = course.CreatedAt,
                EnrolledStudents = course.Enrollments
                    .Select(e => new StudentInfoDto
                    {
                        Id = e.User.Id,
                        FirstName = e.User.FirstName,
                        LastName = e.User.LastName,
                        Email = e.User.Email ?? "",
                        EnrollmentDate = e.EnrollmentDate
                    }).ToList()
            };
        }

        public async Task<CourseResponseDto?> CreateCourseAsync(CreateCourseRequestDto request)
        {
            try
            {
                await _businessRuleService.ValidateUniqueCourseNameAsync(request.Name);
            }
            catch (BusinessException)
            {
                return null;
            }

            var course = new Course
            {
                Name = request.Name,
                Description = request.Description,
                Credits = request.Credits,
                CreatedAt = DateTime.UtcNow
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            return new CourseResponseDto
            {
                Id = course.Id,
                Name = course.Name,
                Description = course.Description,
                Credits = course.Credits,
                CreatedAt = course.CreatedAt,
                EnrolledStudentsCount = 0
            };
        }

        public async Task<CourseResponseDto?> UpdateCourseAsync(int id, UpdateCourseRequestDto request)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null)
                return null;

            try
            {
                await _businessRuleService.ValidateUniqueCourseNameAsync(request.Name, id);
            }
            catch (BusinessException)
            {
                return null;
            }

            course.Name = request.Name;
            course.Description = request.Description;
            course.Credits = request.Credits;
            course.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new CourseResponseDto
            {
                Id = course.Id,
                Name = course.Name,
                Description = course.Description,
                Credits = course.Credits,
                CreatedAt = course.CreatedAt,
                EnrolledStudentsCount = course.Enrollments.Count()
            };
        }

        public async Task<bool> DeleteCourseAsync(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null)
                return false;

            try
            {
                await _businessRuleService.ValidateCourseDeletionAsync(id);
            }
            catch (BusinessException)
            {
                return false;
            }

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<CourseResponseDto>> GetAvailableCoursesForStudentAsync(string studentId)
        {
            var enrolledCourseIds = await _context.Enrollments
                .Where(e => e.UserId == studentId)
                .Select(e => e.CourseId)
                .ToListAsync();

            return await _context.Courses
                .Where(c => !enrolledCourseIds.Contains(c.Id))
                .Select(c => new CourseResponseDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    Credits = c.Credits,
                    CreatedAt = c.CreatedAt,
                    EnrolledStudentsCount = c.Enrollments.Count()
                })
                .ToListAsync();
        }
    }
} 