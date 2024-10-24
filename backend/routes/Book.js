const express = require('express');
const User    = require('../models/User'); 
const Book    = require('../models/Book'); 
const jwt     = require('jsonwebtoken');
const authenticateUser = require('./userAuth');

const router = express.Router();

// Create a new book (POST /books)
router.post('/', authenticateUser, async (req, res) => {
  try {

    const {id} = req.headers;
    const user = await User.findById(id);
    if(user.role !== "admin" && user.role!=="publisher")
    {   
        return res.status(400).json({ message: 'Admin or Publisher privilege required for this operation !'});    
    }

    const newBook = new Book({
      pub_id   : id,
      url      : req.body.url,
      title    : req.body.title,
      author   : req.body.author,
      price    : req.body.price,
      desc     : req.body.desc,
      language : req.body.language,
    });

    const savedBook = await newBook.save();
    res.status(201).json({"message":"Book added successfully"});
  } catch (error) {
    res.status(500).json({ message: 'Error creating the book', error });
  }
});

// Get all books (GET /books)
router.get('/', authenticateUser, async (req, res) => {
  try {
    const {pub_id}=req.headers;
    let query = {};
    if (pub_id) {
      query.pub_id = pub_id; // Filter by publisher ID if provided
    }

    const books = await Book.find(query).select('-pub_id ').sort({ createdAt: -1 });
    res.status(200).json({ status: "success", books });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error });
  }
});

// Get 4 recent books (GET /books)
router.get('/recent', authenticateUser, async (req, res) => {
    try {
      const books = await Book.find().sort({createdAt:-1}).limit(4);
      res.status(200).json({status:"success",books:books});
    } catch (error) {
      res.status(500).json({ message: 'Error fetching books', error });
    }
  });

// Get a single book by ID (GET /books/:id)
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const {id}=req.headers;
    const book = await Book.findById(req.params.id);
     if ( !book ||book.pub_id.toString() !== id) {
      return res.status(404).json({ message: 'Book not found or access denied' });
    }
   

    res.status(200).json({status:"success",book:book});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching the book', error });
  }
});

// Update a book (PUT /books)
router.put('/', authenticateUser, async (req, res) => {
  try {
    
    const {book_id,id} = req.headers;
  
    
    const book = await Book.findById(book_id);

    if ( !book ||book.pub_id.toString() !== id) {
      return res.status(404).json({ message: 'Book not found or access denied' });
    }
    existingBook = await Book.findByIdAndUpdate(book_id,{
        url      : req.body.url,
        title    : req.body.title,
        author   : req.body.author,
        price    : req.body.price,
        desc     : req.body.desc,
        language : req.body.language,
      });
      
      return res.status(200).json({"message":"Book Updated successfully","Book":existingBook});


  } catch (error) {
    res.status(500).json({ message: 'Error updating the book', error });
  }
});

// Delete a book (DELETE /books)
router.delete('/', authenticateUser, async (req, res) => {
  try {
    const {book_id,id} = req.headers;
    const book = await Book.findById(book_id);

    if ( !book ||book.pub_id.toString() !== id) {
      return res.status(404).json({ message: 'Book not found or access denied' });
    }
    await Book.findByIdAndDelete(book_id);

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting the book', error });
  }
});

module.exports = router;
