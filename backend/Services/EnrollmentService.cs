using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.DTOs;
using backend.Exceptions;

namespace backend.Services
{
    public interface IEnrollmentService
    {
        Task<PagedResponseDto<EnrollmentResponseDto>> GetEnrollmentsAsync(int page, int pageSize);
        Task<EnrollmentResponseDto?> EnrollStudentAsync(string studentId, EnrollmentRequestDto request);
        Task<EnrollmentResponseDto?> AdminEnrollStudentAsync(AdminEnrollmentRequestDto request);
        Task<bool> UnenrollStudentAsync(string studentId, int courseId);
        Task<bool> AdminUnenrollStudentAsync(int enrollmentId);
        Task<List<EnrollmentResponseDto>> GetStudentEnrollmentsAsync(string studentId);
    }

    public class EnrollmentService : IEnrollmentService
    {
        private readonly ApplicationDbContext _context;
        private readonly IBusinessRuleService _businessRuleService;

        public EnrollmentService(ApplicationDbContext context, IBusinessRuleService businessRuleService)
        {
            _context = context;
            _businessRuleService = businessRuleService;
        }

        public async Task<PagedResponseDto<EnrollmentResponseDto>> GetEnrollmentsAsync(int page, int pageSize)
        {
            var query = _context.Enrollments
                .Include(e => e.User)
                .Include(e => e.Course)
                .AsQueryable();
            
            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);
            
            var enrollments = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(e => new EnrollmentResponseDto
                {
                    Id = e.Id,
                    StudentId = e.User.Id,
                    StudentName = $"{e.User.FirstName} {e.User.LastName}",
                    StudentEmail = e.User.Email ?? "",
                    CourseId = e.Course.Id,
                    CourseName = e.Course.Name,
                    EnrollmentDate = e.EnrollmentDate
                })
                .ToListAsync();

            return new PagedResponseDto<EnrollmentResponseDto>
            {
                Data = enrollments,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = totalPages,
                HasNextPage = page < totalPages,
                HasPreviousPage = page > 1
            };
        }

        public async Task<EnrollmentResponseDto?> EnrollStudentAsync(string studentId, EnrollmentRequestDto request)
        {
            var user = await _context.Users.FindAsync(studentId);
            var course = await _context.Courses.FindAsync(request.CourseId);

            if (user == null)
                throw new backend.Exceptions.NotFoundException("User", studentId);
            
            if (course == null)
                throw new backend.Exceptions.NotFoundException("Course", request.CourseId);
                
            if (user.Role != UserRole.Student)
                throw new backend.Exceptions.BusinessException("Only students can enroll in courses");

            var existingEnrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.UserId == studentId && e.CourseId == request.CourseId);

            if (existingEnrollment != null)
                throw new backend.Exceptions.BusinessException("You are already enrolled in this course");

            var enrollment = new Enrollment
            {
                UserId = studentId,
                CourseId = request.CourseId,
                EnrollmentDate = DateTime.UtcNow
            };

            _context.Enrollments.Add(enrollment);
            await _context.SaveChangesAsync();

            await _context.Entry(enrollment)
                .Reference(e => e.User)
                .LoadAsync();
            await _context.Entry(enrollment)
                .Reference(e => e.Course)
                .LoadAsync();

            return new EnrollmentResponseDto
            {
                Id = enrollment.Id,
                StudentId = enrollment.User.Id,
                StudentName = $"{enrollment.User.FirstName} {enrollment.User.LastName}",
                StudentEmail = enrollment.User.Email ?? "",
                CourseId = enrollment.Course.Id,
                CourseName = enrollment.Course.Name,
                EnrollmentDate = enrollment.EnrollmentDate
            };
        }

        public async Task<EnrollmentResponseDto?> AdminEnrollStudentAsync(AdminEnrollmentRequestDto request)
        {
            var existingEnrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.UserId == request.StudentId && e.CourseId == request.CourseId);

            if (existingEnrollment != null)
                return null;

            var user = await _context.Users.FindAsync(request.StudentId);
            var course = await _context.Courses.FindAsync(request.CourseId);

            if (user == null || course == null || user.Role != UserRole.Student)
                return null;

            var enrollment = new Enrollment
            {
                UserId = request.StudentId,
                CourseId = request.CourseId,
                EnrollmentDate = DateTime.UtcNow
            };

            _context.Enrollments.Add(enrollment);
            await _context.SaveChangesAsync();

            await _context.Entry(enrollment)
                .Reference(e => e.User)
                .LoadAsync();
            await _context.Entry(enrollment)
                .Reference(e => e.Course)
                .LoadAsync();

            return new EnrollmentResponseDto
            {
                Id = enrollment.Id,
                StudentId = enrollment.User.Id,
                StudentName = $"{enrollment.User.FirstName} {enrollment.User.LastName}",
                StudentEmail = enrollment.User.Email ?? "",
                CourseId = enrollment.Course.Id,
                CourseName = enrollment.Course.Name,
                EnrollmentDate = enrollment.EnrollmentDate
            };
        }

        public async Task<bool> UnenrollStudentAsync(string studentId, int courseId)
        {
            var enrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.UserId == studentId && e.CourseId == courseId);

            if (enrollment == null)
                return false;

            _context.Enrollments.Remove(enrollment);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AdminUnenrollStudentAsync(int enrollmentId)
        {
            var enrollment = await _context.Enrollments.FindAsync(enrollmentId);
            if (enrollment == null)
                return false;

            _context.Enrollments.Remove(enrollment);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<EnrollmentResponseDto>> GetStudentEnrollmentsAsync(string studentId)
        {
            return await _context.Enrollments
                .Include(e => e.Course)
                .Include(e => e.User)
                .Where(e => e.UserId == studentId)
                .Select(e => new EnrollmentResponseDto
                {
                    Id = e.Id,
                    StudentId = e.User.Id,
                    StudentName = $"{e.User.FirstName} {e.User.LastName}",
                    StudentEmail = e.User.Email ?? "",
                    CourseId = e.Course.Id,
                    CourseName = e.Course.Name,
                    EnrollmentDate = e.EnrollmentDate
                })
                .ToListAsync();
        }
    }
} 