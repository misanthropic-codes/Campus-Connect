import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const TaskFeed = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    urgency: '',
  });

  useEffect(() => {
    // Query all tasks regardless of status
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

  const handleAcceptTask = async (taskId) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        claimedBy: currentUser.uid,
        status: 'accepted'
      });
      toast.success("Task accepted successfully!");
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
    } catch (error) {
      toast.error("Failed to reject task. Please try again.");
    }
  };

  const filteredTasks = tasks.filter(task => {
    return (
      (!filters.location || task.location === filters.location) &&
      (!filters.urgency || task.urgency === filters.urgency) &&
      task.status === 'open' && // Only show open tasks
      task.createdBy !== currentUser.uid // Don't show user's own tasks
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <h1 className="text-3xl font-bold mb-6">Task Feed</h1>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <select
            className="p-2 border rounded"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          >
            <option value="">All Locations</option>
            <option value="Library">Library</option>
            <option value="Student Center">Student Center</option>
            <option value="Cafeteria">Cafeteria</option>
            <option value="Dormitory">Dormitory</option>
          </select>

          <select
            className="p-2 border rounded"
            value={filters.urgency}
            onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
          >
            <option value="">All Urgency</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Task Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map(task => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold mb-2">{task.title}</h2>
              <p className="text-gray-600 mb-4">{task.description}</p>
              
              <div className="flex gap-2 mb-4">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {task.location}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  task.urgency === 'high' ? 'bg-red-100 text-red-800' :
                  task.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {task.urgency.charAt(0).toUpperCase() + task.urgency.slice(1)}
                </span>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleAcceptTask(task.id)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRejectTask(task.id)}
                  className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <p className="text-center text-gray-500">No tasks available at the moment.</p>
        )}
      </motion.div>
    </div>
  );
};

export default TaskFeed;