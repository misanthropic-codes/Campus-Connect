import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const TestimonialCard = React.memo(({ name, role, content, rating, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    whileHover={{ y: -5 }}
    className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-lg p-8 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
  >
    <div className="flex gap-1 mb-4">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
      ))}
    </div>
    <p className="text-gray-300 mb-6 italic leading-relaxed">"{content}"</p>
    <div>
      <p className="font-medium text-white">{name}</p>
      <p className="text-gray-400 text-sm">{role}</p>
    </div>
  </motion.div>
));

const TestimonialSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJub25lIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==')] bg-[length:50px_50px] opacity-[0.03]"
      />
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
            name="Abhishek Kumar"
            role="Electrical Engineering"
            content="Campus Taskboard has completely changed how our study group collaborates. The real-time updates and task tracking are game-changers!"
            rating={5}
            delay={0.2}
          />
          <TestimonialCard
            name="Atique Alam"
            role="CSE- Data Science"
            content="The interface is intuitive and the features are exactly what we needed for managing group projects. Highly recommended!"
            rating={5}
            delay={0.4}
          />
          <TestimonialCard
            name="Tannu Kumari"
            role="CSE-AI/ML"
            content="Finally, a platform that understands student collaboration. It's helped our engineering team stay organized and efficient."
            rating={5}
            delay={0.6}
          />
        </div>
      </div>
    </section>
  );
};

export default React.memo(TestimonialSection);