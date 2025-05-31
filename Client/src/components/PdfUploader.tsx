"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSpring, animated } from 'react-spring';

export default function PdfUploader({ onUploadSuccess }: { onUploadSuccess: (filename: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const uploadPdf = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:5000/upload_pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        }
      });
      return response.data;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (!file || !file.name.endsWith('.pdf')) {
      toast.error('Please upload a PDF file');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const toastId = toast.loading('Uploading PDF...');

    try {
      await uploadPdf(file);

      toast.update(toastId, {
        render: 'PDF uploaded successfully! Analyzing document...',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });

      setTimeout(() => {
        onUploadSuccess(file.name.replace('.pdf', ''));
      }, 1500);
    } catch (error) {
      console.error('Upload error:', error);
      toast.update(toastId, {
        render: 'Failed to upload PDF',
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    disabled: uploading,
    onDragEnter: () => setDragOver(true),
    onDragLeave: () => setDragOver(false),
    onDropAccepted: () => setDragOver(false),
    onDropRejected: () => setDragOver(false)
  });

  const [{ transform, boxShadow }, api] = useSpring(() => ({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
    boxShadow: '0 10px 30px -15px rgba(0, 0, 0, 0.2)',
    config: { mass: 1, tension: 170, friction: 26 }
  }));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (uploading) return;

    const container = e.currentTarget;
    const { left, top, width, height } = container.getBoundingClientRect();

    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    const rotateX = 10 * (0.5 - y);
    const rotateY = 10 * (x - 0.5);

    api.start({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`,
      boxShadow: `
        0 ${10 + Math.abs(rotateY)}px ${30 + Math.abs(rotateY) * 2}px -15px rgba(0, 0, 0, 0.2),
        0 0 20px rgba(59, 130, 246, ${dragOver ? 0.5 : 0.1})
      `
    });
  };

  const handleMouseLeave = () => {
    if (uploading) return;

    api.start({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
      boxShadow: '0 10px 30px -15px rgba(0, 0, 0, 0.2)'
    });
  };

  const particleCount = 20;
  const particles = Array(particleCount).fill(0).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 10 + 5,
    duration: Math.random() * 20 + 10
  }));

  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-3">
          Upload Your PDF
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
          Upload your document and let AI help you extract insights and answer questions about the content.
        </p>
      </motion.div>

      <div className="relative">
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-blue-400/10 dark:bg-blue-600/10 blur-md"
              style={{
                width: particle.size,
                height: particle.size,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              animate={{
                x: [0, Math.random() * 50 - 25],
                y: [0, Math.random() * 50 - 25],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                repeat: Infinity,
                duration: particle.duration,
                repeatType: "reverse"
              }}
            />
          ))}
        </div>

        <animated.div
          style={{ transform, boxShadow }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative z-10"
        >
          <div
            {...getRootProps()}
            className={`
              relative overflow-hidden p-12 border-3 border-dashed rounded-2xl 
              cursor-pointer transition-all duration-300 
              ${isDragActive || dragOver
                ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-700'
              }
              backdrop-blur-sm
              ${uploading ? 'pointer-events-none' : ''}
            `}
          >
            <input {...getInputProps()} />

            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24 mb-6">
                  <motion.div
                    className="absolute inset-0 rounded-full bg-blue-100 dark:bg-blue-900/30"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                  <svg className="absolute inset-0 w-full h-full text-blue-600 animate-spin-slow" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 10C73.1 10 92 28.9 92 52C92 75.1 73.1 94 50 94C26.9 94 8 75.1 8 52C8 28.9 26.9 10 50 10Z" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeDasharray="16 16" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {uploadProgress}%
                    </span>
                  </div>
                </div>

                <div className="w-64 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    style={{ width: `${uploadProgress}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ type: "spring", stiffness: 50 }}
                  />
                </div>

                <p className="font-medium mt-4 text-blue-600 dark:text-blue-400">
                  Uploading your PDF...
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Please wait while we process your document
                </p>
              </div>
            ) : isDragActive ? (
              <div className="flex flex-col items-center">
                <motion.div
                  className="w-24 h-24 mb-6 rounded-full bg-blue-500/10 flex items-center justify-center"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [-5, 5, -5, 0],
                    y: [0, -10, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.svg
                    className="w-12 h-12 text-blue-600 dark:text-blue-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <path
                      d="M4 16L4 17C4 18.6569 5.34315 20 7 20L17 20C18.6569 20 20 18.6569 20 17L20 16"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    />
                    <path
                      d="M16 12L12 8M12 8L8 12M12 8L12 16"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    />
                  </motion.svg>
                </motion.div>

                <motion.p
                  className="text-xl font-medium text-blue-600 dark:text-blue-400"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  Release to upload PDF!
                </motion.p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  We'll start processing right away
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <motion.div
                  className="w-24 h-24 mb-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center relative overflow-hidden shadow-inner"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    className="absolute w-full h-full bg-blue-400/10 rounded-full"
                    animate={{ scale: [0, 3], opacity: [0.5, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, repeatDelay: 0.5 }}
                  />
                  <motion.div
                    className="absolute w-full h-full bg-indigo-400/10 rounded-full"
                    animate={{ scale: [0, 3], opacity: [0.5, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, delay: 0.8, repeatDelay: 0.5 }}
                  />

                  <motion.svg
                    className="w-12 h-12 text-blue-600 dark:text-blue-400 relative z-10"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    animate={{
                      rotate: [0, 0, -5, 5, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      repeatDelay: 5,
                      duration: 2
                    }}
                  >
                    <path d="M7 18H17V16H7V18Z" fill="currentColor" />
                    <path d="M17 14H7V12H17V14Z" fill="currentColor" />
                    <path d="M7 10H11V8H7V10Z" fill="currentColor" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M6 2C4.34315 2 3 3.34315 3 5V19C3 20.6569 4.34315 22 6 22H18C19.6569 22 21 20.6569 21 19V9C21 5.13401 17.866 2 14 2H6ZM6 4H13V9H19V19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V5C5 4.44772 5.44772 4 6 4ZM15 4.10002C16.6113 4.4271 17.9413 5.52906 18.584 7H15V4.10002Z" fill="currentColor" />
                  </motion.svg>
                </motion.div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key="uploadText"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                  >
                    <p className="text-lg font-medium mb-2">
                      Drag & drop your PDF here
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      or click to browse files
                    </p>
                  </motion.div>
                </AnimatePresence>

                <motion.button
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg shadow-md"
                  whileHover={{ scale: 1.05, y: -2, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 16L12 8M12 8L16 12M12 8L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    Select PDF File
                  </span>
                </motion.button>
              </div>
            )}
          </div>
        </animated.div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Upload Any PDF",
            description: "Supports documents of any size and complexity",
            icon: (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16L12 8M12 8L16 12M12 8L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" />
              </svg>
            ),
            color: "from-blue-600 to-blue-400",
            delay: 0.1
          },
          {
            title: "Semantic Search",
            description: "Get contextually relevant answers to your questions",
            icon: (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 15L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10C17 13.866 13.866 17 10 17Z" stroke="currentColor" strokeWidth="2" />
              </svg>
            ),
            color: "from-indigo-600 to-indigo-400",
            delay: 0.2
          },
          {
            title: "Instant Analysis",
            description: "Advanced AI extracts insights in seconds",
            icon: (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 10V3L4 14H11V21L20 10H13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ),
            color: "from-purple-600 to-purple-400",
            delay: 0.3
          }
        ].map((feature, index) => (
          <motion.div
            key={index}
            className="group relative bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: feature.delay, duration: 0.5 }}
            whileHover={{
              y: -5,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
          >
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600/0 to-indigo-600/0 opacity-0 group-hover:opacity-10 rounded-xl blur-xl transition-opacity duration-300"></div>

            <div className={`w-12 h-12 mb-4 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-lg`}>
              {feature.icon}
            </div>

            <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {feature.description}
            </p>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}