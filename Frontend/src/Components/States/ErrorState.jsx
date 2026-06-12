import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

const ErrorState = ({ title = "Something went wrong", message, onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center w-full py-12 px-4 text-center liquid-glass rounded-3xl border border-apple-error/20"
    >
      <div className="w-16 h-16 bg-apple-error/10 rounded-full flex items-center justify-center mb-5 shadow-[0_0_20px_rgba(239,68,68,0.15)] border border-apple-error/20">
        <AlertCircle className="w-8 h-8 text-apple-error" />
      </div>
      <h3 className="text-xl font-extrabold text-white mb-2">{title}</h3>
      <p className="text-apple-text-secondary max-w-sm mx-auto mb-6">
        {message}
      </p>

      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="flex items-center gap-2 bg-apple-error text-white px-5 py-2.5 rounded-xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-apple-error/20"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </motion.button>
      )}
    </motion.div>
  );
};

export default ErrorState;
