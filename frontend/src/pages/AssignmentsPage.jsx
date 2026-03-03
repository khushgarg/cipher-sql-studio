import React, { useState } from 'react';
import { useAssignments } from '../hooks/useAssignments';
import AssignmentCard from '../components/AssignmentCard/AssignmentCard';
import './_assignments-page.scss';

const DIFFICULTIES = ['all', 'easy', 'medium', 'hard'];

const AssignmentsPage = () => {
  const { assignments, loading, error } = useAssignments();
  const [filter, setFilter] = useState('all');

  const filteredAssignments = assignments.filter(a =>
    filter === 'all' || a.difficulty === filter
  );

  const counts = {
    easy: assignments.filter(a => a.difficulty === 'easy').length,
    medium: assignments.filter(a => a.difficulty === 'medium').length,
    hard: assignments.filter(a => a.difficulty === 'hard').length,
  };

  return (
    <div className="assignments-page">
      {/* Hero Section */}
      <div className="assignments-page__hero">
        <div className="assignments-page__hero-content">
          <div className="assignments-page__hero-badge">SQL Practice</div>
          <h1 className="assignments-page__title">
            Master SQL with <span className="assignments-page__title-accent">Real Queries</span>
          </h1>
          <p className="assignments-page__subtitle">
            Write, run, and learn SQL against live databases. Get AI-powered hints when you're stuck.
          </p>
          {!loading && !error && (
            <div className="assignments-page__stats">
              <div className="assignments-page__stat">
                <span className="assignments-page__stat-value">{assignments.length}</span>
                <span className="assignments-page__stat-label">Assignments</span>
              </div>
              <div className="assignments-page__stat-divider" />
              <div className="assignments-page__stat assignments-page__stat--easy">
                <span className="assignments-page__stat-value">{counts.easy}</span>
                <span className="assignments-page__stat-label">Easy</span>
              </div>
              <div className="assignments-page__stat-divider" />
              <div className="assignments-page__stat assignments-page__stat--medium">
                <span className="assignments-page__stat-value">{counts.medium}</span>
                <span className="assignments-page__stat-label">Medium</span>
              </div>
              <div className="assignments-page__stat-divider" />
              <div className="assignments-page__stat assignments-page__stat--hard">
                <span className="assignments-page__stat-value">{counts.hard}</span>
                <span className="assignments-page__stat-label">Hard</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="assignments-page__controls">
        <div className="assignments-page__filters">
          {DIFFICULTIES.map((f) => (
            <button
              key={f}
              id={`filter-${f}`}
              className={`assignments-page__filter ${filter === f ? 'active' : ''} ${f !== 'all' ? `assignments-page__filter--${f}` : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        {!loading && !error && (
          <span className="assignments-page__result-count">
            {filteredAssignments.length} result{filteredAssignments.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="assignments-page__loading">
          <div className="assignments-page__spinner"></div>
          <p>Loading assignments...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="assignments-page__error">
          <span className="assignments-page__error-icon">⚠</span>
          <p>Could not load assignments: {error}</p>
          <p className="assignments-page__error-hint">Make sure the backend server is running on port 5000.</p>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && (
        <div className="assignments-page__grid">
          {filteredAssignments.map((assignment) => (
            <AssignmentCard key={assignment._id} assignment={assignment} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredAssignments.length === 0 && (
        <div className="assignments-page__empty">
          <span className="assignments-page__empty-icon">⬡</span>
          <p>No assignments found for "{filter}" difficulty</p>
        </div>
      )}
    </div>
  );
};

export default AssignmentsPage;
