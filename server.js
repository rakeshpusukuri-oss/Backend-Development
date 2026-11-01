// server.js - Express Web Server
// BDF Lab 01: Node.js and Express server

const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to log every incoming request and its final response status code
app.use((req, res, next) => {
    const startTime = Date.now();

    // Hook into response finish event to log status code once sent
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${req.method} ${req.originalUrl} -> Status: ${res.statusCode} (${duration}ms)`);
    });

    next();
});

// Route 1: GET / (Welcome text)
app.get('/', (req, res) => {
    res.status(200).send('Welcome to Lab 1: Node.js and Express server!');
});

// Route 2: GET /about (JSON with name and section)
app.get('/about', (req, res) => {
    res.status(200).json({
        name: "Rakesh",
        section: "CSE-2D",
        registrationNumber: "252U1R1207",
        course: "Backend Development Fundamentals",
        faculty: "Sai Shiva Teja",
        lab: "Lab 01 - Node.js and Express server"
    });
});

// Route 3: GET /time (Current date and time using new Date())
app.get('/time', (req, res) => {
    const now = new Date();
    res.status(200).json({
        isoTime: now.toISOString(),
        formattedTime: now.toLocaleString(),
        utcTime: now.toUTCString(),
        timestamp: now.getTime()
    });
});

// Route 4: Catch-all 404 handler for any unknown route/path
app.use((req, res) => {
    res.status(404).json({
        status: 404,
        error: "Not Found",
        message: `Route '${req.originalUrl}' does not exist on this server.`
    });
});

// Start Express server
app.listen(PORT, () => {
    console.log(`Express server is running on http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log(` - GET http://localhost:${PORT}/`);
    console.log(` - GET http://localhost:${PORT}/about`);
    console.log(` - GET http://localhost:${PORT}/time`);
    console.log(` - Any unknown path (e.g. http://localhost:${PORT}/xyz) returns 404`);
});
