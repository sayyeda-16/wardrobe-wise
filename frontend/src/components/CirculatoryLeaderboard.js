import React, { useState, useEffect, useCallback } from 'react';
import { FaTrophy, FaRecycle, FaUserShield, FaSpinner } from 'react-icons/fa';
import api from '../api/axios';

const THEME_COLORS = {
    primaryGreen: '#6b8e23',
    darkText: '#3c5a17',
    subtleText: '#556b2f',
    lightGreen: '#e8f4d3',
    offWhite: '#f0f7e6',
};

const CircularityLeaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchLeaderboard = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            // This endpoint is protected by IsAdminUser
            const response = await api.get('/api/admin/eco-users/');
            setLeaderboardData(response.data);
        } catch (err) {
            console.error('Error fetching leaderboard:', err);
            setError('Access Denied. You must be an administrator to view the Circularity Leaderboard.');
            setLeaderboardData([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLeaderboard();
    }, [fetchLeaderboard]);

    if (loading) {
        return (
            <div className="flex justify-center items-center p-10 bg-white rounded-lg shadow-xl border" style={{ borderColor: THEME_COLORS.lightGreen }}>
                <FaSpinner className="text-4xl animate-spin mr-3" style={{ color: THEME_COLORS.primaryGreen }} />
                <span className="text-lg" style={{ color: THEME_COLORS.subtleText }}>Loading Circularity Leaderboard...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 bg-red-50 border-l-4 border-red-500 rounded-md shadow-md text-red-800">
                <FaUserShield className="inline mr-2 text-xl" />
                {error}
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-2xl border" style={{ borderColor: THEME_COLORS.secondaryGreen }}>
            <h2 className="text-2xl font-bold mb-6 flex items-center pb-3 border-b-2" style={{ color: THEME_COLORS.darkText, borderColor: THEME_COLORS.lightGreen }}>
                <FaTrophy className="mr-3 text-3xl" style={{ color: THEME_COLORS.primaryGreen }} />
                Circularity Leaderboard: Top Eco-Friendly Users
            </h2>

            <div className="grid grid-cols-4 font-bold uppercase text-sm p-3 rounded-t-md" style={{ backgroundColor: THEME_COLORS.offWhite, color: THEME_COLORS.subtleText }}>
                <div className="col-span-1">Rank</div>
                <div className="col-span-1">User</div>
                <div className="col-span-1 text-center">Recirculated Items</div>
                <div className="col-span-1 text-right">Circularity Score</div>
            </div>

            <div className="divide-y">
                {leaderboardData.map((user, index) => (
                    <div 
                        key={index} 
                        className={`grid grid-cols-4 p-4 items-center transition duration-200 ${index < 3 ? 'font-extrabold text-lg' : 'font-medium'}`}
                        style={{ backgroundColor: index % 2 === 0 ? 'white' : THEME_COLORS.lightGreen }}
                    >
                        <div className="col-span-1 flex items-center">
                            {index === 0 && <span className="text-3xl mr-2">🥇</span>}
                            {index === 1 && <span className="text-2xl mr-2">🥈</span>}
                            {index === 2 && <span className="text-xl mr-2">🥉</span>}
                            {index >= 3 && <span className="mr-4 text-base" style={{ color: THEME_COLORS.subtleText }}>#{index + 1}</span>}
                        </div>
                        <div className="col-span-1" style={{ color: THEME_COLORS.darkText }}>{user.username}</div>
                        <div className="col-span-1 text-center flex items-center justify-center" style={{ color: THEME_COLORS.primaryGreen }}>
                            <FaRecycle className="mr-2" />
                            {user.items_recirculated} / {user.total_items}
                        </div>
                        <div className="col-span-1 text-right font-mono text-xl" style={{ color: THEME_COLORS.primaryGreen }}>
                            {user.score.toFixed(2)}%
                        </div>
                    </div>
                ))}
            </div>
            {leaderboardData.length === 0 && (
                <p className="text-center p-5 italic" style={{ color: THEME_COLORS.subtleText }}>
                    No users found with tracked items for the leaderboard.
                </p>
            )}
        </div>
    );
};

export default CircularityLeaderboard;