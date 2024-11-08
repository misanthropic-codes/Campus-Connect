// ProfileBio.jsx
import React from 'react';
import { motion } from 'framer-motion';

const ProfileBio = ({ profile }) => {
  if (!profile.bio) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="p-6 backdrop-blur-md bg-white/5 rounded-xl border border-white/10 mt-8"
    >
      <h3 className="text-xl font-semibold text-white mb-3">About</h3>
      <p className="text-white/80 leading-relaxed">{profile.bio}</p>
    </motion.div>
  );
};

export default ProfileBio;