
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

async function main(){
    try{
        await mongoose.connect(process.env.MONGO_URL!);
        app.listen(3000, ()=> console.log("running on port 3000"))

        console.log("db connected")
    }
    catch(e){
        console.log("db error : " ,e)
    }
}

app.get("/", (req,res)=>{
    res.json({
        msg : "Waste detection "
    })
})

main();

