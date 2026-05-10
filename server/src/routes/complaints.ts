import express from 'express'
import complaint from '../models/complaint.js'
import { verifyAdmin } from '../middleware/auth.js' 

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
            severity,
            timeline: [{ status: 'Pending', note: 'Complaint filed by citizen' }]
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

router.get('/', verifyAdmin, async (req, res) => {
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

// GET — public, track by complaint_id or email
router.get('/track', async (req, res) => {
    try {
        const q = req.query['q'] as string
        if (!q) {
            res.status(400).json({ error: 'Query required' })
            return
        }

        const found = await complaint.findOne({
            $or: [
                { complaint_id: q.toUpperCase() },
                { email: q.toLowerCase() }
            ]
        })

        if (!found) {
            res.status(404).json({ error: 'Complaint not found' })
            return
        }

        res.json({ complaint: found })
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: 'Failed to track complaint' })
    }
})

// PATCH — update status with note
router.patch('/:complaint_id', verifyAdmin, async (req, res) => {
    try {
        const { status, note } = req.body
        const validStatuses = ['Pending', 'Viewed', 'Forwarded', 'In Progress', 'Resolved']

        if (!status || !validStatuses.includes(status)) {
            res.status(400).json({ error: 'Invalid status' })
            return
        }

        const updated = await complaint.findOneAndUpdate(
            { complaint_id: req.params['complaint_id'] } as Record<string, unknown>,
            {
                $set: { status },
                $push: { timeline: { status, note: note || '', updatedAt: new Date() } }
            },
            { new: true }
        )

        if (!updated) {
            res.status(404).json({ error: 'Complaint not found' })
            return
        }

        res.json({
            msg: 'Status updated',
            complaint_id: updated.complaint_id,
            status: updated.status,
            timeline: updated.timeline
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: 'Failed to update status' })
    }
})

export default router    


