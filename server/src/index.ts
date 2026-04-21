
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
        const PORT = process.env.PORT || 8000;
        app.listen(PORT, ()=> console.log(`Running on Port ${PORT}`))

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

