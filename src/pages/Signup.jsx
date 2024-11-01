import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from 'framer-motion';

const Signup = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signup } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
      try {
        await signup(data.email, data.password, {
          displayName: data.displayName,
          major: data.major,
          year: data.year,
          bio: data.bio
        });

        toast.success("Account created successfully!");
        navigate('/dashboard');
      } catch (error) {
        toast.error(`Error: ${error.message}`);
      }
    };

    return (
      <div className="container mx-auto px-4 py-8">
        <ToastContainer />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Display Name</label>
              <input
                {...register("displayName", { required: true })}
                className="w-full p-2 border rounded"
              />
              {errors.displayName && <span className="text-red-500">Display name is required</span>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                {...register("email", {
                  required: true,
                  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                })}
                className="w-full p-2 border rounded"
              />
              {errors.email && <span className="text-red-500">Valid email is required</span>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                {...register("password", { required: true, minLength: 6 })}
                className="w-full p-2 border rounded"
              />
              {errors.password && <span className="text-red-500">Password must be at least 6 characters</span>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Major</label>
              <input
                {...register("major", { required: true })}
                className="w-full p-2 border rounded"
              />
              {errors.major && <span className="text-red-500">Major is required</span>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Year</label>
              <select
                {...register("year", { required: true })}
                className="w-full p-2 border rounded"
              >
                <option value="">Select year</option>
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Graduate">Graduate</option>
              </select>
              {errors.year && <span className="text-red-500">Year is required</span>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea
                {...register("bio")}
                className="w-full p-2 border rounded"
                rows="3"
                placeholder="Tell us about yourself..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Sign Up
            </button>
          </form>
        </motion.div>
      </div>
    );
  };

  export default Signup;
