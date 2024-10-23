const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({

    title:{
     type:String,
     require:true,
    },
    description:String,
    image:{
      type:String,
      set:(v)=> v === "" ? "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dmlsbGF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60" : v,
      default:"https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dmlsbGF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
    },
    price:Number,
    location:String,
    country:String
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;