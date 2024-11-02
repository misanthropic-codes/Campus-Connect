import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { X, ChevronDown, MapPin, AlertTriangle } from 'lucide-react';

const TaskFeed = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({
    location: '',
    urgency: '',
  });
  const [openFilter, setOpenFilter] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, 'tasks'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setOpenFilter(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleAcceptTask = async (taskId) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        claimedBy: currentUser.uid,
        status: 'accepted'
      });
      toast.success("Task accepted successfully!");
      setSelectedTask(null);
    } catch (error) {
      toast.error("Failed to accept task. Please try again.");
    }
  };

  const handleRejectTask = async (taskId) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        status: 'rejected'
      });
      toast.info("Task rejected.");
      setSelectedTask(null);
    } catch (error) {
      toast.error("Failed to reject task. Please try again.");
    }
  };

  const filteredTasks = tasks.filter(task => {
    return (
      (!filters.location || task.location === filters.location) &&
      (!filters.urgency || task.urgency === filters.urgency) &&
      task.status === 'open' &&
      task.createdBy !== currentUser.uid
    );
  });

  const CustomDropdown = ({ type, value, options, onChange }) => (
    <div className="relative">
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          setOpenFilter(openFilter === type ? null : type);
        }}
        className="w-48 px-4 py-2.5 rounded-xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 
                   flex items-center justify-between text-slate-200 hover:bg-slate-800/50 transition-all"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="flex items-center gap-2">
          {type === 'location' ? <MapPin size={16} /> : <AlertTriangle size={16} />}
          {value || `Select ${type}`}
        </span>
        <motion.div
          animate={{ rotate: openFilter === type ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {openFilter === type && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full rounded-xl bg-slate-800/95 backdrop-blur-sm 
                     border border-slate-700/50 shadow-xl overflow-hidden z-50"
          >
            {options.map((option) => (
              <motion.button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setOpenFilter(null);
                }}
                className={`w-full px-4 py-2.5 text-left text-slate-200 flex items-center gap-2
                          hover:bg-slate-700/50 transition-colors
                          ${value === option.value ? 'bg-blue-600/20' : ''}`}
                whileHover={{ x: 4 }}
              >
                {option.icon}
                {option.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,theme(colors.slate.800/40),theme(colors.slate.900/60)_30%,theme(colors.slate.900)_50%)] bg-[#0B1021]">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold text-white mb-2">Task Feed</h1>
            <p className="text-slate-400">Discover and collaborate on campus tasks</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <CustomDropdown
              type="location"
              value={filters.location}
              onChange={(value) => setFilters({ ...filters, location: value })}
              options={[
                { value: '', label: 'All Locations', icon: <MapPin size={16} /> },
                { value: 'Library', label: 'Library', icon: <MapPin size={16} /> },
                { value: 'Student Center', label: 'Student Center', icon: <MapPin size={16} /> },
                { value: 'Cafeteria', label: 'Cafeteria', icon: <MapPin size={16} /> },
                { value: 'Dormitory', label: 'Dormitory', icon: <MapPin size={16} /> },
              ]}
            />

            <CustomDropdown
              type="urgency"
              value={filters.urgency}
              onChange={(value) => setFilters({ ...filters, urgency: value })}
              options={[
                { value: '', label: 'All Urgency', icon: <AlertTriangle size={16} /> },
                { value: 'low', label: 'Low Priority', icon: <AlertTriangle size={16} className="text-green-400" /> },
                { value: 'medium', label: 'Medium Priority', icon: <AlertTriangle size={16} className="text-yellow-400" /> },
                { value: 'high', label: 'High Priority', icon: <AlertTriangle size={16} className="text-red-400" /> },
              ]}
            />
          </div>

          {/* Task Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredTasks.map(task => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  onClick={() => setSelectedTask(task)}
                  className="group bg-slate-800/20 hover:bg-slate-800/30 backdrop-blur-md rounded-xl p-6 
                           cursor-pointer border border-slate-700/30 hover:border-slate-600/50 
                           shadow-lg transition-all duration-300"
                >
                  <h2 className="text-xl font-semibold mb-2 text-white group-hover:text-blue-400 transition-colors">
                    {task.title}
                  </h2>
                  <p className="text-slate-400 mb-4 line-clamp-2">{task.description}</p>
                  
                  <div className="flex gap-2 mb-4">
                    <span className="bg-slate-700/30 px-3 py-1 rounded-full text-sm text-slate-300 flex items-center gap-1">
                      <MapPin size={12} />
                      {task.location}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1
                      ${task.urgency === 'high' ? 'bg-red-500/20 text-red-300' :
                        task.urgency === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-green-500/20 text-green-300'}`}
                    >
                      <AlertTriangle size={12} />
                      {task.urgency.charAt(0).toUpperCase() + task.urgency.slice(1)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Task Detail Modal */}
          <AnimatePresence>
            {selectedTask && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50"
                onClick={() => setSelectedTask(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  onClick={e => e.stopPropagation()}
                  className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-8 max-w-2xl w-full 
                           border border-slate-700/50 text-white shadow-2xl"
                >
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedTask(null)}
                      className="absolute -top-2 -right-2 p-2 rounded-full bg-slate-800 text-slate-400 
                               hover:text-white hover:bg-slate-700 transition-colors"
                    >
                      <X size={20} />
                    </motion.button>

                    <h2 className="text-2xl font-bold mb-4 text-white">{selectedTask.title}</h2>
                    <p className="text-slate-300 mb-6 leading-relaxed">{selectedTask.description}</p>

                    <div className="flex gap-3 mb-8">
                      <span className="bg-slate-800/50 px-4 py-2 rounded-lg text-sm text-slate-300 
                                   flex items-center gap-2">
                        <MapPin size={16} />
                        {selectedTask.location}
                      </span>
                      <span className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2
                        ${selectedTask.urgency === 'high' ? 'bg-red-500/20 text-red-300' :
                          selectedTask.urgency === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-green-500/20 text-green-300'}`}
                      >
                        <AlertTriangle size={16} />
                        {selectedTask.urgency.charAt(0).toUpperCase() + selectedTask.urgency.slice(1)} Priority
                      </span>
                    </div>

                    <div className="flex gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAcceptTask(selectedTask.id)}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-medium
                                 transition-colors shadow-lg shadow-blue-500/20"
                      >
                        Accept Task
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleRejectTask(selectedTask.id)}
                        className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 py-3 rounded-xl font-medium
                                 transition-colors"
                      >
                        Reject Task
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {filteredTasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-slate-400">No tasks available at the moment.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TaskFeed;