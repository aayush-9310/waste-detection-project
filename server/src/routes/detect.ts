
import express from 'express'
import multer from 'multer'
import axios from 'axios'
import dotenv from 'dotenv'
import FormData from 'form-data'             

dotenv.config()

const router = express.Router()


// multer : to store image in memory temporarily
const storage = multer.memoryStorage()
const upload = multer({
    storage,
    limits : {fileSize : 5 * 1024 * 1024},
    fileFilter : (req,file,cb) =>{
        if(file.mimetype.startsWith('image/')){
            cb(null, true)
        }else{
            cb(new Error('Only image files allowed'))
        }
    }
})


router.post('/',upload.single('file'), async(req,res)=>{
    try{
        if(!req.file){
            res.status(400).json({ error : "No image uploaded"})
            return
        }

        const formData = new FormData()
        formData.append('file', req.file.buffer, {
            filename : req.file.originalname,
            contentType : req.file.mimetype
        })

        const url = process.env.ML_SERVICE_URL + "/predict";

        const mlResponse = await axios.post(
            url,
            formData,
            {
                headers: formData.getHeaders()
            }
        );

        const result = mlResponse.data;
        

        // converting image to base64 text and then into url so it can be displayed on frontend
        const imageBase64 = req.file.buffer.toString('base64');
        const imageDataUrl = `data:${req.file.mimetype};base64,${imageBase64}`

        // these properties we getting from the ml model response
        res.json({
            severity : result.severity,
            severityConf : result.severity_conf,
            wasteType : result.waste_type,
            waste_conf : result.waste_conf,
            tips : result.tips,
            image : imageDataUrl
        })
    }
    catch(e){
        res.json({
            msg : "some error occured"
        })
    }
})

export default router
