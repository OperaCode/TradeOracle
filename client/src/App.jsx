import "./App.css";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";

import { Route, Routes } from "react-router-dom";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        {/* <Route path="/" element={<Landing />} /> */}
        {/* <Route path="/home" element={<Home />} /> */}
        
      </Routes>

      
    </>
  );
}

export default App;
