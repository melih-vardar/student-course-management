using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.DTOs;
using backend.Exceptions;

namespace backend.Services
{
    public interface IUserService
    {
        Task<PagedResponseDto<UserResponseDto>> GetUsersAsync(int page, int pageSize);
        Task<PagedResponseDto<UserResponseDto>> GetStudentsAsync(int page, int pageSize);
        Task<PagedResponseDto<UserResponseDto>> GetAdminsAsync(int page, int pageSize);
        Task<UserDetailResponseDto?> GetUserByIdAsync(string id);
        Task<UserDetailResponseDto> CreateUserAsync(CreateUserRequestDto request);
        Task<UserDetailResponseDto> UpdateUserAsync(string id, AdminUpdateUserRequestDto request);
        Task<bool> DeleteUserAsync(string id);
        Task<UserDetailResponseDto?> GetCurrentUserAsync(string userId);
        Task<UserDetailResponseDto> UpdateCurrentUserAsync(string userId, UpdateCurrentUserRequestDto request);
        Task<List<CourseInfoDto>> GetUserEnrollmentsAsync(string userId);
    }

    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly IBusinessRuleService _businessRuleService;

        public UserService(ApplicationDbContext context, UserManager<User> userManager, IBusinessRuleService businessRuleService)
        {
            _context = context;
            _userManager = userManager;
            _businessRuleService = businessRuleService;
        }

        public async Task<PagedResponseDto<UserResponseDto>> GetUsersAsync(int page, int pageSize)
        {
            var query = _context.Users.AsQueryable();
            
            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);
            
