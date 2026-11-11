// =============================================================================
// resume.ts: the single source of truth for the whole site.
//
// Every page reads from this file, and later the AI assistant will search it.
// To update the website, edit this file. Never copy resume text into pages.
// =============================================================================

// ---- Types -------------------------------------------------------------------
// A "type" describes the shape of an object. If you forget a field or misspell
// one below, TypeScript underlines it in red before you ever run the site.

export type Link = { label: string; href: string };

export type Category = "Full-stack" | "AI / ML" | "Computer vision" | "Research";

export type Project = {
  slug: string; // short id, used in the URL / as a React key
  title: string;
  year: string;
  summary: string; // one line, shown on the closed card
  bullets: string[]; // full details, shown when the card opens
  tags: string[]; // tech stack chips
  categories: Category[]; // used by the filter buttons
  links: Link[];
};

export type Hackathon = {
  slug: string;
  title: string;
  event: string;
  award: string;
  summary: string;
  bullets: string[];
  links: Link[];
};

export type Role = {
  title: string;
  org: string;
  when: string;
  bullets: string[];
};

export type Degree = {
  degree: string;
  school: string;
  when: string;
  gpa: string;
  coursework: string[];
};

// ---- Profile -----------------------------------------------------------------

export const profile = {
  name: "Sinchana S. Arun",
  fullName: "Sinchana Shylaja Arun",
  headline: "M.S. Computer Science · Rutgers",
  location: "New Brunswick, NJ",
  email: "sinchanasarunn@gmail.com",
  linkedin: "https://www.linkedin.com/in/sinchanasarun/",
  github: "https://github.com/SinchanaShylajaArun",
  // The two lines under the big headline on the landing section
  intro:
    "Hi, I'm Sinchana. I turn coffee and curiosity into AI-powered software that people actually enjoy using.",
  openTo: "Open to software engineering and ML/AI engineering roles.",
};

// ---- About section ---------------------------------------------------------------
// Written in the first person for the website. Edit freely: add where you grew
// up, what got you into CS, what you do outside of code.

export const about = {
  heading: "I build software that meets people where they are.",
  paragraphs: [
    "I studied Information Science and Engineering at JSS Academy of Technical Education in Bengaluru, then moved to New Jersey in 2025 for my Master's in Computer Science at Rutgers. My coursework centers on machine learning, computer vision, NLP, and foundation models.",
    "The work I care about most sits where technology meets people who need it. At Rutgers Newark I'm building Piano Master, a Unity game for children with disabilities, alongside games that study attention and re-engage kids when they drift. At hackathons I've built tools for caregivers: EyeQ, which flags potential abuse in real time, and MedCheck, which catches missed or wrong medication doses.",
    "I also love teaching. As a part-time lecturer I lead recitations for Discrete Structures II and Design and Analysis of Algorithms, and as a RINGS facilitator I help new international graduate students settle in, something I went through myself not long ago.",
    "As an engineer, I like owning the whole stack: the data pipeline, the model, the API, and the interface people actually click on. Lately that means retrieval-augmented systems like DocuPilot and the assistant on this site, usually with a coffee close by.",
  ],
  facts: [
    { label: "Based in", value: "New Brunswick, NJ" },
    { label: "Studying", value: "M.S. Computer Science, Rutgers (May 2027)" },
    { label: "Teaching", value: "CS 206 and CS 344 at Rutgers" },
    { label: "Building", value: "Piano Master, DocuPilot, Sinch & Save" },
    { label: "Interests", value: "RAG and LLM apps, computer vision, full-stack web" },
    { label: "Looking for", value: "Software and ML/AI engineering roles" },
  ],
};

// ---- Projects ----------------------------------------------------------------

