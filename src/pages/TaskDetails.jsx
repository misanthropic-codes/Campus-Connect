import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from 'framer-motion';
import { Clock, MapPin, AlertTriangle, Send, User } from 'lucide-react';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [task, setTask] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [poster, setPoster] = useState(null);
  const [claimant, setClaimant] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      const docRef = doc(db, 'tasks', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTask({ id: docSnap.id, ...docSnap.data() });

        const posterRef = doc(db, 'users', docSnap.data().createdBy);
        const posterSnap = await getDoc(posterRef);
        setPoster(posterSnap.data());

        if (docSnap.data().claimedBy) {
          const claimantRef = doc(db, 'users', docSnap.data().claimedBy);
          const claimantSnap = await getDoc(claimantRef);
          setClaimant(claimantSnap.data());
        }
      }
    };

    fetchTask();

    const q = collection(db, `tasks/${id}/messages`);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [id]);

  const handleAcceptTask = async () => {
    try {
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, {
        claimedBy: currentUser.uid,
        status: 'accepted'
      });
      toast.success("Task accepted successfully!");
    } catch (error) {
      toast.error("Failed to accept task. Please try again.");
    }
  };

  const handleRejectTask = async () => {
    try {
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, {
        claimedBy: null,
        status: 'open'
      });
      toast.info("Task rejected.");
    } catch (error) {
      toast.error("Failed to reject task. Please try again.");
    }
  };

  const handleMarkComplete = async () => {
    try {
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, {
        status: 'completed',
        completedAt: new Date().toISOString()
      });

      const helperRef = doc(db, 'users', task.claimedBy);
      const helperSnap = await getDoc(helperRef);
      const currentScore = helperSnap.data().helpfulnessScore || 0;
      await updateDoc(helperRef, {
        helpfulnessScore: currentScore + 1,
        tasksCompleted: (helperSnap.data().tasksCompleted || 0) + 1
      });

      toast.success("Task marked as complete!");
    } catch (error) {
      toast.error("Failed to complete task. Please try again.");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await addDoc(collection(db, `tasks/${id}/messages`), {
        content: newMessage,
        senderId: currentUser.uid,
        senderName: currentUser.displayName,
        createdAt: new Date().toISOString()
      });

      setNewMessage('');
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  if (!task) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-300"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl p-6 mb-6"
        >
          <h1 className="text-3xl font-bold mb-4 text-blue-300">{task.title}</h1>
          <p className="text-gray-300 mb-6">{task.description}</p>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-lg">
              <MapPin className="w-4 h-4 text-blue-300" />
              <span className="text-gray-200">{task.location}</span>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              task.urgency === 'high' ? 'bg-red-900/50 text-red-300' :
              task.urgency === 'medium' ? 'bg-yellow-900/50 text-yellow-300' :
              'bg-green-900/50 text-green-300'
            }`}>
              <AlertTriangle className="w-4 h-4" />
              <span>{task.urgency.charAt(0).toUpperCase() + task.urgency.slice(1)}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-lg">
              <Clock className="w-4 h-4 text-blue-300" />
              <span className="text-gray-200">
                Posted {new Date(task.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {poster && (
            <div className="flex items-center gap-4 mb-6 bg-slate-700/30 p-4 rounded-lg">
              <div className="w-12 h-12 bg-blue-500/30 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-300" />
              </div>
              <div>
                <p className="font-medium text-blue-300">{poster.displayName}</p>
                <p className="text-sm text-gray-400">Task Creator</p>
              </div>
            </div>
          )}

          {task.status === 'open' && currentUser.uid !== task.createdBy && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex gap-4 mb-6"
            >
              <button
                onClick={handleAcceptTask}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors"
              >
                Accept Task
              </button>
              <button
                onClick={handleRejectTask}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors"
              >
                Reject Task
              </button>
            </motion.div>
          )}

          {task.status === 'accepted' && task.createdBy === currentUser.uid && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={handleMarkComplete}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors mb-6"
            >
              Mark as Complete
            </motion.button>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800/50 rounded-lg p-6"
          >
            <h3 className="text-xl font-semibold mb-4 text-blue-300">Messages</h3>
            <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <motion.div
                  initial={{ opacity: 0, x: message.senderId === currentUser.uid ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  key={message.id}
                  className={`p-4 rounded-lg ${
                    message.senderId === currentUser.uid
                      ? 'bg-blue-600/30 ml-auto'
                      : 'bg-slate-700/30'
                  } max-w-[80%]`}
                >
                  <p className="text-sm font-medium text-blue-300">{message.senderName}</p>
                  <p className="text-gray-200 mt-1">{message.content}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </p>
                </motion.div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-slate-700/30 text-gray-200 p-3 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Type your message..."
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </form>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TaskDetails;