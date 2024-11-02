import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader } from 'lucide-react';


const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      // Attempt to login
      console.log('Attempting To Login....')
      const result = await login(data.email, data.password);
      console.log('Login Result;' , result);
      
      if (result && result.success) {
        toast.success("Welcome back!", {
          position: toast.POSITION.TOP_CENTER,
        });
        // Explicitly navigate to task-feed after successful login
        setTimeout(() => {
          navigate('/task-feed');
          console.log('Navigation attempted'); // Debug log
        }, 100);
      } else {
        console.log('Login failed' , result)
        toast.error("Invalid credentials. Please try again.", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || "Login failed. Please try again.", {
        position: toast.POSITION.TOP_CENTER,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (email) => {
    try {
      // Implement password reset logic here
      toast.success("Password reset link sent to your email", {
        position: toast.POSITION.TOP_CENTER,
      });
      setIsResetModalOpen(false);
    } catch (error) {
      toast.error("Failed to send reset link", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-blue-200">Sign in to continue to Campus Taskboard</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300" size={20} />
                <input
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  type="email"
                  className="w-full bg-white/5 border border-blue-300/30 rounded-lg px-10 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-red-400 text-sm"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300" size={20} />
                <input
                  {...register("password", { 
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters"
                    }
                  })}
                  type="password"
                  className="w-full bg-white/5 border border-blue-300/30 rounded-lg px-10 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-red-400 text-sm"
                >
                  {errors.password.message}
                </motion.p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsResetModalOpen(true)}
                className="text-sm text-blue-300 hover:text-blue-200 transition-colors"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-3 px-4 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={20} />
                </>
              )}
            </motion.button>

            <p className="text-center text-blue-200">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </motion.div>

      {/* Password Reset Modal */}
      {isResetModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Reset Password</h2>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-white/5 border border-blue-300/30 rounded-lg px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex gap-4">
              <button
                onClick={() => handleResetPassword()}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-2"
              >
                Send Reset Link
              </button>
              <button
                onClick={() => setIsResetModalOpen(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-lg py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Login;