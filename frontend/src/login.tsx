import React, { FormEvent, useState } from "react";
import axios from 'axios';
import { useAppContext } from './appContext';
import { useNavigate } from 'react-router-dom';

interface LoginProps{
}

const Login: React.FC<LoginProps> = () =>{

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const {token, setToken} = useAppContext();
    const navigate = useNavigate();


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_API}/api/auth/login`, {
                email: email,
                password: password,
              });
              const jwtToken = response.data.jwt; 
              if(jwtToken){
                setToken(jwtToken)
              }
              navigate('/')        
            } catch (error) {
            
        }
        console.log(email, password)
    }

return <div style={{backgroundColor: 'grey'}}>
    <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" value={email}
        onChange={(e)=>setEmail(e.target.value)}
        required/>
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" value={password}
        onChange={(e)=>setPassword(e.target.value)}
        required/>
        <button type="submit">Login</button>
    </form>
</div>
};

export default Login