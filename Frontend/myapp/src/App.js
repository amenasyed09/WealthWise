import React from "react";
import NavbarRouting from "./Components/NavbarRouting";
import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
function App() {
  console.log(`API URL: ${process.env.REACT_APP_API_URL}`)
  return (
    <React.StrictMode> <NavbarRouting/></React.StrictMode>


  );  
}

export default App;
