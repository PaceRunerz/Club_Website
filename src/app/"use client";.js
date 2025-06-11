"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import Head from "next/head";

// Landing Page Component
const LandingPage = ({ onComplete }) => {
  return (
    <motion.div
      className="fixed inset-0 flex flex-col justify-center items-center bg-black z-50"
      initial={{ y: 0 }}
      animate={{ y: "-100vh" }}
      transition={{ duration: 1, ease: "easeInOut", delay: 2 }}
      onAnimationComplete={onComplete}
    >
      {/* Ganga Bhumi Logo */}
      <motion.img
        src="/logo.png"
        alt="Ganga Bhumi Club Logo"
        className="w-64 h-64"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />

      {/* Pace Runerz Text */}
      <motion.h1
        className="text-6xl font-bold mt-6 text-white"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        Pace Runerz
      </motion.h1>

      {/* VIT Bhopal Text */}
      <motion.p
        className="text-4xl mt-4 text-white"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        VIT Bhopal
      </motion.p>
    </motion.div>
  );
};

// Calendar Component
const Calendar = ({ events, onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 200], [0, -100]); // Move up when scrolling down

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="p-2"></div>);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
    const hasEvent = events.some((event) => event.date === date);
    days.push(
      <div
        key={i}
        className={`p-2 text-center cursor-pointer rounded-lg ${
          hasEvent ? "bg-[#0a192f] text-white" : ""
        }`}
        onClick={() => onDateClick(date)}
      >
        {i}
      </div>
    );
  }

  return (
    <motion.div
      className="bg-black p-6 rounded-lg"
      style={{ y }} // Apply scroll-based animation
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="text-white hover:text-gray-400">
          &lt; Previous
        </button>
        <h3 className="text-xl font-bold text-white">
          {new Date(year, month).toLocaleString("default", { month: "long" })} {year}
        </h3>
        <button onClick={nextMonth} className="text-white hover:text-gray-400">
          Next &gt;
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-bold text-white">
            {day}
          </div>
        ))}
        {days}
      </div>
    </motion.div>
  );
};

