import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { toast } from "react-toastify";
import { Map, FileText, AlignLeft, Clock, Plus, X } from 'lucide-react';

// Memoized option data
const LOCATIONS = [
  "Library",
  "Student Center",
  "Cafeteria",
  "Dormitory",
  "Sports Complex",
  "Academic Building"
];

const URGENCY_LEVELS = [
  { value: "low", label: "Low Priority", color: "#4ADE80" },
  { value: "medium", label: "Medium Priority", color: "#FACC15" },
  { value: "high", label: "High Priority", color: "#EF4444" }
];

// Reusable components
const FormLabel = ({ icon: Icon, children }) => (
  <label className="flex items-center text-sm text-blue-200/80 gap-2 mb-2">
    <Icon className="w-4 h-4" />
    {children}
  </label>
);

const FormInput = ({ error, ...props }) => (
  <input
    {...props}
    className={`w-full px-4 py-3 bg-[#0A1F33]/50 backdrop-blur-sm border 
    ${error ? 'border-red-500' : 'border-[#1E3A5F]'}
    rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400/30
    text-white placeholder-blue-200/30 transition-all duration-300`}
  />
);

const FormTextArea = ({ error, ...props }) => (
  <textarea
    {...props}
    className={`w-full px-4 py-3 bg-[#0A1F33]/50 backdrop-blur-sm border 
    ${error ? 'border-red-500' : 'border-[#1E3A5F]'}
    rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400/30
    text-white placeholder-blue-200/30 transition-all duration-300 min-h-[120px]`}
  />
);

const ErrorMessage = ({ children }) => (
  <span className="text-red-500 text-sm mt-1">{children}</span>
);

const Dropdown = ({ isOpen, onClose, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute w-full mt-2 py-1 bg-[#0A1F33]/95 backdrop-blur-xl border border-[#1E3A5F] rounded-lg shadow-lg z-50"
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

const CreateTask = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    urgency: ''
  });
  const [errors, setErrors] = useState({});
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isUrgencyOpen, setIsUrgencyOpen] = useState(false);
  
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const taskRef = await addDoc(collection(db, 'tasks'), {
        ...formData,
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-[#0B1829] via-[#0A1F33] to-[#0B1829] text-white flex items-center justify-center p-6"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl backdrop-blur-xl bg-[#0A1F33]/30 p-8 rounded-2xl border border-[#1E3A5F] shadow-2xl"
      >
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-bold mb-2" style={{ 
            background: 'linear-gradient(to right, #60A5FA, #3B82F6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Create New Task</h2>
          <p className="text-blue-200/60">Fill in the details to create a new task request</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <FormLabel icon={FileText}>Title</FormLabel>
            <FormInput
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter task title"
              error={errors.title}
            />
            {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
          </div>

          <div className="space-y-2">
            <FormLabel icon={AlignLeft}>Description</FormLabel>
            <FormTextArea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the task in detail"
              error={errors.description}
            />
            {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
          </div>

          <div className="space-y-2 relative">
            <FormLabel icon={Map}>Location</FormLabel>
            <button
              type="button"
              className={`w-full px-4 py-3 bg-[#0A1F33]/50 backdrop-blur-sm border
                ${errors.location ? 'border-red-500' : 'border-[#1E3A5F]'}
                rounded-lg hover:bg-[#1E3A5F]/30 transition-all duration-300 flex items-center justify-between`}
              onClick={() => {
                setIsLocationOpen(!isLocationOpen);
                setIsUrgencyOpen(false);
              }}
            >
              <span className={formData.location ? 'text-white' : 'text-blue-200/30'}>
                {formData.location || 'Select location'}
              </span>
              <motion.span
                animate={{ rotate: isLocationOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isLocationOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </motion.span>
            </button>
            {errors.location && <ErrorMessage>{errors.location}</ErrorMessage>}
            
            <Dropdown isOpen={isLocationOpen} onClose={() => setIsLocationOpen(false)}>
              {LOCATIONS.map((location, index) => (
                <motion.button
                  key={location}
                  type="button"
                  className="w-full px-4 py-2 text-left text-sm hover:bg-[#1E3A5F]/50 transition-colors flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    handleInputChange('location', location);
                    setIsLocationOpen(false);
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  {location}
                </motion.button>
              ))}
            </Dropdown>
          </div>

          <div className="space-y-2 relative">
            <FormLabel icon={Clock}>Urgency</FormLabel>
            <button
              type="button"
              className={`w-full px-4 py-3 bg-[#0A1F33]/50 backdrop-blur-sm border
                ${errors.urgency ? 'border-red-500' : 'border-[#1E3A5F]'}
                rounded-lg hover:bg-[#1E3A5F]/30 transition-all duration-300 flex items-center justify-between`}
              onClick={() => {
                setIsUrgencyOpen(!isUrgencyOpen);
                setIsLocationOpen(false);
              }}
            >
              <span className={formData.urgency ? 'text-white' : 'text-blue-200/30'}>
                {formData.urgency ? 
                  URGENCY_LEVELS.find(u => u.value === formData.urgency)?.label : 
                  'Select urgency'
                }
              </span>
              <motion.span
                animate={{ rotate: isUrgencyOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isUrgencyOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </motion.span>
            </button>
            {errors.urgency && <ErrorMessage>{errors.urgency}</ErrorMessage>}
            
            <Dropdown isOpen={isUrgencyOpen} onClose={() => setIsUrgencyOpen(false)}>
              {URGENCY_LEVELS.map((level, index) => (
                <motion.button
                  key={level.value}
                  type="button"
                  className="w-full px-4 py-2 text-left text-sm hover:bg-[#1E3A5F]/50 transition-colors flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    handleInputChange('urgency', level.value);
                    setIsUrgencyOpen(false);
                  }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: level.color }} />
                  {level.label}
                </motion.button>
              ))}
            </Dropdown>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 px-4 rounded-lg
                     transition-all duration-300 flex items-center justify-center gap-2 hover:opacity-90
                     shadow-lg shadow-blue-500/20 mt-8"
          >
            <Plus className="w-5 h-5" />
            Create Task
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateTask;