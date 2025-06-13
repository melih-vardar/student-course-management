using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using backend.Services;
using backend.DTOs;
using backend.Exceptions;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginRequestDto request)
        {
            // Spring Boot'taki @Valid @RequestBody karşılığı
            if (!ModelState.IsValid)
            {
                return BadRequest(new ErrorResponseDto
                {
                    Message = "Invalid input data",
                    Errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList()
                });
            }

            var result = await _authService.LoginAsync(request);
            
            if (result == null)
            {
                return Unauthorized(new ErrorResponseDto
                {
                    Message = "Invalid email or password"
                });
            }

            return Ok(result);
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ErrorResponseDto
                {
                    Message = "Invalid input data",
                    Errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList()
                });
            }

            try
            {
                var result = await _authService.RegisterAsync(request);
                
                // 201 Created response
                return CreatedAtAction(nameof(Login), result);
            }
            catch (ValidationException ex)
            {
                return BadRequest(new ErrorResponseDto
                {
                    Message = "Registration failed",
                    Errors = ex.Errors
                });
            }
            catch (BusinessException ex)
            {
                return BadRequest(new ErrorResponseDto
                {
                    Message = "Registration failed",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<ActionResult> Logout()
        {
            // Authentication.getPrincipal()
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            await _authService.LogoutAsync(userId);
            
            return Ok(new { message = "Logged out successfully" });
        }

        [HttpGet("me")]
        [Authorize]
        public ActionResult GetCurrentUser()
        {
            // SecurityContextHolder.getContext()
            var userClaims = new
            {
                Id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value,
                Email = User.FindFirst(ClaimTypes.Email)?.Value,
                FirstName = User.FindFirst(ClaimTypes.GivenName)?.Value,
                LastName = User.FindFirst(ClaimTypes.Surname)?.Value,
                Role = User.FindFirst(ClaimTypes.Role)?.Value
            };

            return Ok(userClaims);
        }
    }
} 