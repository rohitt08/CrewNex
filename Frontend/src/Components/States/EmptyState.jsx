import React from "react";
import { motion } from "framer-motion";

// eslint-disable-next-line no-unused-vars
const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className="flex flex-col items-center justify-center w-full py-16 px-4 text-center liquid-glass rounded-3xl border border-dashed border-apple-glass-border relative overflow-hidden group"
    >
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-apple-blue/5 rounded-full blur-2xl group-hover:bg-apple-blue/10 transition-colors duration-500 pointer-events-none"></div>

      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="w-20 h-20 liquid-glass rounded-full flex items-center justify-center mb-6 shadow-sm border border-apple-glass-border relative z-10"
      >
        <Icon className="w-10 h-10 text-apple-blue" />
      </motion.div>
      <h3 className="text-2xl font-extrabold text-white mb-3 relative z-10">
        {title}
      </h3>
      <p className="text-apple-text-secondary max-w-md mx-auto mb-8 text-lg relative z-10">
        {description}
      </p>
      {action && <div className="mt-2 relative z-10">{action}</div>}
    </motion.div>
  );
};

export default EmptyState;
