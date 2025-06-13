using Xunit;
using Moq;
using backend.Controllers;
using backend.Services;
using backend.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

public class UserControllerUnitTests
{
    private UserController CreateControllerWithUser(IUserService userService, string userId = "test-user-id")
    {
        var controller = new UserController(userService);
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
    public async Task GetCurrentUserProfile_Valid_ReturnsOk()
    {
        var mockService = new Mock<IUserService>();
        var fakeUser = new UserDetailResponseDto { Id = "1", Email = "test@test.com" };
        mockService.Setup(s => s.GetCurrentUserAsync(It.IsAny<string>()))
                    .ReturnsAsync(fakeUser);
        var controller = CreateControllerWithUser(mockService.Object);
        var result = await controller.GetCurrentUserProfile();
        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var user = Assert.IsType<UserDetailResponseDto>(ok.Value);
        Assert.Equal("test@test.com", user.Email);
    }

    [Fact]
    public async Task GetCurrentUserProfile_NotFound_ReturnsNotFound()
    {
        var mockService = new Mock<IUserService>();
        mockService.Setup(s => s.GetCurrentUserAsync(It.IsAny<string>()))
                    .ReturnsAsync((UserDetailResponseDto?)null);
        var controller = CreateControllerWithUser(mockService.Object);
        var result = await controller.GetCurrentUserProfile();
        var notFound = Assert.IsType<NotFoundObjectResult>(result.Result);
        Assert.Equal(404, notFound.StatusCode);
    }

    [Fact]
    public async Task UpdateCurrentUserProfile_InvalidModel_ReturnsBadRequest()
    {
        var mockService = new Mock<IUserService>();
        var controller = CreateControllerWithUser(mockService.Object);
        controller.ModelState.AddModelError("Email", "Required");
        var request = new UpdateCurrentUserRequestDto();
        var result = await controller.UpdateCurrentUserProfile(request);
        var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.Equal(400, badRequest.StatusCode);
    }

    [Fact]
    public async Task CreateUser_AdminValidRequest_ReturnsCreated()
    {
        var mockService = new Mock<IUserService>();
        var fakeUser = new UserDetailResponseDto { Id = "1", Email = "admin@test.com" };
        mockService.Setup(s => s.CreateUserAsync(It.IsAny<CreateUserRequestDto>()))
                    .ReturnsAsync(fakeUser);
        var controller = new UserController(mockService.Object);
        var request = new CreateUserRequestDto
        {
            FirstName = "Admin",
            LastName = "User",
            Email = "admin@test.com",
            Password = "Test123!",
            DateOfBirth = DateTime.UtcNow.AddYears(-30),
            Role = "Admin"
        };
        var result = await controller.CreateUser(request);
        var created = Assert.IsType<CreatedAtActionResult>(result.Result);
        var user = Assert.IsType<UserDetailResponseDto>(created.Value);
        Assert.Equal("admin@test.com", user.Email);
    }
} 