export const projects: Project[] = [
  {
    slug: "docupilot",
    title: "DocuPilot",
    year: "2026 · In progress",
    summary:
      "A full-stack knowledge assistant that answers questions over team documents with cited sources.",
    bullets: [
      "Building a full-stack web application with a FastAPI backend, PostgreSQL/pgvector data layer, and React/Next.js frontend that answers questions over team documents with cited sources.",
      "Designing Google Drive and Slack integrations with background ingestion jobs, incremental re-indexing, and role-based access control.",
      "Containerizing services with Docker and deploying on AWS via a GitHub Actions CI/CD pipeline; adding logging, monitoring, rate limiting, and an automated accuracy/latency test suite.",
    ],
    tags: ["FastAPI", "pgvector", "Next.js", "Docker", "AWS"],
    categories: ["Full-stack", "AI / ML"],
    links: [{ label: "GitHub", href: "https://github.com/SinchanaShylajaArun" }],
  },
  {
    slug: "sinch-and-save",
    title: "Sinch & Save",
    year: "2026 · In progress",
    summary:
      "A personal expense tracker for variable part-time income: log earnings and spending, stay under weekly caps, and watch a savings jar grow.",
    bullets: [
      "Built a FastAPI backend with SQLAlchemy and PostgreSQL/SQLite for logging earnings and spending, weekly spending caps, savings goals, and analytics.",
      "Added user accounts with JWT authentication, a demo account, and Alembic database migrations.",
      "Built a React + Vite frontend with login, sign-up, and a demo entry page, plus a terrarium-style savings jar that grows as you save.",
      "Organized as independent backend and frontend parts, each with its own tests, CI workflow, and versioned releases.",
      "Planned next: a paystub RAG feature using the Claude API and pgvector.",
    ],
    tags: ["FastAPI", "React", "PostgreSQL", "JWT", "Alembic"],
    categories: ["Full-stack"],
    links: [{ label: "GitHub", href: "https://github.com/SinchanaShylajaArun/Sinch-Save" }],
  },
  {
    slug: "sign-language",
    title: "Real-Time Sign Language Recognition",
    year: "2026",
    summary: "End-to-end gesture recognition, from data collection to low-latency webcam inference.",
    bullets: [
      "Built an end-to-end real-time application covering data collection, feature extraction, model training, and low-latency webcam inference served through a Streamlit UI.",
      "Implemented gesture classification in PyTorch using MediaPipe hand landmarks and an LSTM over gesture sequences.",
    ],
    tags: ["PyTorch", "MediaPipe", "LSTM", "Streamlit"],
    categories: ["AI / ML", "Computer vision"],
    links: [{ label: "GitHub", href: "https://github.com/SinchanaShylajaArun" }],
  },
  {
    slug: "vlm-hallucinations",
    title: "Visual Hallucinations in VLMs",
    year: "2025",
    summary:
      "A 45-image synthetic benchmark testing LLaVA-1.5 and BLIP-2 across three ambiguity levels.",
    bullets: [
      "Built a 45-image synthetic benchmark and evaluation harness to test LLaVA-1.5-7B and BLIP-2 across 3 ambiguity levels.",
      "Ran both models on a single T4 GPU using 4-bit/8-bit quantization (BitsAndBytes) to fit memory constraints.",
    ],
    tags: ["LLaVA", "BLIP-2", "BitsAndBytes"],
    categories: ["AI / ML", "Computer vision", "Research"],
    links: [{ label: "GitHub", href: "https://github.com/SinchanaShylajaArun" }],
  },
  {
    slug: "digital-herbarium",
    title: "Digital Herbarium",
    year: "2024",
    summary: "A searchable digital archive for 1,000+ herbarium specimens at the University of Mysore.",
    bullets: [
      "Built a searchable digital archive for 1,000+ herbarium specimens using structured taxonomy data, MySQL, and advanced search filters.",
      "Designed the relational database schema and improved research data accessibility through digitization and UI enhancements.",
    ],
    tags: ["MySQL", "Schema design", "Search"],
    categories: ["Full-stack"],
    links: [],
  },
];

// ---- Hackathons ----------------------------------------------------------------

export const hackathons: Hackathon[] = [
  {
    slug: "eyeq",
    title: "EyeQ",
    event: "Bitcamp 2026",
    award: "Social Good Runner-up",
    summary: "Real-time caregiver abuse detection with instant guardian alerts.",
    bullets: [
      "Built a real-time detection system with instant guardian alerts delivered through an iOS app, flagging potential abuse of children, the elderly, and individuals with cognitive disabilities.",
      "Integrated YOLO pose estimation with Gemini LLM classification; reduced false positives from depth ambiguity by tightening detection logic.",
    ],
    links: [{ label: "Devpost", href: "https://devpost.com/software/eyeq-0c8wdl" }],
  },
  {
    slug: "brain-brew",
    title: "Brain Brew",
    event: "HackPrinceton 2026",
    award: "Education Track",
    summary: "An AI academic planner that models a full semester and tutors you through it.",
    bullets: [
      "Built and deployed a web app that models a full semester and acts as a personal tutor, with flashcards, quizzes, and degree-plan generation from a single goal.",
      "Designed a fault-tolerant dual-model fallback (K2 Think V2 to Gemini) with context injection and response sanitization.",
    ],
    links: [
      { label: "Live site", href: "https://brain-brew.us/" },
      { label: "Devpost", href: "https://devpost.com/software/brain-brew" },
    ],
  },
  {
    slug: "medcheck",
    title: "MedCheck",
    event: "HackRU Fall 2026",
    award: "Social Good Track",
    summary: "Medication safety for caregivers: OCR-verified pill bottles and missed-dose alerts.",
    bullets: [
      "Built the React web dashboard as frontend developer for a caregiver system that verifies pill bottles via OCR and alerts caregivers to missed, late, or wrong doses, alongside an iOS app and Flask/PostgreSQL hub.",
      "Displayed taken, skipped, and missed doses and low-supply alerts from the hub API, working against a shared data contract across the iOS, web, and backend teams.",
    ],
    links: [{ label: "Devpost", href: "https://devpost.com/software/medcheck-8k61na" }],
  },
];

