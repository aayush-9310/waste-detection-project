
import mongoose from 'mongoose'

const complaintSchema = new mongoose.Schema({
    complaint_id : {type : String, required : true, unique : true},
    location : {type : String},
    name : {type : String, required : true},
    contact : {type : Number, required : true},
    description : {type : String, default : ''},
    imageUrl: {type: String, default: ''},
    status: {type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending'},
    createdAt: {type: Date, default: Date.now }
})

export default mongoose.model("complaint",complaintSchema);