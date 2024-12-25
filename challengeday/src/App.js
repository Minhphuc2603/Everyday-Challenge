 
// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home';
import Login from './auth/Login';
import Register from './auth/Register';
import UserProfile from './UserProfile';
import ChallengeDetail from './Challenge';
import ManageChallenges from './ManagerChallenges';
import Settings from './Setting';
import ManageUser from './ManagerUser';
import AdminApprovalManager from './ManagerChallengeAdmin';
import Verify from './auth/Verify';
import Chat from './chat/Chat';
import ChallengeDetailne from './ChallengeDetail';
import AccountUpdatePage from './UpdateAccount';
import ManagerReports from './ManagerReports';


const App = () => {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/updateAccount' element={<AccountUpdatePage />} />
          <Route path="/profile/:userId" element={<UserProfile />} />
          <Route path='/viewchallenge/:id' element={<ChallengeDetailne />} />
          <Route path='/challenge/:id' element={<ChallengeDetail />} />
          <Route path='/manageChallenges' element={<ManageChallenges />} />
          <Route path='/setting' element={<Settings />} />
          <Route path='/manageUser' element={<ManageUser />} />
          <Route path='/admin' element={<AdminApprovalManager />} />
          <Route path='/manageReports' element={<ManagerReports />} />
          <Route path='/verify/:verificationCode' element={<Verify />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
