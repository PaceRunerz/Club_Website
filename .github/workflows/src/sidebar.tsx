"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Hamburger Menu */}
      <div
        className="fixed top-4 left-4 z-50 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-8 h-1 bg-white mb-1"></div>
        <div className="w-8 h-1 bg-white mb-1"></div>
        <div className="w-8 h-1 bg-white"></div>
      </div>

      {/* Animated Sidebar */}
      <motion.div
        ref={sidebarRef}
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 h-screen w-64 bg-[#112240] text-white p-4 shadow-lg z-40"
      >
        <h2 className="text-2xl font-bold mb-6">Ganga Bhumi Club</h2>
        <ul className="space-y-4">
          {["Home", "Events", "Explore", "Gallery", "About Us"].map((item) => (
            <li key={item}>
              <Link href={`#${item.toLowerCase().replace(" ", "-")}`} className="hover:text-gray-400 font-bold">
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>
    </>
  );
}
