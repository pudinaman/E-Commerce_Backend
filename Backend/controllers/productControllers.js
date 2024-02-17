const Product=require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors=require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");

//Create Product--Admin
exports.createProduct=catchAsyncErrors(async(req,res,next)=>{
     req.body.user=req.user.id
    const product =await Product.create(req.body);
    res.status(201).json({
     success:true,
     product
    });
 });
//get all products
exports.getAllProducts=catchAsyncErrors(async(req,res)=>{
    const resultPerPage=5;
    const productCount=await Product.countDocuments();

  
    const apiFeature=new ApiFeatures(Product.find(),req.query)
    .search()
    .filter().pagination(resultPerPage);//search feature
    const products =await apiFeature.query;
    res.status(200).json({
        success:true,
        products,
        productCount

});
});

//Get product details
exports.getProductDetails=catchAsyncErrors(async(req,res,next)=>{
    const product =await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("product not found",404));
        }
    

    res.status(200).json({
        succes:true,
        product
    })
})

//update product--admin
exports.updateProduct = catchAsyncErrors(async(req,res)=>{
    let product=Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("product not found",404));
        }

    product=await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });
    res.status(200).json({
        success:true,
        product
    })
})
//delete product
exports.deleteProduct = catchAsyncErrors(async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
  
      if(!product){
        return next(new ErrorHandler("product not found",404));
        }
  
      await product.deleteOne();
      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
  
    // Create a review object
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
  
    // Find the product by ID
    const product = await Product.findById(productId);
  
    // Check if the user has already reviewed the product
    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
  
    // If the user has already reviewed, update the existing review
    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString()) {
          rev.rating = Number(rating);
          rev.comment = comment;
        }
      });
    } else {
      // If the user has not reviewed, add a new review
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }
  
    // Calculate the average rating
    let avg = 0;
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
    product.ratings = avg / product.reviews.length;
  
    // Save the updated product
    await product.save({ validateBeforeSave: false });
  
    // Send a success response
    res.status(200).json({
      success: true,
    });
  });