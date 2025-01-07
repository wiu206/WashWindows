import React, { useState, useEffect } from 'react';
import '../style/Rank.css';
import { User } from '../interface/User';
import Header from '../component/Header';
import { asyncGet } from '../utils/fetch';
import { user_api } from '../enum/api';
import { RankItem } from '../interface/RankItem';

export const Rank: React.FC = () => {
    const [rank, setRank] = useState<RankItem[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    useEffect(() => {
        if (token && savedUser) {
            setIsLoggedIn(true);
            setUser(JSON.parse(savedUser));
        }

        const fetchRankData = async () => {
            try {
                setIsLoading(true);
                const response = await asyncGet(user_api.getAllPoints, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.code === 200 && Array.isArray(response.body)) {
                    // 排序用戶數據，依據分數從高到低
                    const sortedRank = response.body
                        .sort((a: RankItem, b: RankItem) => b.points - a.points);
                    setRank(sortedRank);
                } else {
                    setError('無法載入排行榜數據');
                }
            } catch (err) {
                setError('載入排行榜時發生錯誤');
                console.error('Error fetching rank data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRankData();
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUser(null);
    };

    return (
        <>
            <Header isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
            <div className="rank-page">
            <h1>排行榜</h1>
                <div className="rank-container">
                    {isLoading ? (
                        <div className="loading">載入中...</div>
                    ) : error ? (
                        <div className="error">{error}</div>
                    ) : (
                        <>
                            <div className="rank-header">
                                <span className="rank-number">名次</span>
                                <span className="username">名稱</span>
                                <span className="points">分數</span>
                            </div>
                            {rank.map((item, index) => (
                                <div key={item._id} className="rank-item">
                                    <span className="rank-number">{index + 1}</span>
                                    <span className="username">{item.username}</span>
                                    <span className="points">{item.points}</span>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};