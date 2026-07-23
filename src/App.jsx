import React, { lazy, Suspense, useEffect, useState } from "react";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import ServiceSummary from "./sections/ServiceSummary";
import Services from "./sections/Services";
import ReactLenis from "lenis/react";
import About from "./sections/About";
import Works from "./sections/Works";
import ContactSummary from "./sections/ContactSummary";
import Contact from "./sections/Contact";
import { Analytics } from '@vercel/analytics/react';
import PlanetScene from "./components/PlanetScene";

// Lazy load the 3D planet — this creates a separate chunk
const PlanetComponent = lazy(() => import("./components/PlanetScene"));

const App = () => {
  const [showPlanet, setShowPlanet] = useState(false);

  useEffect(() => {
    // Load 3D scene after text is rendered and interactive
    const timer = setTimeout(() => setShowPlanet(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ReactLenis root className="relative w-screen min-h-screen overflow-x-auto">
      <Navbar />
      <Hero />
      <ServiceSummary />
      <Services />
      <About />
      <Works />
      <ContactSummary />
      <Contact />
      <Analytics />
      
      {/* 3D scene loads after everything else */}
      {showPlanet && (
        <Suspense fallback={null}>
          <PlanetScene />
        </Suspense>
      )}
    </ReactLenis>
  );
};

export default App;