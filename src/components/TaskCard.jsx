import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const TaskCard = ({ task }) => {
  const urgencyColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const statusColors = {
    open: 'text-green-600',
    accepted: 'text-blue-600',
    completed: 'text-gray-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white p-6 rounded-lg shadow-md transition-transform duration-150"
    >
      <Link to={`/task/${task.id}`} className="block">
        <h3 className="text-xl font-semibold mb-2 truncate">{task.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{task.description}</p>
        
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 rounded-full text-sm ${urgencyColors[task.urgency]}`}>
            {task.urgency.charAt(0).toUpperCase() + task.urgency.slice(1)}
          </span>
          <span className={`text-sm ${statusColors[task.status]}`}>
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Posted {new Date(task.createdAt).toLocaleDateString()}
        </div>
      </Link>
    </motion.div>
  );
};

export default TaskCard;
