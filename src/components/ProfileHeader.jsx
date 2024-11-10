import React from 'react';
import { 
  Github, 
  Linkedin, 
  MapPin, 
  GraduationCap, 
  Building2, 
  Calendar, 
  Edit2 
} from 'lucide-react';
import ProfileBio from './ProfileBio';

const ProfileHeader = ({ profile, currentUser, id, setIsEditing }) => {
  const SocialButton = ({ icon, label, link, color }) => (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${color} text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95`}
    >
      {icon}
      <span className="text-sm sm:text-base">{label}</span>
    </a>
  );

  const StatItem = ({ icon, text }) => (
    <div className="flex items-center gap-2 text-white/80 text-sm sm:text-base">
      {icon}
      <span className="truncate">{text}</span>
    </div>
  );

  return (
    <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-4 sm:p-7 mb-8 relative animate-fadeIn">
      {currentUser && currentUser.uid === id && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-4 right-4 px-3 sm:px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors flex items-center gap-2"
          aria-label="Edit profile"
        >
          <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline text-sm sm:text-base">Edit</span>
        </button>
      )}

      <div className="flex flex-col sm:grid sm:grid-cols-[auto_1fr] gap-5 sm:gap-7">
        <div className="flex justify-center sm:block">
          <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-3xl sm:text-5xl font-bold text-white shadow-lg transition-transform duration-200 hover:scale-105">
            {profile.displayName?.charAt(0)}
          </div>
        </div>

        <div className="flex-1">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3 text-center sm:text-left">
            {profile.displayName}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 mb-5">
            <StatItem 
              icon={<GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />}
              text={`${profile.major} • ${profile.year}`}
            />
            <StatItem 
              icon={<Building2 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />}
              text={profile.hostel || 'No hostel specified'}
            />
            <StatItem 
              icon={<Calendar className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />}
              text={`Tasks: ${profile.tasksCompleted || 0}`}
            />
            <StatItem 
              icon={<MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />}
              text={`Helpfulness: ${profile.helpfulnessScore || 0}`}
            />
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-5 justify-center sm:justify-start">
            {profile.githubUsername && (
              <SocialButton
                icon={<Github className="w-4 h-4 sm:w-5 sm:h-5" />}
                label="GitHub"
                link={`https://github.com/${profile.githubUsername}`}
                color="bg-gray-800"
              />
            )}
            {profile.linkedinUsername && (
              <SocialButton
                icon={<Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />}
                label="LinkedIn"
                link={`https://linkedin.com/in/${profile.linkedinUsername}`}
                color="bg-blue-600"
              />
            )}
          </div>
        </div>
      </div>

      {profile.bio && (
        <div className="mt-5">
          <ProfileBio profile={profile} />
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;