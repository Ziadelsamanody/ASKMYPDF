"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function MouseTrailEffect() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);

    const trailCount = 15;

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", updateMousePosition);

        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
        };
    }, []);

    useEffect(() => {
        const newTrail = [...trail, { ...mousePosition, id: Date.now() }];

        if (newTrail.length > trailCount) {
            newTrail.shift();
        }

        setTrail(newTrail);
    }, [mousePosition]);

    return (
        <>
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[999]">
                {trail.map((dot, index) => {
                    const size = Math.max(3, (index / trail.length) * 12);
                    const opacity = Math.max(0.1, (index / trail.length) * 0.5);

                    return (
                        <motion.div
                            key={dot.id}
                            className="absolute rounded-full bg-blue-500 dark:bg-blue-400 mix-blend-screen"
                            style={{
                                left: dot.x,
                                top: dot.y,
                                width: size,
                                height: size,
                                opacity,
                                transform: "translate(-50%, -50%)"
                            }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ duration: 0.3 }}
                        />
                    );
                })}
            </div>
        </>
    );
}