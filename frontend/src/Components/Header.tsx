import React, { useEffect } from "react"
import { useAppContext } from '../appContext';
import { useNavigate } from "react-router";


const Header:React.FC = ()=>{
    const {token, setToken} = useAppContext();
    const navigate = useNavigate();

    useEffect(()=>{
        if(!token){
            console.log('logout')
            navigate('/login')        
        }
    }, [token])


    return <header>
    <button>Go Back</button>
    Workouts Plan - 
    <span>Welcome Name</span>
    <button onClick={()=>setToken(undefined)}>Logout</button>
</header>
}

export default Header