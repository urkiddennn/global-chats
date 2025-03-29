import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import NavBar from '../NavBar';

const Chats = () => {
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect to login if not authenticated
    if (!user || !token) {
        navigate('/login');
        return null;
    }

    // Fetch messages on component mount
    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:5000/api/messages', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch messages');
                }

                const data = await response.json();
                setMessages(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [token]);

    // Handle sending a new message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        setError('');

        if (!newMessage.trim()) {
            setError('Message cannot be empty');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/messages', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: newMessage }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to send message');
            }

            const sentMessage = await response.json();
            setMessages([sentMessage, ...messages]); // Add the new message to the top
            setNewMessage(''); // Clear the input
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className='w-full h-full flex justify-center items-center flex-col '>
            <h2>Global Chat</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? (
                <p>Loading messages...</p>
            ) : (
                <div style={{ overflowY: 'auto', border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }} className='w-full h-3/4'>
                    {messages.length === 0 ? (
                        <p>No messages yet. Be the first to chat!</p>
                    ) : (
                        messages.map((message) => (
                            <div
                                key={message._id}
                                className='w-full'
                                style={{
                                    marginBottom: '10px',
                                    padding: '5px',
                                    backgroundColor: message.sender._id === user.id ? '#e0f7fa' : '#f5f5f5',
                                    borderRadius: '5px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    width: "100%",
                                }}
                            >
                                {message.sender.profilePicture && (
                                    <img
                                        src={message.sender.profilePicture}
                                        alt={message.sender.username}
                                        style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }}
                                    />
                                )}
                                <div>
                                    <strong>{message.sender.username}</strong>: {message.content}
                                    <br />
                                    <small>{new Date(message.createdAt).toLocaleString()}</small>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
            <form onSubmit={handleSendMessage} className='w-full'>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        className='w-full h-12 outline-2 rounded-lg p-2'
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        style={{ flex: 1, padding: '5px' }}
                        maxLength={500}
                    />
                    <button type="submit" disabled={loading} className='bg-blue-500 p-2 rounded-lg text-white'>
                        Send
                    </button>
                </div>
            </form>
            <NavBar />
        </div>
    );
};

export default Chats;
