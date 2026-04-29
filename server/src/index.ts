
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import detectRouter from './routes/detect.js'
import complaintRouter from './routes/complaints.js'

dotenv.config()


const app = express()
app.use(express.json())
app.use(cors())

app.use('/api/detect' , detectRouter)
app.use('/api/complaints' , complaintRouter)

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