// Main Website Component
const MainWebsite = ({ showLanding }) => {
  const [isUpcomingModalOpen, setIsUpcomingModalOpen] = useState(false);
  const [isPastModalOpen, setIsPastModalOpen] = useState(false);
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 });
  const [glowingImageIndex, setGlowingImageIndex] = useState(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isUpcomingModalOpen || isPastModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isUpcomingModalOpen, isPastModalOpen]);

  const openUpcomingModal = () => setIsUpcomingModalOpen(true);
  const closeUpcomingModal = () => setIsUpcomingModalOpen(false);

  const openPastModal = () => setIsPastModalOpen(true);
  const closePastModal = () => setIsPastModalOpen(false);

  // Handle mouse move for glowing background
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    setGlowPosition({ x: clientX, y: clientY });
  };

  // Handle mouse enter/leave for image glow
  const handleImageMouseEnter = (index) => {
    setGlowingImageIndex(index);
  };

  const handleImageMouseLeave = () => {
    setGlowingImageIndex(null);
  };

  // Sample event data
  const upcomingEvents = [
    {
      date: "2025-02-20",
      title: "DHAROHAR",
      description: "We are excited to invite you to DHAROHAR an incredible cultural event organized by Andy Haryana Club as part of Advitya 2025. This event will showcase the vibrant traditions of Haryana through engaging activities and experiences.",
      image: "/event1.jpg",
    },
    {
      date: "2023-11-05",
      title: "Health Awareness Camp",
      description: "A camp to promote health and fitness among students.",
      image: "/event2.jpg",
    },
  ];

  const pastEvents = [
    {
      date: "2023-09-20",
      title: "Tech Fest",
      description: "A celebration of technology and innovation.",
      image: "/event3.jpg",
    },
    {
      date: "2023-08-10",
      title: "Sports Day",
      description: "A day full of sports and activities.",
      image: "/event4.jpg",
    },
  ];

  const handleDateClick = (date) => {
    console.log("Clicked date:", date);
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (isUpcomingModalOpen || isPastModalOpen) &&
        event.target.classList.contains("modal-overlay")
      ) {
        closeUpcomingModal();
        closePastModal();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isUpcomingModalOpen, isPastModalOpen]);

  return (
    <div className="bg-[#0a192f] text-white">
      <Head>
        <title>Ganga Bhumi Club</title>
        <meta name="description" content="Official Website of Ganga Bhumi Club" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navbar */}
      {!showLanding && (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a192f] shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo and Text */}
              <div className="flex items-center space-x-4">
                <img src="/logo.png" alt="Ganga Bhumi Club Logo" className="h-10" />
                <span className="text-white text-xl font-bold">Pace Runerz</span>
              </div>

              {/* Navigation Links */}
              <div className="hidden md:flex space-x-8">
                <a href="#home" className="text-white hover:text-gray-400">
                  Home
                </a>
                <a href="#events" className="text-white hover:text-gray-400">
                  Events
                </a>
                <a href="#about" className="text-white hover:text-gray-400">
                  About Us
                </a>
                <a href="#gallery" className="text-white hover:text-gray-400">
                  Gallery
                </a>
                <a href="#explore" className="text-white hover:text-gray-400">
                  Explore
                </a>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Home Section */}
      <motion.section
        id="home"
        className="h-screen flex flex-col justify-center items-center bg-cover bg-center"
        style={{ backgroundImage: "url('/background.jpg')" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Ganga Bhumi Club Logo and Text */}
        <div className="text-center">
          <motion.img
            src="/logo.png"
            alt="Ganga Bhumi Club Logo"
            className="w-64 h-64 mx-auto"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
          />
          <motion.h1
            className="text-6xl font-bold mt-6"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            PACE RUNERZ
          </motion.h1>
          <motion.p
            className="text-2xl mt-4"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Shreyansh Tripathi
          </motion.p>
          <motion.p
            className="text-lg mt-8 max-w-2xl mx-auto"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Your time is limited, so don't waste it living someone else's life.
            Don't be trapped by dogma -which is living with the results of other people's thinking.
            Don't let the noise of other's opinions drown out your own inner voice.
          </motion.p>
        </div>
      </motion.section>

      {/* Events Section */}
      <motion.section
        id="events"
        className="py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#112240] p-6 rounded-lg cursor-pointer" onClick={openUpcomingModal}>
              <h3 className="text-2xl font-bold">Upcoming Events</h3>
              <p className="mt-4">Stay tuned for exciting events!</p>
            </div>
            <div className="bg-[#112240] p-6 rounded-lg cursor-pointer" onClick={openPastModal}>
              <h3 className="text-2xl font-bold">Past Events</h3>
              <p className="mt-4">Relive our memorable moments.</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Modal for Upcoming Events */}
      {isUpcomingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex justify-center items-center p-4 modal-overlay">
          <div className="bg-[#112240] rounded-lg p-8 max-w-6xl w-full max-h-full overflow-y-auto">
            <h2 className="text-4xl font-bold text-center mb-8">Upcoming Events</h2>

            {/* Calendar */}
            <Calendar events={upcomingEvents} onDateClick={handleDateClick} />

            {/* Event Posters and Descriptions */}
            <div className="mt-12 space-y-8">
              {upcomingEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row items-center bg-[#0a192f] p-6 rounded-lg"
                >
                  {/* Portrait Banner with Glow Effect */}
                  <div
                    className="w-full md:w-1/2 h-[11.7in] max-h-[80vh] overflow-hidden rounded-lg relative glow-effect"
                    onMouseEnter={() => handleImageMouseEnter(index)}
                    onMouseLeave={handleImageMouseLeave}
                  >
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    {glowingImageIndex === index && (
                      <div
                        className="absolute inset-0 border-4 border-purple-500 rounded-lg glow-effect"
                        style={{
                          boxShadow: "0 0 20px 10px rgba(168, 85, 247, 0.7)",
                        }}
                      />
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="w-full md:w-1/2 p-6">
                    <h3 className="text-3xl font-bold">{event.title}</h3>
                    <p className="mt-4 text-lg">{event.description}</p>
                    <p className="mt-4 text-sm text-gray-400">Date: {event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal for Past Events */}
      {isPastModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex justify-center items-center p-4 modal-overlay">
          <div className="bg-[#112240] rounded-lg p-8 max-w-6xl w-full max-h-full overflow-y-auto">
            <h2 className="text-4xl font-bold text-center mb-8">Past Events</h2>

            {/* Calendar */}
            <Calendar events={pastEvents} onDateClick={handleDateClick} />

            {/* Event Posters and Descriptions */}
            <div className="mt-12 space-y-8">
              {pastEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row items-center bg-[#0a192f] p-6 rounded-lg"
                >
                  {/* Portrait Banner with Glow Effect */}
                  <div
                    className="w-full md:w-1/2 h-[11.7in] max-h-[80vh] overflow-hidden rounded-lg relative glow-effect"
                    onMouseEnter={() => handleImageMouseEnter(index)}
                    onMouseLeave={handleImageMouseLeave}
                  >
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    {glowingImageIndex === index && (
                      <div
                        className="absolute inset-0 border-4 border-purple-500 rounded-lg glow-effect"
                        style={{
                          boxShadow: "0 0 20px 10px rgba(168, 85, 247, 0.7)",
                        }}
                      />
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="w-full md:w-1/2 p-6">
                    <h3 className="text-3xl font-bold">{event.title}</h3>
                    <p className="mt-4 text-lg">{event.description}</p>
                    <p className="mt-4 text-sm text-gray-400">Date: {event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* About Us Section */}
      <motion.section
        id="about"
        className="py-20 bg-[#112240]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">About Us</h2>
          <div className="space-y-8 text-center">
            {/* Faculty Coordinators */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
              initial={{ y: -50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <motion.img
                  src="/faculty1.jpg"
                  alt="Faculty Coordinator"
                  className="w-48 h-48 mx-auto rounded-full cursor-pointer"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                />
                <h3 className="text-2xl font-bold mt-4">Dr. Rahul Kumar Chaturvedi</h3>
                <p className="mt-2">Faculty Coordinator</p>
              </div>
              <div>
                <motion.img
                  src="/faculty2.jpg"
                  alt="Faculty Coordinator"
                  className="w-48 h-48 mx-auto rounded-full cursor-pointer"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                />
                <h3 className="text-2xl font-bold mt-4">Dr. Deep Chandra Upadhyay</h3>
                <p className="mt-2">Faculty Coordinator</p>
              </div>
              <div>
                <motion.img
                  src="/faculty3.jpg"
                  alt="Faculty Coordinator"
                  className="w-48 h-48 mx-auto rounded-full cursor-pointer"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                />
                <h3 className="text-2xl font-bold mt-4">Dr. Pratosh Pal</h3>
                <p className="mt-2">Faculty Coordinator</p>
              </div>
            </motion.div>

            {/* President and Vice President */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div>
                <motion.img
                  src="/president.jpg"
                  alt="President"
                  className="w-48 h-48 mx-auto rounded-full cursor-pointer"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                />
                <h3 className="text-2xl font-bold mt-4">President</h3>
                <p className="mt-2">Aprajita Ranjan</p>
              </div>
              <div>
                <motion.img
                  src="/vice-president.jpg"
                  alt="Vice President"
                  className="w-48 h-48 mx-auto rounded-full cursor-pointer"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                />
                <h3 className="text-2xl font-bold mt-4">Vice President</h3>
                <p className="mt-2">Vishal Kumar</p>
              </div>
            </div>

            {/* General Secretary and Secretary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div>
                <motion.img
                  src="/general-secretary.jpg"
                  alt="General Secretary"
                  className="w-48 h-48 mx-auto rounded-full cursor-pointer"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                />
                <h3 className="text-2xl font-bold mt-4">General Secretary</h3>
                <p className="mt-2">Venkatesh</p>
              </div>
              <div>
                <motion.img
                  src="/secretary.jpg"
                  alt="Secretary"
                  className="w-48 h-48 mx-auto rounded-full cursor-pointer"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                />
                <h3 className="text-2xl font-bold mt-4">Secretary</h3>
                <p className="mt-2">Tarun Singh</p>
              </div>
            </div>

            {/* Tech Lead and Co-Lead */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div>
                <motion.img
                  src="/tech-lead.jpg"
                  alt="Tech Lead"
                  className="w-48 h-48 mx-auto rounded-full cursor-pointer"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                />
                <h3 className="text-2xl font-bold mt-4">Tech Lead</h3>
                <p className="mt-2">Himalaya Yadav</p>
              </div>
              <div>
                <motion.img
                  src="/co-lead.jpg"
                  alt="Co-Lead"
                  className="w-48 h-48 mx-auto rounded-full cursor-pointer"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                />
                <h3 className="text-2xl font-bold mt-4">Co-Lead</h3>
                <p className="mt-2">Shreyansh Tripathi</p>
              </div>
            </div>

            {/* Design Team Lead and Co-Lead */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div>
                <motion.img
                  src="/design-lead.jpg"
                  alt="Design Lead"
                  className="w-48 h-48 mx-auto rounded-full cursor-pointer"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                />
                <h3 className="text-2xl font-bold mt-4">Design Lead</h3>
                <p className="mt-2">Himalaya Yadav</p>
              </div>
              <div>
                <motion.img
                  src="/design-co-lead.jpg"
                  alt="Co-Lead"
                  className="w-48 h-48 mx-auto rounded-full cursor-pointer"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                />
                <h3 className="text-2xl font-bold mt-4">Co-Lead</h3>
                <p className="mt-2">Shreyansh Tripathi</p>
              </div>
            </div>

            {/* Event Management Lead and Co-Lead */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div>
                <motion.img
                  src="/event-lead.jpg"
                  alt="Event Lead"
                  className="w-48 h-48 mx-auto rounded-full cursor-pointer"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                />
                <h3 className="text-2xl font-bold mt-4">Event Lead</h3>
                <p className="mt-2">Himalaya Yadav</p>
              </div>
              <div>
                <motion.img
                  src="/event-co-lead.jpg"
                  alt="Co-Lead"
                  className="w-48 h-48 mx-auto rounded-full cursor-pointer"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                />
                <h3 className="text-2xl font-bold mt-4">Co-Lead</h3>
                <p className="mt-2">Shreyansh Tripathi</p>
              </div>
            </div>

            {/* Content Writing Lead and Co-Lead */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div>
                <motion.img
                  src="/content-lead.jpg"
                  alt="Content Lead"
                  className="w-48 h-48 mx-auto rounded-full cursor-pointer"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                />
                <h3 className="text-2xl font-bold mt-4">Content Lead</h3>
                <p className="mt-2">Himalaya Yadav</p>
              </div>
              <div>
                <motion.img
                  src="/content-co-lead.jpg"
                  alt="Co-Lead"
                  className="w-48 h-48 mx-auto rounded-full cursor-pointer"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                />
                <h3 className="text-2xl font-bold mt-4">Content-Co-Lead</h3>
                <p className="mt-2">Shreyansh Tripathi</p>
              </div>
            </div>

            {/* PR and Outreach Lead and Co-Lead */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div>
                <motion.img
                  src="/pr-lead.jpg"
                  alt="PR Lead"
                  className="w-48 h-48 mx-auto rounded-full cursor-pointer"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                />
                <h3 className="text-2xl font-bold mt-4">PR Lead</h3>
                <p className="mt-2">Himalaya Yadav</p>
              </div>
              <div>
                <motion.img
                  src="/pr-co-lead.jpg"
                  alt="PR-Co-Lead"
                  className="w-48 h-48 mx-auto rounded-full cursor-pointer"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                />
                <h3 className="text-2xl font-bold mt-4">PR-Co-Lead</h3>
                <p className="mt-2">Shreyansh Tripathi</p>
              </div>
            </div>

            {/* Social Media Lead and Co-Lead */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div>
                <motion.img
                  src="/social-media-lead.jpg"
                  alt="Social Media Lead"
                  className="w-48 h-48 mx-auto rounded-full cursor-pointer"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                />
                <h3 className="text-2xl font-bold mt-4">Social Media Lead</h3>
                <p className="mt-2">Himalaya Yadav</p>
              </div>
              <div>
                <motion.img
                  src="/social-media-co-lead.jpg"
                  alt="Social-Media-Co-Lead"
                  className="w-48 h-48 mx-auto rounded-full cursor-pointer"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                />
                <h3 className="text-2xl font-bold mt-4">Social Media-Co-Lead</h3>
                <p className="mt-2">Shreyansh Tripathi</p>
              </div>
            </div>

            {/* Finance Team Lead and Co-Lead */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div>
                <motion.img
                  src="/finance-lead.jpg"
                  alt="Finance Lead"
                  className="w-48 h-48 mx-auto rounded-full cursor-pointer"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                />
                <h3 className="text-2xl font-bold mt-4">Finance Lead</h3>
                <p className="mt-2">Himalaya Yadav</p>
              </div>
              <div>
                <motion.img
                  src="/finance-co-lead.jpg"
                  alt="Finance-Co-Lead"
                  className="w-48 h-48 mx-auto rounded-full cursor-pointer"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                />
                <h3 className="text-2xl font-bold mt-4">Finance-Co-Lead</h3>
                <p className="mt-2">Shreyansh Tripathi</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Gallery Section */}
      <motion.section
        id="gallery"
        className="py-40" // Increased height
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">A Glimpse of Pace-Runerz alchemy</h2>
          <div className="overflow-x-auto whitespace-nowrap scrollbar-hide">
            <motion.div
              className="inline-flex space-x-8"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              {Array.from({ length: 10 }).map((_, index) => (
                <motion.img
                  key={index}
                  src={`/gallery${index + 1}.jpg`}
                  alt={`Gallery Image ${index + 1}`}
                  className="w-96 h-96 object-cover rounded-lg cursor-pointer" // Increased width and height
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Explore Section */}
      <motion.section
        id="explore"
        className="py-20 bg-[#112240]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Explore</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#0a192f] p-6 rounded-lg">
              <h3 className="text-2xl font-bold">Insights</h3>
              <p className="mt-4">Learn more about our initiatives.</p>
            </div>
            <div className="bg-[#0a192f] p-6 rounded-lg">
              <h3 className="text-2xl font-bold">Blog</h3>
              <p className="mt-4">Read our latest updates.</p>
            </div>
            <div className="bg-[#0a192f] p-6 rounded-lg">
              <h3 className="text-2xl font-bold">Activities</h3>
              <p className="mt-4">Discover what we do.</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-10 bg-[#0a192f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-6">FOLLOW US</h2>
          <div className="flex justify-center space-x-6">
            <a
              href="https://www.instagram.com/andy_haryana_vitb/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/in/st-shreyansh-tripathi/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              LinkedIn
            </a>
          </div>
          <p className="mt-4">Contact: haryanaclub@vitbhopal.ac.in</p>
          <p>Address: Vellore Institute of Technology, Bhopal</p>
        </div>
      </footer>
    </div>
  );
};

// Home Component
export default function Home() {
  const [showLanding, setShowLanding] = useState(true);

  return (
    <div className="relative overflow-hidden">
      {/* Show Landing Page if `showLanding` is true */}
      {showLanding && <LandingPage onComplete={() => setShowLanding(false)} />}

      {/* Show Main Website */}
      <MainWebsite showLanding={showLanding} />
    </div>
  );
}