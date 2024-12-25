import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { getDatabase, ref, push, onValue } from 'firebase/database';
import ChatMessage from './chatMessage';

const socket = io('http://localhost:9090'); // Your socket server

const Chat = () => {
    const [friendId, setFriendId] = useState("");
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const userId = localStorage.getItem('userId'); // Get userId from local storage or wherever you store it

    useEffect(() => {
        if (friendId && userId) {
            socket.emit('joinRoom', { userId, friendId });

            // Load existing messages from Firebase
            loadMessagesFromFirebase(userId, friendId);

            // Listen for new messages received from socket
            socket.on('receiveMessage', (message) => {
                setMessages(prevMessages => [...prevMessages, message]);
            });
        }

        return () => {
            socket.off('receiveMessage');
        };
    }, [friendId, userId]);

    const loadMessagesFromFirebase = (userId, friendId) => {
        const database = getDatabase();
        const chatRef = ref(database, `chats/${userId}_${friendId}`);

        // Listen for new messages added to Firebase
        onValue(chatRef, (snapshot) => {
            const messages = snapshot.val() ? Object.values(snapshot.val()) : [];
            setMessages(messages);
        });
    };

    const handleSendMessage = () => {
        if (newMessage.trim() === "" || !userId || !friendId) return;

        const messageData = {
            userId,
            friendId,
            content: newMessage,
        };

        // Save message to Firebase Realtime Database
        const database = getDatabase();
        const chatRef = ref(database, `chats/${userId}_${friendId}`);
        push(chatRef, messageData)
            .then(() => {
                console.log('Message sent to Firebase');
                // Gửi tin nhắn qua socket để đối phương nhận được
                socket.emit('sendMessage', messageData);
                setNewMessage("");
            })
            .catch((error) => console.error('Error sending message to Firebase', error));
    };

    return (
        <div className="chat-container max-w-2xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
            <div className="flex mb-4">
                <input
                    type="text"
                    value={friendId}
                    onChange={(e) => setFriendId(e.target.value)}
                    className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring focus:border-blue-300"
                    placeholder="Enter friend's ID..."
                />
                <button onClick={() => socket.emit('joinRoom', { userId, friendId })} className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-700">
                    Connect
                </button>
            </div>
            <div className="messages flex-grow overflow-y-auto mb-4">
                {messages.map((message, index) => (
                    <ChatMessage key={index} message={message}
 />
                ))}
            </div>
            <div className="input-container flex">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring focus:border-blue-300"
                    placeholder="Type a message..."
                />
                <button onClick={handleSendMessage} className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-700">
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
