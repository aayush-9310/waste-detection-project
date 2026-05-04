import express from 'express'
import complaint from '../models/complaint.js'

const router = express.Router()

const generateId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let id = 'WD'
    for (let i = 0; i < 6; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return id
}

router.post("/", async (req, res) => {
    try {
        const { name, contact, email, location, description, imageUrl, waste_type, severity } = req.body

        if (!name || !contact || !email || !location || !waste_type || !severity) {
            res.status(400).json({ error: "name, contact, email, location, waste_type and severity are required" })
            return
        }

        const newComplaint = await complaint.create({
            complaint_id: generateId(),
            name,
            contact,
            email,
            location,
            description,
            imageUrl,
            waste_type,
            severity
        })

        res.status(201).json({
            msg: "Complaint Filed Successfully",
            complaint_id: newComplaint.complaint_id,
            status: newComplaint.status,
            createdAt: newComplaint.createdAt
        })
    } catch (e) {
        console.error("complaint error:", e)
        res.status(500).json({ error: 'Failed to file complaint' })
    }
})

router.get('/', async (req, res) => {
    try {
        const complaints = await complaint.find().sort({ createdAt: -1 })
        res.json({
            total: complaints.length,
            complaints
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: 'Failed to fetch complaints' })
    }
})

export default router