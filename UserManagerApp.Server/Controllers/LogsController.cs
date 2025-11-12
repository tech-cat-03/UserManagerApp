using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace UserManagerApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LogsController : ControllerBase
    {
        private readonly string _logDirectory = Path.Combine(AppContext.BaseDirectory, "Logs");

        [HttpGet]
        public async Task<IActionResult> GetLogs()
        {
            if (!Directory.Exists(_logDirectory))
                return Ok(new List<object>()); // return empty list if no logs

            var logs = new List<object>();

            foreach (var file in Directory.GetFiles(_logDirectory, "*.txt"))
            {
                var fileInfo = new FileInfo(file);
                var lines = await System.IO.File.ReadAllLinesAsync(file);

                // You can also parse log details here if needed
                logs.Add(new
                {
                    id = fileInfo.Name.GetHashCode(), // unique-ish ID
                    name = fileInfo.Name,
                    createdAt = fileInfo.CreationTime,
                    updatedAt = fileInfo.LastWriteTime,
                    entries = lines.Length // count lines for debugging
                });
            }

            // Sort by last modified
            logs = logs.OrderByDescending(l => ((dynamic)l).updatedAt).ToList();

            return Ok(logs);
        }

        [HttpGet("entries")]
        public async Task<IActionResult> GetLogEntries()
        {
            var entries = new List<object>();

            if (!Directory.Exists(_logDirectory))
                return Ok(entries);

            foreach (var file in Directory.GetFiles(_logDirectory, "*.txt"))
            {
                var content = await System.IO.File.ReadAllTextAsync(file);
                var blocks = content.Split("----------------------------------------", StringSplitOptions.RemoveEmptyEntries);

                foreach (var block in blocks)
                {
                    entries.Add(new
                    {
                        file = Path.GetFileName(file),
                        message = block.Trim(),
                    });
                }
            }

            return Ok(entries.OrderByDescending(e => ((dynamic)e).file).ToList());
        }

        [HttpGet("{fileName}")]
        public async Task<IActionResult> GetLogFile(string fileName)
        {
            var filePath = Path.Combine(_logDirectory, fileName);

            if (!System.IO.File.Exists(filePath))
                return NotFound(new { message = "Log file not found" });

            var content = await System.IO.File.ReadAllTextAsync(filePath);
            return Content(content, "text/plain");
        }

    }
}
