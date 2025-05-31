"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from 'next-themes';

export default function Footer() {
    const [isHovered, setIsHovered] = useState<number | null>(null);
    const { theme } = useTheme();

    const contributors = [
        {
            name: 'Zeyad Lotfy',
            role: 'Full Stack Developer',
            link: 'https://zeyadlotfy.vercel.app/',
            github: null,
            icon: "coffee",
            avatar: 'https://avatars.githubusercontent.com/u/114695576?v=4'
        },
        {
            name: 'Ziad Elsamnody',
            role: 'AI Developer',
            link: 'https://github.com/Ziadelsamanody',
            github: 'Ziadelsamanody',
            icon: "github",
            avatar: 'https://avatars.githubusercontent.com/u/121461473?v=4'
        },
        {
            name: 'Zyad Ashraf',
            role: 'Flutter Developer',
            link: 'https://github.com/Z-Ash0',
            github: 'Z-Ash0',
            icon: "github",
            avatar: 'https://avatars.githubusercontent.com/u/142425238?v=4'
        }
    ];

    return (
        <motion.footer
            className="relative py-12 px-4 sm:px-6 lg:px-8 mt-10 overflow-hidden  border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >


            <div className="absolute inset-0 -z-10">

                <div className="absolute inset-0 backdrop-blur-[2px]" />
            </div>

            <div className="max-w-3xl mx-auto text-center">
                <motion.div
                    className="flex items-center justify-center space-x-3 mb-6"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                    </div>
                    <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                        Ask My PDF
                    </span>
                </motion.div>

                <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
                    Chat with your PDF documents using advanced AI. Upload your files and get instant answers to your questions.
                </p>

                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-8 rounded-full"></div>

                <div className="mb-10">
                    <h3 className="text-lg font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                        Created By
                    </h3>

                    <div className="flex flex-wrap justify-center gap-6">
                        {contributors.map((contributor, index) => (
                            <motion.div
                                key={index}
                                className="flex flex-col items-center"
                                onHoverStart={() => setIsHovered(index)}
                                onHoverEnd={() => setIsHovered(null)}
                                whileHover={{ y: -5 }}
                            >
                                <Link
                                    href={contributor.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group text-center"
                                >
                                    <motion.div
                                        className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center mb-3 mx-auto overflow-hidden border-2 border-white/20"
                                        animate={{
                                            scale: isHovered === index ? [1, 1.1, 1] : 1,
                                            rotate: isHovered === index ? [0, -5, 5, 0] : 0
                                        }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <img
                                            src={contributor.avatar}
                                            alt={contributor.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </motion.div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center justify-center">
                                            {contributor.name}
                                            {contributor.icon && (
                                                <motion.span
                                                    className="ml-1.5 text-gray-500 dark:text-gray-400"
                                                    animate={
                                                        isHovered === index
                                                            ? { y: [0, -2, 0] }
                                                            : {}
                                                    }
                                                    transition={{ duration: 0.5, repeat: isHovered === index ? Infinity : 0 }}
                                                >
                                                    {contributor.icon === "github" ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                                                            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                                                            <line x1="6" y1="1" x2="6" y2="4"></line>
                                                            <line x1="10" y1="1" x2="10" y2="4"></line>
                                                            <line x1="14" y1="1" x2="14" y2="4"></line>
                                                        </svg>
                                                    )}
                                                </motion.span>
                                            )}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {contributor.role}
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>


                <div className="pt-6 border-t border-gray-200 dark:border-gray-800/30">
                    <motion.div
                        className="text-sm text-gray-500 dark:text-gray-400 mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        © {new Date().getFullYear()} Ask My PDF. All rights reserved.

                    </motion.div>

                    {/* Links */}
                    <div className="flex justify-center space-x-6 text-sm">
                        {['Privacy', 'Terms', 'Contact'].map((item, i) => (
                            <motion.a
                                key={i}
                                href="#"
                                className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {item}
                            </motion.a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-blue-500/5 blur-3xl -z-5 opacity-50 animate-pulse hidden md:block"></div>
            <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-purple-500/5 blur-3xl -z-5 opacity-50 animate-pulse hidden md:block"></div>
        </motion.footer>
    );
}