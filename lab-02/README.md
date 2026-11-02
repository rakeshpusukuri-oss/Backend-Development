# Lab 2: SQLite database and CRUD routes

**Name:** Rakesh · **Registration Number:** 252U1R1207 · **Section:** CSE-2D  
**Course:** Backend Development Fundamentals (Year II Term II • Aurora) · **Faculty:** Joel Prashanth D

---

## Submission & Repository Links
- **Course Repository:** [https://github.com/rakeshpusukuri-oss/Backend-Development](https://github.com/rakeshpusukuri-oss/Backend-Development)
- **Lab 2 Folder:** [https://github.com/rakeshpusukuri-oss/Backend-Development/tree/main/lab-02](https://github.com/rakeshpusukuri-oss/Backend-Development/tree/main/lab-02)
- **Standalone Lab 2 Repository:** [https://github.com/rakeshpusukuri-oss/Lab-02](https://github.com/rakeshpusukuri-oss/Lab-02)
- **Live Link:** `Not applicable` — This project runs locally as an Express.js API connected to a file-based SQLite database (`books.db`). Comprehensive Postman and terminal verification screenshots of all five endpoints and database mutations are provided in the [Screenshots](#screenshots) section below.

---

## How to Run

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or v20.x recommended)
- `npm` (Node Package Manager)

### 2. Installation
Navigate into the `lab-02` directory and install the required dependencies:
```bash
cd lab-02
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env` (optional; defaults to port `3000`):
```bash
cp .env.example .env
```
Contents of `.env`:
```env
PORT=3000
```
*(Note: Never commit your actual `.env` file; it is ignored by `.gitignore`)*.

### 4. Database Setup & Seeding
The database (`books.db`) will be automatically created and populated with 10 sample books on first server startup. You can also explicitly seed or inspect the database anytime by running:
```bash
npm run seed
```

### 5. Start the Server
To run the server with `nodemon` for auto-restart on changes:
```bash
npm run dev
```

Or run with standard Node:
```bash
npm start
```
The server will start at: `http://localhost:3000/`

### 6. Automated Testing & Postman Import
You can run the end-to-end test suite directly with:
```bash
npm test
```

A ready-to-import Postman Collection is also provided:
- Import `Lab-02-Postman-Collection.json` into Postman to test all routes and capture screenshots easily.

---

## Endpoints Table

| HTTP Method | Endpoint | Description | Request Body / Parameters | Success Status | Error Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GET** | `/books/` | Retrieves all books in the database | None | `200 OK` | `500 Internal Server Error` |
| **GET** | `/books/:bookId/` | Retrieves a single book by its primary ID | URL Param: `:bookId` (integer) | `200 OK` | `404 Not Found`, `500 Server Error` |
| **POST** | `/books/` | Adds a new book to the database | JSON Body: `{ "title": string, "author": string, "price": number, "pages": number }` | `201 Created` | `400 Bad Request`, `500 Server Error` |
| **PUT** | `/books/:bookId/` | Updates an existing book's details | URL Param: `:bookId`<br>JSON Body: `{ "title": string, "author": string, "price": number, "pages": number }` | `200 OK` | `400 Bad Request`, `404 Not Found`, `500 Server Error` |
| **DELETE** | `/books/:bookId/` | Removes a book from the database | URL Param: `:bookId` (integer) | `200 OK` | `404 Not Found`, `500 Server Error` |

---

## Screenshots

> Place the captured Postman and terminal screenshots inside the `screenshots/` directory.

### 1. GET /books/ (All Books)
![GET /books/](screenshots/01_get_all_books.png)
*Fetches the complete collection of books from SQLite with HTTP 200 OK.*

---

### 2. GET /books/:bookId/ (Single Book)
![GET /books/:bookId/](screenshots/02_get_book_by_id.png)
*Fetches a single book by ID with HTTP 200 OK (and HTTP 404 for non-existent IDs).*

---

### 3. POST /books/ (Add Book)
![POST /books/](screenshots/03_post_new_book.png)
*Creates a new book record using parameterized INSERT query and returns HTTP 201 Created.*

---

### 4. PUT /books/:bookId/ (Update Book)
![PUT /books/:bookId/](screenshots/04_put_update_book.png)
*Updates book details by ID using parameterized UPDATE query and returns HTTP 200 OK.*

---

### 5. DELETE /books/:bookId/ (Remove Book)
![DELETE /books/:bookId/](screenshots/05_delete_book.png)
*Deletes the specified book from the database and returns HTTP 200 OK.*

---

### 6. SQLite Database State Verification
![SQLite CLI / DB View](screenshots/06_sqlite_db_view.png)
*Verification of database rows and schema in `books.db`.*

---

## Viva Questions & Answers

### 1. Why await the database call?
> **Answer:** Database operations in Node.js are asynchronous I/O operations (communicating with the filesystem or external database engine). If we do not use `await`, JavaScript's event loop will proceed to execute the next lines immediately, leaving the database query as an unresolved `Promise`. Consequently, the API would attempt to send a response before the data is retrieved, or even crash. 
> 
> Furthermore, in `initializeDBAndServer()`, awaiting database initialization ensures the Express HTTP server does not start listening for incoming requests until the database file is opened and ready to handle queries.

### 2. What is SQL injection and how do placeholders prevent it?
> **Answer:** SQL Injection (SQLi) is a security vulnerability where untrusted user input is directly concatenated or interpolated into a raw SQL query string. An attacker can craft malicious inputs (e.g. `' OR '1'='1`) to manipulate query logic, bypass authentication, read unauthorized data, or delete tables.
> 
> Parameterized queries with `?` placeholders prevent SQL injection by strictly separating the SQL code structure from the user-supplied data:
> 1. The database engine compiles and parses the query structure with placeholders *first*.
> 2. The input values are subsequently bound to those placeholders strictly as **literal data**, never as executable SQL instructions.
> 3. Any special or dangerous characters (such as quotes or semicolons) are safely escaped automatically by the database driver.

### 3. When is PUT used instead of POST?
> **Answer:**
> - **Idempotency:** `PUT` is an idempotent HTTP method, meaning executing the exact same `PUT` request multiple times results in the same server state. `POST` is non-idempotent; sending the same `POST` request multiple times results in creating multiple duplicate records.
> - **Resource URI & Creation vs Modification:** `POST` is used to create a new subordinate resource where the server determines the new resource's URI and ID. `PUT` is used to update or replace an existing resource whose URI is already known (e.g. `/books/:bookId/`).

---

## Notes: Problems Faced and How You Solved Them

1. **Race Condition Between Database Connection and Server Startup:**
   - *Problem:* If the Express server starts listening before the SQLite database file connection is established, incoming client requests will fail because the `db` instance is `null`.
   - *Solution:* Implemented `initializeDBAndServer()` as an asynchronous function where `await open({ ... })` and table creation execute completely before `app.listen()` is invoked.

2. **Preventing SQL Injection with Dynamic Route Parameters:**
   - *Problem:* Passing `request.params.bookId` directly inside string literals (e.g. ``WHERE id = ${bookId}``) makes the application vulnerable to injection.
   - *Solution:* Enforced SQLite parameterized queries using `?` placeholders across all five route handlers (e.g., `await db.get("SELECT * FROM book WHERE id = ?;", [bookId])`).

3. **Accurate HTTP Status Codes for Resource Lifecycle:**
   - *Problem:* Standard Express routes often return generic 200 or 500 status codes, failing REST conventions.
   - *Solution:* Handled distinct scenarios with proper semantics: `201 Created` for `POST`, `404 Not Found` when a `bookId` does not exist in `GET`, `PUT`, or `DELETE`, and `400 Bad Request` when required JSON body fields are missing.
