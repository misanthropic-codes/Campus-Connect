import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from 'framer-motion';
import { Github, Linkedin, Loader } from 'lucide-react';

const Signup = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [isSuccess, setIsSuccess] = useState(false);

    const onSubmit = async (data) => {
      if (isSuccess) {
        navigate('/login');
        return;
      }

      try {
        // Disable form while submitting
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
        setIsSuccess(true);
        reset(); // Reset form data
        
        // Auto-navigate to login after 3 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);

      } catch (error) {
        toast.error(error.message || "An error occurred during signup");
        setIsSuccess(false);
      }
    };

    // Memoized form fields to prevent unnecessary re-renders
    const formFields = (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Display Name</label>
          <input
            {...register("displayName", { 
              required: "Display name is required",
              minLength: { value: 2, message: "Name must be at least 2 characters" }
            })}
            disabled={isSubmitting || isSuccess}
            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            placeholder="Your name"
          />
          {errors.displayName && <span className="text-red-400 text-sm">{errors.displayName.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-white">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Please enter a valid email"
              }
            })}
            disabled={isSubmitting || isSuccess}
            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            placeholder="student@university.edu"
          />
          {errors.email && <span className="text-red-400 text-sm">{errors.email.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-white">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters"
              },
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                message: "Password must contain at least one letter and one number"
              }
            })}
            disabled={isSubmitting || isSuccess}
            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            placeholder="••••••••"
          />
          {errors.password && <span className="text-red-400 text-sm">{errors.password.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-white">Major</label>
          <input
            {...register("major", { required: "Major is required" })}
            disabled={isSubmitting || isSuccess}
            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            placeholder="Your major"
          />
          {errors.major && <span className="text-red-400 text-sm">{errors.major.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-white">Year</label>
          <select
            {...register("year", { required: "Year is required" })}
            disabled={isSubmitting || isSuccess}
            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          >
            <option value="" className="bg-indigo-950">Select year</option>
            <option value="Freshman" className="bg-indigo-950">Freshman</option>
            <option value="Sophomore" className="bg-indigo-950">Sophomore</option>
            <option value="Junior" className="bg-indigo-950">Junior</option>
            <option value="Senior" className="bg-indigo-950">Senior</option>
            <option value="Graduate" className="bg-indigo-950">Graduate</option>
          </select>
          {errors.year && <span className="text-red-400 text-sm">{errors.year.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-white">Hostel</label>
          <input
            {...register("hostel", { required: "Hostel is required" })}
            disabled={isSubmitting || isSuccess}
            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            placeholder="Your hostel name"
          />
          {errors.hostel && <span className="text-red-400 text-sm">{errors.hostel.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-white">
            <Github className="inline w-4 h-4 mr-1" /> GitHub Username
          </label>
          <input
            {...register("githubUsername")}
            disabled={isSubmitting || isSuccess}
            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            placeholder="username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-white">
            <Linkedin className="inline w-4 h-4 mr-1" /> LinkedIn Username
          </label>
          <input
            {...register("linkedinUsername")}
            disabled={isSubmitting || isSuccess}
            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            placeholder="username"
          />
        </div>
      </div>
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-purple-900 py-12 px-4">
        <ToastContainer position="top-center" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto backdrop-blur-lg bg-white/10 p-8 rounded-xl shadow-2xl border border-white/20"
        >
          <h2 className="text-3xl font-bold mb-8 text-white text-center">
            {isSuccess ? "Account Created!" : "Create Your Account"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {!isSuccess && formFields}

            <div>
              <label className="block text-sm font-medium mb-1 text-white">Bio</label>
              <textarea
                {...register("bio")}
                disabled={isSubmitting || isSuccess}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                rows="3"
                placeholder="Tell us about yourself..."
              />
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className={`w-full flex justify-center items-center space-x-2 py-3 rounded-lg font-medium shadow-lg transition-all duration-300 ${
                isSuccess
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
              } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  <span>Creating Account...</span>
                </>
              ) : isSuccess ? (
                "Continue to Dashboard"
              ) : (
                "Create Account"
              )}
            </motion.button>

            {!isSuccess && (
              <p className="text-white/70 text-center mt-4">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-400 hover:text-blue-300">
                  Login here
                </Link>
              </p>
            )}
          </form>
        </motion.div>
      </div>
    );
};

export default Signup;