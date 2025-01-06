import React, { useEffect, useState } from 'react';
import { User } from '../interface/User';
import userPng from "../assets/user.png";
import '../style/Profile.css';
import Header from '../component/Header';


const ProfilePage: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    useEffect(() => {
        if (token && savedUser) {
            setIsLoggedIn(true);
            setUser(JSON.parse(savedUser));
        }
    }, []);
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUser(null);
    };
    return (
        <>
            <Header isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
            <div className="profile-page">
                <div className="profile-container">
                    <div className="image-container">
                        <label htmlFor="image-upload" className="image-label">
                            <img src={userPng} alt="user" className="user" />
                        </label>
                    </div>
                    <div className="user-info">
                        <span className="username">
                            {user?.username}<span className="edit-icon">🖊</span>
                        </span>
                        <div className="stats">
                            <span>#1/100</span>
                            <span>Points: {user?.points}</span>
                        </div>
                    </div>
                    <div className="action-buttons">
                        <button className="button">修改密碼</button>
                        <button className="button">刪除帳號</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
