import { useState, useEffect, useRef } from 'react';

const useScrollAnimation = (threshold = 0.1) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
};

const AccordionItem = ({
  company,
  role,
  date,
  description,
  details,
  tags,
  isActive,
  onClick,
  variant = 'up',
  delay = 0,
  threshold = 0.1
}) => {
  const [animationRef, isVisible] = useScrollAnimation(threshold);

  return (
    <div
      ref={animationRef}
      className={`accordion-item animate-on-scroll ${isActive ? 'active' : ''} ${isVisible ? 'visible' : ''}`}
      data-variant={variant}
      style={{ '--reveal-delay': `${delay}ms` }}
    >
      <button className="accordion-header" onClick={onClick}>
        <div className="accordion-left">
          <span className="accordion-company">{company}</span>
          <span className="accordion-role">{role}</span>
        </div>
        <span className="accordion-date">{date}</span>
        <svg className="accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div className="accordion-content">
        <div className="accordion-inner">
          <p className="accordion-description">{description}</p>
          <ul className="accordion-list">
            {details.map((detail, i) => (
              <li key={i}>{detail}</li>
            ))}
          </ul>
          <div className="accordion-tags">
            {tags.map((tag) => (
              <span key={tag} className="accordion-tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SkillCard = ({ title, skills, variant = 'up', delay = 0, threshold = 0.1 }) => {
  const [animationRef, isVisible] = useScrollAnimation(threshold);

  return (
    <div
      ref={animationRef}
      className={`skill-card animate-on-scroll ${isVisible ? 'visible' : ''}`}
      data-variant={variant}
      style={{ '--reveal-delay': `${delay}ms` }}
    >
      <h3 className="skill-title">{title}</h3>
      <div className="skill-items">
        {skills.map((skill) => (
          <span key={skill} className="skill-pill">{skill}</span>
        ))}
      </div>
    </div>
  );
};

const AnimatedSection = ({
  children,
  className = '',
  variant = 'up',
  delay = 0,
  threshold = 0.1,
  as: Component = 'div'
}) => {
  const [ref, isVisible] = useScrollAnimation(threshold);

  return (
    <Component
      ref={ref}
      className={`animate-on-scroll ${isVisible ? 'visible' : ''} ${className}`.trim()}
      data-variant={variant}
      style={{ '--reveal-delay': `${delay}ms` }}
    >
      {children}
    </Component>
  );
};

function App() {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleAccordionClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const experiences = [
    {
      company: "Arizona Athletics",
      role: "Automation & Systems Analyst",
      date: "2022 - Present",
      description: "Building custom web applications and automations that modernize workflows, improve data quality, and support operational decision-making across Athletics.",
      details: [
        "Designed and developed custom web applications and automation tools that streamlined day-to-day operations across multiple Athletics departments.",
        "Digitized business receipt submissions using Power Apps and Power Automate, replacing manual intake and standardizing required data.",
        "Built an automated post-submission workflow that routes, tags, and organizes receipts after upload, improving retrieval, tracking, and staff follow-through.",
        "Developed a program that reviews game broadcast footage and measures sponsor visibility duration for partnership reporting and decision support.",
        "Collaborated with staff and leadership to analyze workflows, identify inefficiencies, and deploy scalable web-based solutions tailored to end-user needs.",
        "Managed the full software development lifecycle, including requirements gathering, UI design, testing, deployment, and user training."
      ],
      tags: ["Python", "JavaScript", "HTML/CSS", "Power Platform", "Power Apps", "Power Automate", "APIs", "Dashboards"]
    },
    {
      company: "Camp Sea Gull & Camp Seafarer",
      role: "Archery Program Director & Instructor",
      date: "Summer 2022",
      description: "Directed the archery program at one of the largest overnight camps in the U.S., focused on safety and skill development.",
      details: [
        "Oversaw safety protocols and skill development for 1,000+ campers and staff",
        "Managed maintenance and safety of the archery range and equipment",
        "Instructed campers and staff in archery and riflery to improve skills and participation",
        "Collaborated with leadership to enhance camper experience and launch new initiatives"
      ],
      tags: ["Leadership", "Safety", "Training", "Program Management", "Operations"]
    }
  ];

  const skillCategories = [
    { title: "Programming Languages", skills: ["Python", "Java", "JavaScript", "HTML/CSS", "Swift"] },
    { title: "Technologies", skills: ["Git", "Microsoft Power Platform", "Azure", "Linux", "macOS", "Windows"] },
    { title: "Soft Skills", skills: ["Leadership", "Communication", "Teamwork", "Problem-Solving"] },
    { title: "Business Skills", skills: ["Accounting", "Marketing", "Sales"] }
  ];

  return (
    <div>
      <nav className="nav">
        <div className="nav-logo">
          JC<span>.</span>
        </div>
        <div className="nav-links">
          <a href="#work" className="nav-link">Work</a>
          <a href="#skills" className="nav-link">Skills</a>
          <a href="mailto:jcantor@arizona.edu" className="btn btn-primary">Contact</a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <AnimatedSection className="hero-label" variant="zoom" threshold={0.2}>
            Available for opportunities
          </AnimatedSection>
          <AnimatedSection as="h1" className="hero-title" variant="up" delay={120} threshold={0.2}>
            Jason <span>Cantor</span>
          </AnimatedSection>
          <AnimatedSection as="p" className="hero-subtitle" variant="up" delay={220} threshold={0.2}>
            Automation & Systems Analyst building AI-driven workflows and internal tools.
          </AnimatedSection>
          <AnimatedSection className="hero-links" variant="up" delay={320} threshold={0.2}>
            <a href="https://github.com/jasoncantor" target="_blank" rel="noreferrer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/jason-cantor/" target="_blank" rel="noreferrer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
          </AnimatedSection>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="stats-grid">
            <AnimatedSection variant="left" delay={0}>
              <div className="stat-card">
                <div className="stat-number">20+</div>
                <div className="stat-label">Hours/Week Saved</div>
              </div>
            </AnimatedSection>
            <AnimatedSection variant="up" delay={120}>
              <div className="stat-card">
                <div className="stat-number">20+</div>
                <div className="stat-label">Tools & Apps Built</div>
              </div>
            </AnimatedSection>
            <AnimatedSection variant="right" delay={240}>
              <div className="stat-card">
                <div className="stat-number">10+</div>
                <div className="stat-label">Systems Integrated</div>
              </div>
            </AnimatedSection>
          </div>

          <div id="work">
            <AnimatedSection className="section-header" variant="left">
              <p className="section-label">// EXPERIENCE</p>
              <h2 className="section-title">Professional Experience</h2>
            </AnimatedSection>

            <div className="accordion">
              {experiences.map((exp, index) => (
                <AccordionItem
                  key={index}
                  {...exp}
                  isActive={activeIndex === index}
                  onClick={() => handleAccordionClick(index)}
                  variant={index % 2 === 0 ? 'left' : 'right'}
                  delay={index * 140}
                  threshold={0.15}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="section">
        <div className="container">
          <AnimatedSection className="section-header" variant="right">
            <p className="section-label">// SKILLS</p>
            <h2 className="section-title">Skills & Technologies</h2>
          </AnimatedSection>

          <div className="skills-grid">
            {skillCategories.map((category, index) => (
              <SkillCard
                key={category.title}
                {...category}
                variant={index % 2 === 0 ? 'left' : 'right'}
                delay={index * 100}
                threshold={0.15}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <AnimatedSection variant="zoom" delay={100}>
            <div className="github-card">
              <h3 className="github-title">GitHub Activity</h3>
              <p className="github-desc">Live contribution tracker synced from GitHub.</p>
              <div className="github-graph">
                <img
                  src="https://ghchart.rshah.org/AB0520/jasoncantor"
                  alt="Jason Cantor GitHub contribution graph"
                  loading="lazy"
                />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="contact">
        <div className="container">
          <AnimatedSection variant="up" delay={100}>
            <h2 className="contact-title">
              Let's Build <span>Something Great</span>
            </h2>
            <p className="contact-subtitle">Currently based in Tucson, AZ</p>
            <a href="mailto:jcantor@arizona.edu" className="contact-email">
              jcantor@arizona.edu
            </a>
            <p className="contact-footer">University of Arizona '26</p>
          </AnimatedSection>
        </div>
      </section>

      <footer className="footer">
        <p className="footer-text">Designed & Built by Jason Cantor</p>
      </footer>
    </div>
  );
}

export default App;
