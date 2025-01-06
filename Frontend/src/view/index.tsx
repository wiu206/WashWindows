import React, { useState, useEffect } from 'react';
import Window from "../assets/window.png";
import Rag from "../assets/rag.png";
import '../style/index.css';

interface Rank {
  user: string;
  score: number;
}

interface User {
  name: string;
  email: string;
  role: string; // 新增使用者角色
}

const WashWindowsGame: React.FC = () => {
  const [score, setScore] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(3);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [currentKey, setCurrentKey] = useState<string | null>(null);
  const [wrongAttempt, setWrongAttempt] = useState(false);
  const [position, setPosition] = useState({ top: 50, left: 50 });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const user: User = {
    name: 'Green',
    email: 'user@example.com',
    role: '一般使用者' // 或者 '管理員'
  };

  const ranks: Rank[] = [
    { user: 'User1', score: 10 },
    { user: 'User2', score: 9 },
    { user: 'User3', score: 8 }
  ];

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const generateRandomKey = () => {
    const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    return keys[Math.floor(Math.random() * keys.length)];
  };

  useEffect(() => {
    setCurrentKey(generateRandomKey());
  }, []);

  const updatePosition = (key: string) => {
    const step = 5;
    setPosition((prevPosition) => {
      switch (key) {
        case "ArrowUp":
          return { ...prevPosition, top: Math.max(0, prevPosition.top - step) };
        case "ArrowDown":
          return { ...prevPosition, top: Math.min(95, prevPosition.top + step) };
        case "ArrowLeft":
          return { ...prevPosition, left: Math.max(0, prevPosition.left - step) };
        case "ArrowRight":
          return { ...prevPosition, left: Math.min(95, prevPosition.left + step) };
        default:
          return prevPosition;
      }
    });

    setTimeout(() => {
      setPosition({ top: 50, left: 50 });
    }, 200);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key;
    if (key === currentKey) {
      setScore((prevScore) => prevScore + 1);
      setCurrentKey(generateRandomKey());
      setWrongAttempt(false);
      updatePosition(key);
    } else if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
      setWrongAttempt(true);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentKey]);

  return (
    <div className="container">
      <header className="header">
        <a className='btn' href='#/'>Washwindows Game</a>
        <div className="button-group">
          <a className='button' href='#/Login'>登入</a>
          <a className='button' href='#/Register'>註冊</a>
          <div className="user-info" onClick={toggleDropdown} style={{ cursor: 'pointer', position: 'relative' }}>
            Hi, {user.name}
            <div className={`dropdown ${isDropdownOpen ? 'open' : ''}`} style={{ display: isDropdownOpen ? 'block' : 'none', position: 'absolute', top: '100%', right: 0, backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px', padding: '10px', zIndex: 1000 }}>
              <p>名稱: {user.name}</p>
              <p>電子郵件: {user.email}</p>
              <p>角色: {user.role}</p>
              <a href="#/Personal">個人資料</a>
              {user.role === '管理員' && (
                <>
                  <a href="#/dashboard">管理員</a>
                  <a href="#/Manager">管理員選項</a>
                </>
              )}
              <a href="#/">登出</a>
            </div>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="game-area">
          <div>
            <h2>Score: {score}</h2>
          </div>

          <img className="window" src={Window} alt="Window" />

          <div
            className="rag"
            style={{
              position: 'absolute',
              top: `${position.top}%`,
              left: `${position.left}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <img className="rag" src={Rag} alt="rag" />
          </div>

          <div className="frame-counter">
            Frame {currentFrame}
          </div>

          <div className="controls">
            {["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].map((key) => (
              <button
                key={key}
                className={`control-button ${key === currentKey ? 'current' : ''} ${wrongAttempt && key === currentKey ? 'wrong' : ''}`}
              >
                {key === "ArrowUp" && "↑"}
                {key === "ArrowDown" && "↓"}
                {key === "ArrowLeft" && "←"}
                {key === "ArrowRight" && "→"}
              </button>
            ))}
          </div>
        </div>

        <button
          className={`toggle-button ${isPanelOpen ? 'open' : ''}`}
          onClick={togglePanel}
        >
          {isPanelOpen ? '◀' : '▶'}
        </button>

        <div className={`leaderboard ${isPanelOpen ? 'open' : ''}`}>
          <h3>Rank</h3>
          {ranks.map((rank, index) => (
            <div key={index} className="rank-item">
              <span>{rank.user}:</span>
              <span>{rank.score}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default WashWindowsGame;
