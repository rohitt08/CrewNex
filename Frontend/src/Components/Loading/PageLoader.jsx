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
        <Loader2 className="w-12 h-12 text-blue-600 drop-shadow-sm" />
      </motion.div>
      <p className="text-slate-500 font-medium tracking-wide">
        {message}
      </p>
    </motion.div>
  );
};

export default PageLoader;



