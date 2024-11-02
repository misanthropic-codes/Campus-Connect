import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, MapPin, AlertTriangle } from 'lucide-react';

const TaskCard = ({ task }) => {
  const urgencyColors = {
    low: 'bg-green-400/10 text-green-400 border-green-400/20',
    medium: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
    high: 'bg-red-400/10 text-red-400 border-red-400/20'
  };

  const urgencyIcons = {
    low: <AlertTriangle className="w-4 h-4 text-green-400" />,
    medium: <AlertTriangle className="w-4 h-4 text-yellow-400" />,
    high: <AlertTriangle className="w-4 h-4 text-red-400" />
  };

  const statusColors = {
    open: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
    accepted: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
    completed: 'bg-gray-400/10 text-gray-400 border-gray-400/20'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="overflow-hidden"
    >
      <Link to={`/task/${task.id}`} className="block p-6">
        <div className="space-y-4">
          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-100 truncate">
            {task.title}
          </h3>

          {/* Description */}
          <p className="text-gray-400 line-clamp-2 text-sm">
            {task.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {/* Location Tag */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-sm">
              <MapPin className="w-4 h-4" />
              {task.location}
            </div>

            {/* Urgency Tag */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border ${urgencyColors[task.urgency]}`}>
              {urgencyIcons[task.urgency]}
              <span className="text-sm">
                {task.urgency.charAt(0).toUpperCase() + task.urgency.slice(1)}
              </span>
            </div>

            {/* Status Tag */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border ${statusColors[task.status]}`}>
              <span className="text-sm">
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>
              Posted {new Date(task.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default TaskCard;