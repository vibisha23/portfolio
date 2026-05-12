import './App.css'
import heroImage from './assets/portfolio-hero.png'

const navItems = ['Home', 'About', 'Services', 'Skills', 'Projects', 'Education', 'Contact']

const services = [
  {
    title: 'Secure Application Development',
    copy: 'Building authentication, access-control, and encryption-focused systems with practical security foundations.',
  },
  {
    title: 'IoT and Embedded Systems',
    copy: 'Designing sensor-based monitoring systems using microcontrollers, GSM alerts, and real-time threshold logic.',
  },
  {
    title: 'Full Stack Fundamentals',
    copy: 'Creating structured interfaces and backend logic with Java, Python, React, HTML, CSS, and relational databases.',
  },
]

const skills = [
  { name: 'Java', focus: 'OOP, backend logic, secure systems' },
  { name: 'Python', focus: 'Automation, scripting, problem solving' },
  { name: 'Embedded Systems', focus: 'ESP32, NodeMCU, sensor integration' },
  { name: 'React / Frontend', focus: 'Responsive UI, HTML, CSS' },
  { name: 'Computer Networks', focus: 'Protocols, monitoring, analysis' },
  { name: 'MySQL / SQLite', focus: 'Data modeling and storage' },
]

const tools = [
  'C',
  'C++',
  'GitHub',
  'VS Code',
  'Android Studio',
  'NetBeans',
  'Nmap',
  'Wireshark',
  'Data Structures',
  'OOP',
  'Operating Systems',
]

const projects = [
  {
    number: '01',
    title: 'Thermal Imaging Security System',
    category: 'Embedded Security',
    stack: 'ESP32, AMG8833 Thermal Sensor, Embedded C/Arduino, I2C',
    description:
      'An intrusion detection system that captures 8x8 real-time thermal data and triggers automated alerts with threshold-based detection.',
    highlights: ['64 thermal data points per cycle', 'Response time under 1 second', 'Automated alert mechanism'],
  },
  {
    number: '02',
    title: 'IoT-Based Manhole Monitoring System',
    category: 'IoT Safety',
    stack: 'NodeMCU, SIM800L GSM, Ultrasonic Sensor, MQ Gas Sensor',
    description:
      'A sensor-integrated monitoring system for gas levels, water level, and manhole tilt, designed to improve hazard response.',
    highlights: ['GSM SMS alerts in 2-3 seconds', 'Gas and water-level monitoring', 'Reduced manual inspection'],
  },
  {
    number: '03',
    title: 'Data Leakage Prevention System',
    category: 'Data Security',
    stack: 'Java, Cryptography, Role-Based Access Control',
    description:
      'A secure data protection system using encryption, authentication, and role-based authorization to protect sensitive information.',
    highlights: ['Encrypted data handling', 'Role-based access control', 'Unauthorized access prevention'],
  },
]

const education = [
  {
    period: '2022 - Present',
    title: 'Integrated M.Tech in Software Engineering',
    place: 'Vellore Institute of Technology, Vellore',
    detail: 'Current CGPA: 8.36',
  },
  {
    period: '2020 - 2022',
    title: 'Higher Secondary and Secondary Education',
    place: 'CS Academy, Erode',
    detail: 'HSC: 76.2% | SSLC: 82.6%',
  },
]

