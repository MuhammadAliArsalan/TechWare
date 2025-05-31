import { useEffect } from "react"
import React from "react"
import { useNavigate } from "react-router-dom"

const Failure = () => {

    const navigate=useNavigate();

     useEffect(() => {
            const timer = setTimeout(() => {
              navigate("/"); // Homepage
            }, 5000);
        
            return () => clearTimeout(timer);
          }, [navigate]);

    return (
        <>
            <h2>Something went wrong</h2>
        </>
    )
}

export default Failure