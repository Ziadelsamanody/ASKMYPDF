"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PdfUploader from "../components/PdfUploader";
import PdfChat from "../components/PdfChat";
import ParticleBackground from "../components/ParticleBackground";
import FloatingCard from "../components/FloatingCard";

export default function Home() {
  const [activePdf, setActivePdf] = useState<string | null>(null);
  const [theme, setTheme] = useState<'cosmic' | 'neon' | 'vibrant'>('cosmic');

  return (
    <div className={`min-h-screen transition-all duration-700 ${theme === 'cosmic' ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800' :
      theme === 'neon' ? 'bg-gradient-to-br from-black via-violet-950 to-indigo-950' :
        'bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-400'
      }`}>
      <ParticleBackground intensity={theme === 'neon' ? 'high' : 'medium'} />

      <div className="absolute top-4 right-4 flex space-x-2 z-20">
        {['cosmic', 'neon', 'vibrant'].map((t) => (
          <motion.button
            key={t}
            onClick={() => setTheme(t as any)}
            className={`w-8 h-8 rounded-full border-2 ${theme === t ? 'scale-125 border-white' : 'border-gray-400'}`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            style={{
              background: t === 'cosmic' ? 'linear-gradient(135deg, #4f46e5, #9333ea, #ec4899)' :
                t === 'neon' ? 'linear-gradient(135deg, #000000, #4c1d95, #1e40af)' :
                  'linear-gradient(135deg, #2563eb, #06b6d4, #10b981)'
            }}
          />
        ))}
      </div>

      <div className="container mx-auto py-16 px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
        >
          <motion.div
            className="w-32 h-32 mx-auto mb-8 relative perspective-800"
            initial={{ rotateY: -180 }}
            animate={{ rotateY: 0 }}
            transition={{ duration: 1.2, ease: "backOut" }}
            whileHover={{ rotateY: 15, rotateX: 15, scale: 1.1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-blue-600 rounded-2xl rotate-3 shadow-[0_0_30px_rgba(147,51,234,0.5)]"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-transparent backdrop-blur-sm rounded-xl rotate-6"></div>
            <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 rounded-xl border-2 border-blue-400 dark:border-blue-500 flex items-center justify-center overflow-hidden">
              <motion.span
                className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
                initial={{ y: 40 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
              >
                PDF
              </motion.span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 100, opacity: 0.7 }}
                transition={{
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 1.5,
                  ease: "easeInOut",
                  repeatDelay: 0.5
                }}
              />
            </div>
          </motion.div>

          <motion.h1
            className="text-7xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 dark:from-blue-300 dark:via-purple-400 dark:to-pink-400 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          >
            Ask My PDF
          </motion.h1>

          <motion.div
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <motion.div
              className="absolute -left-6 -top-10 text-5xl opacity-25"
              animate={{
                rotateZ: [0, 10, 0, 10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              ✨
            </motion.div>
            Upload your PDF document and ask questions to get
            <motion.span
              className="relative inline-block mx-2 font-medium"
              whileHover={{ scale: 1.05 }}
            >
              <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-orange-500">instant answers</span>
              <motion.span
                className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-pink-500/30 to-orange-500/30 -z-0 rounded-md"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 1, duration: 0.8 }}
              />
            </motion.span>
            powered by AI.
            <motion.div
              className="absolute -right-4 -bottom-8 text-5xl opacity-25"
              animate={{
                rotateZ: [0, -10, 0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1
              }}
            >
              🚀
            </motion.div>
          </motion.div>
        </motion.div>

        <FloatingCard>
          <AnimatePresence mode="wait">
            {!activePdf ? (
              <motion.div
                key="uploader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PdfUploader onUploadSuccess={setActivePdf} />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-8">
                  <motion.div
                    className="flex items-center space-x-3"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Chat with your PDF</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">File: {activePdf}</p>
                    </div>
                  </motion.div>

                  <motion.button
                    onClick={() => setActivePdf(null)}
                    className="px-4 py-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 dark:from-gray-800 dark:to-gray-700 dark:hover:from-gray-700 dark:hover:to-gray-600 rounded-lg text-sm shadow-md"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="flex items-center space-x-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      <span>Upload different PDF</span>
                    </span>
                  </motion.button>
                </div>

                <PdfChat pdfName={activePdf} />
              </motion.div>
            )}
          </AnimatePresence>
        </FloatingCard>
      </div>
    </div>
  );
}
