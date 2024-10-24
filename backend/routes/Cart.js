const express          = require('express');
const User             = require('../models/User');
const authenticateUser = require('./userAuth');

const router = express.Router();

router.put    ('/add-to-cart' , authenticateUser, async (req, res) => {
  try {
    
    const {id,bookid} = req.headers;
    
    const userData = await User.findById(id);

    const isBookInCart = userData.cart.includes(bookid);
    
    if(isBookInCart){

        return res.status(200).json({"message":"Book already in cart."}); 
    }

    await User.findByIdAndUpdate(id,{$push :{cart:bookid}});
    return res.status(200).json({"message":"Book added to cart."});


  } catch (error) {
    res.status(500).json({ message: 'Error while adding book to cart.', error });
  }
});

router.delete ('/remove-from-cart' , authenticateUser, async (req, res) => {
    try {
      
      const {id,bookid} = req.headers;
      
      const userData = await User.findById(id);
  
      const isBookInCart = userData.cart.includes(bookid);
      
      if(isBookInCart){
        await User.findByIdAndUpdate(id,{$pull :{cart:bookid}});
        return res.status(200).json({"message":"Book removed from cart."});     
      }else{

        return res.status(404).json({"message":"Book not found in cart."});

      }
  
    } catch (error) {
      res.status(500).json({ message: 'Error while removing Book from cart.', error });
    }
});
  
router.get    ('/get-books-from-cart' , authenticateUser, async (req, res) => {
    try {

        const {id} = req.headers;
        const userData = await User.findById(id).populate("cart");
        const Books    = userData.cart.reverse();
        
        res.status(200).json({status:"success",cart:Books});
    
    } catch (error) {
      res.status(500).json({ message: 'Error fetching books in cart.', error });
    }
});

module.exports = router;
