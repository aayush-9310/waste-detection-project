
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home'
import Result from './pages/Result'
import Complaints from './pages/Complaints'


function App(){
  return<>
    <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<Home />} />
        <Route path = "/result" element = {<Result />} />
        <Route path = "/complaints" element = {<Complaints />} />
      </Routes>
    </BrowserRouter>
  </>
}

export default App