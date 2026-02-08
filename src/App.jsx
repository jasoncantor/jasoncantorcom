import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, useReducedMotion } from 'framer-motion';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(max-width: 768px), (pointer: coarse)');
    const handleChange = (event) => setIsMobile(event.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return isMobile;
};

// Animated text that reveals letter by letter
const AnimatedText = ({ text, className, style, delay = 0, reduceMotion = false }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (reduceMotion) {
    return (
      <span ref={ref} className={className} style={{ ...style, display: 'inline-block' }}>
        {text}
      </span>
    );
  }

  return (
    <span ref={ref} className={className} style={{ ...style, display: 'inline-block' }}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 50, rotateX: -90 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.03,
            ease: [0.215, 0.61, 0.355, 1]
          }}
          style={{ display: 'inline-block', transformOrigin: 'bottom' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
};

// Scroll-triggered card component
const ScrollCard = ({ children, className, style, delay = 0, reduceMotion = false }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={reduceMotion ? false : { opacity: 0, y: 80, scale: 0.95 }}
      animate={reduceMotion ? { opacity: 1, y: 0, scale: 1 } : (isInView ? { opacity: 1, y: 0, scale: 1 } : {})}
      transition={{
        duration: reduceMotion ? 0 : 0.7,
        delay,
        ease: [0.215, 0.61, 0.355, 1]
      }}
      whileHover={reduceMotion ? undefined : {
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
    >
      {children}
    </motion.div>
  );
};

// Animated counter for stats
const Counter = ({ value, suffix = '', duration = 2, reduceMotion = false }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      if (reduceMotion) {
        setCount(parseInt(value));
        return;
      }
      let start = 0;
      const end = parseInt(value);
      const increment = end / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);
      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// Magnetic button effect
const MagneticButton = ({ children, className, href, style, target, rel, reduceMotion = false }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - left - width / 2) * 0.3;
    const y = (clientY - top - height / 2) * 0.3;
    setPosition({ x, y });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      style={style}
      onMouseMove={reduceMotion ? undefined : handleMouse}
      onMouseLeave={reduceMotion ? undefined : reset}
      animate={reduceMotion ? { x: 0, y: 0 } : { x: position.x, y: position.y }}
      transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 150, damping: 15 }}
      target={target}
      rel={rel}
    >
      {children}
    </motion.a>
  );
};

