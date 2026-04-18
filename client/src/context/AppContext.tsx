
import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface DetectionResult{
    severity : string
    severity_conf : number
    waste_type : string
    waste_conf : number
    tips : any
    image : string
}

interface AppContextType{
    result : DetectionResult | null
    setResult : (r: DetectionResult) => void
    location: string
    setLocation : (l: string) => void  // does not return anything
    demoMode : boolean
    setDemoMode : (d : boolean) => void
    
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({children}:{children: ReactNode}){
    const[result,setResult] = useState<DetectionResult|null>(null)
    const[location,setLocation] = useState<string>('')
    const[demoMode,setDemoMode] = useState<boolean>(false)

    return(
        <AppContext.Provider value ={{
            result, setResult,
            location, setLocation,
            demoMode, setDemoMode
        }}>
            {children}
        </AppContext.Provider>
    )
}


//Custom Hook -> to avoid repetition, messy code , safety check everytime
export function useApp(){
    const cont = useContext(AppContext)
    if(!cont) throw new Error("useApp must be used inside AppProvider")
    return cont
}