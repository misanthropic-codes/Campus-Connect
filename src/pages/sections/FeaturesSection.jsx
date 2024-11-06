import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Clock } from 'lucide-react';

const FeatureCard = React.memo(({ icon: Icon, title, description, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    whileHover={{ y: -5 }}
    className="group p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
  >
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 mb-4">
        <motion.div 
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
          className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors"
        >
          <Icon className="w-6 h-6 text-blue-400" />
        </motion.div>
        <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
      </div>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  </motion.div>
));

const FeaturesSection = () => {
  return (
    <section className="py-24 relative">
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
            Everything you need for
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent ml-2">
              seamless collaboration
            </span>
          </h2>
          <p className="text-xl text-gray-400">
            Powerful features designed for modern campus life
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={Target}
            title="Smart Task Management"
            description="Organize tasks with intelligent prioritization and automated workflows"
            delay={0.2}
          />
          <FeatureCard
            icon={Users}
            title="Team Collaboration"
            description="Connect with peers, share resources, and work together seamlessly"
            delay={0.4}
          />
          <FeatureCard
            icon={Clock}
            title="Real-time Updates"
            description="Stay informed with instant notifications and progress tracking"
            delay={0.6}
          />
        </div>
      </div>
    </section>
  );
};

export default React.memo(FeaturesSection);