import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';


const Verify = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const verificationCode = useParams().verificationCode;

  const handleVerify = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const data = { verificationCode };
      const response = await axios.post('http://localhost:9999/auth/verify', data);
      console.log(response.data);
      setMessage(response.data.message);
      setLoading(true);
    } catch (error) {
      console.log(error.response.data.message);
      setMessage("Mã xác minh không hợp lệ"); 
      setLoading(true);
    } 
  };

  

  return (
    <div className={`flex flex-col items-center justify-center h-screen`}>
      <div className={`mb-8`}>
        
      </div>
      {loading ? (
        <div className={`flex flex-col items-center`}>
          <div className={`text-4xl`}>{message === 'Mã xác minh không hợp lệ' ?  '❌' : '✅' }</div>
          <div className={`text-lg mt-4`}>{message ? message : "Mã xác minh không hợp lệ"}</div>
          <div className={`mt-4`}>
            <Link to="/login" className={`text-blue-500 hover:text-blue-700`}>Trở lại đăng nhập</Link>
          </div>
        </div>
      ) : (
        <div className={`flex flex-col items-center`}>
          <button
            onClick={handleVerify}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4`}
          >
            Xác Minh
          </button>
          <div className={`mt-4`}>
            <Link to="/login" css={`text-blue-500 hover:text-blue-700`}>Trở lại đăng nhập</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Verify;
