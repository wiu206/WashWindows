import React, { useState, useEffect } from 'react';
import '../style/Rank.css';
import { User } from '../interface/User';
import Header from '../component/Header';

interface RankItem {
    username: string;
    points: number;
}

export const Rank: React.FC = () => {
    const [rank, setRank] = useState<RankItem[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    useEffect(() => {
        if (token && savedUser) {
            setIsLoggedIn(true);
            setUser(JSON.parse(savedUser));
        }
        // 模擬獲取排名數據，實際應使用 API 調用
        const fetchRankData = async () => {
            const rankData = [
                { username: "小希", points: 10 },
                { username: "小凱", points: 9 },
                { username: "小沛", points: 8 },
            ];
            setRank(rankData);
        };

        fetchRankData();
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
            <div className="rank-page">
                <div className="rank-container">
                    <h2>Washwindows Game</h2>
                    <h3>排行榜</h3>
                    <div className="rank-header">
                        <span className="rank-number">名次</span>
                        <span className="username">名稱</span>
                        <span className="points">分數</span>
                    </div>
                    {rank.map((item, index) => (
                        <div key={index} className="rank-item">
                            <span className="rank-number">{index + 1}</span>
                            <span className="username">{item.username}</span>
                            <span className="points">{item.points}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}