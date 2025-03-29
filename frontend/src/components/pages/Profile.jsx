import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import NavBar from '../NavBar.jsx';

const Profile = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

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
            <h2>Profile</h2>
            <p><strong>Username:</strong> {user.userName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            {user.profilePicture && (
                <div>
                    <strong>Profile Picture:</strong>
                    <img
                        src={user.profilePicture}
                        alt="Profile"
                        style={{ width: '100px', height: '100px' }}
                    />
                </div>
            )}
            <button onClick={handleLogout}>Logout</button>

            <NavBar />
        </div>
    );
};

export default Profile;
