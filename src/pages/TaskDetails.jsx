import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from 'framer-motion';

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

        // Fetch poster details
        const posterRef = doc(db, 'users', docSnap.data().createdBy);
        const posterSnap = await getDoc(posterRef);
        setPoster(posterSnap.data());

        // Fetch claimant details if exists
        if (docSnap.data().claimedBy) {
          const claimantRef = doc(db, 'users', docSnap.data().claimedBy);
          const claimantSnap = await getDoc(claimantRef);
          setClaimant(claimantSnap.data());
        }
      }
    };

    fetchTask();

    // Subscribe to messages
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

      // Update helper's score
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

  if (!task) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h1 className="text-3xl font-bold mb-4">{task.title}</h1>
        <div className="mb-6">
          <p className="text-gray-600">{task.description}</p>
          <div className="mt-4 flex gap-4">
            <span className="bg-gray-100 px-3 py-1 rounded-full">
              {task.location}
            </span>
            <span className={`px-3 py-1 rounded-full ${
              task.urgency === 'high' ? 'bg-red-100 text-red-800' :
              task.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {task.urgency.charAt(0).toUpperCase() + task.urgency.slice(1)}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Posted by</h3>
          {poster && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                {poster.displayName?.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{poster.displayName}</p>
                <p className="text-sm text-gray-500">
                  Posted on {new Date(task.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>

        {task.status === 'open' && currentUser.uid !== task.createdBy && (
          <>
            <button
              onClick={handleAcceptTask}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-2"
            >
              Accept Task
            </button>
            <button
              onClick={handleRejectTask}
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Reject Task
            </button>
          </>
        )}

        {task.status === 'accepted' && task.createdBy === currentUser.uid && (
          <button
            onClick={handleMarkComplete}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mb-6"
          >
            Mark as Complete
          </button>
        )}

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Messages</h3>
          <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-3 rounded-lg ${
                  message.senderId === currentUser.uid
                    ? 'bg-blue-100 ml-auto'
                    : 'bg-gray-100'
                } max-w-[80%]`}
              >
                <p className="text-sm font-medium">{message.senderName}</p>
                <p>{message.content}</p>
                <p className="text-xs text-gray-500">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="Type your message..."
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Send
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskDetails;
