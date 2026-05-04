import mongoose from 'mongoose'

const complaintSchema = new mongoose.Schema({
    complaint_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    waste_type: { type: String, required: true },
    severity: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
}, { timestamps: true })

export default mongoose.model("complaint", complaintSchema)