function App() {
  return (
    <main className="site-shell">
      <div className="live-background" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <header className="navbar">
        <a className="logo" href="#home" aria-label="Vibisha Abhirami home">
          Vibisha<span>.</span>
        </a>
        <nav aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`}>
              {item}
            </a>
          ))}
        </nav>
      </header>

      <section className="hero section" id="home">
        <div className="hero-content">
          <p className="section-kicker">Hello, I am</p>
          <h1>
            Vibisha Abhirami V
            <span>Software Engineering Student</span>
          </h1>
          <p className="hero-copy">
            I build secure, practical systems across software engineering, IoT, embedded systems,
            and data protection. My work connects real-time sensing, reliable alerts, and
            application security.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#projects">
              View Projects
            </a>
          </div>
          <div className="hero-socials" aria-label="Profile links">
            <a href="mailto:vibivasu2004@gmail.com">Email</a>
            <a
              href="https://linkedin.com/in/vibisha-abhirami-08197b312"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a href="tel:+917010461040">Phone</a>
          </div>
        </div>

        <div className="hero-portrait">
          <img src={heroImage} alt="Abstract secure technology portfolio visual" />
          <div className="status-card">
            <strong>Available for Projects</strong>
            <span>Software, IoT, and security-focused systems</span>
          </div>
        </div>
      </section>

      <section className="stats-strip" aria-label="Portfolio highlights">
        <article>
          <span>8.36</span>
          <p>CGPA</p>
        </article>
        <article>
          <span>3+</span>
          <p>Major Projects</p>
        </article>
        <article>
          <span>AWS</span>
          <p>Certified</p>
        </article>
        <article>
          <span>2026</span>
          <p>Hackathon</p>
        </article>
      </section>

      <section className="about section" id="about">
        <div className="section-heading">
          <p className="section-kicker">About Me</p>
          <h2>Engineering secure systems with clear structure and real-world purpose.</h2>
        </div>
        <div className="about-grid">
          <div className="about-panel">
            <p>
              I am a Software Engineering student at Vellore Institute of Technology with strong
              foundations in data structures, object-oriented programming, computer networks, and
              operating systems. I enjoy building systems that are useful beyond the screen,
              especially embedded and IoT applications that monitor, detect, and respond quickly.
            </p>
            <p>
              My strongest interests are secure application design, sensor-driven automation, and
              backend logic. I work with Java, Python, C, C++, React, MySQL, and SQLite.
            </p>
          </div>
          <div className="about-info">
            <div>
              <span>Name</span>
              <strong>Vibisha Abhirami V</strong>
            </div>
            <div>
              <span>Location</span>
              <strong>Erode, Tamil Nadu</strong>
            </div>
            <div>
              <span>Email</span>
              <strong>vibivasu2004@gmail.com</strong>
            </div>
            <div>
              <span>Focus</span>
              <strong>Security, IoT, Embedded Systems</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="services section" id="services">
        <div className="section-heading centered">
          <p className="section-kicker">What I Do</p>
          <h2>Areas of Interest</h2>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.title}>
              <span aria-hidden="true">◆</span>
              <h3>{service.title}</h3>
              <p>{service.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="skills section" id="skills">
        <div className="section-heading">
          <p className="section-kicker">My Skills</p>
          <h2>Technical Skills</h2>
        </div>
        <div className="skills-layout">
          <div className="skill-card-grid">
            {skills.map((skill) => (
              <article className="skill-card" key={skill.name}>
                <span aria-hidden="true" />
                <h3>{skill.name}</h3>
                <p>{skill.focus}</p>
              </article>
            ))}
          </div>
          <div className="tool-cloud">
            {tools.map((tool) => (
              <span key={tool}>{tool}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="projects section" id="projects">
        <div className="section-heading centered">
          <p className="section-kicker">Portfolio</p>
          <h2>Featured Projects</h2>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.title}>
              <div className="project-topline">
                <span>{project.number}</span>
                <p>{project.category}</p>
              </div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <small>{project.stack}</small>
              <ul>
                {project.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="education section" id="education">
        <div className="section-heading">
          <p className="section-kicker">Qualification</p>
          <h2>Education and Certifications</h2>
        </div>
        <div className="timeline">
          {education.map((item) => (
            <article className="timeline-item" key={item.title}>
              <span>{item.period}</span>
              <h3>{item.title}</h3>
              <p>{item.place}</p>
              <strong>{item.detail}</strong>
            </article>
          ))}
          <article className="timeline-item certificate">
            <span>2026</span>
            <h3>AWS Certified Cloud Practitioner (CLF-C02)</h3>
            <p>Amazon Web Services</p>
            <strong>Cloud fundamentals, security, and AWS services</strong>
          </article>
          <article className="timeline-item certificate">
            <span>January 2026</span>
            <h3>Develop Secure Mobile/Web Application Hackathon</h3>
            <p>Industry Academia Conclave, VIT Vellore</p>
            <strong>Secure application development challenge</strong>
          </article>
        </div>
      </section>

      <section className="contact section" id="contact">
        <div className="section-heading">
          <p className="section-kicker">Contact</p>
          <h2>Let us work together.</h2>
        </div>
        <div className="contact-grid">
          <div className="contact-list">
            <a href="mailto:vibivasu2004@gmail.com">
              <span>Email</span>
              vibivasu2004@gmail.com
            </a>
            <a href="tel:+917010461040">
              <span>Phone</span>
              +91 70104 61040
            </a>
            <a
              href="https://linkedin.com/in/vibisha-abhirami-08197b312"
              target="_blank"
              rel="noreferrer"
            >
              <span>LinkedIn</span>
              linkedin.com/in/vibisha-abhirami-08197b312
            </a>
          </div>
          <form
            className="contact-form"
            action="mailto:vibivasu2004@gmail.com"
            method="post"
            encType="text/plain"
          >
            <input aria-label="Your name" name="name" placeholder="Your Name" type="text" />
            <input aria-label="Your email" name="email" placeholder="Your Email" type="email" />
            <textarea aria-label="Message" name="message" placeholder="Message" rows={5} />
            <button type="submit">Send Message</button>
          </form>
        </div>
      </section>
    </main>
  )
}

export default App