const AnimatedExperienceCard = ({ number, title, role, description, details, tags, color }) => {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const isInView = useInView(cardRef, { once: false, margin: "-20%" });

  // Animated values based on scroll
  const cardScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.9]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);
  const expandProgress = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);
  const detailsOpacity = useTransform(scrollYProgress, [0.25, 0.4], [0, 1]);

  const smoothScale = useSpring(cardScale, { stiffness: 100, damping: 20 });
  const smoothExpand = useSpring(expandProgress, { stiffness: 80, damping: 20 });

  return (
    <motion.div
      ref={cardRef}
      className="exp-card"
      style={{
        scale: smoothScale,
        opacity: cardOpacity,
        '--expand-progress': smoothExpand,
        '--accent-color': color
      }}
    >
      <div className="exp-card-inner">
        {/* Number with animated gradient */}
        <motion.div
          className="exp-number"
          style={{ color }}
        >
          {number}
        </motion.div>

        {/* Header Section */}
        <div className="exp-header">
          <motion.h3
            className="exp-title"
            initial={{ x: -30, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {title}
          </motion.h3>
          <motion.p
            className="exp-role"
            style={{ color }}
            initial={{ x: -30, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {role}
          </motion.p>
        </div>

        {/* Expanding Details Section */}
        <motion.div
          className="exp-details"
          style={{ opacity: detailsOpacity }}
        >
          <motion.p
            className="exp-description"
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {description}
          </motion.p>

          {/* Animated bullet points */}
          <ul className="exp-bullets">
            {details.map((detail, i) => (
              <motion.li
                key={i}
                className="exp-bullet"
                initial={{ x: -40, opacity: 0 }}
                animate={isInView ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              >
                <span className="bullet-icon" style={{ background: color }}>→</span>
                {detail}
              </motion.li>
            ))}
          </ul>

          {/* Tags with staggered animation */}
          <div className="exp-tags">
            {tags.map((tag, i) => (
              <motion.span
                key={tag}
                className="exp-tag"
                style={{ borderColor: color, color }}
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  delay: 0.6 + i * 0.08
                }}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: color,
                  color: '#fff'
                }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          className="exp-line"
          style={{
            scaleX: smoothExpand,
            backgroundColor: color
          }}
        />
      </div>
    </motion.div>
  );
};

const StaticExperienceCard = ({ number, title, role, description, details, tags, color }) => (
  <div className="exp-card">
    <div className="exp-card-inner">
      <div className="exp-number" style={{ color }}>{number}</div>
      <div className="exp-header">
        <h3 className="exp-title">{title}</h3>
        <p className="exp-role" style={{ color }}>{role}</p>
      </div>
      <div className="exp-details">
        <p className="exp-description">{description}</p>
        <ul className="exp-bullets">
          {details.map((detail, i) => (
            <li key={i} className="exp-bullet">
              <span className="bullet-icon" style={{ background: color }}>→</span>
              {detail}
            </li>
          ))}
        </ul>
        <div className="exp-tags">
          {tags.map((tag) => (
            <span key={tag} className="exp-tag" style={{ borderColor: color, color }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="exp-line" style={{ backgroundColor: color }} />
    </div>
  </div>
);

// Expandable Experience Card with scroll-triggered details
const ExperienceCard = ({ reduceMotion, ...props }) => (
  reduceMotion ? <StaticExperienceCard {...props} /> : <AnimatedExperienceCard {...props} />
);

// Parallax floating elements
const ParallaxElement = ({ children, speed = 0.5, style }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * -200]);

  return (
    <motion.div ref={ref} style={{ ...style, y }} className="floating-element">
      {children}
    </motion.div>
  );
};

const FloatingElement = ({ reduceMotion = false, ...props }) => (
  reduceMotion ? (
    <div className="floating-element" style={props.style}>
      {props.children}
    </div>
  ) : (
    <ParallaxElement {...props} />
  )
);


function App() {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = prefersReducedMotion || isMobile;
  const { scrollYProgress } = useScroll();
  const scaleProgress = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);
  const opacityProgress = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <div className="scroll-container">
      {/* Progress bar */}
      {!shouldReduceMotion && (
        <motion.div
          className="scroll-progress"
          style={{ scaleX: scrollYProgress }}
        />
      )}

      {/* Floating background elements */}
      <FloatingElement reduceMotion={shouldReduceMotion} speed={0.3} style={{ position: 'fixed', top: '10%', left: '5%', zIndex: 0 }}>
        <div className="float-orb float-orb-1" />
      </FloatingElement>
      <FloatingElement reduceMotion={shouldReduceMotion} speed={0.5} style={{ position: 'fixed', top: '60%', right: '10%', zIndex: 0 }}>
        <div className="float-orb float-orb-2" />
      </FloatingElement>
      <FloatingElement reduceMotion={shouldReduceMotion} speed={0.2} style={{ position: 'fixed', bottom: '20%', left: '15%', zIndex: 0 }}>
        <div className="float-orb float-orb-3" />
      </FloatingElement>

      {/* Hero Section - Full viewport */}
      <motion.section
        className="hero-section"
        style={{ scale: shouldReduceMotion ? 1 : scaleProgress }}
      >
        <nav className="nav-fixed">
          <motion.div
            className="nav-logo"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            JC<span style={{ color: 'var(--accent)' }}>.</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <MagneticButton reduceMotion={shouldReduceMotion} href="mailto:jcantor@arizona.edu" className="btn btn-outline nav-btn">
              Contact
            </MagneticButton>
          </motion.div>
        </nav>

        <div className="hero-content">
          <h1 className="hero-title">
            <AnimatedText text="Jason" delay={0.1} reduceMotion={shouldReduceMotion} />
            <br />
            <AnimatedText text="Cantor" delay={0.25} className="hero-title-accent" reduceMotion={shouldReduceMotion} />
          </h1>

          <motion.p
            className="hero-subtitle"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.6, duration: shouldReduceMotion ? 0 : 0.6 }}
          >
            Automation &amp; Systems Analyst building AI-driven workflows and internal tools.
          </motion.p>

          <motion.div
            className="hero-cta"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.8, duration: shouldReduceMotion ? 0 : 0.6 }}
          >
            <MagneticButton reduceMotion={shouldReduceMotion} href="#work" className="btn btn-primary btn-large">
              View My Work
            </MagneticButton>
            <div className="hero-secondary">
              <MagneticButton reduceMotion={shouldReduceMotion} href="https://github.com/jasoncantor" className="btn btn-link" target="_blank" rel="noreferrer">
                GitHub
              </MagneticButton>
              <MagneticButton
                href="https://www.linkedin.com/in/jason-cantor/"
                className="btn btn-link"
                target="_blank"
                rel="noreferrer"
                reduceMotion={shouldReduceMotion}
              >
                LinkedIn
              </MagneticButton>
            </div>
          </motion.div>

          <motion.p
            className="hero-note"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: shouldReduceMotion ? 0 : 1, duration: shouldReduceMotion ? 0 : 0.6 }}
          >
            Available for opportunities
          </motion.p>
        </div>

        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{ opacity: shouldReduceMotion ? 1 : opacityProgress }}
        >
          <span>Scroll to explore</span>
          {shouldReduceMotion ? (
            <div className="scroll-arrow">↓</div>
          ) : (
            <motion.div
              className="scroll-arrow"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ↓
            </motion.div>
          )}
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <ScrollCard className="stat-card" delay={0} reduceMotion={shouldReduceMotion}>
              <div className="stat-number"><Counter value={20} suffix="+" reduceMotion={shouldReduceMotion} /></div>
              <div className="stat-label">Hours/Week Saved</div>
            </ScrollCard>
            <ScrollCard className="stat-card" delay={0.1} reduceMotion={shouldReduceMotion}>
              <div className="stat-number"><Counter value={20} suffix="+" reduceMotion={shouldReduceMotion} /></div>
              <div className="stat-label">Tools & Apps Built</div>
            </ScrollCard>
            <ScrollCard className="stat-card" delay={0.2} reduceMotion={shouldReduceMotion}>
              <div className="stat-number"><Counter value={10} suffix="+" reduceMotion={shouldReduceMotion} /></div>
              <div className="stat-label">Systems Integrated</div>
            </ScrollCard>
          </div>
        </div>
      </section>

      {/* Experience Section - Expanding Cards */}
      <section id="work" className="experience-section">
        <div className="container">
          <motion.h2
            className="section-title-large"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Professional <span className="text-accent">Experience</span>
          </motion.h2>

          <div className="experience-list">
            <ExperienceCard
              reduceMotion={shouldReduceMotion}
              number="01"
              title="Arizona Athletics"
              role="Automation & Systems Analyst"
              color="#AB0520"
              description="Building custom web apps and automation tools that streamline operations across Athletics departments."
              details={[
                "Designed and developed web applications and automation tools to improve daily operations",
                "Built full-stack solutions with Python, JavaScript, HTML/CSS, and Microsoft Power Platform",
                "Created equipment checkout and inventory systems with dynamic interfaces and automated reporting",
                "Connected Microsoft 365, Excel, and internal databases via cloud services and APIs for real-time sync"
              ]}
              tags={["Python", "JavaScript", "HTML/CSS", "Power Platform", "Power Apps", "Power Automate"]}
            />

            <ExperienceCard
              reduceMotion={shouldReduceMotion}
              number="02"
              title="Arizona Athletics"
              role="Automation & Systems Analyst"
              color="#0C234B"
              description="Partnering with staff and leadership to modernize systems, improve data visibility, and deliver scalable internal tools."
              details={[
                "Collaborated with stakeholders to analyze workflows, identify inefficiencies, and define requirements",
                "Managed the full software lifecycle: discovery, UI design, testing, deployment, and training",
                "Built reporting and dashboarding experiences to improve operational decision-making",
                "Integrated legacy systems with cloud services and APIs to unify data across departments"
              ]}
              tags={["Requirements", "UI Design", "Dashboards", "APIs", "Data Sync"]}
            />

            <ExperienceCard
              reduceMotion={shouldReduceMotion}
              number="03"
              title="Camp Sea Gull & Camp Seafarer"
              role="Archery Program Director & Instructor, Camp Counselor"
              color="#AB0520"
              description="Directed the archery program at one of the largest overnight camps in the U.S., focused on safety and skill development."
              details={[
                "Oversaw safety protocols and skill development for 1,000+ campers and staff",
                "Managed maintenance and safety of the archery range and equipment",
                "Instructed campers and staff in archery and riflery to improve skills and participation",
                "Collaborated with leadership to enhance camper experience and launch new initiatives"
              ]}
              tags={["Leadership", "Safety", "Training", "Program Management", "Operations"]}
            />
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="skills-section">
        <div className="container">
          <motion.h2
            className="section-title-large"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Skills & <span className="text-accent">Technologies</span>
          </motion.h2>

          <div className="skills-grid">
            <ScrollCard className="skill-category" delay={0} reduceMotion={shouldReduceMotion}>
              <h3 className="skill-title">Programming Languages</h3>
              <div className="skill-items">
                {['Python', 'Java', 'JavaScript', 'HTML/CSS', 'Swift'].map((s, i) => (
                  <motion.span
                    key={s}
                    className="skill-pill"
                    initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.8 }}
                    whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.1, backgroundColor: '#AB0520', color: '#fff' }}
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </ScrollCard>

            <ScrollCard className="skill-category" delay={0.15} reduceMotion={shouldReduceMotion}>
              <h3 className="skill-title">Technologies</h3>
              <div className="skill-items">
                {['Git', 'Microsoft Power Platform', 'Azure', 'Linux', 'macOS', 'Windows'].map((s, i) => (
                  <motion.span
                    key={s}
                    className="skill-pill"
                    initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.8 }}
                    whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.1, backgroundColor: '#AB0520', color: '#fff' }}
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </ScrollCard>

            <ScrollCard className="skill-category" delay={0.3} reduceMotion={shouldReduceMotion}>
              <h3 className="skill-title">Soft Skills</h3>
              <div className="skill-items">
                {['Leadership', 'Communication', 'Teamwork', 'Problem-Solving'].map((s, i) => (
                  <motion.span
                    key={s}
                    className="skill-pill"
                    initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.8 }}
                    whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.1, backgroundColor: '#AB0520', color: '#fff' }}
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </ScrollCard>

            <ScrollCard className="skill-category" delay={0.45} reduceMotion={shouldReduceMotion}>
              <h3 className="skill-title">Business Skills</h3>
              <div className="skill-items">
                {['Accounting', 'Marketing', 'Sales'].map((s, i) => (
                  <motion.span
                    key={s}
                    className="skill-pill"
                    initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.8 }}
                    whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.1, backgroundColor: '#AB0520', color: '#fff' }}
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </ScrollCard>
          </div>
        </div>
      </section>

      {/* GitHub Section */}
      <section className="github-section">
        <div className="container">
          <ScrollCard className="github-card" reduceMotion={shouldReduceMotion}>
            <div className="card-title">GitHub Activity</div>
            <p className="github-desc">Live contribution tracker synced from GitHub.</p>
            <div className="github-activity" aria-label="GitHub contribution graph">
              <img
                src="https://ghchart.rshah.org/AB0520/jasoncantor"
                alt="Jason Cantor GitHub contribution graph"
                loading="lazy"
              />
            </div>
            <MagneticButton
              href="https://github.com/jasoncantor"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
              style={{ marginTop: '24px', alignSelf: 'flex-start' }}
              reduceMotion={shouldReduceMotion}
            >
              View on GitHub
            </MagneticButton>
          </ScrollCard>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="contact-title">
              <AnimatedText text="Let's Build" reduceMotion={shouldReduceMotion} />
              <br />
              <AnimatedText text="Something Great" className="text-accent" delay={0.3} reduceMotion={shouldReduceMotion} />
            </h2>
            <motion.p
              className="contact-subtitle"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              Currently based in Tucson, AZ
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1 }}
            >
              <MagneticButton href="mailto:jcantor@arizona.edu" className="contact-email" reduceMotion={shouldReduceMotion}>
                jcantor@arizona.edu
              </MagneticButton>
            </motion.div>
          </motion.div>

          <motion.div
            className="contact-footer"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2 }}
          >
            <span>University of Arizona '26</span>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default App;
