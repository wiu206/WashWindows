import React, { useState, useEffect } from 'react';
import { asyncGet } from '../utils/fetch';
import { user_api } from '../enum/api';
import '../style/RankList.css';
import { RankItem } from '../interface/RankItem';

interface RankListProps {
  isOpen: boolean;
  togglePanel: () => void;
}

const RankList: React.FC<RankListProps> = ({ isOpen, togglePanel }) => {
  const [rank, setRank] = useState<RankItem[]>([]);
  const [user, setUser] = useState<RankItem | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchRankList = async () => {
    try {
      setIsRefreshing(true);
      const response = await asyncGet(user_api.getAllPoints, {});
      if (response.code === 200) {
        const rankData: RankItem[] = response.body.map((item: any) => ({
          username: item.username,
          points: item.points,
        }));

        setRank(rankData);

        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const currentUser = JSON.parse(savedUser);
          const foundUser = rankData.find(
            (item) => item.username === currentUser.username
          );
          setUser(foundUser || null);
        }
      }
    } catch (error) {
      console.error('Failed to fetch rank list:', error);
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500)
    }
  };

  useEffect(() => {
    fetchRankList();

    // 可選：定時刷新排行榜
    const interval = setInterval(fetchRankList, 5000); // 每 5 秒刷新
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rank-list">
      <button
        className={`toggle-button ${isOpen ? 'open' : ''}`}
        onClick={togglePanel}
      >
        {isOpen ? '◀' : '▶'}
      </button>
      <div className={`leaderboard ${isOpen ? 'open' : ''}`}>
        <h3>排行榜</h3>
        <div style={{height: "62vh"}}>
          {isRefreshing ? (
            <div className="loading">刷新中...</div>
          ) : (
            rank.slice(0, 10).map((item, index) => (
              <div key={index} className="rank-item">
                <span className="rank-number">{index + 1}</span>
                <span className="username">{item.username}</span>
                <span className="points">{item.points}</span>
              </div>
            ))
          )}
        </div>
        {user && (
            <div className="rank-item user-rank">
              <span className="rank-number">
                {rank.findIndex((item) => item.username === user.username) + 1}
              </span>
              <span className="username">{user.username}</span>
              <span className="points">{user.points}</span>
            </div>
        )}

      </div>
    </div>
  );
};

export default RankList;
