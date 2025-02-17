const express = require('express');
const bookRouter = express.Router();

// Book Data
let books = [
    { id: 1, title: "Pride and Prejudice", author: "Jane Austen", imageUrl: "/img-pride.jpg", year: 1813 },
    { id: 2, title: "Wuthering Heights", author: "Emily Brontë", imageUrl: "/img-wuthering.jpg", year: 1847 },
    { id: 3, title: "Jane Eyre", author: "Charlotte Brontë", imageUrl: "/img-jane.jpg", year: 1847 }
];

// Middleware to find a book by id
// req is object, which contains information about the incoming HTTP request
// res is object, which will be used to send a response back to the client
// next is called to pass control to the next middleware or route handler
// "Book not found" is show when the book-id is not found
function findBookById(req, res, next) {

    const requestedId = Number(req.params.id);

    const bookData = books.find(bookList => bookList.id === requestedId);

    if ( bookData !==  undefined) {
        req.book = bookData; 
        next();
    } else {
        res.status(404).send({ error: "Book not found" });
    }
}

// Create a new book using POST
// The data has to be the same as the previous data storage 
// Data must containt title, author, imageURl, year
// after select the methoh POST > need to go to body and send the req
bookRouter.post('/books', (req, res) => {
    const { title, author, imageUrl, year } = req.body;
    
    // if one of the date is missing the code 404 will show the message
    if (!title || !author || !imageUrl || !year) {
        return res.status(400).send({ error: "All fields are required" });
    }

    // add the new book with the data that match with title, author, imageUrl, year
    const newBook = { id: books.length + 1, title, author, imageUrl, year };
    books.push(newBook);

    res.status(201).send(newBook);
});

// Able to see all the books by using GET
bookRouter.get('/books', (req, res) => {
    res.send(books);
});

// Show individual book by using GET + only the id
bookRouter.get('/books/:id', findBookById, (req, res) => {
    res.send(req.book);
});

// Update a book by using PUT
// Any change require by adding the section require and send the req 
bookRouter.put('/books/:id', findBookById, (req, res) => {
    const { title, author, imageUrl, year } = req.body;

    if (title) req.book.title = title;
    if (author) req.book.author = author;
    if (imageUrl) req.book.imageUrl = imageUrl;
    if (year) req.book.year = year;

    res.send(req.book);
});

// Delete a book by using DELETE 
// indicate the id of the book and will delete and send the req
// The code 204 shows when id of book is send the req to be delete, 
// but the id of book has been deleted and no data can delete it
// The code 404 shows when the id is not found
bookRouter.delete('/books/:id', findBookById, (req, res) => {
    const requestedId = Number(req.params.id);

    // Find index of book
    const bookIndex = books.findIndex(book => book.id === requestedId);

    if (bookIndex !== -1) {
        books.splice(bookIndex, 1);

        // Message responde after the the book had been deleted
        res.status(204).send('Book deleted'); 

    } else {

        // Message responde with code 404 for not found
        res.status(404).send('Book not found');
    }
});


module.exports = bookRouter;

