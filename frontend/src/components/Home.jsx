import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div>
            <h1>Welcome to the App</h1>
            {user ? (
                <div>
                    <p>Hello, {user.userName}!</p>
                    <p>
                        View your <Link to="/profile">profile</Link>.
                    </p>
                </div>
            ) : (
                <div>
                    <p>Please log in or sign up to continue.</p>
                    <p>
                        <Link to="/login">Login</Link> | <Link to="/signup">Signup</Link>
                    </p>
                </div>
            )}
        </div>
    );
};

export default Home;
