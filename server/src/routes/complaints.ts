
import express from 'express'
import complaint from '../models/complaint.js'

const router = express.Router()

// generate complaint ID
const generateId = () =>{
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let id = 'WD'
    for(let i = 0; i< 6; i++){
        id += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return id
}



// this function get called when the model detects high severity
router.post("/", async(req,res)=>{
    try{
        const {name, contact, location, description, imageUrl} = req.body
        
        if(!name || !contact || !location){
            res.status(400).json({
                error : "Name, contact and location are required"
            })
            return
        }

        // creating the complaint
        const Complaint = await complaint.create({
            complaint_id : generateId(),
            name,
            contact,
            location,
            description,
            imageUrl
        })


        res.status(201).json({
            msg : "Complaint Filed Successfully !!",
            status : Complaint.status,
            createdAt : Complaint.createdAt
        })
    }
    catch(e){
        console.error("complaint error : ",e)
        res.status(500).json({
            error : 'Failed to file complaint'
        })
    }
})

// fetch all the complaints
router.get('/', async(req,res)=>{
    try{
        const Complaints = await complaint.find().sort({ createdAt : -1 })
        res.json({
            total : Complaints.length,
            Complaints     // all complaints get shown
        })
    }catch(e){
        res.status(500).json({
            error : 'Failed to Fetch Complaints'
        })
    }
})

export default router