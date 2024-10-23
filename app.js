const express = require('express');
const app =  express();
const port = 8080;
const mongoose = require('mongoose');
const ejs = require('ejs');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require('./schema.js');

// ########################################################################################
//models requirements
const Listing = require("./models/listing.js");
// ########################################################################################

// ########################################################################################
//ejs setup

const path = require('path');
const { wrap } = require('module');
app.set("view engine" , "ejs");
app.set("views",path.join(__dirname,"view"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
// ########################################################################################

// ===================================================================>>
//mongo connections
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
.then(result=>{  console.log("connected to the DB");  })
.catch(err=>{ console.log(err); });
async function main() {
    
    await mongoose.connect(MONGO_URL);
}
// ===================================================================>>


const validateListing = (req , res , next)=>{
    let {error}= listingSchema.validate(req.body);
                    // console.log(result);
                    if(error)
                    {
                        let errMsg = error.details.map((el)=> el.message).join(",");
                        throw new ExpressError(400 , "error");
                    }
                    else
                    {
                        next();
                    }
}


// ################################################################################################################################

//all routes
                // ===================================================================>>
                // default route
                app.get("/",(req , res )=>{ 
                    res.send("working correctly");
                });
                // ===================================================================>>


                // ===================================================================>>
                //index route
                app.get("/listings",wrapAsync( async(req , res)=>{

                    const  allListings=await Listing.find();
                    res.render("listings/index.ejs" , {allListings});    
                }));
                // ===================================================================>>

                // ===================================================================>>
                //new route
                app.get("/listings/new",(req , res)=>{
                    res.render("listings/new.ejs");
                });

                // ===================================================================>>

                // ===================================================================>>
                //(show) route
                app.get("/listings/:id",wrapAsync( async(req , res)=>{

                    let {id} = req.params;
                    const listing =   await Listing.findById(id)
                    res.render("listings/show.ejs",{listing});

                }));

                // ===================================================================>>


                // ===================================================================>>
                //create route
                app.post("/listings",validateListing,wrapAsync( async (req ,res, next)=>{
                    // const {title ,description ,image ,price ,location} = req.body;
                    let listing = req.body.listing;
                    const newlisting =  await new Listing(listing);
                    await newlisting.save();
                    res.redirect("/listings");  
            
                }));
                // ===================================================================>>


                // ===================================================================>>
                //edit route
                app.get("/listings/:id/edit",wrapAsync( async(req ,res )=>{
                    let {id} = req.params;
                    const listing= await Listing.findById(id);
                    res.render("listings/edit.ejs",{listing});
                }));

                //update route
                app.put("/listings/:id",validateListing,wrapAsync( async (req , res)=>{

                    if(!req.body.listing)
                        {
                                throw new ExpressError(404 , "Send Valid data for listings");
                        }
                    let {id} = req.params;
                    let listing = req.body.listing;
                    await Listing.findByIdAndUpdate(id,{...listing});
                    res.redirect(`/listings/${id}`);
                }));
                // ===================================================================>>



                // ===================================================================>>
                //delete route
                app.delete("/listings/:id",wrapAsync( async (req , res )=>{

                        let {id} =req.params;
                        await Listing.findByIdAndDelete(id);
                        res.redirect("/listings");
                }));

                // ===================================================================>>
// #############################################################################################################


// ===================================================================>>
app.all("*",(req , res , next)=>{

    next( new ExpressError(404 , "Page Not Found"));
});
// ===================================================================>>


// ===================================================================>>
//middleware
app.use((err , req, res ,next)=>{
    
    let {statusCode = 500 , message= "Some thing went wrong"} = err;
    res.render("error.ejs",{err});
    // res.status(statusCode).send(message);
});



// ===================================================================>>


app.listen(port , ()=>{

    console.log(`listening on the port ${port}`);
});
