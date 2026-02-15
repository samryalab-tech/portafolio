import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Phone, MapPin, Linkedin, Code, Database, 
  Cpu, Terminal, CheckCircle2, Globe, Briefcase, GraduationCap 
} from 'lucide-react';

const CV = () => {
  const [lang, setLang] = useState('es');

  const content = {
    es: {
      header: {
        name: "ROBERTO MACIAS",
        role: "Fullstack Developer & IT Support Specialist",
        location: "Guadalajara, México",
        contact: ["+52 33 1024 7786", "rmm@gmail.com"]
      },
      about: "Desarrollador Fullstack Junior con experiencia en aplicaciones web responsivas (HTML5, CSS3, JS, PHP, Node.js) y diseño de bases de datos (SQL). Especialista en soporte IT con dominio de Active Directory y Azure AD. Enfocado en la automatización de flujos y soluciones prácticas.",
      skills: {
        web: "HTML5, CSS3, Bootstrap, JavaScript, PHP, Node.js",
        db: "MySQL, PostgreSQL, SQL Queries, CRUD Systems",
        it: "Active Directory, Azure AD, Office 365, VPN, Hardware/Software Support",
        tools: "Git/GitHub, RESTful APIs, Automation Scripting"
      },
      experience: [
        {
          title: "Jr. Fullstack Developer",
          company: "PuntoActivo",
          date: "Nov 2023 — Presente",
          bullets: [
            "Desarrollo de apps responsivas y escalables con arquitectura modular.",
            "Integración y diseño de APIs RESTful para comunicación Front-End/Back-End.",
            "Gestión de bases de datos PostgreSQL y MySQL para sistemas CRUD.",
            "Pruebas manuales y depuración de endpoints para asegurar el rendimiento."
          ]
        },
        {
          title: "Support Engineer T2",
          company: "Teleperformance",
          date: "Ene 2022 — Oct 2023",
          bullets: [
            "Administración avanzada de Active Directory, Azure AD y licencias Office 365.",
            "Soporte técnico remoto y presencial Nivel 1 y 2 para sistemas internos.",
            "Configuración de VPN (Global Protect) y telefonía VoIP.",
            "Entrenamiento de nuevos colaboradores y gestión de tickets en ServiceNow."
          ]
        },
        {
          title: "Domotic Developer Jr",
          company: "Alive",
          date: "Sep — Dic 2021",
          bullets: [
            "Desarrollo en lenguajes C#, C y C4 para sistemas domóticos.",
            "Gestión de cableado estructurado y bases de datos SQL.",
            "Calibración de sensores e instalación de racks de switches."
          ]
        },
        {
          title: "Prácticas Profesionales",
          company: "Weiss Technic",
          date: "Jun 2019 — Jun 2021",
          bullets: [
            "Mantenimiento preventivo y correctivo de equipos tecnológicos.",
            "Medición de voltajes en cámaras de refrigeración.",
            "Organización de almacén de herramientas e instalación de red local."
          ]
        }
      ],
      languages: "Español: Nativo | Inglés: Intermedio (B1 - Técnico)"
    },
    en: {
      header: {
        name: "ROBERTO MACIAS",
        role: "Fullstack Developer & IT Support Specialist",
        location: "Guadalajara, Mexico",
        contact: ["+52 33 1024 7786", "rmm@gmail.com"]
      },
      about: "Junior Fullstack Developer with experience in responsive web apps (HTML5, CSS3, JS, PHP, Node.js) and database design (SQL). IT Support Specialist proficient in Active Directory and Azure AD. Focused on workflow automation and practical solutions.",
      skills: {
        web: "HTML5, CSS3, Bootstrap, JavaScript, PHP, Node.js",
        db: "MySQL, PostgreSQL, SQL Queries, CRUD Systems",
        it: "Active Directory, Azure AD, Office 365, VPN, Hardware/Software Support",
        tools: "Git/GitHub, RESTful APIs, Automation Scripting"
      },
      experience: [
        {
          title: "Jr. Fullstack Developer",
          company: "PuntoActivo",
          date: "Nov 2023 — Present",
          bullets: [
            "Development of responsive and scalable apps with modular architecture.",
            "Design and integration of RESTful APIs for Front-End/Back-End communication.",
            "PostgreSQL and MySQL database management for CRUD systems.",
            "Manual testing and endpoint debugging to ensure application performance."
          ]
        },
        {
          title: "Support Engineer T2",
          company: "Teleperformance",
          date: "Jan 2022 — Oct 2023",
          bullets: [
            "Advanced administration of Active Directory, Azure AD, and Office 365 licenses.",
            "Level 1 & 2 remote and on-site technical support for internal systems.",
            "VPN (Global Protect) configuration and VoIP phone support.",
            "Training new coworkers and ticket management via ServiceNow."
          ]
        },
        {
          title: "Domotic Developer Jr",
          company: "Alive",
          date: "Sep — Dec 2021",
          bullets: [
            "Development in C#, C, and C4 languages for home automation.",
            "Structured cabling management and SQL database administration.",
            "Sensor calibration and switch rack installation."
          ]
        },
        {
          title: "Scholar Practices",
          company: "Weiss Technic",
          date: "Jun 2019 — Jun 2021",
          bullets: [
            "Preventive and corrective maintenance of computer equipment.",
            "Voltage measurement for refrigeration chambers.",
            "Tool storage organization and local network installation."
          ]
        }
      ],
      languages: "Spanish: Native | English: Intermediate (B1 - Technical)"
    }
  };

  const t = content[lang];

  return (
    <div className="pt-28 pb-20 px-4 bg-slate-50 min-h-screen">
      {/* Botón de Idioma */}
      <div className="max-w-4xl mx-auto flex justify-end mb-8">
        <button 
          onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-xs font-black tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200"
        >
          <Globe size={14} /> {lang === 'es' ? 'ENGLISH VERSION' : 'VERSIÓN ESPAÑOL'}
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[3rem] overflow-hidden"
      >
        {/* HEADER */}
        <header className="bg-slate-900 text-white p-10 md:p-14">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">{t.header.name}</h1>
              <span className="inline-block bg-blue-600 px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em]">{t.header.role}</span>
            </div>
            <div className="space-y-3 text-sm text-slate-400 font-medium">
              <p className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><Mail size={16} className="text-blue-500"/> {t.header.contact[1]}</p>
              <p className="flex items-center gap-2"><Phone size={16} className="text-blue-500"/> {t.header.contact[0]}</p>
              <p className="flex items-center gap-2"><MapPin size={16} className="text-blue-500"/> {t.header.location}</p>
            </div>
          </div>
        </header>

        <div className="p-10 md:p-14 space-y-16">
          
          {/* PERFIL */}
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-6 border-b border-slate-100 pb-2">Perfil Profesional</h2>
            <p className="text-lg text-slate-600 leading-relaxed font-medium italic">"{t.about}"</p>
          </section>

          {/* HABILIDADES (BENTO GRID) */}
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-8 border-b border-slate-100 pb-2">Stack Técnico</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SkillItem icon={<Code size={20}/>} title="Web Dev" desc={t.skills.web} />
              <SkillItem icon={<Database size={20}/>} title="Databases" desc={t.skills.db} />
              <SkillItem icon={<Cpu size={20}/>} title="IT Systems" desc={t.skills.it} />
              <SkillItem icon={<Terminal size={20}/>} title="Tools" desc={t.skills.tools} />
            </div>
          </section>

          {/* EXPERIENCIA */}
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-10 border-b border-slate-100 pb-2 text-right">Trayectoria Laboral</h2>
            <div className="space-y-14">
              {t.experience.map((exp, i) => (
                <div key={i} className="group relative">
                  <div className="flex flex-col md:flex-row md:justify-between items-baseline mb-4 gap-2">
                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">{exp.title}</h3>
                    <span className="text-[10px] font-black bg-slate-900 text-white px-3 py-1 rounded-full uppercase tracking-widest">{exp.date}</span>
                  </div>
                  <p className="text-blue-500 font-bold mb-6 text-xs uppercase tracking-widest">{exp.company}</p>
                  <ul className="grid grid-cols-1 gap-4">
                    {exp.bullets.map((bullet, j) => (
                      <li key={j} className="flex gap-4 text-sm text-slate-500 leading-relaxed">
                        <CheckCircle2 size={18} className="text-blue-400 shrink-0 mt-0.5"/>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* IDIOMAS */}
          <section className="pt-8 border-t border-slate-100">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-4">Idiomas</h2>
            <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">{t.languages}</p>
          </section>

        </div>
      </motion.div>
    </div>
  );
};

// Sub-componente para las Skills
const SkillItem = ({ icon, title, desc }) => (
  <div className="group p-6 bg-slate-50 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all rounded-[2rem] border border-slate-100">
    <div className="flex items-center gap-3 mb-3 font-black text-slate-900 uppercase tracking-widest text-[10px]">
      <div className="text-blue-500">{icon}</div> {title}
    </div>
    <p className="text-xs text-slate-500 leading-loose font-medium">{desc}</p>
  </div>
);

export default CV;