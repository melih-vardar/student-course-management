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

            // Authentication.getPrincipal()
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var result = await _enrollmentService.EnrollStudentAsync(userId, request);

            return CreatedAtAction(nameof(GetEnrollments), result);
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

            var result = await _enrollmentService.AdminEnrollStudentAsync(request);
            
            if (result == null)
            {
                return BadRequest(new ErrorResponseDto
                {
                    Message = "Enrollment failed. Student may already be enrolled in this course or student/course may not exist."
                });
            }

            return CreatedAtAction(nameof(GetEnrollments), result);
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

            var result = await _enrollmentService.UnenrollStudentAsync(userId, courseId);
            
            if (!result)
            {
                return BadRequest(new ErrorResponseDto
                {
                    Message = "Unenrollment failed. You may not be enrolled in this course."
                });
            }

            return NoContent();
        }

        [HttpDelete("{enrollmentId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> AdminUnenrollStudent(int enrollmentId)
        {
            var result = await _enrollmentService.AdminUnenrollStudentAsync(enrollmentId);
            
            if (!result)
            {
                return NotFound(new ErrorResponseDto
                {
                    Message = "Enrollment not found"
                });
            }

            return NoContent();
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