const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");

// Create a new order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// Get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (!order) {
    return next(new ErrorHandler("Order not found with this id", 400)); // Change status code to 404
  }
  res.status(200).json({
    success: true,
    order,
  });
});

// Get Logged-in User Orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id }); // Change from findById to find

  res.status(200).json({
    success: true,
    orders,
  });
});


// Get all Orders --Admin
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find(); 
  let totalAmount=0;
  orders.forEach(order=>{
    totalAmount +=order.totalPrice;
  })

  res.status(200).json({
    success: true,
    orders,
  });
});

//update Order status --Admin
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler('Order not found with this id', 404));
  }

  if (order.orderStatus === 'Delivered') {
    return next(new ErrorHandler('You have already delivered this order', 400));
  }

  for (const orderItem of order.orderItems) {
    await updateStock(orderItem.product, orderItem.quantity);
  }

  order.orderStatus = req.body.status;

  if (req.body.status === 'Delivered') {
    order.deliveredAt = Date.now();
  }

  await order.save({validateBeforeSave:false});

  res.status(200).json({
    success: true,
    order,
  });
});

async function updateStock(id,quantity){
  const product= await Product.findById(id)
}



