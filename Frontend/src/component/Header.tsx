import React, { useState } from 'react';
import { User } from '../interface/User';
import '../style/Header.css';

interface HeaderProps {
  isLoggedIn: boolean;
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="header">
      <a className='btn' href='#/'>Washwindows Game</a>
      <div className="button-group">
        {!isLoggedIn ? (
          <>
            <a className='button' href='#/Login'>登入</a>
            <a className='button' href='#/Register'>註冊</a>
          </>
        ) : (
          <div className="user-info" onClick={toggleDropdown}>
            {user?.username}
            <div className={`dropdown ${isDropdownOpen ? 'open' : ''}`}>
              <a href="#/Profile">個人資料</a>
              <a href='#/Rank'>排行榜</a>
              {user?.userRole === 'admin' && (
                <>
                  <a href="#/Manager">管理員選項</a>
                </>
              )}
              <button onClick={onLogout}>登出</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;