using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using backend.Services;
using backend.DTOs;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<PagedResponseDto<UserResponseDto>>> GetUsers(
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 10)
        {
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 10;

            var result = await _userService.GetUsersAsync(page, pageSize);
            return Ok(result);
        }

        [HttpGet("students")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<PagedResponseDto<UserResponseDto>>> GetStudents(
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 10)
        {
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 10;

            var result = await _userService.GetStudentsAsync(page, pageSize);
            return Ok(result);
        }

        [HttpGet("admins")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<PagedResponseDto<UserResponseDto>>> GetAdmins(
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 10)
        {
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 10;

            var result = await _userService.GetAdminsAsync(page, pageSize);
            return Ok(result);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<UserDetailResponseDto>> GetUser(string id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            
            if (user == null)
            {
                return NotFound(new ErrorResponseDto
                {
                    Message = "User not found"
                });
            }

            return Ok(user);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<UserDetailResponseDto>> CreateUser([FromBody] CreateUserRequestDto request)
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

            var result = await _userService.CreateUserAsync(request);
            
            if (result == null)
            {
                return BadRequest(new ErrorResponseDto
                {
                    Message = "User creation failed. Email might already exist or validation failed."
                });
            }

            return CreatedAtAction(nameof(GetUser), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<UserDetailResponseDto>> UpdateUser(
            string id, 
            [FromBody] UpdateUserRequestDto request)
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

            var result = await _userService.UpdateUserAsync(id, request);
            
            if (result == null)
            {
                return NotFound(new ErrorResponseDto
                {
                    Message = "User not found or validation failed"
                });
            }

            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteUser(string id)
        {
            var result = await _userService.DeleteUserAsync(id);
            
            if (!result)
            {
                return NotFound(new ErrorResponseDto
                {
                    Message = "User not found"
                });
            }

            return NoContent();
        }

        [HttpGet("profile")]
        public async Task<ActionResult<UserDetailResponseDto>> GetCurrentUserProfile()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var user = await _userService.GetCurrentUserAsync(userId);
            
            if (user == null)
            {
                return NotFound(new ErrorResponseDto
                {
                    Message = "User profile not found"
                });
            }

            return Ok(user);
        }

        [HttpPut("profile")]
        public async Task<ActionResult<UserDetailResponseDto>> UpdateCurrentUserProfile(
            [FromBody] UpdateUserRequestDto request)
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

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var result = await _userService.UpdateCurrentUserAsync(userId, request);
            
            if (result == null)
            {
                return NotFound(new ErrorResponseDto
                {
                    Message = "User profile not found or validation failed"
                });
            }

            return Ok(result);
        }
    }
} 