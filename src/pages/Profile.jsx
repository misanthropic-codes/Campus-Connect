import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import ProfileHeader from '../components/ProfileHeader';
import TaskList from '../components/TaskList';
import EditModal from '../components/EditModal';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from "react-toastify";

const Profile = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'users', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const profileData = { id: docSnap.id, ...docSnap.data() };
          setProfile(profileData);
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

  const handleEditSubmit = async (editForm) => {
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
        <ProfileHeader profile={profile} currentUser={currentUser} id={id} setIsEditing={setIsEditing} />
        <TaskList tasks={tasks} completedTasks={completedTasks} />
        <AnimatePresence>
          {isEditing && (
            <EditModal
              profile={profile}
              handleEditSubmit={handleEditSubmit}
              setIsEditing={setIsEditing}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;