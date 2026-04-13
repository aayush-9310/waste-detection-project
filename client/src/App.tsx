import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='text-3xl font-bold text-red-600 text-center pt-1'>  
        <div className='mt-20'>
          <h1>Waste Detection & Complaint Generation</h1>
        </div>
      </div>
    </>
  )
}

export default App
