import React, { useEffect, useState } from 'react'
import './home.css'
import { useAppContext } from './appContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Components/Header';

interface WorkoutPlanInfo{
    workout_plan_code:number,
    name:string,
    init_date: string,
    end_date: string
}
const Home:React.FC = ()=>{
    const [WkPSelect, setWkPSelect] = useState<WorkoutPlanInfo | undefined>(undefined)
    const [userWksPlan, setUserWksPlan] = useState([])
    const {token, setToken} = useAppContext();
    const navigate = useNavigate();

    const getUserWksP = async() =>{
        try {
            const {data} = await axios.get(`${process.env.REACT_APP_BACKEND_API}/api/user/workout-plan`,
                {
                  headers: {
                    authorization: `Bearer ${token}`
                  }
                })
            console.log()
            setUserWksPlan(data.user_workouts_plan)
        } catch (error) {
            console.log(error)
            throw new Error('Unable to get user workouts plan')
        }
    }

    const createWksPlan = async ()=>{
        try {
            await axios.post(``)
        } catch (error) {
            
        }
    }

    useEffect(()=>{
        if(token){
            getUserWksP()
        }
        else{
            console.log('logout')
            navigate('/login')   
        }
    }, [token])

    return<>
    {
        token? 
        <main className='home'>
                <Header />
                <div>
                {
                    userWksPlan.length > 0?
                    userWksPlan.map((workoutPlan:WorkoutPlanInfo, index)=>{
                        return  <>
                        <button>Create Workout Plan</button>
                        <div className='container-workoutPlan'>
                            <div className='container-info-workoutPlan'>
                                <span>{workoutPlan.name}</span>
                                <span> {workoutPlan.init_date}</span>
                                <span>-</span>
                                <span>{workoutPlan.end_date}</span>
                            </div>
                            <div>
                                <button onClick={()=>navigate(`/workout-plan/${workoutPlan.workout_plan_code}`, { state: { workoutPlan } })}>Select</button>
                                <button>Delete</button> 
                            </div>
                        </div>
                    </>
                    }):null
                }
                </div>
        </main>
        :null
    }
    </>
}

export default Home