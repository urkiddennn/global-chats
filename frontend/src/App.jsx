import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Login from './components/Login'
import Signup from './components/SignUp'
import Home from './components/Home'
import Profile from './components/pages/Profile'
import Main from './components/pages/Main'
import Chats from './components/pages/Chats'
const App = () => {
    return (


        <div className='w-full h-screen flex justify-center items-center p-8'>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path='/profile' element={<Profile />} />
                <Route path="/main" element={<Main />} />
                <Route path='/chats' element={<Chats />} />

            </Routes>



        </div>








    )
}

export default App
