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
    public class EnrollmentController : ControllerBase
    {
        private readonly IEnrollmentService _enrollmentService;

        public EnrollmentController(IEnrollmentService enrollmentService)
        {
            _enrollmentService = enrollmentService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<PagedResponseDto<EnrollmentResponseDto>>> GetEnrollments(
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 10)
        {
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 10;

            var result = await _enrollmentService.GetEnrollmentsAsync(page, pageSize);
            return Ok(result);
        }

        [HttpPost("enroll")]
        [Authorize(Roles = "Student")]
        public async Task<ActionResult<EnrollmentResponseDto>> EnrollStudent([FromBody] EnrollmentRequestDto request)
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
                var result = await _enrollmentService.EnrollStudentAsync(userId, request);
                return CreatedAtAction(nameof(GetEnrollments), result);
            }
            catch (NotFoundException ex)
            {
                return NotFound(new ErrorResponseDto
                {
                    Message = "Enrollment failed",
                    Errors = new List<string> { ex.Message }
                });
            }
            catch (BusinessException ex)
            {
                return BadRequest(new ErrorResponseDto
                {
                    Message = "Enrollment failed",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPost("admin-enroll")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<EnrollmentResponseDto>> AdminEnrollStudent([FromBody] AdminEnrollmentRequestDto request)
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
                var result = await _enrollmentService.AdminEnrollStudentAsync(request);
                return CreatedAtAction(nameof(GetEnrollments), result);
            }
            catch (NotFoundException ex)
            {
                return NotFound(new ErrorResponseDto
                {
                    Message = "Enrollment failed",
                    Errors = new List<string> { ex.Message }
                });
            }
            catch (BusinessException ex)
            {
                return BadRequest(new ErrorResponseDto
                {
                    Message = "Enrollment failed",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpDelete("unenroll/{courseId}")]
        [Authorize(Roles = "Student")]
        public async Task<ActionResult> UnenrollStudent(int courseId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            try
            {
                await _enrollmentService.UnenrollStudentAsync(userId, courseId);
                return NoContent();
            }
            catch (BusinessException ex)
            {
                return BadRequest(new ErrorResponseDto
                {
                    Message = "Unenrollment failed",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpDelete("{enrollmentId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> AdminUnenrollStudent(int enrollmentId)
        {
            try
            {
                await _enrollmentService.AdminUnenrollStudentAsync(enrollmentId);
                return NoContent();
            }
            catch (NotFoundException ex)
            {
                return NotFound(new ErrorResponseDto
                {
                    Message = "Unenrollment failed",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpGet("my-enrollments")]
        [Authorize(Roles = "Student")]
        public async Task<ActionResult<List<EnrollmentResponseDto>>> GetMyEnrollments()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var result = await _enrollmentService.GetStudentEnrollmentsAsync(userId);
            return Ok(result);
        }
    }
} 