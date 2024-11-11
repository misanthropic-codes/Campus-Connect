import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, MapPin, AlertTriangle } from 'lucide-react';

const TaskCard = ({ task, onComplete, showComplete }) => {
  const urgencyColors = {
    low: 'bg-green-400/10 text-green-400 border-green-400/20',
    medium: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
    high: 'bg-red-900/50 text-red-300'
  };

  const urgencyIcons = {
    low: <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />,
    medium: <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />,
    high: <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-red-300" />
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
      }
    }
    return 'Just now';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="overflow-hidden w-full"
    >
      <Link 
        to={`/task/${task.id}`} 
        className="block bg-slate-900/20 backdrop-blur-sm rounded-xl p-4 space-y-3"
      >
        <div className="space-y-2">
          {/* Title */}
          <h3 className="text-xl font-semibold text-blue-300">
            {task.title}
          </h3>
          
          {/* Description */}
          <p className="text-sm text-gray-300 line-clamp-2">
            {task.description}
          </p>

          {/* Tags and Status */}
          <div className="flex flex-wrap gap-2 mt-3">
            {/* Location Tag */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg 
                          bg-white/5 border border-white/10 text-gray-200 text-sm">
              <MapPin className="w-4 h-4 text-blue-300" />
              {task.location}
            </div>

            {/* Urgency Tag */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg 
                          ${urgencyColors[task.urgency]} text-sm`}>
              {urgencyIcons[task.urgency]}
              <span className="capitalize">
                {task.urgency}
              </span>
            </div>

            {/* Accepted Status */}
            {task.status === 'accepted' && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg 
                            bg-blue-500/20 text-blue-300 text-sm border border-blue-500/30">
                Accepted
              </div>
            )}
          </div>

          {/* Footer - Time */}
          <div className="flex items-center text-sm text-gray-400 pt-2">
            <Clock className="w-4 h-4 mr-1.5" />
            <span>Posted {getTimeAgo(task.createdAt)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default TaskCard;