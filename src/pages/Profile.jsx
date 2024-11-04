import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import TaskCard from '../components/TaskCard';
import { motion } from 'framer-motion';
import { toast } from "react-toastify";
import { Github, Linkedin, MapPin, GraduationCap, Building2, Calendar, Edit2, X } from 'lucide-react';

const Profile = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: '',
    major: '',
    year: '',
    hostel: '',
    bio: '',
    githubUsername: '',
    linkedinUsername: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'users', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const profileData = { id: docSnap.id, ...docSnap.data() };
          setProfile(profileData);
          setEditForm({
            displayName: profileData.displayName || '',
            major: profileData.major || '',
            year: profileData.year || '',
            hostel: profileData.hostel || '',
            bio: profileData.bio || '',
            githubUsername: profileData.githubUsername || '',
            linkedinUsername: profileData.linkedinUsername || '',
          });
        } else {
          toast.error("Profile not found.");
        }

        const tasksQuery = query(
          collection(db, 'tasks'),
          where('createdBy', '==', id)
        );
        const tasksSnap = await getDocs(tasksQuery);
        setTasks(tasksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const completedQuery = query(
          collection(db, 'tasks'),
          where('claimedBy', '==', id),
          where('status', '==', 'completed')
        );
        const completedSnap = await getDocs(completedQuery);
        setCompletedTasks(completedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        toast.error("Error fetching profile data.");
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(db, 'users', id);
      await updateDoc(userRef, editForm);
      setProfile({ ...profile, ...editForm });
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Error updating profile.");
      console.error("Error updating profile:", error);
    }
  };

  const EditModal = () => (
    isEditing && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-gradient-to-br from-indigo-950 to-purple-900 rounded-2xl p-6 w-full max-w-md relative">
          <button
            onClick={() => setIsEditing(false)}
            className="absolute top-4 right-4 text-white/60 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
          
          <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>
          
          <form onSubmit={handleEditSubmit} className="space-y-4">
            {Object.entries(editForm).map(([key, value]) => (
              <div key={key}>
                <label className="block text-white/80 mb-1 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                {key === 'bio' ? (
                  <textarea
                    value={value}
                    onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40"
                    rows={4}
                  />
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40"
                  />
                )}
              </div>
            ))}
            
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );

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
      <span>{label}</span>
    </motion.a>
  );

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-purple-900 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
      />
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-purple-900 flex items-center justify-center text-white">
      Profile not found.
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-purple-900 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8 mb-8 relative"
        >
          {currentUser && currentUser.uid === id && (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-4 right-4 px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-4xl font-bold text-white shadow-lg"
              >
                {profile.displayName?.charAt(0)}
              </motion.div>
            </div>
            
            <div className="flex-grow">
              <h1 className="text-3xl font-bold text-white mb-4">{profile.displayName}</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-white/80">
                  <GraduationCap className="w-5 h-5" />
                  <span>{profile.major} • {profile.year}</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Building2 className="w-5 h-5" />
                  <span>{profile.hostel || 'No hostel specified'}</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Calendar className="w-5 h-5" />
                  <span>Tasks Completed: {profile.tasksCompleted || 0}</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <MapPin className="w-5 h-5" />
                  <span>Helpfulness Score: {profile.helpfulnessScore || 0}</span>
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

          {profile.bio && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 p-6 backdrop-blur-md bg-white/5 rounded-xl border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-3">About</h3>
              <p className="text-white/80 leading-relaxed">{profile.bio}</p>
            </motion.div>
          )}
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Posted Tasks</h2>
            <div className="space-y-4">
              {tasks.length > 0 ? (
                tasks.map(task => (
                  <motion.div
                    key={task.id}
                    whileHover={{ scale: 1.02 }}
                    className="backdrop-blur-lg bg-white/5 rounded-xl border border-white/10 overflow-hidden"
                  >
                    <TaskCard task={task} />
                  </motion.div>
                ))
              ) : (
                <div className="text-white/60 text-center py-8">No tasks posted yet.</div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Completed Tasks</h2>
            <div className="space-y-4">
              {completedTasks.length > 0 ? (
                completedTasks.map(task => (
                  <motion.div
                    key={task.id}
                    whileHover={{ scale: 1.02 }}
                    className="backdrop-blur-lg bg-white/5 rounded-xl border border-white/10 overflow-hidden"
                  >
                    <TaskCard task={task} />
                  </motion.div>
                ))
              ) : (
                <div className="text-white/60 text-center py-8">No completed tasks found.</div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      <EditModal />
    </div>
  );
};

export default Profile;