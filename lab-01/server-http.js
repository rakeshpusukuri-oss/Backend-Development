// server-http.js - Plain HTTP Web Server using Node.js built-in 'http' module
// BDF Lab 01: Node.js and Express server

const http = require('http');

const PORT = 3000;

// Create HTTP server instance
const server = http.createServer((req, res) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Incoming Request: ${req.method} ${req.url}`);

    // Set response headers: HTTP 200 OK and text/plain MIME type
    res.writeHead(200, { 'Content-Type': 'text/plain' });

    // Send response body and terminate connection
    res.end('Hello');
});

// Start listening for incoming connections
server.listen(PORT, () => {
    console.log(`Plain HTTP server is running and listening on port ${PORT}`);
    console.log(`Access in browser: http://localhost:${PORT}`);
});
