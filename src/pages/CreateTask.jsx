import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { toast } from "react-toastify";

const CreateTask = () => {
  const [isLocationOpen, setIsLocationOpen] = React.useState(false);
  const [isUrgencyOpen, setIsUrgencyOpen] = React.useState(false);
  const [selectedLocation, setSelectedLocation] = React.useState('');
  const [selectedUrgency, setSelectedUrgency] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [errors, setErrors] = React.useState({});
  
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const locations = [
    "Library",
    "Student Center",
    "Cafeteria",
    "Dormitory",
    "Sports Complex",
    "Academic Building"
  ];

  const urgencyLevels = [
    { value: "low", label: "Low Priority", color: "#4ADE80" },
    { value: "medium", label: "Medium Priority", color: "#FACC15" },
    { value: "high", label: "High Priority", color: "#EF4444" }
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!selectedLocation) newErrors.location = 'Location is required';
    if (!selectedUrgency) newErrors.urgency = 'Urgency is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const taskRef = await addDoc(collection(db, 'tasks'), {
        title,
        description,
        location: selectedLocation,
        urgency: selectedUrgency,
        createdBy: currentUser.uid,
        createdAt: new Date().toISOString(),
        status: 'open',
        claimedBy: null
      });
      
      toast.success("Task created successfully!");
      navigate(`/task/${taskRef.id}`);
    } catch (error) {
      toast.error("Failed to create task. Please try again.");
      console.error("Error creating task:", error);
    }
  };

  // Your existing icon components remain the same
  const MapIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );

  const FileIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );

  const AlignIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="21" y1="10" x2="3" y2="10" />
      <line x1="21" y1="6" x2="3" y2="6" />
      <line x1="21" y1="14" x2="3" y2="14" />
      <line x1="21" y1="18" x2="3" y2="18" />
    </svg>
  );

  const ClockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );

  const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1829] via-[#0A1F33] to-[#0B1829] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-3xl backdrop-blur-xl bg-[#0A1F33]/30 p-8 rounded-2xl border border-[#1E3A5F] shadow-2xl">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2" style={{ 
            background: 'linear-gradient(to right, #60A5FA, #3B82F6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Create New Task</h2>
          <p className="text-blue-200/60">Fill in the details to create a new task request</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="flex items-center text-sm text-blue-200/80 gap-2">
              <FileIcon />
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-3 bg-[#0A1F33]/50 backdrop-blur-sm border ${
                errors.title ? 'border-red-500' : 'border-[#1E3A5F]'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400/30
                       text-white placeholder-blue-200/30 transition-all duration-300`}
              placeholder="Enter task title"
            />
            {errors.title && (
              <span className="text-red-500 text-sm">{errors.title}</span>
            )}
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label className="flex items-center text-sm text-blue-200/80 gap-2">
              <AlignIcon />
              Description
            </label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-4 py-3 bg-[#0A1F33]/50 backdrop-blur-sm border ${
                errors.description ? 'border-red-500' : 'border-[#1E3A5F]'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400/30
                       text-white placeholder-blue-200/30 transition-all duration-300`}
              placeholder="Describe the task in detail"
            />
            {errors.description && (
              <span className="text-red-500 text-sm">{errors.description}</span>
            )}
          </div>

          {/* Location Dropdown */}
          <div className="space-y-2 relative">
            <label className="flex items-center text-sm text-blue-200/80 gap-2">
              <MapIcon />
              Location
            </label>
            <button
              type="button"
              className={`w-full px-4 py-3 bg-[#0A1F33]/50 backdrop-blur-sm border ${
                errors.location ? 'border-red-500' : 'border-[#1E3A5F]'
              } rounded-lg hover:bg-[#1E3A5F]/30 transition-all duration-300 flex items-center justify-between`}
              onClick={() => {
                setIsLocationOpen(!isLocationOpen);
                setIsUrgencyOpen(false);
              }}
            >
              <span className={`${selectedLocation ? 'text-white' : 'text-blue-200/30'}`}>
                {selectedLocation || 'Select location'}
              </span>
              <motion.span
                animate={{ rotate: isLocationOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-blue-200/50"
              >
                ▼
              </motion.span>
            </button>
            {errors.location && (
              <span className="text-red-500 text-sm">{errors.location}</span>
            )}
            <AnimatePresence>
              {isLocationOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute w-full mt-2 py-1 bg-[#0A1F33]/95 backdrop-blur-xl border border-[#1E3A5F] rounded-lg shadow-lg z-50"
                >
                  {locations.map((location, index) => (
                    <motion.button
                      key={location}
                      type="button"
                      className="w-full px-4 py-2 text-left text-sm hover:bg-[#1E3A5F]/50 transition-colors flex items-center gap-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        setSelectedLocation(location);
                        setIsLocationOpen(false);
                      }}
                    >
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      {location}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Urgency Dropdown */}
          <div className="space-y-2 relative">
            <label className="flex items-center text-sm text-blue-200/80 gap-2">
              <ClockIcon />
              Urgency
            </label>
            <button
              type="button"
              className={`w-full px-4 py-3 bg-[#0A1F33]/50 backdrop-blur-sm border ${
                errors.urgency ? 'border-red-500' : 'border-[#1E3A5F]'
              } rounded-lg hover:bg-[#1E3A5F]/30 transition-all duration-300 flex items-center justify-between`}
              onClick={() => {
                setIsUrgencyOpen(!isUrgencyOpen);
                setIsLocationOpen(false);
              }}
            >
              <span className={`${selectedUrgency ? 'text-white' : 'text-blue-200/30'}`}>
                {selectedUrgency ? 
                  urgencyLevels.find(u => u.value === selectedUrgency)?.label : 
                  'Select urgency'
                }
              </span>
              <motion.span
                animate={{ rotate: isUrgencyOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-blue-200/50"
              >
                ▼
              </motion.span>
            </button>
            {errors.urgency && (
              <span className="text-red-500 text-sm">{errors.urgency}</span>
            )}
            <AnimatePresence>
              {isUrgencyOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute w-full mt-2 py-1 bg-[#0A1F33]/95 backdrop-blur-xl border border-[#1E3A5F] rounded-lg shadow-lg z-50"
                >
                  {urgencyLevels.map((level, index) => (
                    <motion.button
                      key={level.value}
                      type="button"
                      className="w-full px-4 py-2 text-left text-sm hover:bg-[#1E3A5F]/50 transition-colors flex items-center gap-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        setSelectedUrgency(level.value);
                        setIsUrgencyOpen(false);
                      }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: level.color }} />
                      {level.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 px-4 rounded-lg
                     transition-all duration-300 flex items-center justify-center gap-2 hover:opacity-90
                     shadow-lg shadow-blue-500/20"
          >
            <PlusIcon />
            Create Task
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;