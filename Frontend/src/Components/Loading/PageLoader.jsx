import React from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const PageLoader = ({ message = "Loading amazing things..." }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[60vh] flex flex-col items-center justify-center w-full"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="mb-6"
      >
        <Loader2 className="w-12 h-12 text-apple-blue drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
      </motion.div>
      <p className="text-apple-text-secondary font-medium tracking-wide">
        {message}
      </p>
    </motion.div>
  );
};

export default PageLoader;
