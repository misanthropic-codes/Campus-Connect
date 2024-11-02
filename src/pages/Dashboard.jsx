import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import TaskCard from '../components/TaskCard';
import { Tab } from '@headlessui/react';
import { toast } from 'react-toastify';
import { MapPin, AlertTriangle, Library, Coffee, Home, School } from 'lucide-react';

const StyledSelect = ({ label, icon: Icon, options, value, onChange, iconColors = {} }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-64">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 bg-[#1a1f2e]/80 hover:bg-[#1a1f2e] border border-gray-700/50 rounded-lg text-gray-300 flex items-center gap-3 text-sm transition-all duration-200"
      >
        <Icon className={`w-4 h-4 ${iconColors[value] || 'text-gray-400'}`} />
        <span className="flex-grow text-left">{value || label}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
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
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [acceptedTasks, setAcceptedTasks] = useState([]);
  const [filter, setFilter] = useState({
    location: '',
    urgency: '',
    status: 'open'
  });

  useEffect(() => {
    if (!currentUser) {
      toast.error("User not authenticated.");
      return;
    }

    const q = query(
      collection(db, 'tasks'),
      where('status', '==', filter.status),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [filter.status, currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'tasks'),
      where('claimedBy', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAcceptedTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [currentUser]);

  const filteredTasks = tasks.filter(task => {
    return (!filter.location || task.location === filter.location) &&
           (!filter.urgency || task.urgency === filter.urgency);
  });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1440] via-[#2a1b54] to-[#341b6a] p-4 md:p-8">
      {/* Hero Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
          Campus Dashboard
        </h1>
        <p className="text-gray-300 text-lg">Connect, Help, and Earn on Campus</p>
      </div>

      <div className="max-w-7xl mx-auto backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-6 md:p-8">
        <Tab.Group>
          <Tab.List className="flex space-x-4 mb-8">
            {['Available Tasks', 'Accepted Tasks'].map((tab, idx) => (
              <Tab
                key={idx}
                className={({ selected }) =>
                  `px-6 py-3 rounded-2xl font-medium transition-all duration-300 outline-none ${
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

          <Tab.Panels>
            <Tab.Panel>
              <div className="mb-8 flex flex-col md:flex-row gap-4">
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

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map(task => (
                    <div key={task.id} className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl hover:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                      <TaskCard task={task} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center text-center p-12 backdrop-blur-lg bg-white/5 border border-white/20 rounded-2xl">
                    <p className="text-gray-300 text-lg">
                      No tasks found with the selected filters.
                    </p>
                  </div>
                )}
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {acceptedTasks.length > 0 ? (
                  acceptedTasks.map(task => (
                    <div key={task.id} className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl hover:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                      <TaskCard task={task} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center text-center p-12 backdrop-blur-lg bg-white/5 border border-white/20 rounded-2xl">
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