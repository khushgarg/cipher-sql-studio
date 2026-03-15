import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyProgress } from '../services/api';
import './_dashboard.scss';

const DashboardPage = () => {
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const response = await getMyProgress();
                setProgress(response.data);
            } catch (err) {
                setError(err.response?.data?.error || err.message || 'Failed to fetch progress');
            } finally {
                setLoading(false);
            }
        };
        fetchProgress();
    }, []);

    if (loading) return <div className="dashboard-page__loading"><div className="dashboard-page__spinner"></div><p>Loading your stats...</p></div>;
    if (error) return <div className="dashboard-page__error"><p>{error}</p></div>;
    if (!progress) return null;

    const diff = progress.byDifficulty || { easy: 0, medium: 0, hard: 0 };
    const total = (diff.easy + diff.medium + diff.hard) || 1; // avoid /0

    return (
        <div className="dashboard-page">
            <div className="dashboard-page__header">
                <h1>Your Learning Dashboard</h1>
                <p>Track your SQL mastery journey and maintain your daily streak.</p>
            </div>

            <div className="dashboard-page__stats-grid">
                {/* Streak Widget */}
                <div className="dashboard-page__card dashboard-page__card--streak">
                    <div className="dashboard-page__card-icon">🔥</div>
                    <div className="dashboard-page__card-info">
                        <h3>{progress.streakCount} Day{progress.streakCount !== 1 ? 's' : ''}</h3>
                        <span>Current Streak</span>
                        <div className="dashboard-page__streak-longest">
                            Longest: {progress.longestStreak}
                        </div>
                    </div>
                </div>

                {/* Global Progress Widget */}
                <div className="dashboard-page__card">
                    <div className="dashboard-page__card-icon">🎯</div>
                    <div className="dashboard-page__card-info">
                        <h3>{progress.totalSolved} Queries</h3>
                        <span>Total Solved</span>
                    </div>
                </div>

                {/* Accuracy Widget */}
                <div className="dashboard-page__card">
                    <div className="dashboard-page__card-icon">⚡</div>
                    <div className="dashboard-page__card-info">
                        <h3>{progress.totalAttempts > 0 ? Math.round((progress.totalSolved / progress.totalAttempts) * 100) : 0}%</h3>
                        <span>Accuracy Rate</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-page__main-content">
                <div className="dashboard-page__left">
                    <div className="dashboard-page__panel">
                        <h2>Difficulty Breakdown</h2>
                        <div className="dashboard-page__breakdown">
                            <div className="dashboard-page__bar">
                                <div className="dashboard-page__bar-label">Easy <span>{diff.easy}</span></div>
                                <div className="dashboard-page__bar-track">
                                    <div className="dashboard-page__bar-fill dashboard-page__bar-fill--easy" style={{ width: `${(diff.easy / total) * 100}%` }}></div>
                                </div>
                            </div>
                            <div className="dashboard-page__bar">
                                <div className="dashboard-page__bar-label">Medium <span>{diff.medium}</span></div>
                                <div className="dashboard-page__bar-track">
                                    <div className="dashboard-page__bar-fill dashboard-page__bar-fill--medium" style={{ width: `${(diff.medium / total) * 100}%` }}></div>
                                </div>
                            </div>
                            <div className="dashboard-page__bar">
                                <div className="dashboard-page__bar-label">Hard <span>{diff.hard}</span></div>
                                <div className="dashboard-page__bar-track">
                                    <div className="dashboard-page__bar-fill dashboard-page__bar-fill--hard" style={{ width: `${(diff.hard / total) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-page__right">
                    <div className="dashboard-page__panel">
                        <h2>Recent Activity</h2>
                        {progress.recentSolved && progress.recentSolved.length > 0 ? (
                            <ul className="dashboard-page__activity-list">
                                {progress.recentSolved.map((activity, idx) => (
                                    <li key={idx} className="dashboard-page__activity-item">
                                        <span className={`dashboard-page__activity-diff ${activity.difficulty}`}>{activity.difficulty}</span>
                                        <span className="dashboard-page__activity-title">{activity.title}</span>
                                        <span className="dashboard-page__activity-date">{new Date(activity.solvedAt).toLocaleDateString()}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="dashboard-page__activity-empty">
                                <p>No successful attempts yet. Go practice!</p>
                                <Link to="/" className="btn-primary">Start Practicing</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
