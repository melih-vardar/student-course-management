using Xunit;
using Moq;
using backend.Controllers;
using backend.Services;
using backend.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;
using backend.Exceptions;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

public class EnrollmentControllerUnitTests
{
    private EnrollmentController CreateControllerWithUser(IEnrollmentService enrollmentService, string userId = "test-user-id")
    {
        var controller = new EnrollmentController(enrollmentService);
        var claims = new List<Claim> { new Claim(ClaimTypes.NameIdentifier, userId) };
        var identity = new ClaimsIdentity(claims, "Test");
        var principal = new ClaimsPrincipal(identity);
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = principal }
        };
        return controller;
    }

    [Fact]
    public async Task Enroll_ValidRequest_ReturnsCreated()
    {
        var mockService = new Mock<IEnrollmentService>();
        var fakeResponse = new EnrollmentResponseDto { Id = 1, CourseId = 1 };
        mockService.Setup(s => s.EnrollStudentAsync(It.IsAny<string>(), It.IsAny<EnrollmentRequestDto>()))
                    .ReturnsAsync(fakeResponse);
        var controller = CreateControllerWithUser(mockService.Object);
        var request = new EnrollmentRequestDto { CourseId = 1 };
        var result = await controller.EnrollStudent(request);
        var created = Assert.IsType<CreatedAtActionResult>(result.Result);
        var response = Assert.IsType<EnrollmentResponseDto>(created.Value);
        Assert.Equal(1, response.CourseId);
    }

    [Fact]
    public async Task Enroll_NonExistentCourse_ReturnsNotFound()
    {
        var mockService = new Mock<IEnrollmentService>();
        mockService.Setup(s => s.EnrollStudentAsync(It.IsAny<string>(), It.IsAny<EnrollmentRequestDto>()))
                    .ThrowsAsync(new NotFoundException("Course not found"));
        var controller = CreateControllerWithUser(mockService.Object);
        var request = new EnrollmentRequestDto { CourseId = 999 };
        var result = await controller.EnrollStudent(request);
        var notFound = Assert.IsType<NotFoundObjectResult>(result.Result);
        Assert.Equal(404, notFound.StatusCode);
    }

    [Fact]
    public async Task Enroll_InvalidModel_ReturnsBadRequest()
    {
        var mockService = new Mock<IEnrollmentService>();
        var controller = CreateControllerWithUser(mockService.Object);
        controller.ModelState.AddModelError("CourseId", "Required");
        var request = new EnrollmentRequestDto();
        var result = await controller.EnrollStudent(request);
        var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.Equal(400, badRequest.StatusCode);
    }

    [Fact]
    public async Task GetMyEnrollments_ReturnsList()
    {
        var mockService = new Mock<IEnrollmentService>();
        mockService.Setup(s => s.GetStudentEnrollmentsAsync(It.IsAny<string>()))
                    .ReturnsAsync(new List<EnrollmentResponseDto> { new EnrollmentResponseDto { Id = 1, CourseId = 1 } });
        var controller = CreateControllerWithUser(mockService.Object);
        var result = await controller.GetMyEnrollments();
        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var list = Assert.IsAssignableFrom<IEnumerable<EnrollmentResponseDto>>(ok.Value);
        Assert.Single(list);
    }
} 