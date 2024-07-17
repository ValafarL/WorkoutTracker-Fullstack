import axios from "axios";
import React, { useEffect, useState } from "react"
import { useLocation } from 'react-router-dom';
import Workout from "./Workout";
import Header from "./Header";
import { useAppContext } from '../appContext';

interface WorkoutPlan {
    workout_plan_code: number;
    name: string;
    init_date: string;
    end_date: string;
}

const WorkoutPlan: React.FC = ({}) => {
    const location = useLocation();
    const [workouts, setWorkouts] = useState([]);
    const workoutPlan = location.state?.workoutPlan as WorkoutPlan;
    const {token} = useAppContext();

    const getWorkouts = async ()=>{
        try {
            const {data} = await axios.get(`${process.env.REACT_APP_BACKEND_API}/api/user/workout-plan/${workoutPlan.workout_plan_code}/workout`,
                {
                    headers: {
                      authorization: `Bearer ${token}`
                    },
                }
            )
            console.log('workouts ',data)
            setWorkouts(data.workouts)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        if(workoutPlan){
            getWorkouts()
        }
    },[workoutPlan])

    return<>
        <main className='home'>
            <Header />
            <div>
            <h1>Workout Plan</h1>
            <div>
                <p>Name: {workoutPlan.name}</p>
                <p>Start Date: {workoutPlan.init_date}</p>
                <p>End Date: {workoutPlan.end_date}</p>
            </div>
            </div>
            <div>
                {
                    workouts.length> 0 ?
                        workouts.map((workout, index)=>{
                            return <Workout key={index} workout={workout}/>
                        })
                    :<p>Add workouts to the Workout Plan</p>
                }
            </div>
        </main>
    </>
}

export default WorkoutPlan