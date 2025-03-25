const express=require("express")
const mongoose=require("mongoose")
const dotenv=require("dotenv")
require('dotenv').config()

const app=express()
const port=process.env.port||5000
const uri=process.env.MONGO_URI

app.use(express.json())

mongoose.connect(uri)
.then(()=>{
    console.log("mongoDB connected succesfully")
})
.catch((err)=>{
    console.log("error connecting mongoDB",err)
})

app.get("/",()=>{
    res.send("app is working")
})

//Schemas:

const restaurantSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    cuisine:{
        type:String,
        required:true
    },
    rating:{
        type:Number
    },
    menu:{
        type:Array
    }
})

module.exports=mongoose.model("Restaurant",restaurantSchema)



//CRUD operations:
app.post("/creat",async(req,res)=>{
    const {name,location,cuisine,rating}=req.body
    if(!name||!location||!cuisine||!rating){
        res.json({message: "All fields are required"})
    }
    try{
    const Restaurant= new Restaurant({name,location,cuisine,rating})
    await Restaurant.save()
    res.json(Restaurant)
    }
    catch(error){
        res.status(400).json({message: error.message})
    }
})


app.get("/geting/:id",async(req,res)=>{
    try{
        const{id}=req.params
        const restaurant= await Restaurant.findById(id)
        if(!restaurant){
            res.status(404).json({message: "Restaurant not found"})
        }
        res.status(200).json(restaurant)
    }
    catch(error){
        res.json({message: error.message})
    }
})


app.put("/updating/:id",async(req,res)=>{
    try{
        const{id}=req.params
        const {name,location,cuisine,rating}=req.body
        const updatedRestaurant= await Restaurant.findByIdAndUpdate(id,{name,location,cuisine,rating},{new:true})
        if(!updatedRestaurant){
            res.status(500).json({message: "Something went wrong"})
        }
        res.status(200).json(updatedRestaurant)
    }
    catch(error){
        res.json({message: error.message})
    }
})



app.put("/deleting/:id",async(req,res)=>{
    try{
        const{id}=req.params
        const deletedRestaurant= await Restaurant.findByIdAndDelete(id)
        if(!deletedRestaurant){
            res.json({message: "Restaurant is not found"})
        }
        res.status(200).json(deletedRestaurant)
    }
    catch(error){
        res.json({message: error.message})
    }
})



app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}`)
})