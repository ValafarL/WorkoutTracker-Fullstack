import axios from "axios"
import React, { useState, useEffect } from "react"
import { useAppContext } from "../appContext";

const Exercise:React.FC = ()=>{
    const {token} = useAppContext();

    const getExercises = async ()=>{
        try {
            const {data} = await axios.get(``,
                {
                    headers: {
                      authorization: `Bearer ${token}`
                    },
                }
            )
        } catch (error) {
            
        }
    }
    useEffect(()=>{

    })
    return <div>

    </div>
}