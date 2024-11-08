import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const CustomDropdown = ({ value, onChange }) => {
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

  const yearOptions = [
    { value: 'Freshman', label: 'Freshman', description: 'First year undergraduate student' },
    { value: 'Sophomore', label: 'Sophomore', description: 'Second year undergraduate student' },
    { value: 'Junior', label: 'Junior', description: 'Third year undergraduate student' },
    { value: 'Senior', label: 'Senior', description: 'Fourth year undergraduate student' },
    { value: 'Graduate', label: 'Graduate', description: 'Graduate or masters student' },
    { value: 'PhD', label: 'PhD', description: 'Doctoral student' },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
        className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40 flex items-center justify-between group hover:bg-white/20 transition-all duration-200"
      >
        <span>{value || 'Select Year'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isYearDropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isYearDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg shadow-xl overflow-hidden"
          >
            {yearOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange({ target: { name: 'year', value: option.value } });
                  setIsYearDropdownOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-white/20 transition-colors flex flex-col gap-1 border-b border-white/10 last:border-none"
              >
                <span className="text-white font-medium">{option.label}</span>
                <span className="text-white/60 text-sm">{option.description}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomDropdown;