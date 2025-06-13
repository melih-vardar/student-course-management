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

            try
            {
                var result = await _userService.CreateUserAsync(request);
                return CreatedAtAction(nameof(GetUser), new { id = result.Id }, result);
            }
            catch (ValidationException ex)
            {
                return BadRequest(new ErrorResponseDto
                {
                    Message = "User creation failed",
                    Errors = ex.Errors
                });
            }
            catch (BusinessException ex)
            {
                return BadRequest(new ErrorResponseDto
                {
                    Message = "User creation failed",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<UserDetailResponseDto>> UpdateUser(
            string id, 
            [FromBody] AdminUpdateUserRequestDto request)
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
                var result = await _userService.UpdateUserAsync(id, request);
                return Ok(result);
            }
            catch (ValidationException ex)
            {
                return BadRequest(new ErrorResponseDto
                {
                    Message = "User update failed",
                    Errors = ex.Errors
                });
            }
            catch (BusinessException ex)
            {
                return BadRequest(new ErrorResponseDto
                {
                    Message = "User update failed", 
                    Errors = new List<string> { ex.Message }
                });
            }
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
            [FromBody] UpdateCurrentUserRequestDto request)
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

            try
            {
                var result = await _userService.UpdateCurrentUserAsync(userId, request);
                return Ok(result);
            }
            catch (ValidationException ex)
            {
                return BadRequest(new ErrorResponseDto
                {
                    Message = "Profile update failed",
                    Errors = ex.Errors
                });
            }
            catch (BusinessException ex)
            {
                return BadRequest(new ErrorResponseDto
                {
                    Message = "Profile update failed",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpGet("{id}/enrollments")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<CourseInfoDto>>> GetUserEnrollments(string id)
        {
            var enrollments = await _userService.GetUserEnrollmentsAsync(id);
            return Ok(enrollments);
        }
    }
} 