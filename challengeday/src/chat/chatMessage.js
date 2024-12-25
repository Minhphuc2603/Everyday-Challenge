import React from 'react';

const ChatMessage = ({ message }) => {
    return (
        <div className="message p-2 border-b border-gray-200">
            <strong>{message.userId}</strong>: {message.content}
        </div>
    );
};

export default ChatMessage;
