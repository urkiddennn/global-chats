import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signup(userName, email, password);
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className='w-full h-full flex justify-center flex-col items-center md:outline-1 gap-2'>
            <h2 className='text-3xl font-bold self-start'>Signup</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit} className='flex flex-col w-full gap-2'>
                <div className='flex-col flex'>
                    <input
                        className='w-full h-12 outline-1 rounded-lg p-2'
                        placeholder='Enter username'
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                </div>
                <div className='flex-col flex'>
                    <input
                        placeholder='Enter Email'
                        className='w-full h-12 outline-1 rounded-lg p-2'
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className='flex-col flex'>
                    <input
                        placeholder='Enter password'
                        className='w-full h-12 outline-1 rounded-lg p-2'
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className='text-white font-bold w-full h-12 bg-blue-500 rounded-lg'>Sign Up</button>
            </form>
            <p>
                Already have an account? <a className='text-blue-500' href="/login">Log in here</a>
            </p>
        </div>
    );
};

export default Signup;
