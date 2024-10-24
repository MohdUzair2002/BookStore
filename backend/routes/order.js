const router=require("express").Router();
const User    = require('../models/User'); 
const Books    = require('../models/Book'); 
const authenticateToken = require('./userAuth');

router.get('/get-order-history', authenticateToken, async (req, res) => {
    try {
      const {id} = req.headers;
      const userData = await user.findById(id).populate({
        path:"orders",
        populate:{path:"book"},
      });
      
      const orderData=userData.orders.reverse();
      return res.json(
        {
           status:"Sucess",
           message:"Status Updated Sucessfully"

        }
       );
      
    } catch (error) {
      res.status(500).json({ message: 'An error Ocurred', error });
    }
  });

router.put('/update-status/:id', authenticateToken, async (req, res) => {
    try {
        const {id}=req.params;
        await Order.findByIdAndUpdate(id,{status:req.body.status});
        
        return res.json(
            {
               status:"Sucess",
               message:"Order Placed Sucessfully"
    
            }
           );
      
    } catch (error) {
      res.status(500).json({ message: 'An error Ocurred', error });
    }
  });
router.get('/get-all-orders', authenticateToken, async (req, res) => {
    try {
      const userData = await Order.find()
      .populate({
        path:"book",
      })
      .populate({
        path:"user",
      })
      .sort({createdAt:-1});
      return res.json(
        {
           status:"Sucess",
           message:"Order Placed Sucessfully"

        }
       );
      
    } catch (error) {
      res.status(500).json({ message: 'An error Ocurred', error });
    }
  });
router.post('/place-order', authenticateToken, async (req, res) => {
    try {
      const {id} = req.headers;
      const {order} = req.body;
      for (const orderData of order)
      {const neworder =new Order ({user:id,book:orderData._id});
       const orderDataFromDb=await neworder.save();
       
       //saving order in user model
       await user.findByIdAndUpdate(id,{
        $push:{orders:orderDataFromDb._id},
       });
       //clearing cart
       await user.findByIdAndUpdate(id,{
        $pull:{cart:orderData._id},
       });
       
      }
 
      return res.json(
        {
           status:"Sucess",
           message:"Order Placed Sucessfully"

        }
       );
      
    } catch (error) {
      res.status(500).json({ message: 'An error Ocurred', error });
    }
  });