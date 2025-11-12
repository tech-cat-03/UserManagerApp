using System;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace UserManagerApp.Server.Logging
{
    public class FileLogger
    {
        private readonly string _logDirectory = Path.Combine(AppContext.BaseDirectory, "Logs");

        public FileLogger()
        {
            if (!Directory.Exists(_logDirectory))
                Directory.CreateDirectory(_logDirectory);
        }

        private string GetLogFilePath()
        {
            string fileName = $"log_{DateTime.Now:yyyyMMdd}.txt";
            return Path.Combine(_logDirectory, fileName);
        }

        public async Task LogAsync(HttpContext context, string level, string methodName, string message, string? parameters = null)
        {
            string clientIp = context.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
            string clientName = context.Request.Headers["User-Agent"].ToString();
            string hostName = Dns.GetHostName();
            string time = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");

            string logMessage =
                $@"[{level}] {time}
                Host: {hostName}
                Client IP: {clientIp}
                Client Name: {clientName}
                API: {methodName}
                Params: {parameters ?? "N/A"}
                Message: {message}
                ----------------------------------------";

            await File.AppendAllTextAsync(GetLogFilePath(), logMessage + Environment.NewLine);
        }
    }
}
