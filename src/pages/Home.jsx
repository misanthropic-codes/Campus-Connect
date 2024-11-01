import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-900 to-black px-4 text-center">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Campus Taskboard
        </motion.h1>
        <motion.p
          className="text-lg md:text-2xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Manage tasks, collaborate, and get things done with ease.
        </motion.p>
        <div className="flex justify-center space-x-4">
          <Link to="/signup" className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all">
            Get Started
          </Link>
          <Link to="/about" className="px-8 py-3 bg-transparent border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-semibold text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg hover:shadow-lg transition-shadow flex flex-col items-center">
            <h3 className="text-xl font-medium mb-2 text-center">Task Posting</h3>
            <p className="text-gray-400 text-center">Easily post and manage tasks with intuitive tools.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg hover:shadow-lg transition-shadow flex flex-col items-center">
            <h3 className="text-xl font-medium mb-2 text-center">Real-Time Updates</h3>
            <p className="text-gray-400 text-center">Get notified instantly for new and urgent tasks.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg hover:shadow-lg transition-shadow flex flex-col items-center">
            <h3 className="text-xl font-medium mb-2 text-center">Community Collaboration</h3>
            <p className="text-gray-400 text-center">Work together and share progress with peers.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-blue-900 text-center">
        <h2 className="text-3xl font-semibold mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            className="bg-gray-900 p-6 rounded-lg mx-auto" // Centering using mx-auto
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold mb-2">Step 1</h3>
            <p className="text-gray-400">Sign up and create your account to get started.</p>
          </motion.div>
          <motion.div 
            className="bg-gray-900 p-6 rounded-lg mx-auto" // Centering using mx-auto
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold mb-2">Step 2</h3>
            <p className="text-gray-400">Browse tasks and select ones that match your skills.</p>
          </motion.div>
          <motion.div 
            className="bg-gray-900 p-6 rounded-lg mx-auto" // Centering using mx-auto
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold mb-2">Step 3</h3>
            <p className="text-gray-400">Communicate and collaborate to complete the tasks.</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-400 py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Campus Taskboard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
