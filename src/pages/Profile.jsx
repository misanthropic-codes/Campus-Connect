import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import TaskCard from '../components/TaskCard';
import { motion } from 'framer-motion';
import { toast } from "react-toastify";

const Profile = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'users', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile({ id: docSnap.id, ...docSnap.data() });
        } else {
          toast.error("Profile not found.");
        }

        // Fetch created tasks
        const tasksQuery = query(
          collection(db, 'tasks'),
          where('createdBy', '==', id)
        );
        const tasksSnap = await getDocs(tasksQuery);
        setTasks(tasksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // Fetch completed tasks
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

  if (loading) return <div className="text-center">Loading profile...</div>;

  if (!profile) return <div className="text-center">Profile not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6 mb-8"
      >
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold">
            {profile.displayName?.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">{profile.displayName}</h1>
            <p className="text-gray-600">{profile.major} • {profile.year}</p>
            <p className="text-sm text-gray-500 mt-1">
              Helpfulness Score: {profile.helpfulnessScore || 0}
            </p>
            <p className="text-sm text-gray-500">
              Tasks Completed: {profile.tasksCompleted || 0}
            </p>
          </div>
        </div>

        {profile.bio && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">About</h3>
            <p className="text-gray-600">{profile.bio}</p>
          </div>
        )}
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Posted Tasks</h2>
          {tasks.length > 0 ? (
            <div className="space-y-4">
              {tasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <p>No tasks posted yet.</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Completed Tasks</h2>
          {completedTasks.length > 0 ? (
            <div className="space-y-4">
              {completedTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <p>No completed tasks found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
