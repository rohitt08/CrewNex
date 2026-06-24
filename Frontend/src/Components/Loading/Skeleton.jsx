import React from "react";
import { motion } from "framer-motion";

export const Skeleton = ({ className = "", style = {} }) => {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
      className={`bg-white/50 border border-slate-200 overflow-hidden relative ${className}`}
      style={style}
    >
      {/* Shimmer effect */}
      <div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent "
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
        }}
      ></div>
    </motion.div>
  );
};

export const ProjectCardSkeleton = () => (
  <Skeleton className="h-[380px] w-full rounded-2xl" />
);



