import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from 'framer-motion';
import { Github, Linkedin } from 'lucide-react';

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
          bio: data.bio,
          hostel: data.hostel,
          githubUsername: data.githubUsername,
          linkedinUsername: data.linkedinUsername
        });

        toast.success("Account created successfully!");
        navigate('/dashboard');
      } catch (error) {
        toast.error(`Error: ${error.message}`);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-purple-900 py-12 px-4">
        <ToastContainer />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto backdrop-blur-lg bg-white/10 p-8 rounded-xl shadow-2xl border border-white/20"
        >
          <h2 className="text-3xl font-bold mb-8 text-white text-center">Create Your Account</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Display Name</label>
                <input
                  {...register("displayName", { required: true })}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your name"
                />
                {errors.displayName && <span className="text-red-400 text-sm">Display name is required</span>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-white">Email</label>
                <input
                  type="email"
                  {...register("email", {
                    required: true,
                    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                  })}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="student@university.edu"
                />
                {errors.email && <span className="text-red-400 text-sm">Valid email is required</span>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-white">Password</label>
                <input
                  type="password"
                  {...register("password", { required: true, minLength: 6 })}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                {errors.password && <span className="text-red-400 text-sm">Password must be at least 6 characters</span>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-white">Major</label>
                <input
                  {...register("major", { required: true })}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your major"
                />
                {errors.major && <span className="text-red-400 text-sm">Major is required</span>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-white">Year</label>
                <select
                  {...register("year", { required: true })}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="" className="bg-indigo-950">Select year</option>
                  <option value="Freshman" className="bg-indigo-950">Freshman</option>
                  <option value="Sophomore" className="bg-indigo-950">Sophomore</option>
                  <option value="Junior" className="bg-indigo-950">Junior</option>
                  <option value="Senior" className="bg-indigo-950">Senior</option>
                  <option value="Graduate" className="bg-indigo-950">Graduate</option>
                </select>
                {errors.year && <span className="text-red-400 text-sm">Year is required</span>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-white">Hostel</label>
                <input
                  {...register("hostel", { required: true })}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your hostel name"
                />
                {errors.hostel && <span className="text-red-400 text-sm">Hostel is required</span>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  <Github className="inline w-4 h-4 mr-1" /> GitHub Username
                </label>
                <input
                  {...register("githubUsername")}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  <Linkedin className="inline w-4 h-4 mr-1" /> LinkedIn Username
                </label>
                <input
                  {...register("linkedinUsername")}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">Bio</label>
              <textarea
                {...register("bio")}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Tell us about yourself..."
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
            >
              Create Account
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
};

export default Signup;