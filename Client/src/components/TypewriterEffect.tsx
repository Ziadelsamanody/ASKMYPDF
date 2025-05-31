"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TypewriterEffectProps {
    text: string;
    speed?: number;
    onComplete?: () => void;
}

export default function TypewriterEffect({
    text,
    speed = 30,
    onComplete
}: TypewriterEffectProps) {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayText(prev => prev + text[currentIndex]);
                setCurrentIndex(currentIndex + 1);
            }, speed);

            return () => clearTimeout(timeout);
        } else if (!isComplete) {
            setIsComplete(true);
            onComplete?.();
        }
    }, [currentIndex, text, speed, isComplete, onComplete]);

    useEffect(() => {
        setDisplayText('');
        setCurrentIndex(0);
        setIsComplete(false);
    }, [text]);

    return (
        <div className="inline">
            {displayText}
            {!isComplete && (
                <motion.span
                    className="inline-block w-1.5 h-4 bg-blue-500 ml-0.5"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                />
            )}
        </div>
    );
}