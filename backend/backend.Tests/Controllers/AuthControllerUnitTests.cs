using Xunit;
using Moq;
using backend.Controllers;
using backend.Services;
using backend.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;

public class AuthControllerUnitTests
{
    [Fact]
    public async Task Register_ValidRequest_ReturnsCreated()
    {
        var mockAuthService = new Mock<IAuthService>();
        var fakeResponse = new AuthResponseDto { Token = "fake-token" };
        mockAuthService.Setup(s => s.RegisterAsync(It.IsAny<RegisterRequestDto>()))
                       .ReturnsAsync(fakeResponse);
        var controller = new AuthController(mockAuthService.Object);
        var request = new RegisterRequestDto
        {
            FirstName = "Test",
            LastName = "User",
            Email = "test@test.com",
            Password = "Test123!",
            DateOfBirth = DateTime.UtcNow.AddYears(-20)
        };
        var result = await controller.Register(request);
        var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        var response = Assert.IsType<AuthResponseDto>(createdResult.Value);
        Assert.Equal("fake-token", response.Token);
    }

    [Fact]
    public async Task Login_InvalidCredentials_ReturnsUnauthorized()
    {
        var mockAuthService = new Mock<IAuthService>();
        mockAuthService.Setup(s => s.LoginAsync(It.IsAny<LoginRequestDto>()))
                       .ReturnsAsync((AuthResponseDto?)null);
        var controller = new AuthController(mockAuthService.Object);
        var request = new LoginRequestDto { Email = "fail@test.com", Password = "wrong" };
        var result = await controller.Login(request);
        var unauthorized = Assert.IsType<UnauthorizedObjectResult>(result.Result);
        Assert.Equal(401, unauthorized.StatusCode);
    }

    [Fact]
    public async Task Register_InvalidModel_ReturnsBadRequest()
    {
        var mockAuthService = new Mock<IAuthService>();
        var controller = new AuthController(mockAuthService.Object);
        controller.ModelState.AddModelError("Email", "Required");
        var request = new RegisterRequestDto();
        var result = await controller.Register(request);
        var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.Equal(400, badRequest.StatusCode);
    }
} 