

  const Listing = require('./models/listing.js');
  const Review = require('./models/review.js');
  const {listingSchema} = require('./schema.js');  //using joi package that we import in schema.js
  const {reviewSchema} = require('./schema.js');  //using joi package that we import in schema.js
 

  const expressError = require('./utils/expressError.js')


   module.exports.isLoggedIn=(req,res,next)=> {
   
    if(!req.isAuthenticated()){
     // console.log(req.originalUrl) //here in req,all the info of user stored.
      req.session.redirectUrl = req.originalUrl;  //jaha user jana tha usko save krege..taaki login krwakr redirect kr ske,isliye session m store kiya.

      req.flash("errorMsg","You must be logged in to do this operation.")
         return res.redirect("/login");  
       
  }
    next();
  
  };

    module.exports.saveRedirectUrl=(req,res,next)=>{
      if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }  
    next();
  }


    //to authorized the user..
  module.exports.isOwner= async (req,res,next)=>{
    let {id} = req.params;              
    let listing=  await Listing.findById(id);  //here it is id of listing..
    
    if(!listing.owner.equals(res.locals.currentUser._id))
    {
       req.flash("errorMsg","You don't have permission. ")
   return res.redirect(`/listings/${id}`);
    } 
    next();
  };

   
  



   //validateListing function
   module.exports.validateListing = (req,res,next)=>{
    let {error} =listingSchema.validate(req.body)
          if(error){
            let errMsg = error.details.map((el)=>el.message).join(",");  //just to pass error message we wrote this line. we can directly pass error too instead of message,but message looks good to user.
            throw new expressError(400,errMsg);
          } 
          else{
            next();
          }
      }
      //validate Review middleware
  
     module.exports.validateReview = (req,res,next)=>{
        let {error} =reviewSchema.validate(req.body)
            
          
              if(error){
               
                let errMsg = error.details.map((el)=>el.message).join(",");
                throw new expressError(400,errMsg);
               
              } 
             
              else{
                next();
              }
          };
      
           //to authorized the review author...review ka author verify krege..
    module.exports.isReviewAuthor= async (req,res,next)=>{
      let {id,reviewId} = req.params;              
      let review=  await Review.findById(reviewId);  //here it is id of listing..
      
      if(!review.author.equals(res.locals.currentUser._id))
      {
         req.flash("errorMsg","You are not the author of these review. ")
     return res.redirect(`/listings/${id}`);
      } 
      next();
    };