import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { jwtDecode } from 'jwt-decode';

const Header = () => {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';
    const isRegisterPage = location.pathname === '/register';
    const isProfilePage = location.pathname === '/profile';
    const [role, setRole] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("userId");
    const navigate = useNavigate();
    const userID = localStorage.getItem("userId");

    useEffect(() => {
        fetch(`http://localhost:9999/user-profile/${userID}`)
            .then(response => response.json())
            .then(data => {
                setProfileData(data);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setRole(decodedToken.role);
                console.log("User Role:", decodedToken.role);
            } catch (error) {
                console.error("Invalid token:", error);
            }
        } else {
            console.log("No token found in localStorage.");
        }
    }, [token]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const menu = (
        <Menu>
            <Menu.Item key="1">
                <Link to={`/profile/${id}`}>Trang cá nhân</Link>
            </Menu.Item>
            {role === 1 ? (
                <>
                    <Menu.Item key="2">
                        <Link to="/manageChallenges">Quản lí thử thách</Link>
                    </Menu.Item>
                    <Menu.Item key="7">
                        <Link to="/updateAccount">Nâng cấp tài khoản</Link>
                    </Menu.Item>
                </>
            ) : role === 0 ? (
                <>
                    <Menu.Item key="5">
                        <Link to="/manageUser">Quản lí người dùng</Link>
                    </Menu.Item>
                    <Menu.Item key="6">
                        <Link to="/admin">Quản lí thử thách cho admin</Link>
                    </Menu.Item>
                    <Menu.Item key="8">
                        <Link to="/manageReports">Quản lí các đơn tố cáo</Link>
                    </Menu.Item>
                </>
            ) : null}
            <Menu.Item key="3">
                <Link to="/setting">Cài đặt</Link>
            </Menu.Item>
            <Menu.Item key="4" onClick={handleLogout}>
                <Link to="/">Đăng xuất</Link>
            </Menu.Item>
        </Menu>
    );

    if (!profileData) return <div>No profile data available.</div>;

    const img = profileData.profilePictureUrl ? profileData.profilePictureUrl : 'https://upload.wikimedia.org/wikipedia/en/4/4c/GokumangaToriyama.png';

    // Create a formatted email template
    const feedbackEmailTemplate = `
Hello Admin,

I would like to provide some feedback regarding your platform.

---

Name: [Your Name]
Email: [Your Email]
User ID: [Your User ID]

Feedback Type:
- Bug Report
- Feature Request
- General Feedback

Feedback:

[Please enter your detailed feedback here.]

---

Thank you for taking the time to read my feedback.

Best regards,
[Your Name]`;

    // URL-encode the template
    const feedbackMailto = `mailto:trinhphuc980@gmail.com?subject=Feedback%20from%20User&body=${encodeURIComponent(feedbackEmailTemplate)}`;

    return (
        <div className="flex flex-row items-center bg-gray-100 p-2 border-b border-gray-200 shadow-xl">
            <div className="flex items-center w-1/2">
                <img src="https://firebasestorage.googleapis.com/v0/b/sdn301-64d69.appspot.com/o/logo%202.png?alt=media&token=7153f862-92ef-488f-9b6a-08312eb236f5" alt="Logo" className="w-24 h-auto ml-10" />
                <Link to={"/"} className="px-4 py-2 text-black rounded ml-4">Trang chủ</Link>
            </div>
            <div className="flex justify-end items-center w-1/2 space-x-4 mr-10">
                
                <a href={feedbackMailto} className="px-4 py-2 text-black rounded ml-4">Feedback</a>
                {token ? (
                    <Dropdown overlay={menu} trigger={['click']}>
                        <div className="flex items-center cursor-pointer">
                            <img className={`w-10 h-10 rounded-full ${isProfilePage ? 'border-2 border-yellow-500' : ''}`} src={img} alt="Profile" />
                            <DownOutlined className="ml-2" />
                        </div>
                    </Dropdown>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className={`px-4 py-2 ${isLoginPage ? 'border border-black' : ''} text-black rounded`}
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className={`px-4 py-2 ${isRegisterPage ? 'border border-black' : ''} text-black rounded`}
                        >
                            Register
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default Header;