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
    public class CourseController : ControllerBase
    {
        private readonly ICourseService _courseService;

        public CourseController(ICourseService courseService)
        {
            _courseService = courseService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResponseDto<CourseResponseDto>>> GetCourses(
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 10)
        {
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 10;

            var result = await _courseService.GetCoursesAsync(page, pageSize);
            return Ok(result);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CourseDetailResponseDto>> GetCourseDetails(int id)
        {
            var course = await _courseService.GetCourseByIdAsync(id);
            
            if (course == null)
            {
                return NotFound(new ErrorResponseDto
                {
                    Message = "Course not found"
                });
            }

            return Ok(course);
        }

        [HttpGet("{id}/info")]
        public async Task<ActionResult<CourseResponseDto>> GetCourseBasicInfo(int id)
        {
            var courses = await _courseService.GetCoursesAsync(1, 1000); // Tüm dersler
            var course = courses.Data.FirstOrDefault(c => c.Id == id);
            
            if (course == null)
            {
                return NotFound(new ErrorResponseDto
                {
                    Message = "Course not found"
                });
            }

            return Ok(course);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CourseResponseDto>> CreateCourse([FromBody] CreateCourseRequestDto request)
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

            var result = await _courseService.CreateCourseAsync(request);
            
            if (result == null)
            {
                return BadRequest(new ErrorResponseDto
                {
                    Message = "Course creation failed. Course name might already exist."
                });
            }

            return CreatedAtAction(nameof(GetCourseDetails), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CourseResponseDto>> UpdateCourse(
            int id, 
            [FromBody] UpdateCourseRequestDto request)
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

            var result = await _courseService.UpdateCourseAsync(id, request);
            
            if (result == null)
            {
                return NotFound(new ErrorResponseDto
                {
                    Message = "Course not found or name already exists"
                });
            }

            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteCourse(int id)
        {
            var result = await _courseService.DeleteCourseAsync(id);
            
            if (!result)
            {
                return BadRequest(new ErrorResponseDto
                {
                    Message = "Course cannot be deleted. It may not exist or have active enrollments."
                });
            }

            return NoContent();
        }

        [HttpGet("available")]
        [Authorize(Roles = "Student")]
        public async Task<ActionResult<List<CourseResponseDto>>> GetAvailableCourses()
        {
            // Authentication.getPrincipal()
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var result = await _courseService.GetAvailableCoursesForStudentAsync(userId);
            return Ok(result);
        }
    }
} 