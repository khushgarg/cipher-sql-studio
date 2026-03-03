import React from 'react';
import './_difficulty-badge.scss';

const DifficultyBadge = ({ difficulty }) => {
  return (
    <span className={`difficulty-badge difficulty-badge--${difficulty}`}>
      {difficulty}
    </span>
  );
};

export default DifficultyBadge;
