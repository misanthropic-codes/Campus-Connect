import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateTask = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const taskRef = await addDoc(collection(db, 'tasks'), {
        ...data,
        createdBy: currentUser.uid,
        createdAt: new Date().toISOString(),
        status: 'open',
        claimedBy: null
      });

      toast.success("Task created successfully!"); // Use the toast function directly
      navigate(`/task/${taskRef.id}`);
    } catch (error) {
      toast.error("Failed to create task. Please try again."); // Handle errors appropriately
      console.error("Error creating task:", error); // Log the error for debugging
    }
  };

  const locations = [
    "Library",
    "Student Center",
    "Cafeteria",
    "Dormitory",
    "Sports Complex",
    "Academic Building"
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Create New Task</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            {...register("title", { required: true })}
            className="w-full p-2 border rounded"
          />
          {errors.title && <span className="text-red-500">Title is required</span>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            {...register("description", { required: true })}
            className="w-full p-2 border rounded"
            rows="4"
          />
          {errors.description && <span className="text-red-500">Description is required</span>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Location</label>
          <select
            {...register("location", { required: true })}
            className="w-full p-2 border rounded"
          >
            <option value="">Select location</option>
            {locations.map((location) => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
          {errors.location && <span className="text-red-500">Location is required</span>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Urgency</label>
          <select
            {...register("urgency", { required: true })}
            className="w-full p-2 border rounded"
          >
            <option value="">Select urgency</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {errors.urgency && <span className="text-red-500">Urgency is required</span>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Create Task
        </button>
      </form>
    </div>
  );
};

export default CreateTask;
