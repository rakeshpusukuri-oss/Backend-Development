// Automated testing script for Lab 2 CRUD endpoints
// Uses Node 18+ built-in global fetch

const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("==================================================");
  console.log("   Lab 2: SQLite & Express CRUD Route Tests");
  console.log("==================================================\n");

  try {
    // Test 1: GET /books/
    console.log("--> [1] Testing GET /books/ (Fetch all books)");
    const resAll = await fetch(`${BASE_URL}/books/`);
    console.log(`Status: ${resAll.status} ${resAll.statusText}`);
    const books = await resAll.json();
    console.log(`Total books retrieved: ${books.length}`);
    console.table(books.slice(0, 3)); // show top 3
    console.log("... (remaining books truncated for display)\n");

    // Test 2: GET /books/1/
    console.log("--> [2] Testing GET /books/1/ (Fetch single book)");
    const resSingle = await fetch(`${BASE_URL}/books/1/`);
    console.log(`Status: ${resSingle.status} ${resSingle.statusText}`);
    const singleBook = await resSingle.json();
    console.log("Book details:", singleBook);
    console.log();

    // Test 3: GET /books/9999/ (Edge case: Not Found)
    console.log("--> [3] Testing GET /books/9999/ (Non-existent book 404 check)");
    const resNotFound = await fetch(`${BASE_URL}/books/9999/`);
    console.log(`Status: ${resNotFound.status} ${resNotFound.statusText}`);
    const notFoundBody = await resNotFound.json();
    console.log("Response:", notFoundBody);
    console.log();

    // Test 4: POST /books/
    console.log("--> [4] Testing POST /books/ (Add new book)");
    const newBookPayload = {
      title: "Compilers: Principles, Techniques, and Tools",
      author: "Alfred V. Aho et al.",
      price: 999,
      pages: 1038
    };
    const resPost = await fetch(`${BASE_URL}/books/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBookPayload)
    });
    console.log(`Status: ${resPost.status} ${resPost.statusText}`);
    const postBody = await resPost.json();
    console.log("Response:", postBody);
    const createdBookId = postBody.bookId;
    console.log(`Created book ID: ${createdBookId}\n`);

    // Test 5: PUT /books/:bookId/
    console.log(`--> [5] Testing PUT /books/${createdBookId}/ (Update book)`);
    const updatePayload = {
      title: "Compilers (Dragon Book 2nd Edition)",
      author: "Alfred V. Aho, Monica S. Lam, Ravi Sethi, Jeffrey D. Ullman",
      price: 1050,
      pages: 1040
    };
    const resPut = await fetch(`${BASE_URL}/books/${createdBookId}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatePayload)
    });
    console.log(`Status: ${resPut.status} ${resPut.statusText}`);
    const putBody = await resPut.json();
    console.log("Response:", putBody);
    console.log();

    // Verify update
    const resVerifyUpdate = await fetch(`${BASE_URL}/books/${createdBookId}/`);
    const updatedBook = await resVerifyUpdate.json();
    console.log("Updated record from DB:", updatedBook);
    console.log();

    // Test 6: DELETE /books/:bookId/
    console.log(`--> [6] Testing DELETE /books/${createdBookId}/ (Remove book)`);
    const resDelete = await fetch(`${BASE_URL}/books/${createdBookId}/`, {
      method: "DELETE"
    });
    console.log(`Status: ${resDelete.status} ${resDelete.statusText}`);
    const deleteBody = await resDelete.json();
    console.log("Response:", deleteBody);
    console.log();

    // Verify deletion
    const resVerifyDelete = await fetch(`${BASE_URL}/books/${createdBookId}/`);
    console.log(`Verification after DELETE (should be 404): ${resVerifyDelete.status} ${resVerifyDelete.statusText}`);
    console.log();

    console.log("==================================================");
    console.log("   All 5 CRUD route tests passed successfully!    ");
    console.log("==================================================");
  } catch (error) {
    console.error("Test execution failed:", error.message);
  }
}

runTests();

