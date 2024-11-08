import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, MapPin, GraduationCap, Building2, Calendar, Edit2 } from 'lucide-react';
import ProfileBio from './ProfileBio';

const ProfileHeader = ({ profile, currentUser, id, setIsEditing }) => {
  const SocialButton = ({ icon, label, link, color }) => (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${color} text-white font-medium transition-shadow hover:shadow-lg`}
    >
      {icon}
      <span className="text-base">{label}</span>
    </motion.a>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6 mb-8 relative"
    >
      {currentUser && currentUser.uid === id && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-4 right-4 px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors flex items-center gap-2"
        >
          <Edit2 className="w-5 h-5" />
          <span className="text-base">Edit</span>
        </button>
      )}

      <div className="grid grid-cols-[auto_1fr] gap-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-3xl font-bold text-white shadow-lg"
        >
          {profile.displayName?.charAt(0)}
        </motion.div>

        <div>
          <h1 className="text-2xl font-bold text-white mb-2">{profile.displayName}</h1>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-white/80 text-base">
              <GraduationCap className="w-5 h-5" />
              <span>{profile.major} • {profile.year}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-base">
              <Building2 className="w-5 h-5" />
              <span>{profile.hostel || 'No hostel specified'}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-base">
              <Calendar className="w-5 h-5" />
              <span>Tasks: {profile.tasksCompleted || 0}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-base">
              <MapPin className="w-5 h-5" />
              <span>Helpfulness: {profile.helpfulnessScore || 0}</span>
            </div>
          </div>

          <div className="flex gap-4 flex-wrap">
            {profile.githubUsername && (
              <SocialButton
                icon={<Github className="w-5 h-5" />}
                label="GitHub"
                link={`https://github.com/${profile.githubUsername}`}
                color="bg-gray-800"
              />
            )}
            {profile.linkedinUsername && (
              <SocialButton
                icon={<Linkedin className="w-5 h-5" />}
                label="LinkedIn"
                link={`https://linkedin.com/in/${profile.linkedinUsername}`}
                color="bg-blue-600"
              />
            )}
          </div>
        </div>
      </div>

      {profile.bio && <ProfileBio profile={profile} />}
    </motion.div>
  );
};

export default ProfileHeader;