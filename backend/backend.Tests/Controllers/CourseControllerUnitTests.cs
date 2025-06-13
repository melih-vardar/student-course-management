using Xunit;
using Moq;
using backend.Controllers;
using backend.Services;
using backend.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;

public class CourseControllerUnitTests
{
    [Fact]
    public async Task CreateCourse_ValidRequest_ReturnsCreated()
    {
        var mockService = new Mock<ICourseService>();
        var fakeResponse = new CourseResponseDto { Id = 1, Name = "Test" };
        mockService.Setup(s => s.CreateCourseAsync(It.IsAny<CreateCourseRequestDto>()))
                    .ReturnsAsync(fakeResponse);
        var controller = new CourseController(mockService.Object);
        var request = new CreateCourseRequestDto { Name = "Test", Credits = 3 };
        var result = await controller.CreateCourse(request);
        var created = Assert.IsType<CreatedAtActionResult>(result.Result);
        var response = Assert.IsType<CourseResponseDto>(created.Value);
        Assert.Equal("Test", response.Name);
    }

    [Fact]
    public async Task CreateCourse_InvalidModel_ReturnsBadRequest()
    {
        var mockService = new Mock<ICourseService>();
        var controller = new CourseController(mockService.Object);
        controller.ModelState.AddModelError("Name", "Required");
        var request = new CreateCourseRequestDto();
        var result = await controller.CreateCourse(request);
        var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.Equal(400, badRequest.StatusCode);
    }

    [Fact]
    public async Task GetCourse_NonExistent_ReturnsNotFound()
    {
        var mockService = new Mock<ICourseService>();
        mockService.Setup(s => s.GetCourseByIdAsync(It.IsAny<int>()))
                    .ReturnsAsync((CourseDetailResponseDto?)null);
        var controller = new CourseController(mockService.Object);
        var result = await controller.GetCourseDetails(999);
        var notFound = Assert.IsType<NotFoundObjectResult>(result.Result);
        Assert.Equal(404, notFound.StatusCode);
    }

    [Fact]
    public async Task GetCourses_ReturnsList()
    {
        var mockService = new Mock<ICourseService>();
        var paged = new PagedResponseDto<CourseResponseDto> {
            Data = new List<CourseResponseDto> { new CourseResponseDto { Id = 1, Name = "Test" } },
            TotalCount = 1, Page = 1, PageSize = 10, TotalPages = 1, HasNextPage = false, HasPreviousPage = false
        };
        mockService.Setup(s => s.GetCoursesAsync(It.IsAny<int>(), It.IsAny<int>()))
                    .ReturnsAsync(paged);
        var controller = new CourseController(mockService.Object);
        var result = await controller.GetCourses(1, 10);
        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var list = Assert.IsAssignableFrom<PagedResponseDto<CourseResponseDto>>(ok.Value);
        Assert.Single(list.Data);
    }
} 