"use client";
import { motion, useScroll, useTransform, useAnimation, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Head from "next/head";

// Raindrop Component
const Raindrop = ({ delay, left }) => {
  return (
    <motion.div
      className="absolute w-0.5 h-12 bg-purple-500 rounded-full"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: "100vh", opacity: 1 }}
      transition={{ duration: 2, delay, ease: "linear" }}
      style={{ left: `${left}%` }} // Position the raindrop horizontally
      onAnimationComplete={() => {
        // Trigger splash effect when raindrop reaches the bottom
        const splash = document.createElement("div");
        splash.className = "absolute w-1.5 h-1.5 bg-purple-500 rounded-full opacity-0";
        splash.style.left = `${left}%`; // Position the splash at the same horizontal position
        splash.style.bottom = "0";
        document.getElementById("rain-container").appendChild(splash);

        // Animate the splash
        setTimeout(() => {
          splash.style.opacity = "1";
          splash.style.transform = "scale(2)";
          splash.style.transition = "all 0.5s ease-out";
        }, 100);

        // Remove the splash after animation
        setTimeout(() => {
          splash.remove();
        }, 600);
      }}
    />
  );
};

// Landing Page Component
const LandingPage = ({ onComplete }) => {
  // Freeze the main website background
  useEffect(() => {
    document.body.style.overflow = "hidden"; // Freeze the background
    return () => {
      document.body.style.overflow = "auto"; // Unfreeze when landing page is removed
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col justify-center items-center bg-black z-50"
      initial={{ y: 0 }}
      animate={{ y: "-100vh" }}
      transition={{ duration: 1, ease: "easeInOut", delay: 5 }} // Increased delay to 5 seconds
      onAnimationComplete={onComplete}
    >
      {/* Rain Animation */}
      <div id="rain-container" className="absolute inset-0 overflow-hidden">
        {/* First wave: 3 raindrops */}
        {[50, 10, 90].map((left, index) => (
          <Raindrop key={`first-${index}`} delay={0.5 + index * 0.2} left={left} />
        ))}

        {/* Second wave: 2 raindrops */}
        {[30, 70].map((left, index) => (
          <Raindrop key={`second-${index}`} delay={2 + index * 0.2} left={left} />
        ))}

        {/* Third wave: 4 raindrops */}
        {[61, 10, 38, 88].map((left, index) => (
          <Raindrop key={`third-${index}`} delay={3.5 + index * 0.2} left={left} />
        ))}
      </div>

      {/* Ganga Bhumi Logo */}
      <motion.img
        src="/logo.png"
        alt="Ganga Bhumi Club Logo"
        className="w-68 h-64"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />

      {/* Pace Runerz Text with Glowing Effect */}
      <motion.h1
        className="text-6xl font-bold mt-6 text-white glow-effect"
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
const Calendar = ({ events, onDateClick, y }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

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
          hasEvent ? "bg-[#0f0f0f] text-white" : ""
        }`}
        onClick={() => onDateClick(date)}
      >
        {i}
      </div>
    );
  }

  return (
    <motion.div
      className="bg-[#282C35] p-6 rounded-lg"
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

// CountUp Component
const CountUp = ({ from = 0, to, duration = 2 }) => {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const inView = useInView(ref, { once: false });

  useEffect(() => {
    if (inView) {
      let start = from;
      const increment = (to - from) / (duration * 60); // 60 FPS

      const timer = setInterval(() => {
        start += increment;
        if (start >= to) {
          setCount(to);
          clearInterval(timer);
        } else {
          setCount(Math.ceil(start));
        }
      }, 1000 / 60); // 60 FPS

      return () => clearInterval(timer);
    }
  }, [inView, from, to, duration]);

  return <span ref={ref}>{count}+</span>;
};

// Main Website Component
const MainWebsite = ({ showLanding }) => {
  const [isUpcomingModalOpen, setIsUpcomingModalOpen] = useState(false);
  const [isPastModalOpen, setIsPastModalOpen] = useState(false);
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 });
  const [glowingImageIndex, setGlowingImageIndex] = useState(null);
  const [email, setEmail] = useState("");

  // Reset scroll position to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      description: "We are excited to invite you to DHAROHAR, an incredible cultural event organized by Andy Haryana Club as part of Advitya 2025. This event will showcase the vibrant traditions of Haryana through engaging activities and experiences.",
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

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // UseScroll and UseTransform for sticky header
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 200], [0, -100]); // Move up when scrolling down

  // Handle email subscription
  const handleSubscribe = () => {
    if (email) {
      alert(`Thank you for subscribing with ${email}!`);
      setEmail("");
    } else {
      alert("Please enter a valid email address.");
    }
  };

  return (
    <div className="bg-[#0f0f0f] text-white">
      <Head>
        <title>Ganga Bhumi Club</title>
        <meta name="description" content="Official Website of Ganga Bhumi Club" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navbar */}
      {!showLanding && (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f0f] shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo and Text */}
              <div className="flex items-center space-x-4">
                <img src="/logo.png" alt="Ganga Bhumi Club Logo" className="h-10" />
                <span
                  className="text-white text-xl font-bold cursor-pointer"
                  onClick={scrollToTop}
                >
                  Pace Runerz
                </span>
              </div>

              {/* Navigation Links */}
              <div className="hidden md:flex space-x-8">
                <a href="#home" className="text-white hover:text-gray-400" onClick={scrollToTop}>
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
          
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 6 }} // Delay before animation starts
             >
             <svg
              xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 500 100"
                   className="w-102 h-26 mx-auto"
                 >
                    <motion.g
                     initial="hidden"
                           animate="visible"
            variants={{
            hidden: { opacity: 0 },
            visible: {
            opacity: 1,
            transition: {
            staggerChildren: 0.3, // Delay each letter sequentially
           },
           },
           }}
           >
            {["P", "a", "c", "e", " ", "R", "u", "n", "e", "r", "z"].map((letter, index) => (
           <motion.text
            key={index}
            x={50 + index * 35} // Adjust spacing for each letter
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="white"
            fontFamily="Arial, sans-serif"
            fontSize="48"
            fontWeight="bold"
            variants={{
            hidden: { opacity: 0, scale: 0, x: index % 2 === 0 ? -50 : 50, y: index % 2 === 0 ? -50 : 50 },
            visible: { opacity: 1, scale: 1, x: 0, y: 0, transition: { duration: 7.0 } },
                       }}
                     >
                     {letter}
                   </motion.text>
                 ))}
               </motion.g>
             </svg>
           </motion.div>

           <motion.p
            className="text-2xl mt-4"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.0, delay: 1.0 }}
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
            {/* Upcoming Events */}
            <div className="bg-[#282C35] p-6 rounded-lg cursor-pointer" onClick={openUpcomingModal}>
              <div className="flex items-center space-x-4">
                <img src="/ue.png" alt="Upcoming event Logo" className="w-16 h-16" />
                <h3 className="text-2xl font-bold">Upcoming Events</h3>
              </div>
            </div>

            {/* Past Events */}
            <div className="bg-[#282C35] p-6 rounded-lg cursor-pointer" onClick={openPastModal}>
              <div className="flex items-center space-x-4">
                <img src="/ue.png" alt="Past event Logo" className="w-16 h-16" />
                <h3 className="text-2xl font-bold">Past Events</h3>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Modal for Upcoming Events */}
      {isUpcomingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex justify-center items-center p-4 modal-overlay">
          <div className="bg-[#282C35] rounded-lg p-8 max-w-6xl w-full max-h-full overflow-y-auto">
            <motion.h2
              className="text-4xl font-bold text-center mb-8 sticky top-0 bg-[#282C35] z-10"
              style={{ y }}
            >
              Upcoming Events
            </motion.h2>

            {/* Calendar */}
            <Calendar events={upcomingEvents} onDateClick={handleDateClick} y={y} />

            {/* Rectangle Box with Event Details */}
            <div className="mt-8 p-6 bg-[#0f0f0f] rounded-lg">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <h3 className="text-2xl font-bold">Total Events</h3>
                  <p className="text-lg">
                    <CountUp from={0} to={50} duration={2} />
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Participants</h3>
                  <p className="text-lg">
                    <CountUp from={0} to={1200} duration={2} />
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Volunteers</h3>
                  <p className="text-lg">
                    <CountUp from={0} to={200} duration={2} />
                  </p>
                </div>
              </div>
            </div>

            {/* Event Posters and Descriptions */}
            <div className="mt-12 space-y-8">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col md:flex-row items-center bg-[#0f0f0f] p-6 rounded-lg"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  {/* Portrait Banner with Glow Effect */}
                  <motion.div
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
                  </motion.div>

                  {/* Event Details */}
                  <motion.div
                    className="w-full md:w-1/2 p-6"
                    initial={{ opacity: 0, x: index % 2 === 0 ? 100 : -100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                  >
                    <h3 className="text-3xl font-bold">{event.title}</h3>
                    <p className="mt-4 text-lg">{event.description}</p>
                    <p className="mt-4 text-sm text-gray-400">Date: {event.date}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal for Past Events */}
      {isPastModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex justify-center items-center p-4 modal-overlay">
          <div className="bg-[#282C35] rounded-lg p-8 max-w-6xl w-full max-h-full overflow-y-auto">
            <motion.h2
              className="text-4xl font-bold text-center mb-8 sticky top-0 bg-[#282C35] z-10"
              style={{ y }}
            >
              Past Events
            </motion.h2>

            {/* Calendar */}
            <Calendar events={pastEvents} onDateClick={handleDateClick} y={y} />

            {/* Rectangle Box with Event Details */}
            <div className="mt-8 p-6 bg-[#0f0f0f] rounded-lg">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <h3 className="text-2xl font-bold">Total Events</h3>
                  <p className="text-lg">
                    <CountUp from={0} to={50} duration={2} />
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Participants</h3>
                  <p className="text-lg">
                    <CountUp from={0} to={1200} duration={2} />
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Volunteers</h3>
                  <p className="text-lg">
                    <CountUp from={0} to={200} duration={2} />
                  </p>
                </div>
              </div>
            </div>

            {/* Event Posters and Descriptions */}
            <div className="mt-12 space-y-8">
              {pastEvents.map((event, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col md:flex-row items-center bg-[#0f0f0f] p-6 rounded-lg"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  {/* Portrait Banner with Glow Effect */}
                  <motion.div
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
                  </motion.div>

                  {/* Event Details */}
                  <motion.div
                    className="w-full md:w-1/2 p-6"
                    initial={{ opacity: 0, x: index % 2 === 0 ? 100 : -100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                  >
                    <h3 className="text-3xl font-bold">{event.title}</h3>
                    <p className="mt-4 text-lg">{event.description}</p>
                    <p className="mt-4 text-sm text-gray-400">Date: {event.date}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* What We Stand For Section */}
      <motion.section
        id="what-we-stand-for"
        className="py-20 bg-[#282C35]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">
            What We <span className="text-purple-500">Stand For!</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Box 1: Preserving and Promoting Haryanvi Culture */}
            <motion.div
              className="p-6 rounded-lg cursor-pointer relative overflow-hidden bg-[#282C35] hover:bg-[#0f0f0f] transition-colors duration-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">Preserving and Promoting Haryanvi Culture</h3>
                <p className="text-gray-400">
                  Celebrating Haryana’s rich traditions, language, folk music, and dance forms like Ghoomar and Khoria.
                </p>
              </div>
            </motion.div>

            {/* Box 2: Community Building and Networking */}
            <motion.div
              className="p-6 rounded-lg cursor-pointer relative overflow-hidden bg-[#282C35] hover:bg-[#0f0f0f] transition-colors duration-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">Community Building and Networking</h3>
                <p className="text-gray-400">
                  Bringing together students from Haryana and those interested in its heritage, fostering unity and connections.
                </p>
              </div>
            </motion.div>

            {/* Box 3: Cultural Events and Festivals */}
            <motion.div
              className="p-6 rounded-lg cursor-pointer relative overflow-hidden bg-[#282C35] hover:bg-[#0f0f0f] transition-colors duration-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">Cultural Events and Festivals</h3>
                <p className="text-gray-400">
                  Organizing events like Haryanvi folk nights, traditional dress days, and festivals such as Teej, Lohri, and Baisakhi.
                </p>
              </div>
            </motion.div>

            {/* Box 4: Workshops and Awareness Programs */}
            <motion.div
              className="p-6 rounded-lg cursor-pointer relative overflow-hidden bg-[#282C35] hover:bg-[#0f0f0f] transition-colors duration-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">Workshops and Awareness Programs</h3>
                <p className="text-gray-400">
                  Conducting sessions on Haryanvi history, language, and rural traditions, along with skill-building activities.
                </p>
              </div>
            </motion.div>

            {/* Box 5: Supporting Social Causes */}
            <motion.div
              className="p-6 rounded-lg cursor-pointer relative overflow-hidden bg-[#282C35] hover:bg-[#0f0f0f] transition-colors duration-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">Supporting Social Causes</h3>
                <p className="text-gray-400">
                  Engaging in initiatives like rural development awareness, Haryana’s sports culture promotion, and environmental campaigns.
                </p>
              </div>
            </motion.div>

            {/* Box 6: Showcasing Haryanvi Excellence */}
            <motion.div
              className="p-6 rounded-lg cursor-pointer relative overflow-hidden bg-[#282C35] hover:bg-[#0f0f0f] transition-colors duration-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">Showcasing Haryanvi Excellence</h3>
                <p className="text-gray-400">
                  Highlighting Haryana’s contributions in sports, defense, agriculture, and entrepreneurship through talks, exhibitions, and mentorship programs.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* About Us Section (unchanged) */}
      <motion.section
        id="about"
        className="py-20 bg-[#282C35]"
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
                  transition={{ duration: 0.8 }}
                />
                <h3 className="text-2xl font-bold mt-4">Shreyansh Tripathi</h3>
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
                  transition={{ duration: 0.8 }}
                />
                <h3 className="text-2xl font-bold mt-4">Shreyansh Tripati</h3>
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
                  transition={{ duration: 0.8 }}
                />
                <h3 className="text-2xl font-bold mt-4">Shreyansh Tripath</h3>
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
                  transition={{ duration: 0.8 }}
                />
                <h3 className="text-2xl font-bold mt-4">President</h3>
                <p className="mt-2">Shreyansh Tripath</p>
              </div>
              <div>
                <motion.img
                  src="/vice-president.jpg"
                  alt="Vice President"
                  className="w-48 h-48 mx-auto rounded-full cursor-pointer"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.8 }}
                />
                <h3 className="text-2xl font-bold mt-4">Vice President</h3>
                <p className="mt-2">Shreyansh Tripath</p>
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
                  transition={{ duration: 0.8 }}
                />
                <h3 className="text-2xl font-bold mt-4">General Secretary</h3>
                <p className="mt-2">Shreyansh Tripath</p>
              </div>
              <div>
                <motion.img
                  src="/secretary.jpg"
                  alt="Secretary"
                  className="w-48 h-48 mx-auto rounded-full cursor-pointer"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.8 }}
                />
                <h3 className="text-2xl font-bold mt-4">Secretary</h3>
                <p className="mt-2">Shreyansh Tripath</p>
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
                  transition={{ duration: 0.8 }}
                />
                <h3 className="text-2xl font-bold mt-4">Tech Lead</h3>
                <p className="mt-2">Shreyansh Tripath</p>
              </div>
              <div>
                <motion.img
                  src="/co-lead.jpg"
                  alt="Co-Lead"
                  className="w-48 h-48 mx-auto rounded-full cursor-pointer"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.8 }}
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
                  transition={{ duration: 0.8 }}
                />
                <h3 className="text-2xl font-bold mt-4">Design Lead</h3>
                <p className="mt-2">Shreyansh Tripath</p>
              </div>
              <div>
                <motion.img
                  src="/design-co-lead.jpg"
                  alt="Co-Lead"
                  className="w-48 h-48 mx-auto rounded-full cursor-pointer"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.8 }}
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
                  transition={{ duration: 0.8 }}
                />
                <h3 className="text-2xl font-bold mt-4">Event Lead</h3>
                <p className="mt-2">Shreyansh Tripath</p>
              </div>
              <div>
                <motion.img
                  src="/event-co-lead.jpg"
                  alt="Co-Lead"
                  className="w-48 h-48 mx-auto rounded-full cursor-pointer"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.8 }}
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
                  transition={{ duration: 0.8 }}
                />
                <h3 className="text-2xl font-bold mt-4">Content Lead</h3>
                <p className="mt-2">Shreyansh Tripath</p>
              </div>
              <div>
                <motion.img
                  src="/content-co-lead.jpg"
                  alt="Co-Lead"
                  className="w-48 h-48 mx-auto rounded-full cursor-pointer"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.8 }}
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
                  transition={{ duration: 0.8 }}
                />
                <h3 className="text-2xl font-bold mt-4">PR Lead</h3>
                <p className="mt-2">Shreyansh Tripath</p>
              </div>
              <div>
                <motion.img
                  src="/pr-co-lead.jpg"
                  alt="PR-Co-Lead"
                  className="w-48 h-48 mx-auto rounded-full cursor-pointer"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.8 }}
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
                  transition={{ duration: 0.8 }}
                />
                <h3 className="text-2xl font-bold mt-4">Social Media Lead</h3>
                <p className="mt-2">Shreyansh Tripath</p>
              </div>
              <div>
                <motion.img
                  src="/social-media-co-lead.jpg"
                  alt="Social-Media-Co-Lead"
                  className="w-48 h-48 mx-auto rounded-full cursor-pointer"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.8 }}
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
                  transition={{ duration: 0.8 }}
                />
                <h3 className="text-2xl font-bold mt-4">Finance Lead</h3>
                <p className="mt-2">Shreyansh Tripath</p>
              </div>
              <div>
                <motion.img
                  src="/finance-co-lead.jpg"
                  alt="Finance-Co-Lead"
                  className="w-48 h-48 mx-auto rounded-full cursor-pointer"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.8 }}
                />
                <h3 className="text-2xl font-bold mt-4">Finance-Co-Lead</h3>
                <p className="mt-2">Shreyansh Tripathi</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Gallery Section (unchanged) */}
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

      {/* Explore Section (unchanged) */}
      <motion.section
        id="explore"
        className="py-20 bg-[#282C35]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Explore</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#0f0f0f] p-6 rounded-lg">
              <h3 className="text-2xl font-bold">Insights</h3>
              <p className="mt-4">Learn more about our initiatives.</p>
            </div>
            <div className="bg-[#0f0f0f] p-6 rounded-lg">
              <h3 className="text-2xl font-bold">Blog</h3>
              <p className="mt-4">Read our latest updates.</p>
            </div>
            <div className="bg-[#0f0f0f] p-6 rounded-lg">
              <h3 className="text-2xl font-bold">Activities</h3>
              <p className="mt-4">Discover what we do.</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Subscribe Section (unchanged) */}
      <motion.section
        id="subscribe"
        className="py-20 bg-[#282C35]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-8">Subscribe to Our Newsletter</h2>
          <div className="flex justify-center">
            <div className="bg-[#0f0f0f] p-4 rounded-lg border-2 border-purple-500 w-full max-w-xl">
              <input
                type="email"
                placeholder="Enter your email"
                className="p-2 rounded-lg bg-[#282C35] text-white focus:outline-none w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                onClick={handleSubscribe}
                className="mt-3 p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors w-full"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-10 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-6">FOLLOW US</h2>
          <div className="flex justify-center space-x-6">
            {/* Instagram Logo and Link */}
            <a
              href="https://www.instagram.com/andy_haryana_vitb/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
            >
              <img
                src="/instagram-logo.png" // Replace with the path to your Instagram logo
                alt="Instagram"
                className="w-8 h-8"
              />
              <span>Instagram</span>
            </a>
            {/* LinkedIn Logo and Link */}
            <a
              href="https://www.linkedin.com/in/st-shreyansh-tripathi/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
            >
              <img
                src="/linkedin-logo.png" // Replace with the path to your LinkedIn logo
                alt="LinkedIn"
                className="w-8 h-8"
              />
              <span>LinkedIn</span>
            </a>
          </div>
          <p className="mt-4">Contact: shreyanshtripathi210@gmail.com</p>
          <p>Address: Vellore Institute of Technology, Bhopal</p>
          {/* Copyright Section with Updated Font Color */}
          <p className="mt-8 text-gray-500">
            Copyright © 2025 All rights reserved | Made with ❤️{" "}
            <span className="text-purple-500">Pace-Runerz alchemy</span>
          </p>
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
