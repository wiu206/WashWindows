import React, { useState, useEffect } from 'react';
import '../style/Manager.css';

interface Player {
    id: number;
    username: string;
    score: number;
}

const Manager: React.FC = () => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [accuracy, setAccuracy] = useState<number>(55);
    const [activePlayers, setActivePlayers] = useState<number>(20);

    useEffect(() => {
        // 模擬獲取玩家數據，實際應使用 API 調用
        const fetchPlayerData = async () => {
            const playerData = [
                { id: 1, username: "小希", score: 10 },
                { id: 2, username: "小凱", score: 9 },
                { id: 3, username: "小沛", score: 8 },
                { id: 4, username: "小威", score: 7 },
            ];
            setPlayers(playerData);
        };

        fetchPlayerData();
    }, []);

    const handleResetScore = (id: number) => {
        // 重置玩家分數的邏輯
        alert(`重置玩家 ${id} 的分數`);
    };

    const handleDelete = (id: number) => {
        // 刪除玩家的邏輯
        alert(`刪除玩家 ${id}`);
    };

    return (
        <div className="manager-page">
            <h2>Washwindows Game</h2>
            <h3>玩家管理</h3>
            <div className="stats">
                <div>準確率: {accuracy}</div>
                <div>活躍玩家數: {activePlayers}</div>
            </div>
            <div className="player-list">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>帳號名稱</th>
                            <th>分數</th>
                            <th>重置分數</th>
                            <th>刪除</th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.map(player => (
                            <tr key={player.id}>
                                <td>{player.id}</td>
                                <td>{player.username}</td>
                                <td>{player.score}</td>
                                <td><button onClick={() => handleResetScore(player.id)}>重置分數</button></td>
                                <td><button onClick={() => handleDelete(player.id)}>刪除</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Manager;
