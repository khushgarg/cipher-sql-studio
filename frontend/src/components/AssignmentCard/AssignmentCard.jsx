import React from 'react';
import { Link } from 'react-router-dom';
import DifficultyBadge from '../DifficultyBadge/DifficultyBadge';
import './_assignment-card.scss';

const AssignmentCard = ({ assignment }) => {
  return (
    <Link 
      to={`/attempt/${assignment._id}`} 
      className={`assignment-card assignment-card--${assignment.difficulty}`}
    >
      <div className="assignment-card__header">
        <h3 className="assignment-card__title">{assignment.title}</h3>
        <DifficultyBadge difficulty={assignment.difficulty} />
      </div>
      <p className="assignment-card__description">{assignment.description}</p>
    </Link>
  );
};

export default AssignmentCard;
