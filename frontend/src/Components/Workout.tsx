import axios from "axios";
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAppContext } from "../appContext";

interface Workout{
    workout_code:number;
    week_days:string;
    title: string;
}
interface WorkoutProps{
    workout: Workout;
}

const Workout: React.FC<WorkoutProps> = ({workout}) => {
    const {token} = useAppContext();
    const [exercises, setExercises] = useState([]);

    const getExercises = async()=>{
        try {
            const {data} = await axios.get(``,
                {
                    headers: {
                        authorization: `Bearer ${token}`
                      },
                }
            )
            setExercises(data.exercises)
        } catch (error) {
            
        }
    }
    useEffect(()=>{
        if(workout){
            getExercises()
        }
    },[workout])
    return <>
        <div className='container-workoutPlan'>
            <div className='container-info-workoutPlan'>
                <p>{workout.title}</p>
                <p>{workout.week_days}</p>
            </div>
            <div>
                <button>Select</button>
                <button>Delete</button> 
            </div>
        </div>
    </>
}

export default Workout