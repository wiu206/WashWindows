import React, { useState, useEffect } from 'react';
import Window from "../assets/window.png";
import Rag from "../assets/rag.png";
import Dirty from "../assets/dirty.png";
import { User } from '../interface/User';
import '../style/index.css';
import { asyncPut } from '../utils/fetch';
import { user_api } from '../enum/api';
import Header from '../component/Header';
import RankList from '../component/RankList';

export const WashWindowsGame: React.FC = () => {
  const [points, setPoints] = useState<number>(0);
  const [pointsBuffer, setPointsBuffer] = useState<number>(0);
  const [clicked, setClicked] = useState<number>(0);
  const [clickedBuffer, setClickedBuffer] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateStatus, setUpdateStatus] = useState<string>("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [currentKey, setCurrentKey] = useState<string | null>(null);
  const [wrongAttempt, setWrongAttempt] = useState(false);
  const [position, setPosition] = useState({ top: 60, left: 50 });
  const [dirtyPosition, setDirtyPosition] = useState({ top: 50, left: 50 });
  const [dirtyVisible, setDirtyVisible] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const token = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');

  useEffect(() => {
    if (token && savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setIsLoggedIn(true);
      setUser(parsedUser);
      setPoints(parsedUser.points);
      setClicked(parsedUser.clicked || 0);
      
      setPointsBuffer(parsedUser.points);
      setClickedBuffer(parsedUser.clicked || 0);
    }
  }, []);
  
  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const throttledUpdatePoints = async () => {
    if (!token || !user?._id || (points === pointsBuffer && clicked === clickedBuffer)) {
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
          points: points,
          clicked: clicked
        }
      });

      if (response.status === 200) {
        setPointsBuffer(points);
        setClickedBuffer(clicked);
        setUpdateStatus("分數已更新！");
        const updatedUser = { ...user, points: points, clicked: clicked };
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
    const interval = setInterval(() => {
      if (!isUpdating) {
        throttledUpdatePoints();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [points, clicked, isUpdating]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setPoints(0);
    setPointsBuffer(0);
    setClicked(0);
    setClickedBuffer(0);
  };

  const handleScoreIncrease = () => {
    setPoints(prev => prev + 1);
    setClicked(prev => prev + 1);
  };

  const handleWrongAttempt = () => {
    setWrongAttempt(true);
    setClicked(prev => prev + 1);
  };

  const generateDirtyPosition = (key: string): { top: number, left: number } => {
    switch (key) {
      case "ArrowUp":
        return { top: 20, left: 48 };
      case "ArrowDown":
        return { top: 68, left: 48 };
      case "ArrowLeft":
        return { top: 42, left: 40 };
      case "ArrowRight":
        return { top: 42, left: 55 };
      default:
        return position;
    }
  };

  const generateRandomKey = () => {
    const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    const randomKey = keys[Math.floor(Math.random() * keys.length)]; //Math.floor(Math.random() * keys.length)
    const newPosition = generateDirtyPosition(randomKey);
    setDirtyVisible(false);

    setTimeout(() => {
      setDirtyPosition(newPosition);
      setDirtyVisible(true);
    }, 100);

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
      setPosition({ top: 60, left: 50 });
    }, 200);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key;
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
      if (key === currentKey) {
        handleScoreIncrease();
        setWrongAttempt(false);
        updatePosition(key);
        setTimeout(() => {
          setCurrentKey(generateRandomKey());
        }, 200)
      } else {
        updatePosition(key);
        handleWrongAttempt();
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentKey]);

  const calculateAccuracy = (points: number, clicked: number) => {
    if (!clicked) return "0.00";
    return ((points / clicked) * 100).toFixed(2);
  };

  return (
    <div className="index-container">
      <Header isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
      <RankList isOpen={isPanelOpen} togglePanel={togglePanel} />
        <div className="game-area">
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
          {dirtyVisible && (
            <div
              className="dirty"
              style={{
                top: `${dirtyPosition.top}%`,
                left: `${dirtyPosition.left}%`,
              }}
            >
              <img src={Dirty} alt="dirty" className="dirty-animation" />
            </div>
          )}
          <div className="controls">
            {["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].map((key) => (
              <button
                key={key}
                className={`control-button ${key === currentKey ? 'current' : ''} ${wrongAttempt && key === currentKey ? 'wrong' : ''}`}
              >
                {key === "ArrowUp" && " ⭡"}
                {key === "ArrowDown" && "⭣"}
                {key === "ArrowLeft" && "⭠"}
                {key === "ArrowRight" && "⭢"}
              </button> 
            ))}
          </div>
          {updateStatus && (
            <div className={`update-status ${isExiting ? 'exit' : ''}`}>
              {updateStatus}
            </div>
          )}
        </div>
        <div className='scoreboard'>
          <h3>分數:{points}</h3>
          <h3>點擊次數:{clicked}</h3>
          <h3>準確率:{calculateAccuracy(points, clicked)}%</h3>
        </div>
    </div>
  );
};
