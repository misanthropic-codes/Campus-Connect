import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Star, ArrowRight, Users, Clock, Target, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'; // Adjust the import path as needed

// Lazy load components that aren't immediately visible
const TestimonialSection = lazy(() => import('./sections/TestimonialSection'));
const FeaturesSection = lazy(() => import('./sections/FeaturesSection'));
const GettingStartedSection = lazy(() => import('./sections/GettingStartedSection'));

// Memoize static components
const StatCard = React.memo(({ value, label, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.05, y: -5 }}
    className="flex flex-col items-center bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
  >
    <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
      {value}
    </span>
    <span className="text-gray-400 mt-2 font-medium">{label}</span>
  </motion.div>
));

const ScrollIndicator = React.memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 0 }}
    animate={{ opacity: 1, y: [0, 10, 0] }}
    transition={{ duration: 1.5, repeat: Infinity }}
    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
  >
    <span className="text-sm text-gray-400">Scroll to explore</span>
    <ChevronDown className="w-6 h-6 text-blue-400" />
  </motion.div>
));

const LoadingFallback = () => (
  <div className="w-full h-64 flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);

const Home = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], ['0%', '50%']);
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();

  const handleGetStarted = () => {
    if (currentUser) {
      navigate('/task-feed');
    } else {
      navigate('/login', { 
        state: { 
          from: '/',
          message: 'Please log in to continue'
        }
      });
    }
  };

  // Preload critical assets
  useEffect(() => {
    const preloadImages = () => {
      const images = [
        // Add your critical image URLs here
        // '/assets/hero-bg.webp',
        // '/assets/features-bg.webp',
      ];
      images.forEach(image => {
        new Image().src = image;
      });
    };
    preloadImages();
  }, []);

  // Show loading state while auth is initializing
  if (loading) {
    return <LoadingFallback />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-gray-900"
          style={{ y: backgroundY }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl lg:text-7xl font-bold mb-6"
              >
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Transform
                </span>
                <br />
                Campus Collaboration
              </motion.h1>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGetStarted}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center gap-2 font-medium overflow-hidden hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {currentUser ? 'Go to Dashboard' : 'Get Started Free'}
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </button>
                <Link
                  to="/demo"
                  className="px-8 py-4 border border-gray-700 hover:border-blue-500 rounded-xl text-center transition-colors hover:bg-blue-500/10"
                >
                  Watch Demo
                </Link>
              </div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-8 flex items-center gap-4 text-gray-400"
              >
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 border-2 border-gray-900"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm">Trusted by 1000+ students</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Stats Grid */}
            <div className="relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative grid grid-cols-2 gap-4"
              >
                <StatCard value="Task" label="Realtime Updates" delay={0.2} />
                <StatCard value="Collaborate" label="Effectively" delay={0.4} />
                <StatCard value="Build" label="Network" delay={0.6} />
                <StatCard value="Showcase" label="Skills" delay={0.8} />
              </motion.div>
            </div>
          </div>
        </div>
        <motion.div style={{ opacity }}>
          <ScrollIndicator />
        </motion.div>
      </section>

      {/* Lazy loaded sections */}
      <Suspense fallback={<LoadingFallback />}>
        <FeaturesSection />
        <GettingStartedSection />
        <TestimonialSection />
      </Suspense>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Campus Connect. All rights reserved.</p>
          <p> Built with ❤️ by team 10xDevs</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default React.memo(Home);