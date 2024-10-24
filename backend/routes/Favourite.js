const router=require("express").Router();
const User    = require('../models/User'); 
const authenticateToken = require('./userAuth');

router.put('/add-book-to-favourite', authenticateToken, async (req, res) => {
    try {
      const {bookid,id} = req.headers;
      const userData=await User.findById(id);
      const isBookFavourite=userData.favourites.includes(bookid)

      if(isBookFavourite)
      {return res.status(200).json({message:"Book already added in favourites"})}
      await User.findByIdAndUpdate(id,{$push:{favourites:bookid}})
      res.status(200).json({message:"Book  added in favourites"});
    } catch (error) {
      res.status(500).json({ message: 'Error fetching the book', error });
    }
  });
  
router.delete('/remove-book-from-favourite', authenticateToken, async (req, res) => {
    try {
      const {bookid,id} = req.headers;
      const userData=await User.findById(id);
      const isBookFavourite=userData.favourites.includes(bookid)
      if(!isBookFavourite)
      {await User.findByIdAndUpdate(id,{$pull:{favourites:bookid}})}
      
      res.status(200).json({message:"Book  removed from favourites"});
    } catch (error) {
      res.status(500).json({ message: 'Error fetching the book', error });
    }
  });

router.get('/get-favourite-books', authenticateToken, async (req, res) => {
    try {
      const {id} = req.headers;

      const userData= await User.findById(id).populate("favourites");
      const favouriteBooks=userData.favourites
      return res.json({
        status:"Success",
        data:favouriteBooks,
      })
    } catch (error) {
      res.status(500).json({ message: 'Error fetching the book', error });
    }
  });

module.exports=router;