
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Navbar from "../components/Navbar"
import axios from 'axios'

export default function Home(){
    const { setResult } = useApp()
    const navigate = useNavigate()

    const [image, setImage] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    function handleImage(e: React.ChangeEvent<HTMLInputElement>){    // event occur when the html input element changes
        const file = e.target.files?.[0]          // when the type = 'file' in input then whether the user select one or more file --> browser always give you a list (array)
        if(!file) return 
        setImage(file)
        const url = URL.createObjectURL(file)     // this is the browser API that temporarily create a link for the file
        setPreview(url)
    }

    async function handleDetect(){
        if(!image) return
        setLoading(true)

        const formData = new FormData()
        formData.append("file",image)

        try{
            const res = await axios.post('http://localhost:5001/predict', formData)
            const data = res.data

            // adding preview image coz preview is generated on frontend using browser Api to create image url ,to display uploading image on result page
            setResult({...data,image : preview})  
            navigate('/result')
        }
        catch(e){
            alert('May be ML server not Running')
            console.log("error ye h : ",e)
        }
        finally{
            setLoading(false)
        }
    }

    return(
        <div>
            <Navbar />
            <div className='max-w-md max-auto px-4 py-10'>
                <h1 className='text-white text-4xl font-medium mb-2'>Waste Detection & Complaint System</h1>
                <p className='text-slate-400 text-sm mb-8'>Upload a photo of waste</p>

                <div className='mb-4'>
                    <input type="file" accept="image/*" onChange={handleImage} className='text-slate-300 text-sm'/>
                </div>

                {preview && (
                    <div>
                        {/* object-contain makes the image fit completely in the container without getting cropped */}
                        <img src={preview} alt="🤨" className='w-200 rounded-lg max-h-300 object-contain' />   
                    </div>
                )}

                <button onClick = {handleDetect} disabled = {!image || loading} className='bg-green-500 text-white px-6 py-2 rounded-lg'>
                    {loading ? 'Detecting...': 'Detect Waste'}
                </button>

            </div>
        </div>
    )
}