import React, { useState } from 'react';
import './index.css';

interface Rank {
  user: string;
  score: number;
}

const WashWindowsGame: React.FC = () => {
  const [score, setScore] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(3);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [windowSections, setWindowSections] = useState([
    [false, false],
    [false, false]
  ]);

  const ranks: Rank[] = [
    { user: 'User1', score: 10 },
    { user: 'User2', score: 9 },
    { user: 'User3', score: 8 }
  ];

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Washwindows Game</h1>
        <div className="button-group">
          <button className="button">登入</button>
          <button className="button">註冊</button>
        </div>
      </header>

      <main className="main">
        <div className="game-area">
          <div>
            <h2>Score: {score}</h2>
          </div>

          <div className="window-grid">
            {windowSections.map((row, i) =>
              row.map((clean, j) => (
                <div
                  key={`${i}-${j}`}
                  className="window-section"
                />
              ))
            )}
          </div>

          <div className="frame-counter">
            Frame {currentFrame}
          </div>

          <div className="controls">
            <button className="control-button">←</button>
            <button className="control-button">↑</button>
            <button className="control-button">→</button>
            <button className="control-button">↓</button>
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