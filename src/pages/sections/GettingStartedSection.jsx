import React from 'react';
import { motion } from 'framer-motion';

const StepCard = React.memo(({ number, title, description, delay }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.02 }}
    className="relative flex gap-6 bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-lg p-8 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
  >
    <motion.div 
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.6 }}
      className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl font-bold"
    >
      {number}
    </motion.div>
    <div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  </motion.div>
));

const GettingStartedSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/50 to-gray-900" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            Get Started in
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent ml-2">
              Four Simple Steps
            </span>
          </h2>
          <p className="text-xl text-gray-400">
            Your journey to better campus collaboration starts here
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <StepCard 
            number="1"
            title="Create Your Account"
            description="Sign up with your student email to access all features and connect with your campus network."
            delay={0.2}
          />
          <StepCard 
            number="2"
            title="Join or Create Teams"
            description="Connect with classmates, form study groups, or join existing project teams."
            delay={0.4}
          />
          <StepCard 
            number="3"
            title="Set Up Your First Project"
            description="Create a project, add tasks, and invite team members to collaborate."
            delay={0.6}
          />
          <StepCard 
            number="4"
            title="Track & Collaborate"
            description="Use real-time updates, chat, and task management to work together effectively."
            delay={0.8}
          />
        </div>
      </div>
    </section>
  );
};

export default React.memo(GettingStartedSection);