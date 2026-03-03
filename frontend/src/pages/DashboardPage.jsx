import React from 'react';
import { Link } from 'react-router-dom';
import './_dashboard.scss';

const DashboardPage = () => {
    return (
        <div className="dashboard-page">
            <div className="dashboard-page__coming">
                <span className="dashboard-page__icon">📊</span>
                <h1>Dashboard</h1>
                <p>Your personal progress, streaks, and stats — coming in Phase 4!</p>
                <Link to="/" className="dashboard-page__back">← Back to Practice</Link>
            </div>
        </div>
    );
};

export default DashboardPage;
