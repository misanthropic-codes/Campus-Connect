import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from 'framer-motion';
import { Clock, MapPin, AlertTriangle, Send, User, CheckCircle } from 'lucide-react';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [task, setTask] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [poster, setPoster] = useState(null);
  const [claimant, setClaimant] = useState(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

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
      setIsAccepted(true);
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
      navigate('/task-feed');  // Redirects to task feed after rejection
    } catch (error) {
      toast.error("Failed to reject task. Please try again.");
    }
  };

  const handleMarkComplete = async () => {
    if (isCompleting || task.status === 'completed') return;
    
    setIsCompleting(true);
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

      setTask(prev => ({ ...prev, status: 'completed' }));
      toast.success("Task marked as complete!");
    } catch (error) {
      toast.error("Failed to complete task. Please try again.");
    } finally {
      setIsCompleting(false);
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

  const navigateToProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const TaskStatusBadge = () => {
    if (!claimant) return null;
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-700/30 p-4 rounded-lg mb-4 sm:mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/30 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-blue-300" />
          </div>
          <div>
            <p className="text-blue-300 font-medium">{claimant.displayName}</p>
            <p className="text-sm text-gray-400">
              {task.status === 'completed' ? 'Completed this task' : 'Currently working on this task'}
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  if (!task) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-300"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 py-4 sm:py-8 px-2 sm:px-4">
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
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl p-4 sm:p-6 mb-4 sm:mb-6"
        >
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-blue-300">{task.title}</h1>
          <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">{task.description}</p>

          <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 bg-slate-700/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-blue-300" />
              <span className="text-gray-200">{task.location}</span>
            </div>
            <div className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm ${
              task.urgency === 'high' ? 'bg-red-900/50 text-red-300' :
              task.urgency === 'medium' ? 'bg-yellow-900/50 text-yellow-300' :
              'bg-green-900/50 text-green-300'
            }`}>
              <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{task.urgency.charAt(0).toUpperCase() + task.urgency.slice(1)}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-700/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-300" />
              <span className="text-gray-200">
                Posted {new Date(task.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {poster && (
            <motion.div 
              onClick={() => navigateToProfile(task.createdBy)}
              className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 bg-slate-700/30 p-3 sm:p-4 rounded-lg cursor-pointer hover:bg-slate-700/40 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/30 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-300" />
              </div>
              <div>
                <p className="font-medium text-blue-300">{poster.displayName}</p>
                <p className="text-xs sm:text-sm text-gray-400">Task Creator • Click to view profile</p>
              </div>
            </motion.div>
          )}

          {task.claimedBy && <TaskStatusBadge />}

          {task.status === 'open' && currentUser.uid !== task.createdBy && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex gap-2 sm:gap-4 mb-4 sm:mb-6"
            >
              <button
                onClick={handleAcceptTask}
                disabled={isAccepted}
                className={`flex-1 py-2 sm:py-3 rounded-lg transition-all duration-300 text-sm sm:text-base ${
                  isAccepted
                    ? 'bg-green-500 text-white cursor-default'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isAccepted ? 'Task Accepted' : 'Accept Task'}
              </button>
              <button
                onClick={handleRejectTask}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
              >
                Reject Task
              </button>
            </motion.div>
          )}

          {(task.status === 'accepted' || task.status === 'completed') && task.createdBy === currentUser.uid && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={handleMarkComplete}
              disabled={task.status === 'completed' || isCompleting}
              className={`w-full py-2 sm:py-3 rounded-lg transition-all duration-300 mb-4 sm:mb-6 text-sm sm:text-base flex items-center justify-center gap-2 ${
                task.status === 'completed'
                  ? 'bg-green-500 cursor-default'
                  : isCompleting
                  ? 'bg-blue-600 opacity-75 cursor-wait'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
              whileHover={task.status !== 'completed' && !isCompleting ? { scale: 1.02 } : {}}
              whileTap={task.status !== 'completed' && !isCompleting ? { scale: 0.98 } : {}}
            >
              {task.status === 'completed' ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Task Completed</span>
                </>
              ) : (
                <>
                  {isCompleting ? 'Completing...' : 'Mark as Complete'}
                </>
              )}
            </motion.button>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800/50 rounded-lg p-3 sm:p-6"
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-blue-300">Messages</h3>
            <div className="space-y-3 sm:space-y-4 mb-4 max-h-72 sm:max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <motion.div
                  initial={{ opacity: 0, x: message.senderId === currentUser.uid ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  key={message.id}
                  className={`p-3 sm:p-4 rounded-lg ${
                    message.senderId === currentUser.uid
                      ? 'bg-blue-600/30 ml-auto'
                      : 'bg-slate-700/30'
                  } max-w-[85%] sm:max-w-[80%]`}
                >
                  <p className="text-xs sm:text-sm font-medium text-blue-300">{message.senderName}</p>
                  <p className="text-sm sm:text-base text-gray-200 mt-1">{message.content}</p>
                  <p className="text-xs text-gray-400 mt-1 sm:mt-2">
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </p>
                </motion.div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2 sm:gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-slate-700/30 text-gray-200 p-2 sm:p-3 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base"
                placeholder="Type your message..."
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 rounded-lg flex items-center gap-2 transition-colors text-sm sm:text-base whitespace-nowrap"
                >
                  <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    );
  };
  
  export default TaskDetails;
