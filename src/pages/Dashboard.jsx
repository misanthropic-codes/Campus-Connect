import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import TaskCard from '../components/TaskCard';
import { Tab } from '@headlessui/react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [acceptedTasks, setAcceptedTasks] = useState([]);
  const [filter, setFilter] = useState({
    location: '',
    urgency: '',
    status: 'open'
  });

  useEffect(() => {
    if (!currentUser) {
      toast.error("User not authenticated.");
      return;
    }

    const q = query(
      collection(db, 'tasks'),
      where('status', '==', filter.status),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [filter.status, currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'tasks'),
      where('claimedBy', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAcceptedTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [currentUser]);

  const filteredTasks = tasks.filter(task => {
    return (!filter.location || task.location === filter.location) &&
           (!filter.urgency || task.urgency === filter.urgency);
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <Tab.Group>
        <Tab.List className="flex space-x-4 mb-8">
          {['Available Tasks', 'Accepted Tasks'].map((tab, idx) => (
            <Tab key={idx} className={({ selected }) =>
              `px-4 py-2 rounded-lg ${selected ? 'bg-blue-600 text-white' : 'bg-gray-200'}`
            }>
              {tab}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels>
          <Tab.Panel>
            <div className="mb-6 flex gap-4">
              <select
                className="p-2 border rounded"
                value={filter.location}
                onChange={(e) => setFilter({ ...filter, location: e.target.value })}
              >
                <option value="">All Locations</option>
                <option value="Library">Library</option>
                <option value="Student Center">Student Center</option>
                <option value="Cafeteria">Cafeteria</option>
                <option value="Dormitory">Dormitory</option>
              </select>

              <select
                className="p-2 border rounded"
                value={filter.urgency}
                onChange={(e) => setFilter({ ...filter, urgency: e.target.value })}
              >
                <option value="">All Urgency</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.length > 0 ? (
                filteredTasks.map(task => <TaskCard key={task.id} task={task} />)
              ) : (
                <p className="text-gray-500">No tasks found with the selected filters.</p>
              )}
            </div>
          </Tab.Panel>

          <Tab.Panel>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {acceptedTasks.length > 0 ? (
                acceptedTasks.map(task => <TaskCard key={task.id} task={task} />)
              ) : (
                <p className="text-gray-500">You have not accepted any tasks.</p>
              )}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Dashboard;