            var users = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new UserResponseDto
                {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email ?? "",
                    DateOfBirth = u.DateOfBirth,
                    Role = u.Role.ToString(),
                    CreatedAt = u.CreatedAt,
                    EnrolledCoursesCount = u.Enrollments.Count()
                })
                .ToListAsync();

            return new PagedResponseDto<UserResponseDto>
            {
                Data = users,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = totalPages,
                HasNextPage = page < totalPages,
                HasPreviousPage = page > 1
            };
        }

        public async Task<PagedResponseDto<UserResponseDto>> GetStudentsAsync(int page, int pageSize)
        {
            var query = _context.Users.Where(u => u.Role == UserRole.Student);
            
            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);
            
            var students = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new UserResponseDto
                {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email ?? "",
                    DateOfBirth = u.DateOfBirth,
                    Role = u.Role.ToString(),
                    CreatedAt = u.CreatedAt,
                    EnrolledCoursesCount = u.Enrollments.Count()
                })
                .ToListAsync();

            return new PagedResponseDto<UserResponseDto>
            {
                Data = students,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = totalPages,
                HasNextPage = page < totalPages,
                HasPreviousPage = page > 1
            };
        }

        public async Task<PagedResponseDto<UserResponseDto>> GetAdminsAsync(int page, int pageSize)
        {
            var query = _context.Users.Where(u => u.Role == UserRole.Admin);
            
            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);
            
            var admins = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new UserResponseDto
                {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email ?? "",
                    DateOfBirth = u.DateOfBirth,
                    Role = u.Role.ToString(),
                    CreatedAt = u.CreatedAt,
                    EnrolledCoursesCount = u.Enrollments.Count()
                })
                .ToListAsync();

            return new PagedResponseDto<UserResponseDto>
            {
                Data = admins,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = totalPages,
                HasNextPage = page < totalPages,
                HasPreviousPage = page > 1
            };
        }

        public async Task<UserDetailResponseDto?> GetUserByIdAsync(string id)
        {
            var user = await _context.Users
                .Include(u => u.Enrollments)
                    .ThenInclude(e => e.Course)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
                return null;

            return new UserDetailResponseDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email ?? "",
                DateOfBirth = user.DateOfBirth,
                Role = user.Role.ToString(),
                CreatedAt = user.CreatedAt,
                EnrolledCourses = user.Enrollments.Select(e => new CourseInfoDto
                {
                    Id = e.Course.Id,
                    Name = e.Course.Name,
                    Description = e.Course.Description,
                    Credits = e.Course.Credits,
                    EnrollmentDate = e.EnrollmentDate
                }).ToList()
            };
        }

        public async Task<UserDetailResponseDto> CreateUserAsync(CreateUserRequestDto request)
        {
            var errors = new List<string>();

            // Business rule validations - collect all errors
            try
            {
                await _businessRuleService.ValidateUserAgeAsync(request.DateOfBirth);
            }
            catch (BusinessException ex)
            {
                errors.Add(ex.Message);
            }

            try
            {
                await _businessRuleService.ValidateUniqueEmailAsync(request.Email);
            }
            catch (BusinessException ex)
            {
                errors.Add(ex.Message);
            }

            // If business rule errors exist, throw ValidationException
            if (errors.Any())
            {
                throw new ValidationException(errors);
            }

            // Parse role
            if (!Enum.TryParse<UserRole>(request.Role, out var userRole))
            {
                userRole = UserRole.Student; // Default to Student
            }

            var user = new User
            {
                UserName = request.Email,
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                DateOfBirth = request.DateOfBirth,
                Role = userRole,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                var identityErrors = result.Errors.Select(e => e.Description).ToList();
                throw new ValidationException(identityErrors);
            }

            // Add to role
            await _userManager.AddToRoleAsync(user, userRole.ToString());

            return await GetUserByIdAsync(user.Id) ?? throw new BusinessException("Failed to retrieve created user");
        }

        public async Task<UserDetailResponseDto> UpdateUserAsync(string id, AdminUpdateUserRequestDto request)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                throw new BusinessException("User not found");

            var errors = new List<string>();

            // Business rule validations - collect all errors
            try
            {
                await _businessRuleService.ValidateUserAgeAsync(request.DateOfBirth);
            }
            catch (BusinessException ex)
            {
                errors.Add(ex.Message);
            }
            
            // Email değişikliği varsa unique email kontrolü
            if (user.Email != request.Email)
            {
                try
                {
                    await _businessRuleService.ValidateUniqueEmailAsync(request.Email, id);
                }
                catch (BusinessException ex)
                {
                    errors.Add(ex.Message);
                }
            }

            // If business rule errors exist, throw ValidationException
            if (errors.Any())
            {
                throw new ValidationException(errors);
            }

            if (!Enum.TryParse<UserRole>(request.Role, out var newRole))
            {
                newRole = UserRole.Student;
            }

            // Email ve username güncelleme
            if (user.Email != request.Email)
            {
                user.Email = request.Email;
                user.UserName = request.Email; // Username = Email olarak ayarlanmış
                user.NormalizedEmail = request.Email.ToUpper();
                user.NormalizedUserName = request.Email.ToUpper();
            }

            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.DateOfBirth = request.DateOfBirth;
            user.UpdatedAt = DateTime.UtcNow;

            // Role değişikliği varsa rol güncelleme
            if (user.Role != newRole)
            {
                // Eğer Student'tan Admin'e geçiş oluyorsa, tüm enrollment'ları sil
                if (user.Role == UserRole.Student && newRole == UserRole.Admin)
                {
                    var userEnrollments = await _context.Enrollments
                        .Where(e => e.UserId == user.Id)
                        .ToListAsync();
                    
                    if (userEnrollments.Any())
                    {
                        _context.Enrollments.RemoveRange(userEnrollments);
                        await _context.SaveChangesAsync();
                    }
                }

                var oldRoles = await _userManager.GetRolesAsync(user);
                if (oldRoles.Any())
                {
                    await _userManager.RemoveFromRolesAsync(user, oldRoles);
                }

                user.Role = newRole;
                await _userManager.AddToRoleAsync(user, newRole.ToString());
            }

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                var identityErrors = result.Errors.Select(e => e.Description).ToList();
                throw new ValidationException(identityErrors);
            }

            return await GetUserByIdAsync(id) ?? throw new BusinessException("Failed to retrieve updated user");
        }

        public async Task<bool> DeleteUserAsync(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return false;

            var result = await _userManager.DeleteAsync(user);
            return result.Succeeded;
        }

        public async Task<UserDetailResponseDto?> GetCurrentUserAsync(string userId)
        {
            return await GetUserByIdAsync(userId);
        }

        public async Task<UserDetailResponseDto> UpdateCurrentUserAsync(string userId, UpdateCurrentUserRequestDto request)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new BusinessException("User not found");

            var errors = new List<string>();

            // Business rule validations - collect all errors
            try
            {
                await _businessRuleService.ValidateUserAgeAsync(request.DateOfBirth);
            }
            catch (BusinessException ex)
            {
                errors.Add(ex.Message);
            }
            
            // Email değişikliği varsa unique email kontrolü
            if (user.Email != request.Email)
            {
                try
                {
                    await _businessRuleService.ValidateUniqueEmailAsync(request.Email, userId);
                }
                catch (BusinessException ex)
                {
                    errors.Add(ex.Message);
                }
            }

            // If business rule errors exist, throw ValidationException
            if (errors.Any())
            {
                throw new ValidationException(errors);
            }

            if (user.Email != request.Email)
            {
                user.Email = request.Email;
                user.UserName = request.Email; // Username = Email olarak ayarlanmış
                user.NormalizedEmail = request.Email.ToUpper();
                user.NormalizedUserName = request.Email.ToUpper();
            }

            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.DateOfBirth = request.DateOfBirth;
            user.UpdatedAt = DateTime.UtcNow;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                var identityErrors = result.Errors.Select(e => e.Description).ToList();
                throw new ValidationException(identityErrors);
            }

            return await GetUserByIdAsync(userId) ?? throw new BusinessException("Failed to retrieve updated user");
        }

        public async Task<List<CourseInfoDto>> GetUserEnrollmentsAsync(string userId)
        {
            var user = await _context.Users
                .Include(u => u.Enrollments)
                    .ThenInclude(e => e.Course)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return new List<CourseInfoDto>();

            return user.Enrollments.Select(e => new CourseInfoDto
            {
                Id = e.Course.Id,
                Name = e.Course.Name,
                Description = e.Course.Description,
                Credits = e.Course.Credits,
                EnrollmentDate = e.EnrollmentDate
            }).ToList();
        }
    }
} 