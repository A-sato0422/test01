"use client";

import { motion } from "framer-motion";

interface HandWrittenTitleProps {
    title?: string;
    subtitle?: string;
}

function HandWrittenTitle({
    title = "Hand Written",
    subtitle = "Optional subtitle",
}: HandWrittenTitleProps) {
    const draw = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { duration: 2.5, ease: [0.43, 0.13, 0.23, 0.96] },
                opacity: { duration: 0.5 },
            },
        },
    };

    return (
        <div className="relative w-full max-w-7xl mx-auto py-40">
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.svg
                    width="600"
                    height="400"
                    viewBox="0 0 600 400"
                    initial="hidden"
                    animate="visible"
                    className="w-full h-full max-w-2xl"
                >
                    <title>相性診断</title>
                    <motion.ellipse
                        cx="300"
                        cy="200"
                        rx="280"
                        ry="180"
                        fill="none"
                        strokeWidth="3"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        variants={draw}
                        className="text-pink-400 opacity-70"
                    />
                </motion.svg>
            </div>
            <div className="relative text-center z-10 flex flex-col items-center justify-center px-12">
                <motion.h1
                    className="text-6xl md:text-8xl text-gray-800 tracking-tighter flex items-center gap-2 font-bold mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    {title}
                </motion.h1>
                {subtitle && (
                    <motion.p
                        className="text-2xl md:text-3xl text-gray-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.8 }}
                    >
                        {subtitle}
                    </motion.p>
                )}
            </div>
        </div>
    );
}

export { HandWrittenTitle };