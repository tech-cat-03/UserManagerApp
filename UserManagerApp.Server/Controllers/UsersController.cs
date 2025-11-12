using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using UserManagerApp.Server.Logging;
using UserManagerApp.Server.Models;
using UserManagerApp.Server.Models.Auth;
using System.Text.Json;

namespace UserManagerApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly DBContext _context;
        private readonly FileLogger _logger;

        public UsersController(DBContext context, FileLogger logger)
        {
            _context = context;
            _logger = logger;
        }

        // POST /api/users
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] PUser user)
        {
            try
            {
                if (user == null)
                    return BadRequest("User data is required");

                // Hash password
                user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                await _logger.LogAsync(HttpContext, "Info", nameof(CreateUser),
                   "Created new user successfully", System.Text.Json.JsonSerializer.Serialize(user));

                return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
            }
            catch (Exception ex)
            {
                await _logger.LogAsync(HttpContext, "Error", nameof(CreateUser), ex.Message);
                return StatusCode(500, new { message = "Failed to create user" });
            }
        }

        // GET /api/users
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _context.Users.ToListAsync();
                await _logger.LogAsync(HttpContext, "Info", nameof(GetAllUsers), "Fetched all users successfully");
                return Ok(users);
            }
            catch (Exception ex)
            {
                await _logger.LogAsync(HttpContext, "Error", nameof(GetAllUsers), ex.Message);
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }

        // GET /api/users/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    await _logger.LogAsync(HttpContext, "Info", nameof(GetUserById),
                        $"User not found", $"Id={id}");
                    return NotFound(new { message = "User not found" });
                }

                await _logger.LogAsync(HttpContext, "Info", nameof(GetUserById),
                    $"Fetched user successfully", $"Id={id}");
                return Ok(user);
            }
            catch (Exception ex)
            {
                await _logger.LogAsync(HttpContext, "Error", nameof(GetUserById), ex.Message, $"Id={id}");
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }


        // PUT /api/users/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] PUser updatedUser)
        {
            try
            {
                if (updatedUser == null)
                {
                    await _logger.LogAsync(HttpContext, "Error", nameof(UpdateUser),
                        "Invalid user data", $"Id={id}");
                    return BadRequest("Invalid user data");
                }

                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    await _logger.LogAsync(HttpContext, "Info", nameof(UpdateUser),
                        "User not found", $"Id={id}");
                    return NotFound(new { message = "User not found" });
                }

                user.UserName = updatedUser.UserName;
                user.FullName = updatedUser.FullName;
                user.Email = updatedUser.Email;
                user.Phone = updatedUser.Phone;
                user.Language = updatedUser.Language;
                user.Culture = updatedUser.Culture;

                // Only rehash if new password provided
                if (!string.IsNullOrWhiteSpace(updatedUser.Password))
                {
                    user.Password = BCrypt.Net.BCrypt.HashPassword(updatedUser.Password);
                }

                await _context.SaveChangesAsync();

                await _logger.LogAsync(HttpContext, "Info", nameof(UpdateUser),
                    "User updated successfully", JsonSerializer.Serialize(updatedUser));

                return Ok(user);
            }
            catch (Exception ex)
            {
                await _logger.LogAsync(HttpContext, "Error", nameof(UpdateUser), ex.Message, JsonSerializer.Serialize(updatedUser));
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }

        // DELETE /api/users/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    await _logger.LogAsync(HttpContext, "Info", nameof(DeleteUser),
                        "User not found", $"Id={id}");
                    return NotFound(new { message = "User not found" });
                }

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                await _logger.LogAsync(HttpContext, "Info", nameof(DeleteUser),
                    "User deleted successfully", $"Id={id}");

                return NoContent();
            }
            catch (Exception ex)
            {
                await _logger.LogAsync(HttpContext, "Error", nameof(DeleteUser), ex.Message, $"Id={id}");
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }

        // POST /api/users/{id}/validate-password
        [HttpPost("{id:int}/validate-password")]
        public async Task<IActionResult> ValidatePassword(int id, [FromBody] PasswordRequest payload)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    await _logger.LogAsync(HttpContext, "Info", nameof(ValidatePassword),
                        "User not found", $"Id={id}");
                    return NotFound(new { message = "User not found" });
                }

                bool valid = BCrypt.Net.BCrypt.Verify(payload.Password, user.Password);

                await _logger.LogAsync(HttpContext, "Info", nameof(ValidatePassword),
                    $"Password validation performed for user {id}", $"Valid={valid}");

                return Ok(new { valid });
            }
            catch (Exception ex)
            {
                await _logger.LogAsync(HttpContext, "Error", nameof(ValidatePassword), ex.Message, $"Id={id}");
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }

    }
}
