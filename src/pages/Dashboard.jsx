import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { collection, query, where, onSnapshot, orderBy, updateDoc, doc, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import TaskCard from '../components/TaskCard';
import { Tab } from '@headlessui/react';
import { toast } from 'react-toastify';
import { MapPin, AlertTriangle, Library, Coffee, Home, School, Clock, CheckCircle, XCircle } from 'lucide-react';

const StyledSelect = ({ label, icon: Icon, options, value, onChange, iconColors = {} }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full md:w-64">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 bg-[#1a1f2e]/80 hover:bg-[#1a1f2e] border border-gray-700/50 rounded-lg text-gray-300 flex items-center gap-3 text-sm transition-all duration-200"
      >
        <Icon className={`w-4 h-4 ${iconColors[value] || 'text-gray-400'}`} />
        <span className="flex-grow text-left truncate">{value || label}</span>
        <svg
          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-[#1a1f2e] border border-gray-700/50 rounded-lg shadow-xl overflow-hidden">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700/30 flex items-center gap-3 transition-colors duration-150"
              >
                {option.icon}
                <span className="truncate">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const TaskStats = ({ tasks }) => {
  const stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(task => task.status === 'completed').length,
    inProgress: tasks.filter(task => task.status === 'in-progress').length,
  }), [tasks]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {[
        { label: 'Total Tasks', value: stats.total, icon: Clock, color: 'text-blue-400' },
        { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-green-400' },
        { label: 'In Progress', value: stats.inProgress, icon: XCircle, color: 'text-yellow-400' },
      ].map((stat, index) => (
        <div key={index} className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
            <div>
              <p className="text-sm text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [acceptedTasks, setAcceptedTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({
    location: '',
    urgency: '',
    status: 'open'
  });
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    if (!currentUser) {
      toast.error("Please sign in to view tasks");
      setIsLoading(false);
      return;
    }

    const q = query(
      collection(db, 'tasks'),
      where('status', '==', 'open'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching tasks:', error);
        toast.error('Failed to load tasks');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'tasks'),
      where('claimedBy', '==', currentUser.uid),
      where('status', 'in', ['in-progress', 'accepted']),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAcceptedTasks(tasks.filter(task => task.status !== 'completed'));
      },
      (error) => {
        console.error('Error fetching accepted tasks:', error);
        toast.error('Failed to load accepted tasks');
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const handleTaskCompletion = useCallback(async (taskId) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        status: 'completed',
        completedAt: new Date().toISOString(),
      });
      setAcceptedTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success('Task marked as completed!');
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Failed to mark task as completed');
    }
  }, []);

  const handleAcceptTask = useCallback(async (taskId) => {
    if (!currentUser) {
      toast.error('Please sign in to accept tasks');
      return;
    }

    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        status: 'in-progress',
        claimedBy: currentUser.uid,
        acceptedAt: new Date().toISOString(),
      });
      toast.success('Task accepted successfully!');
    } catch (error) {
      console.error('Error accepting task:', error);
      toast.error('Failed to accept task');
    }
  }, [currentUser]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      return (!filter.location || task.location === filter.location) &&
             (!filter.urgency || task.urgency === filter.urgency);
    });
  }, [tasks, filter]);

  const locationOptions = [
    { value: '', label: 'All Locations', icon: <MapPin className="w-4 h-4 text-gray-400" /> },
    { value: 'Library', label: 'Library', icon: <Library className="w-4 h-4 text-gray-400" /> },
    { value: 'Student Center', label: 'Student Center', icon: <School className="w-4 h-4 text-gray-400" /> },
    { value: 'Cafeteria', label: 'Cafeteria', icon: <Coffee className="w-4 h-4 text-gray-400" /> },
    { value: 'Dormitory', label: 'Dormitory', icon: <Home className="w-4 h-4 text-gray-400" /> },
  ];

  const urgencyOptions = [
    { value: '', label: 'All Urgency', icon: <AlertTriangle className="w-4 h-4 text-gray-400" /> },
    { value: 'low', label: 'Low Priority', icon: <AlertTriangle className="w-4 h-4 text-green-400" /> },
    { value: 'medium', label: 'Medium Priority', icon: <AlertTriangle className="w-4 h-4 text-yellow-400" /> },
    { value: 'high', label: 'High Priority', icon: <AlertTriangle className="w-4 h-4 text-red-400" /> },
  ];

  const urgencyColors = {
    low: 'text-green-400',
    medium: 'text-yellow-400',
    high: 'text-red-400'
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1440] via-[#2a1b54] to-[#341b6a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1440] via-[#2a1b54] to-[#341b6a] p-4 md:p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
          Campus Dashboard
        </h1>
        <p className="text-gray-300 text-base md:text-lg">Connect, Help, and Earn on Campus</p>
      </div>

      <div className="max-w-7xl mx-auto backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-4 md:p-8">
        <Tab.Group onChange={setSelectedTab}>
          <Tab.List className="flex space-x-2 md:space-x-4 mb-8 overflow-x-auto">
            {['Available Tasks', 'Accepted Tasks'].map((tab, idx) => (
              <Tab
                key={idx}
                className={({ selected }) =>
                  `px-4 md:px-6 py-2 md:py-3 rounded-2xl font-medium transition-all duration-300 outline-none whitespace-nowrap ${
                    selected
                      ? 'bg-blue-600/30 text-blue-300 shadow-lg border border-blue-400/30 backdrop-blur-md'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                  }`
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>

          {selectedTab === 1 && <TaskStats tasks={acceptedTasks} />}

          <Tab.Panels>
            <Tab.Panel>
              <div className="mb-8 flex flex-col sm:flex-row gap-4">
                <StyledSelect
                  label="Select location"
                  icon={MapPin}
                  options={locationOptions}
                  value={filter.location}
                  onChange={(value) => setFilter({ ...filter, location: value })}
                />
                
                <StyledSelect
                  label="Select urgency"
                  icon={AlertTriangle}
                  options={urgencyOptions}
                  value={filter.urgency}
                  onChange={(value) => setFilter({ ...filter, urgency: value })}
                  iconColors={urgencyColors}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map(task => (
                    <div key={task.id} className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl hover:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                      <TaskCard 
                        task={task}
                        onComplete={handleTaskCompletion}
                        onAccept={handleAcceptTask}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center text-center p-6 md:p-12 backdrop-blur-lg bg-white/5 border border-white/20 rounded-2xl">
                    <p className="text-gray-300 text-lg">
                      No tasks found with the selected filters.
                    </p>
                  </div>
                )}
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {acceptedTasks.length > 0 ? (
                  acceptedTasks.map(task => (
                    <div key={task.id} className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl hover:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                      <TaskCard 
                        task={task}
                        onComplete={handleTaskCompletion}
                        showComplete={true}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center text-center p-6 md:p-12 backdrop-blur-lg bg-white/5 border border-white/20 rounded-2xl">
                    <p className="text-gray-300 text-lg">
                      You haven't accepted any tasks yet.
                    </p>
                  </div>
                )}
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default Dashboard;