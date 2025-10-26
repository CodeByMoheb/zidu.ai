import React from 'react';

interface StatsTriggerProps {
  onClick: () => void;
}

const StatsTrigger: React.FC<StatsTriggerProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="text-xs text-gray-600 hover:text-gray-400 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-500 rounded"
    >
      Admin Stats
    </button>
  );
};

export default StatsTrigger;
