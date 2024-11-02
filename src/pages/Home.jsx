import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Icon Components
const IconArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const IconUsers = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconStar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const IconClock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
  </svg>
);

const IconTarget = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);

const StatCard = ({ value, label, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    className="flex flex-col items-center bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300"
  >
    <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
      {value}
    </span>
    <span className="text-gray-400 mt-2">{label}</span>
  </motion.div>
);

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    className="group p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
    
  >
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
          <Icon className="w-6 h-6 text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
      </div>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const TestimonialCard = ({ name, role, content, rating, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    className="bg-gray-800/30 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
  >
    <div className="flex gap-1 mb-4">
      {[...Array(rating)].map((_, i) => (
        <IconStar key={i} className="w-5 h-5 text-yellow-400" />
      ))}
    </div>
    <p className="text-gray-300 mb-4 italic">"{content}"</p>
    <div>
      <p className="font-medium text-white">{name}</p>
      <p className="text-gray-400 text-sm">{role}</p>
    </div>
  </motion.div>
);

const StepCard = ({ number, title, description, delay }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    className="relative flex gap-4 bg-gray-800/30 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
  >
    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl font-bold">
      {number}
    </div>
    <div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  </motion.div>
);

const Home = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-gray-900"
          style={{ 
            backgroundPositionY: scrollY * 0.5,
            backgroundSize: `100% ${100 + scrollY * 0.2}%`
          }}
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJub25lIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==')] bg-[length:50px_50px] opacity-[0.03]"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Transform
                </span>
                <br />
                Campus Collaboration
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Revolutionize how you manage tasks, connect with peers, and achieve success together. 
                Your all-in-one platform for campus productivity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/signup"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center gap-2 font-medium overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started Free
                    <IconArrowRight className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link
                  to="/demo"
                  className="px-8 py-4 border border-gray-700 hover:border-blue-500 rounded-xl text-center transition-colors"
                >
                  Watch Demo
                </Link>
              </div>
            </motion.div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-3xl"></div>
              <div className="relative grid grid-cols-2 gap-4">
                <motion.div className="div"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}  >
                <StatCard value="Task" label="Realtime Updates" delay={0.2} />
                </motion.div>
                <motion.div className="div"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}>
                <StatCard value="Collaborate" label="Effectively" delay={0.4} />
                </motion.div>
                <motion.div className="div"
                 whileHover={{ scale: 1.04 }}
                 whileTap={{ scale: 0.98 }}
                 transition={{ type: "spring", stiffness: 500, damping: 25 }}>
                <StatCard value="Build" label="Network" delay={0.6} />
                </motion.div>
                <motion.div className="div"
                 whileHover={{ scale: 1.04 }}
                 whileTap={{ scale: 0.98 }}
                 transition={{ type: "spring", stiffness: 500, damping: 25 }}>
                <StatCard value="Showcase" label="Skills" delay={0.8} />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started Guide Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/50 to-gray-900"></div>
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

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/50 to-gray-900"></div>
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
              icon={IconTarget}
              title="Smart Task Management"
              description="Organize tasks with intelligent prioritization and automated workflows"
              delay={0.2}
            />
            <FeatureCard
              icon={IconUsers}
              title="Team Collaboration"
              description="Connect with peers, share resources, and work together seamlessly"
              delay={0.4}
            />
            <FeatureCard
              icon={IconClock}
              title="Real-time Updates"
              description="Stay informed with instant notifications and progress tracking"
              delay={0.6}
            />

</div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Trusted by
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent ml-2">
                students nationwide
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              Join thousands of students already transforming their academic journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TestimonialCard
              name="Sarah Johnson"
              role="Computer Science Major"
              content="Campus Taskboard has completely changed how our study group collaborates. The real-time updates and task tracking are game-changers!"
              rating={5}
              delay={0.2}
            />
            <TestimonialCard
              name="Michael Chen"
              role="Business Administration"
              content="The interface is intuitive and the features are exactly what we needed for managing group projects. Highly recommended!"
              rating={5}
              delay={0.4}
            />
            <TestimonialCard
              name="Emily Rodriguez"
              role="Engineering Student"
              content="Finally, a platform that understands student collaboration. It's helped our engineering team stay organized and efficient."
              rating={5}
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900"></div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8"
        >
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            Ready to
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent ml-2">
              transform
            </span>
            <br />
            your campus experience?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of students and start collaborating smarter today.
          </p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link
              to="/signup"
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center gap-2 font-medium overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started Free
                <IconArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link
              to="/demo"
              className="px-8 py-4 border border-gray-700 hover:border-blue-500 rounded-xl text-center transition-colors"
            >
              Watch Demo
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center text-gray-400">
            <p className="mb-4">&copy; {new Date().getFullYear()} Campus Taskboard. All rights reserved.</p>
            <p className="mb-4">Built with ❤️ by Team 10xDev.</p>
            <div className="flex justify-center gap-4">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </motion.div>
      </footer>
    </div>
  );
};

export default Home;