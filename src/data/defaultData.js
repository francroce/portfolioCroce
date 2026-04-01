export const DEFAULT_DATA = {
  hero: {
    greeting: "Hola, soy",
    name: "Franco",
    title: "Desarrollador Full Stack & Creativo Digital",
    tagline:
      "Construyo experiencias digitales que combinan código elegante con diseño intencional.",
    cta: "Ver proyectos",
    ctaSecondary: "Contactame",
  },
  about: {
    heading: "Sobre mí",
    text: "Soy un desarrollador apasionado por la tecnología y la creatividad. Me especializo en construir soluciones que van desde prototipos de accesibilidad con eye-tracking hasta bots de trading algorítmico. Mi enfoque combina curiosidad técnica con ejecución práctica — siempre buscando el siguiente desafío.",
    stats: [
      { label: "Años de experiencia", value: "3+" },
      { label: "Proyectos completados", value: "10+" },
      { label: "Tecnologías dominadas", value: "15+" },
      { label: "Clientes satisfechos", value: "5+" },
    ],
  },
  skills: [
    { name: "Python", level: 90, category: "Backend" },
    { name: "React", level: 85, category: "Frontend" },
    { name: "JavaScript", level: 88, category: "Frontend" },
    { name: "Node.js", level: 80, category: "Backend" },
    { name: "OpenCV", level: 75, category: "AI/ML" },
    { name: "MediaPipe", level: 70, category: "AI/ML" },
    { name: "Git", level: 85, category: "Tools" },
    { name: "CSS/Tailwind", level: 82, category: "Frontend" },
    { name: "PostgreSQL", level: 72, category: "Backend" },
    { name: "Trading APIs", level: 78, category: "Fintech" },
  ],
  experience: [
    {
      id: "exp1",
      type: "experience",
      title: "Desarrollador Full Stack",
      org: "Freelance",
      period: "2023 — Presente",
      description:
        "Desarrollo de aplicaciones web, automatizaciones y prototipos tecnológicos para diversos clientes.",
    },
  ],
  education: [
    {
      id: "edu1",
      type: "education",
      title: "Ingeniería en Sistemas / Desarrollo de Software",
      org: "Universidad",
      period: "2020 — Presente",
      description:
        "Formación en ciencias de la computación, algoritmos y desarrollo de software.",
    },
  ],
  certifications: [
    {
      id: "cert1",
      type: "certification",
      title: "Python para Data Science",
      org: "Plataforma Online",
      period: "2024",
      description:
        "Certificación en análisis de datos y machine learning con Python.",
    },
  ],
  projects: [
    {
      id: "p1",
      title: "EyeGaze Controller",
      description:
        "Prototipo de accesibilidad que permite controlar el computador mediante eye-tracking usando MediaPipe FaceMesh y OpenCV. Incluye calibración de 9 puntos, click por parpadeo y modo sandbox.",
      tags: ["Python", "OpenCV", "MediaPipe", "Accesibilidad"],
      image: "",
      link: "",
      github: "",
      featured: true,
    },
    {
      id: "p2",
      title: "Algorithmic Trading Bot",
      description:
        "Bot de trading algorítmico en fase de paper trading. Conecta con exchanges crypto vía CCXT, implementa estrategias automatizadas y monitoreo remoto.",
      tags: ["Python", "CCXT", "Binance", "Trading"],
      image: "",
      link: "",
      github: "",
      featured: true,
    },
    {
      id: "p3",
      title: "Polinomio Eventos",
      description:
        "Aplicación web para gestión de eventos construida con React y Vite, desplegada en Vercel.",
      tags: ["React", "Vite", "Vercel", "JavaScript"],
      image: "",
      link: "",
      github: "",
      featured: false,
    },
    {
      id: "p4",
      title: "Brainrot Video Pipeline",
      description:
        "Workflow automatizado para crear videos cortos estilo brainrot para TikTok/Reels. Generación de imágenes, animación y narración.",
      tags: ["Python", "AI", "Content Creation", "Automation"],
      image: "",
      link: "",
      github: "",
      featured: false,
    },
  ],
  contact: {
    heading: "Hablemos",
    text: "¿Tenés un proyecto en mente? Me encantaría escucharte.",
    email: "francocrocee7@gmail.com",
    github: "https://github.com/tu-usuario",
    linkedin: "https://linkedin.com/in/tu-usuario",
    twitter: "",
  },
};
