const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "books.db");
const PORT = process.env.PORT || 3000;

let db = null;

// Async function to open the database and start the server
async function initializeDBAndServer() {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Ensure the book table exists
    await db.exec(`
      CREATE TABLE IF NOT EXISTS book (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        price INTEGER NOT NULL,
        pages INTEGER NOT NULL
      );
    `);

    // Check if table needs initial seed data (8-10 rows)
    const countRow = await db.get("SELECT COUNT(*) AS count FROM book;");
    if (countRow.count === 0) {
      console.log("Database table 'book' is empty. Inserting initial seed records...");
      const seedBooks = [
        ["Clean Code", "Robert C. Martin", 650, 464],
        ["The Pragmatic Programmer", "Andrew Hunt & David Thomas", 720, 352],
        ["Design Patterns", "Erich Gamma et al.", 850, 395],
        ["You Don't Know JS Yet", "Kyle Simpson", 450, 280],
        ["JavaScript: The Good Parts", "Douglas Crockford", 380, 176],
        ["Introduction to Algorithms", "Thomas H. Cormen", 1200, 1312],
        ["Refactoring", "Martin Fowler", 790, 448],
        ["Database System Concepts", "Abraham Silberschatz", 950, 1376],
        ["Designing Data-Intensive Applications", "Martin Kleppmann", 1100, 616],
        ["Site Reliability Engineering", "Betsy Beyer et al.", 880, 550]
      ];

      const insertQuery = `
        INSERT INTO book (title, author, price, pages)
        VALUES (?, ?, ?, ?);
      `;

      for (const item of seedBooks) {
        await db.run(insertQuery, item);
      }
      console.log("Seeded 10 books into 'book' table.");
    }

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error(`DB Error: ${error.message}`);
    process.exit(1);
  }
}

// ----------------------------------------------------
// CRUD Routes
// ----------------------------------------------------

// 1. GET /books/ - Retrieve all books
app.get("/books/", async (request, response) => {
  try {
    const getBooksQuery = `
      SELECT *
      FROM book
      ORDER BY id ASC;
    `;
    const books = await db.all(getBooksQuery);
    response.status(200).json(books);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// 2. GET /books/:bookId/ - Retrieve a single book by ID
app.get("/books/:bookId/", async (request, response) => {
  try {
    const { bookId } = request.params;
    const getBookQuery = `
      SELECT *
      FROM book
      WHERE id = ?;
    `;
    const book = await db.get(getBookQuery, [bookId]);

    if (!book) {
      return response.status(404).json({ error: `Book with id ${bookId} not found` });
    }

    response.status(200).json(book);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// 3. POST /books/ - Add a new book
app.post("/books/", async (request, response) => {
  try {
    const { title, author, price, pages } = request.body;

    // Validate required fields
    if (!title || !author || price === undefined || pages === undefined) {
      return response.status(400).json({
        error: "Missing required fields: title, author, price, and pages are required"
      });
    }

    const addBookQuery = `
      INSERT INTO book (title, author, price, pages)
      VALUES (?, ?, ?, ?);
    `;

    const result = await db.run(addBookQuery, [title, author, price, pages]);

    response.status(201).json({
      message: "Book Added Successfully",
      bookId: result.lastID
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// 4. PUT /books/:bookId/ - Update an existing book
app.put("/books/:bookId/", async (request, response) => {
  try {
    const { bookId } = request.params;
    const { title, author, price, pages } = request.body;

    // Check if the book exists first
    const checkBookQuery = `
      SELECT *
      FROM book
      WHERE id = ?;
    `;
    const existingBook = await db.get(checkBookQuery, [bookId]);

    if (!existingBook) {
      return response.status(404).json({ error: `Book with id ${bookId} not found` });
    }

    // Validate update fields
    if (!title || !author || price === undefined || pages === undefined) {
      return response.status(400).json({
        error: "Missing required fields: title, author, price, and pages are required"
      });
    }

    const updateBookQuery = `
      UPDATE book
      SET
        title = ?,
        author = ?,
        price = ?,
        pages = ?
      WHERE id = ?;
    `;

    await db.run(updateBookQuery, [title, author, price, pages, bookId]);

    response.status(200).json({
      message: "Book Updated Successfully"
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// 5. DELETE /books/:bookId/ - Remove a book
app.delete("/books/:bookId/", async (request, response) => {
  try {
    const { bookId } = request.params;

    // Check if the book exists first
    const checkBookQuery = `
      SELECT *
      FROM book
      WHERE id = ?;
    `;
    const existingBook = await db.get(checkBookQuery, [bookId]);

    if (!existingBook) {
      return response.status(404).json({ error: `Book with id ${bookId} not found` });
    }

    const deleteBookQuery = `
      DELETE FROM book
      WHERE id = ?;
    `;

    await db.run(deleteBookQuery, [bookId]);

    response.status(200).json({
      message: "Book Deleted Successfully"
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// Start the server
initializeDBAndServer();

module.exports = app;

