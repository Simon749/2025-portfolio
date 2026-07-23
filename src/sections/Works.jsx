import { Icon } from "@iconify/react/dist/iconify.js";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import { projects } from "../constants";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Works = () => {
  const overlayRefs = useRef([]);
  const previewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(null);

  const text = `Featured projects that have been meticulously crafted with passion to drive results and impact.`;

  const mouse = useRef({ x: 0, y: 0 });
  const moveX = useRef(null);
  const moveY = useRef(null);

  useGSAP(() => {
    moveX.current = gsap.quickTo(previewRef.current, "x", {
      duration: 1.5,
      ease: "power3.out",
    });
    moveY.current = gsap.quickTo(previewRef.current, "y", {
      duration: 2,
      ease: "power3.out",
    });

    // FIXED: Use class selector instead of broken ID
    gsap.from(".project-card", {
      y: 100,
      opacity: 0,
      delay: 0.5,
      duration: 1,
      stagger: 0.3,
      ease: "back.out",
      scrollTrigger: {
        trigger: ".project-card",
      },
    });
  }, []);

  const handleMouseEnter = (index) => {
    if (window.innerWidth < 768) return;
    setCurrentIndex(index);

    const el = overlayRefs.current[index];
    if (!el) return;

    gsap.killTweensOf(el);
    gsap.fromTo(
      el,
      {
        clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
      },
      {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
        duration: 0.15,
        ease: "power2.out",
      }
    );

    gsap.to(previewRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = (index) => {
    if (window.innerWidth < 768) return;
    setCurrentIndex(null);

    const el = overlayRefs.current[index];
    if (!el) return;

    gsap.killTweensOf(el);
    gsap.to(el, {
      clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
      duration: 0.2,
      ease: "power2.in",
    });

    gsap.to(previewRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseMove = (e) => {
    if (window.innerWidth < 768) return;
    // FIXED: Position preview to the right of cursor, not overlapping text
    const offsetX = 20;
    const offsetY = -150;
    mouse.current.x = e.clientX + offsetX;
    mouse.current.y = e.clientY + offsetY;
    moveX.current(mouse.current.x);
    moveY.current(mouse.current.y);
  };

  return (
    <section id="work" className="flex flex-col min-h-screen">
      <AnimatedHeaderSection
        subTitle={"Logic meets Aesthetics, Seamlessly"}
        title={"Works"}
        text={text}
        textColor={"text-black"}
        withScrollTrigger={true}
      />
      <div
        className="relative flex flex-col font-light"
        onMouseMove={handleMouseMove}
      >
        {projects.map((project, index) => (
          <a
            key={project.id}
            className="project-card relative flex flex-col gap-1 py-5 cursor-pointer group md:gap-0"
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            {/* overlay */}
            <div
              ref={(el) => {
                overlayRefs.current[index] = el;
              }}
              className="absolute inset-0 hidden md:block duration-200 bg-black -z-10 clip-path"
            />

            {/* title + arrow */}
            <div className="flex justify-between px-10 text-black transition-all duration-500 md:group-hover:px-12 md:group-hover:text-white">
              <div className="flex flex-col">
                <h2 className="lg:text-[32px] text-[26px] leading-none">
                  {project.name}
                </h2>
                {/* NEW: Show role on desktop hover */}
                <p className="hidden md:block text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white/70 mt-1">
                  {project.role}
                </p>
              </div>
              <Icon icon="lucide:arrow-up-right" className="md:size-6 size-5" />
            </div>

            {/* framework tags */}
            <div className="flex px-10 text-xs leading-loose uppercase transition-all duration-500 md:text-sm gap-x-5 md:group-hover:px-12">
              {project.frameworks.map((framework) => (
                <p
                  key={framework.id}
                  className="text-black transition-colors duration-500 md:group-hover:text-white"
                >
                  {framework.name}
                </p>
              ))}
            </div>

            {/* NEW: Description visible on mobile, hover on desktop */}
            <div className="px-10 mt-2 md:mt-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 md:text-white/80 text-sm max-w-2xl">
              <p className="md:hidden text-black/70">{project.description}</p>
              <p className="hidden md:block">{project.description}</p>
            </div>

            {/* NEW: Outcome badge on hover */}
            <div className="hidden md:block px-10 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-xs uppercase tracking-wider text-white/50">
                Result: {project.outcome}
              </span>
            </div>

            {/* mobile preview image — IMPROVED */}
            <div className="relative flex items-center justify-center px-10 mt-4 md:hidden h-[300px]">
              <img
                src={project.bgImage}
                alt=""
                className="object-cover w-full h-full rounded-md brightness-50"
              />
              <img
                src={project.image}
                alt={`${project.name} preview`}
                className="absolute object-contain w-3/4 h-3/4 rounded-lg shadow-2xl"
              />
            </div>
          </a>
        ))}

        {/* desktop floating preview — FIXED SIZE */}
        <div
          ref={previewRef}
          className="fixed top-0 left-0 z-40 overflow-hidden rounded-lg shadow-2xl pointer-events-none md:block hidden opacity-0"
          style={{ width: "min(480px, 35vw)", height: "auto" }}
        >
          {currentIndex !== null && (
            <img
              src={projects[currentIndex].image}
              alt={`${projects[currentIndex].name} preview`}
              className="object-cover w-full h-auto"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Works;