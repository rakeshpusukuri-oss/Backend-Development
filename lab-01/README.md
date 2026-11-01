# Lab 1: Node.js and Express server

**Student Name:** Rakesh  
**Registration Number:** 252U1R1207  
**Section:** CSE-2D  
**Course:** Backend Development Fundamentals (Year II Term II • Aurora)  
**Faculty:** Sai Shiva Teja  

---

## Live Link
- **Deployment Status:** Local Development Server / Cloud Deployable (Render / Railway / Cloud IDE compatible)
- **Live URL:** `Not applicable (Local execution mode verified; instructions below for one-click deployment)`

---

## How to Run

### Prerequisites
- Node.js (version 18.x, 20.x, or later)
- npm (Node Package Manager)

### 1. Installation
Clone the repository and navigate into the `lab-01` directory:
```bash
cd lab-01
npm install
```

### 2. Environment Variables
No secrets or private keys are required. You can optionally configure the listening port:
```env
PORT=3000
```

### 3. Start Commands
- To start the **Express server**:
  ```bash
  npm start
  ```
  *(or `node server.js`)*

- To start the **Plain HTTP server** (built-in `http` module):
  ```bash
  npm run start:http
  ```
  *(or `node server-http.js`)*

---

## Explanation of `package.json` Fields

When running `npm init -y`, npm generates a standard manifest file (`package.json`). Each field serves a specific purpose in the Node.js ecosystem:

| Field | Purpose / Explanation |
| :--- | :--- |
| **`name`** | The unique identifier / name of the project or package. Used if published to the npm registry. Must be lowercase and URL-friendly. |
| **`version`** | The current semantic version (`major.minor.patch`) following SemVer guidelines (e.g., `1.0.0`). |
| **`description`** | A short, human-readable summary describing the module's functionality and purpose. |
| **`main`** | The primary entry point for the application or package (e.g., `server.js`). When imported by another file, this is resolved first. |
| **`scripts`** | A dictionary of custom CLI commands aliasable via `npm run <script-name>` (e.g., `start`, `start:http`, `test`). |
| **`keywords`** | An array of searchable tags/keywords that help categorize the package in the npm registry. |
| **`author`** | The creator or maintainer of the project (Name, email, or URL). |
| **`license`** | Specifies legal terms under which the code is released and distributed (e.g., `ISC`, `MIT`). |
| **`dependencies`** | A list of external packages required for runtime execution (e.g., `"express": "^5.3.0"`), installed in `node_modules`. |

---

## Endpoints Table

| Method | Endpoint | HTTP Status | Description |
| :---: | :--- | :---: | :--- |
| **GET** | `/` | `200 OK` | Welcome message text: `"Welcome to Lab 1: Node.js and Express server!"` |
| **GET** | `/about` | `200 OK` | JSON payload containing student details (Name, Section, Registration No, Course) |
| **GET** | `/time` | `200 OK` | JSON payload containing dynamic server date and time using `new Date()` |
| **ALL** | `/*` (unknown route) | `404 Not Found` | Catch-all error handler returning descriptive JSON error message |

---

## Screenshots

### 1. Plain HTTP Server (`server-http.js`)
Demonstrating Node.js built-in `http.createServer` listening on port 3000 and answering with `"Hello"`:
![Plain HTTP Server](screenshots/00_plain_http_server.png)

---

### 2. Express Server — Root Route (`GET /`)
Welcome message returning HTTP 200:
![Root Route](screenshots/01_root_route.png)

---

### 3. Express Server — About Route (`GET /about`)
Student and course information returned as JSON:
![About Route](screenshots/02_about_route.png)

---

### 4. Express Server — Time Route (`GET /time`)
Dynamic date and timestamp returned as JSON:
![Time Route](screenshots/03_time_route.png)

---

### 5. Express Server — Unknown Route (`404 Not Found`)
Catch-all route handling unknown requests:
![404 Error Handler](screenshots/04_404_route.png)

---

## Viva Questions & Answers

### Q1: What is the difference between `package.json` and `node_modules`?
- **`package.json`**: A lightweight, human-readable metadata file that records project configuration, scripts, and abstract dependency names with version constraints (e.g., `"express": "^5.3.0"`). It is checked into Git version control.
- **`node_modules`**: A large directory containing the actual downloaded JavaScript source code and compiled binaries of all dependencies and transitive sub-dependencies. Because it can contain thousands of files and be reproduced at any time using `npm install`, it must **never** be committed to Git.

### Q2: What does `app.listen()` do?
- In Express, `app.listen(port, [callback])` is a convenience wrapper around Node.js's native `http.createServer(app).listen(...)`.
- It binds the application to a specific TCP port and network interface, continuously listening for incoming HTTP connections and dispatching incoming requests through the Express middleware and routing pipeline.

### Q3: What do `request` and `response` represent?
- **`request` (`req`)**: An object representing the incoming HTTP request received from the client. It provides access to request headers, HTTP method (`GET`, `POST`), query parameters (`req.query`), route parameters (`req.params`), URL path, and request body (`req.body`).
- **`response` (`res`)**: An object representing the outgoing HTTP response that the server constructs and sends back to the client. It provides helper methods to set HTTP status codes (`res.status(200)`), headers (`res.set()`), and send responses (`res.send()`, `res.json()`, `res.end()`).

---

## Notes: Problems Faced and How They Were Solved

1. **Node.js Environment Availability**:
   - *Problem*: Node.js was initially not present in the system `PATH`.
   - *Solution*: Downloaded and extracted the official Node.js standalone runtime to `%LOCALAPPDATA%\Programs\nodejs`, configured the user's permanent environment `PATH`, and verified `node -v` and `npm -v`.

2. **Capturing Real Browser Screenshots Headlessly**:
   - *Problem*: Needing real, authentic browser screenshots for all required endpoints without manual screenshotting tools.
   - *Solution*: Automated automated headless browser captures using Google Chrome (`--headless --screenshot`) via a Python harness script, capturing all 5 routes directly into `screenshots/`.

3. **Status Code Logging & 404 Routing**:
   - *Problem*: Accurately logging the final response status codes for every request after routes finish processing.
   - *Solution*: Implemented an Express middleware that listens to `res.on('finish')`, calculating response duration and logging the method, URL, and final status code (`res.statusCode`).