// ---- Experience ----------------------------------------------------------------

export const experience: Role[] = [
  {
    title: "Part-Time Lecturer",
    org: "Rutgers University, Dept. of Computer Science",
    when: "Spring 2026 – Present",
    bullets: [
      "Teaching CS 206: Introduction to Discrete Structures II (Spring 2026, Fall 2026) and CS 344: Design and Analysis of Computer Algorithms (Fall 2026).",
      "Leading recitations on probability, combinatorics, and algorithm design; supporting students through office hours and grading.",
    ],
  },
  {
    title: "Student Assistant",
    org: "Rutgers Newark, Dept. of Movement and Rehabilitation Sciences",
    when: "July 2026 – Present",
    bullets: [
      "Building Piano Master, a Unity-based game designed for children with disabilities.",
      "Building ML-ready feature pipelines for audio and hand-landmark data to support model training and evaluation.",
      "Analyzing multimodal voice and hand-gesture data to study alertness and response patterns via signal processing and visualization.",
      "Building Unity-based games that capture real-time gameplay and behavioral data from children for the SPACE project's brain and attention analysis.",
      "Developing logic to detect distraction from live game data and trigger external stimuli that re-engage the child.",
    ],
  },
  {
    title: "Software Engineer Intern",
    org: "361Firm · New York, NY",
    when: "June – Aug 2026",
    bullets: [
      "Built and maintained user-facing features, including a member leaderboard and product roadmap, in React/Next.js for an AI-powered family office co-investment platform serving 11,000+ members.",
      "Shipped iterative frontend improvements that streamlined the member experience and increased user engagement and platform traffic.",
    ],
  },
  {
    title: "Software Engineering Intern",
    org: "Digital Herbarium, University of Mysore",
    when: "May – Aug 2024",
    bullets: [
      "Built a searchable digital archive for 1,000+ herbarium specimens using structured taxonomy data, MySQL, and advanced search filters.",
      "Designed the relational database schema and improved research data accessibility through digitization and UI enhancements.",
    ],
  },
];

export const education: Degree[] = [
  {
    degree: "M.S. Computer Science",
    school: "Rutgers University, New Brunswick",
    when: "Sept 2025 – May 2027",
    gpa: "3.67 / 4.00",
    coursework: [
      "Machine Learning",
      "Machine Learning II",
      "Computer Vision",
      "Natural Language Processing (NLP)",
      "Intro to Artificial Intelligence",
      "Foundation Models",
      "Massive Data Mining",
      "Algorithms",
    ],
  },
  {
    degree: "B.E. Information Science and Engineering",
    school: "JSS Academy of Technical Education, Bengaluru",
    when: "2021 – 2025",
    gpa: "8.6 / 10.0",
    coursework: ["Data Structures & Algorithms", "OOP", "DBMS", "Operating Systems"],
  },
];

export const leadership: Role[] = [
  {
    title: "International Graduate Student Facilitator",
    org: "RINGS Community, Rutgers Graduate Student Association",
    when: "Ongoing",
    bullets: [
      "Helping incoming international graduate students settle in through peer support, guidance, and community events.",
    ],
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python", "C", "C++", "SQL", "JavaScript"] },
  { group: "Frontend", items: ["React", "Next.js", "Streamlit"] },
  { group: "Backend and cloud", items: ["FastAPI", "PostgreSQL", "pgvector", "MySQL", "MongoDB", "Docker", "AWS", "GitHub Actions"] },
  { group: "AI / ML", items: ["PyTorch", "HF Transformers", "scikit-learn", "LangChain", "OpenCV", "MediaPipe", "YOLO", "RAG", "Gemini API"] },
  { group: "Tools", items: ["Git", "Claude Code", "Unity", "Jupyter", "Colab"] },
];
