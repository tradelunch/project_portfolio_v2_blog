'use client';

import React, { useState, useEffect } from 'react';

// Reusable Scroll to Top Component
export const ScrollToTopButton = ({ threshold = 300 }) => {
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > threshold);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [threshold]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    if (!showScrollTop) return null;

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-primary text-primary-foreground w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center z-50"
            aria-label="Scroll to top"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
        </button>
    );
};
