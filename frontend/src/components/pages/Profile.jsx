import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import NavBar from '../NavBar.jsx';

const Profile = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    console.log(user)

    // If the user is not logged in, redirect to login page
    if (!user) {
        navigate('/login');
        return null;
    }

    const handleLogout = () => {
        logout(); // Clear token and user data from AuthContext
        navigate('/login'); // Redirect to login page
    };

    return (
        <div className='w-full h-full flex justify-center items-center flex-col '>
            <h2 className='text-2xl font-bold'>Profile</h2>
            {user.profilePicture && (
                <div className='w-32 h-32 overflow-hidden rounded-full border-2 flex justify-center items-center '>
                    <img
                        src={user.profilePicture}
                        alt="Profile"
                        style={{ width: '100px', height: '100px' }}
                    />
                </div>
            )}
            <p>{user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>

            <button onClick={handleLogout}>Logout</button>

            <NavBar />
        </div>
    );
};

export default Profile;
