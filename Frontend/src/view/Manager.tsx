import React, { useState, useEffect } from 'react';
import '../style/Manager.css';
import Header from '../component/Header';
import { User } from '../interface/User';
import { asyncGet, asyncDelete, asyncPut } from '../utils/fetch';
import { admin_api } from '../enum/api';

const Manager: React.FC = () => {
    const [players, setPlayers] = useState<User[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    const [sortIndex, setSortIndex] = useState(0); // 排序屬性索引
    const sortKeys: (keyof User | 'accuracy')[] = ['username', 'points', 'clicked', 'accuracy'];
    useEffect(() => {
        if (token && savedUser) {
            setIsLoggedIn(true);
            setUser(JSON.parse(savedUser));

            const fetchData = async () => {
                try {
                    const response = await asyncGet(admin_api.getAllUser, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setPlayers(response.body);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchData();
        }
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUser(null);
    };

    const handleResetScore = async (id: string) => {
        try {
            const response = await asyncPut(`${admin_api.resetUserPoints}?_id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert('玩家分數已成功重置！');
                setPlayers((prevPlayers) =>
                    prevPlayers.map((player) =>
                        player._id === id ? { ...player, points: 0, clicked: 0 } : player
                    )
                );
            } else {
                alert('重置分數失敗，請稍後再試。');
            }
        } catch (error) {
            console.error('Error resetting score:', error);
            alert('重置分數時發生錯誤，請稍後再試。');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('您確定要刪除詆玩家嗎？此操作無法恢復。')) {
            return;
        }

        try {
            const response = await asyncDelete(`${admin_api.revokeUser}?_id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert('玩家已成功刪除！');
                setPlayers((prevPlayers) => prevPlayers.filter((player) => player._id !== id));
            } else {
                alert('刪除玩家失敗，請稍後再試。');
            }
        } catch (error) {
            console.error('Error deleting player:', error);
            alert('刪除玩家時發生錯誤，請稍後再試。');
        }
    };
    const handleSort = () => {
        const key = sortKeys[sortIndex]; // 獲取當前排序屬性
        const nextIndex = (sortIndex + 1) % sortKeys.length; // 計算下一個索引

        setSortIndex(nextIndex);

        setPlayers((prevPlayers) => {
            const sortedPlayers = [...prevPlayers].sort((a, b) => {
                let aValue = key === 'accuracy' ? calculateAccuracy(a.points, a.clicked) : a[key];
                let bValue = key === 'accuracy' ? calculateAccuracy(b.points, b.clicked) : b[key];

                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return bValue.localeCompare(aValue); // 字串降序
                }

                return bValue - aValue; // 數值降序
            });
            return sortedPlayers;
        });
    };

    const calculateAccuracy = (points: number, clicked: number) => {
        if (!clicked) return "0.00";
        return ((points / clicked) * 100).toFixed(2);
    };

    return (
        <>
            <Header isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
            <div className="manager-page">
                <h3>玩家管理</h3>
                <button onClick={handleSort}>
                        排序（{sortKeys[sortIndex] === 'accuracy' ? '準確率' : sortKeys[sortIndex]}）
                    </button>
                <div className="player-list">
                    {players.map((player) => (
                        <div key={player._id} className="player-card">
                            <h4>{player.username}</h4>
                            <p>ID: {player._id}</p>
                            <p>分數: {player.points}</p>
                            <p>點擊數: {player.clicked}</p>
                            <p>準確率: {calculateAccuracy(player.points, player.clicked)}%</p>
                            <button onClick={() => handleResetScore(player._id)}>重置分數</button>
                            <button className="deleteButton" onClick={() => handleDelete(player._id)}>刪除</button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Manager;
