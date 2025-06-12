using Microsoft.AspNetCore.Identity;
using backend.Models;
using backend.DTOs;
using backend.Exceptions;

namespace backend.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> LoginAsync(LoginRequestDto request);
        Task<AuthResponseDto?> RegisterAsync(RegisterRequestDto request);
        Task<bool> LogoutAsync(string userId);
    }

    public class AuthService : IAuthService
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IBusinessRuleService _businessRuleService;

        public AuthService(
            UserManager<User> userManager, 
            SignInManager<User> signInManager,
            ITokenService tokenService,
            IBusinessRuleService businessRuleService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _businessRuleService = businessRuleService;
        }

        public async Task<AuthResponseDto?> LoginAsync(LoginRequestDto request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
                return null;

            // Password kontrolü
            // Boolean olan parametre true ise yanlış giriş durumunda kullanıcı hesabını kilitler
            var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
            if (!result.Succeeded)
                return null;

            // JWT Token Generation
            var token = _tokenService.GenerateToken(user);
            var expiryHours = 24;

            return new AuthResponseDto
            {
                Token = token,
                Email = user.Email ?? "",
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = user.Role.ToString(),
                ExpiresAt = DateTime.UtcNow.AddHours(expiryHours)
            };
        }

        public async Task<AuthResponseDto?> RegisterAsync(RegisterRequestDto request)
        {
            try
            {
                await _businessRuleService.ValidateUniqueEmailAsync(request.Email);
                await _businessRuleService.ValidateUserAgeAsync(request.DateOfBirth);
            }
            catch (BusinessException)
            {
                return null;
            }

            var user = new User
            {
                UserName = request.Email,
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                DateOfBirth = request.DateOfBirth,
                Role = UserRole.Student, // Varsayılan olarak öğrenci
                CreatedAt = DateTime.UtcNow,
                EmailConfirmed = true // Direkt onaylı
            };

            // Save User
            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
                return null;

            await _userManager.AddToRoleAsync(user, "Student");

            var token = _tokenService.GenerateToken(user);
            var expiryHours = 24;

            return new AuthResponseDto
            {
                Token = token,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = user.Role.ToString(),
                ExpiresAt = DateTime.UtcNow.AddHours(expiryHours)
            };
        }

        public async Task<bool> LogoutAsync(string userId)
        {
            // Client tarafında token silinmesi yeterli
            
            await _signInManager.SignOutAsync();
            
            return true;
        }
    }
} 