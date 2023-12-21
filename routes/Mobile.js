const express = require('express');
const router = express.Router();
const Order= require("../models/Order")
const Mobile = require('../models/Mobile');
const isUser= require("../middlewares/userAuthentication")
require('dotenv').config();
const multer = require('multer');
const Razorpay = require("razorpay") ;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post('/create', isUser, async (req, res) => {
  const { name, price, type, processor, memory, os,imageUrl, createdBy} = req.body;

  try {
    const mobile = new Mobile({
      name,
      price,
      type,
      processor,
      memory,
      os,
      imageUrl,
      createdBy
    });
    
    // Save the mobile to the database
    const savedMobile = await mobile.save();
    console.log(savedMobile)
    // Add any additional logic, like clearing cache or updating related data
    res.status(201).json(savedMobile);
  } catch (error) {
    console.error('Error creating mobile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  
router.get('/getAll', async (req, res) => {
  try {
    const mobiles = await Mobile.find();
    res.json(mobiles);
  } catch (error) {
    console.error('Error getting mobiles:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/get/:mobileId', isUser, async (req, res) => {
  const { mobileId } = req.params;
  try {
    const mobile = await Mobile.findById(mobileId);

    if (!mobile) {
      return res.status(404).json({ error: 'Mobile not found' });
    }
    res.json(mobile);
  } catch (error) {
    console.error('Error getting mobile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.put('/:mobileId', isUser, async (req, res) => {
  const { mobileId } = req.params;
  try {
    const { name, price, type, processor, memory, os } = req.body;

    const updatedMobile = await Mobile.findByIdAndUpdate(
      mobileId,
      { name, price, type, processor, memory, os },
      { new: true }
    );

    if (!updatedMobile) {
      return res.status(404).json({ error: 'Mobile not found' });
    }

    res.json(updatedMobile);
  } catch (error) {
    console.error('Error updating mobile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:mobileId', isUser, async (req, res) => {
  const { mobileId } = req.params;
  try {
    const deletedMobile = await Mobile.findByIdAndDelete(mobileId);

    if (!deletedMobile) {
      return res.status(404).json({ error: 'Mobile not found' });
    }

    res.json(deletedMobile);
  } catch (error) {
    console.error('Error deleting mobile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/search', isUser, async (req, res) => {
  try {
    const { query } = req.query;

    const mobiles = await Mobile.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { type: { $regex: query, $options: 'i' } },
        { processor: { $regex: query, $options: 'i' } },
        { os: { $regex: query, $options: 'i' } },
      ],
    });

    res.json(mobiles);
  } catch (error) {
    console.error('Error searching mobiles:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post('/razorpay', async (req, res) => {
const payment_capture = 1

const currency = 'INR'
const imageUrl=req.body.imageUrl;
const title=req.body.title;
const createdBy=req.body.createdBy
const price=req.body.price
const receipt=req.body.oid
const options = {
  amount: req.body.price*100,
  currency,
  receipt: receipt,
  payment_capture
}

try {
  const response = await razorpay.orders.create(options)
  //await Order.collection.dropIndex('name_1');
  console.log(response)
  const order= new Order({
    title,
    price,
    currency,
    receipt,
    payment_capture,
    createdBy,
    imageUrl
  })
  
  const savedPayment = await order.save();
  console.log(savedPayment)
  res.json({
    id: response.id,
    currency: response.currency,
    amount: response.amount,
    savedPayment
  })
} catch (error) {
  console.log(error)
}
})


router.get('/order/:username', async (req, res) => {
  try {
    // Find all orders related to the user
    const orders = await Order.find({ createdBy: req.params.username });

    res.json(orders);
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


  module.exports = router;