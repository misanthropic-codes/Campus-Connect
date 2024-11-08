import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit2 } from 'lucide-react';
import CustomDropdown from './CustomDropdown';

const EditModal = ({ profile, handleEditSubmit, setIsEditing }) => {
  const [editForm, setEditForm] = React.useState({
    displayName: profile.displayName,
    major: profile.major,
    year: profile.year,
    hostel: profile.hostel,
    bio: profile.bio,
    githubUsername: profile.githubUsername,
    linkedinUsername: profile.linkedinUsername,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEditSubmit(editForm);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsEditing(false);
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-gradient-to-br from-indigo-950 to-purple-900 rounded-2xl p-6 w-full max-w-4xl relative my-8"
        >
          <button
            onClick={() => setIsEditing(false)}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 mb-1 font-medium">Display Name</label>
                <input
                  type="text"
                  name="displayName"
                  value={editForm.displayName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40 transition-colors"
                  placeholder="Enter your display name"
                />
              </div>

              <div>
                <label className="block text-white/80 mb-1 font-medium">Major</label>
                <input
                  type="text"
                  name="major"
                  value={editForm.major}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40 transition-colors"
                  placeholder="Enter your major"
                />
              </div>

              <div>
                <label className="block text-white/80 mb-1 font-medium">Year</label>
                <CustomDropdown
                  value={editForm.year}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-white/80 mb-1 font-medium">Hostel</label>
                <input
                  type="text"
                  name="hostel"
                  value={editForm.hostel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40 transition-colors"
                  placeholder="Enter your hostel"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white/80 mb-1 font-medium">Bio</label>
                <textarea
                  name="bio"
                  value={editForm.bio}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40 transition-colors resize-none"
                  rows={4}
                  placeholder="Tell us about yourself"
                />
              </div>

              <div>
                <label className="block text-white/80 mb-1 font-medium">GitHub Username</label>
                <input
                  type="text"
                  name="githubUsername"
                  value={editForm.githubUsername}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40 transition-colors"
                  placeholder="Enter your GitHub username"
                />
              </div>

              <div>
                <label className="block text-white/80 mb-1 font-medium">LinkedIn Username</label>
                <input
                  type="text"
                  name="linkedinUsername"
                  value={editForm.linkedinUsername}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40 transition-colors"
                  placeholder="Enter your LinkedIn username"
                />
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditModal;