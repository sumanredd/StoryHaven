'use client'
import { useState,useEffect } from "react"
import Navbar from "./components/NavBar/page"
import CategoryMenuHover from "./components/NavBar/categoryDropdown"
import Home from "./components/home/page"
const HomePage=()=>{
  return (
    <div>
      
      <div className="HomeBg">
        <Home/>
      </div>
    </div>
  )
}
export default HomePage