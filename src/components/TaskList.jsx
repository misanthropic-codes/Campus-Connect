// TaskList.jsx
import React from 'react';
import { motion } from 'framer-motion';
import TaskCard from './TaskCard';

const TaskList = ({ tasks, completedTasks }) => {
  return (
    <div className="grid md:grid-cols-2 gap-8 mb-12">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Posted Tasks</h2>
        <div className="space-y-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <motion.div
                key={task.id}
                whileHover={{ scale: 1.02 }}
                className="backdrop-blur-lg bg-white/5 rounded-xl border border-white/10 overflow-hidden"
              >
                <TaskCard task={task} />
              </motion.div>
            ))
          ) : (
            <div className="text-white/60 text-center py-6 backdrop-blur-lg bg-white/5 rounded-xl border border-white/10">
              No tasks posted yet.
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Completed Tasks</h2>
        <div className="space-y-4">
          {completedTasks.length > 0 ? (
            completedTasks.map((task) => (
              <motion.div
                key={task.id}
                whileHover={{ scale: 1.02 }}
                className="backdrop-blur-lg bg-white/5 rounded-xl border border-white/10 overflow-hidden"
              >
                <TaskCard task={task} />
              </motion.div>
            ))
          ) : (
            <div className="text-white/60 text-center py-6 backdrop-blur-lg bg-white/5 rounded-xl border border-white/10">
              No completed tasks found.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TaskList;
