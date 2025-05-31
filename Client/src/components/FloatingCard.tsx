import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FloatingCardProps {
  children: ReactNode;
}

export default function FloatingCard({ children }: FloatingCardProps) {
  return (
    <motion.div
      className="relative max-w-4xl mx-auto mt-12"
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        delay: 0.3,
        duration: 0.8,
        type: "spring",
        stiffness: 100,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl transform rotate-1 blur-[2px] -z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/50 to-indigo-500/50 rounded-2xl transform -rotate-1 blur-[3px] opacity-70 -z-10"></div>

      <div className="relative backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 rounded-xl border border-white/20 dark:border-gray-700/30 shadow-2xl p-8 overflow-hidden">
        {/* Animated decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        <motion.div
          className="absolute top-5 right-5 w-20 h-20 rounded-full bg-gradient-to-r from-pink-500/10 to-blue-500/10 blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-8 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
        />

        {children}
      </div>
    </motion.div>
  );
}