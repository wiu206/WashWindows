import React, { useState, useEffect } from 'react';
import Window from "../assets/window.png";
import Rag from "../assets/rag.png";
import '../style/index.css';

interface Rank {
  user: string;
  score: number;
}

const WashWindowsGame: React.FC = () => {
  const [score, setScore] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(3);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [position, setPosition] = useState({ top: 50, left: 50 }); // 預設圖片位置

  const ranks: Rank[] = [
    { user: 'User1', score: 10 },
    { user: 'User2', score: 9 },
    { user: 'User3', score: 8 }
  ];

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  // 處理鍵盤按鍵按下
  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key;
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
      setActiveKey(key);
      setPosition((prevPosition) => {
        const step = 5; // 每次移動的像素
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
    }
  };

  // 處理鍵盤按鍵釋放
  const handleKeyUp = (event: KeyboardEvent) => {
    const key = event.key;
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
      setActiveKey(null);
      // 按鍵釋放後重置位置
      setPosition({ top: 50, left: 50 });
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div className="container">
      <header className="header">
        <a className='btn' href='#/'>Washwindows Game</a>
        <div className="button-group">
          <a className='button' href='#/Login'>登入</a>
          <a className='button' href='#/Register'>註冊</a>
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
              top: `${position.top}%`,
              left: `${position.left}%`,
            }}
          >
            <img className="rag" src={Rag} alt="rag" />
          </div>

          <div className="frame-counter">
            Frame {currentFrame}
          </div>

          <div className="controls">
            <button
              className={`control-button ${activeKey === "ArrowLeft" ? 'active' : ''}`}
            >
              ←
            </button>
            <button
              className={`control-button ${activeKey === "ArrowUp" ? 'active' : ''}`}
            >
              ↑
            </button>
            <button
              className={`control-button ${activeKey === "ArrowRight" ? 'active' : ''}`}
            >
              →
            </button>
            <button
              className={`control-button ${activeKey === "ArrowDown" ? 'active' : ''}`}
            >
              ↓
            </button>
          </div>
        </div>

        {/* 切換按鈕 */}
        <button
          className={`toggle-button ${isPanelOpen ? 'open' : ''}`}
          onClick={togglePanel}
        >
          {isPanelOpen ? '▶' : '◀'}
        </button>

        {/* 排行榜面板 */}
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
