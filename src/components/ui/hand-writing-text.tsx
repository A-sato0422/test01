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
        <div className="relative w-full max-w-6xl mx-auto py-32">
            <div className="absolute inset-0">
                <motion.svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 1400 700"
                    initial="hidden"
                    animate="visible"
                    className="w-full h-full"
                >
                    <title>相性診断</title>
                    <motion.path
                        d="M 1100 120 
                           C 1450 350, 1200 550, 700 600
                           C 250 600, 100 550, 100 350
                           C 100 150, 400 100, 700 100
                           C 1000 100, 1100 220, 1100 220"
                        fill="none"
                        strokeWidth="14"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        variants={draw}
                        className="text-pink-400 opacity-90"
                    />
                </motion.svg>
            </div>
            <div className="relative text-center z-10 flex flex-col items-center justify-center px-8">
                <motion.h1
                    className="text-5xl md:text-7xl text-gray-800 tracking-tighter flex items-center gap-2 font-bold mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    {title}
                </motion.h1>
                {subtitle && (
                    <motion.p
                        className="text-xl md:text-2xl text-gray-600"
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