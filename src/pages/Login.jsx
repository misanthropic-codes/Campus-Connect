import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader } from 'lucide-react';

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const onSubmit = async (data) => {
    if (isSuccess) {
      navigate('/dashboard');
      return;
    }

    try {
      const result = await login(data.email, data.password);
      
      if (result && result.success) {
        setIsSuccess(true);
        reset();
        
        toast.success("Welcome back! Redirecting to dashboard...", {
          position: "top-center",
          autoClose: 2000,
        });

        // Auto-navigate to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || "Login failed. Please try again.", {
        position: "top-center",
      });
      setIsSuccess(false);
    }
  };

  const handleResetPassword = useCallback(async (email) => {
    try {
      // Implement password reset logic here
      toast.info("Password reset link sent to your email", {
        position: "top-center",
      });
      setIsResetModalOpen(false);
    } catch (error) {
      toast.error("Failed to send reset link", {
        position: "top-center",
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-purple-900 py-12 px-4">
      <ToastContainer position="top-center" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto backdrop-blur-lg bg-white/10 p-8 rounded-xl shadow-2xl border border-white/20"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {isSuccess ? "Login Successful!" : "Welcome Back"}
          </h1>
          <p className="text-white/70">Sign in to continue to your dashboard</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {!isSuccess && (
            <>
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={20} />
                  <input
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    type="email"
                    className="w-full p-3 pl-10 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                    placeholder="Enter your email"
                    disabled={isSubmitting || isSuccess}
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
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={20} />
                  <input
                    {...register("password", { 
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                      }
                    })}
                    type="password"
                    className="w-full p-3 pl-10 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                    placeholder="Enter your password"
                    disabled={isSubmitting || isSuccess}
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
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  disabled={isSubmitting}
                >
                  Forgot password?
                </button>
              </div>
            </>
          )}

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
                <span>Signing In...</span>
              </>
            ) : isSuccess ? (
              "Continue to Dashboard"
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={20} />
              </>
            )}
          </motion.button>

          {!isSuccess && (
            <p className="text-white/70 text-center mt-4">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-400 hover:text-blue-300">
                Sign up here
              </Link>
            </p>
          )}
        </form>
      </motion.div>

      {/* Password Reset Modal */}
      {isResetModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 w-full max-w-md border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Reset Password</h2>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
            />
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleResetPassword()}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 transition-colors"
              >
                Send Reset Link
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsResetModalOpen(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-lg py-2 transition-colors"
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Login;