import React, { useState, useEffect } from 'react';
import Window from "../assets/window.png";
import Rag from "../assets/rag.png";
import Dirty from "../assets/dirty.png";
import { User } from '../interface/User';
import '../style/index.css';
import { asyncGet, asyncPut } from '../utils/fetch';
import { user_api } from '../enum/api';
import Header from '../component/Header';

interface RankItem {
  username: string;
  points: number;
}

export const WashWindowsGame: React.FC = () => {
  const [points, setPoints] = useState<number>(0);
  const [pointsBuffer, setPointsBuffer] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateStatus, setUpdateStatus] = useState<string>("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [currentKey, setCurrentKey] = useState<string | null>(null);
  const [wrongAttempt, setWrongAttempt] = useState(false);
  const [position, setPosition] = useState({ top: 50, left: 50 });
  const [dirtyPosition, setDirtyPosition] = useState({ top: 50, left: 50 });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [rank, setRank] = useState<RankItem[]>([]);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const token = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');
  useEffect(() => {
    if (token && savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setIsLoggedIn(true);
      setUser(parsedUser);
      setPoints(parsedUser.points);
      
      // Initialize pointsBuffer with the saved points
      setPointsBuffer(parsedUser.points);
    }
  }, []);
  
  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };
  
  const showRankList = async () => {
    try {
      const response = await asyncGet(user_api.getAllPoints);
      if (response.code === 200) {
        const rankData: RankItem[] = response.body.map((item: any) => ({
          username: item.username,
          points: item.points
        }));
        setRank(rankData);
      }
    } catch (error) {
      console.log("failed to fetch rank list");
    }
  };

  const throttledUpdatePoints = async () => {
    if (!token || !user?._id || points === pointsBuffer) {
      return;
    }

    setIsUpdating(true);
    try {
      const response = await asyncPut(user_api.updatePoints, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: {
          _id: user?._id,
          points: points
        }
      });

      if (response.status === 200) {
        setPointsBuffer(points);
        setUpdateStatus("分數已更新！");
        const updatedUser = { ...user, points: points };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            setUpdateStatus("");
            setIsExiting(false);
          }, 300);
        }, 2000);
      }
    } catch (error) {
      console.error('Error updating points:', error);
      setUpdateStatus("更新失敗，請稍後再試");
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    showRankList();
    const interval = setInterval(() => {
      if (!isUpdating) {
        throttledUpdatePoints();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [points, isUpdating]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setPoints(0);
    setPointsBuffer(0);
  };

  const handleScoreIncrease = () => {
    setPoints(prev => prev + 1);
  };

  const generateRandomPosition = (key: string): { top: number, left: number } => {
    switch (key) {
      case "ArrowUp":
        return { top: 18, left: 48 };
      case "ArrowDown":
        return { top: 58, left: 48 };
      case "ArrowLeft":
        return { top: 38, left: 40 };
      case "ArrowRight":
        return { top: 38, left: 54 };
      default:
        return { top: 50, left: 50 };
    }
  };

  const generateRandomKey = () => {
    const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const newPosition = generateRandomPosition(randomKey);
    setDirtyPosition(newPosition);
    return randomKey;
  };

  useEffect(() => {
    setCurrentKey(generateRandomKey());
  }, []);

  const updatePosition = (key: string) => {
    const step = 8;
    setPosition((prevPosition) => {
      switch (key) {
        case "ArrowUp":
          return { ...prevPosition, top: Math.max(0, prevPosition.top - step - 10) };
        case "ArrowDown":
          return { ...prevPosition, top: Math.min(95, prevPosition.top + step + 10) };
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
      handleScoreIncrease(); // 調用增加分數函式
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
      <Header isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />

      <main className="main">
        <div className="game-area">
          <h2 style={{top: 100}}>Score: {points}</h2>

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
          <div
            className="dirty"
            style={{
              top: `${dirtyPosition.top}%`,
              left: `${dirtyPosition.left}%`,
            }}
          >
            <img src={Dirty} alt="dirty" />
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
          {updateStatus && (
            <div className={`update-status ${isExiting ? 'exit' : ''}`}>
              {updateStatus}
            </div>
          )}
        </div>

        <button
          className={`toggle-button ${isPanelOpen ? 'open' : ''}`}
          onClick={togglePanel}
        >
          {isPanelOpen ? '◀' : '▶'}
        </button>

        <div className={`leaderboard ${isPanelOpen ? 'open' : ''}`}>
          <h3 style={{textAlign: "center"}}>擦窗戶排行榜</h3>
          <div className="rank-item">
            <span className="rank-number">排名</span>
            <span className="username">清潔工</span>
            <span className="points">擦窗數</span>
          </div>
          {rank.map((item, index) => (
            <div key={index} className="rank-item">
              <span className="rank-number">{index + 1}</span>
              <span className="username">{item.username}</span>
              <span className="points">{item.points}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};