import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router';
import Login from './login';
import Home from './Home';
import { AppProvider } from './appContext';
import WorkoutPlan from './Components/WorkoutPlan';


const App: React.FC = () => {
  return (
    <>
    <AppProvider>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/workout-plan/:id' element={<WorkoutPlan />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </AppProvider>
    </>
  );
}

export default App;
