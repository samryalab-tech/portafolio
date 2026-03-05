import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/shared/Navbar';
import { useAuth } from './context/AuthContext';
import { useData } from './context/DataContext'; 
import ClientsModule from './components/erp/ClientsModule';
import OTModule from './components/erp/OTModule';
import ServicesModule from './components/erp/ServicesModule';
import SalesModule from './components/erp/SalesModule';
import AccountsReceivable from './components/erp/AccountsReceivable';
import Payments from './components/erp/Payments';

// --- COMPONENTE: SIDEBAR PARA EL ERP (OPTIMIZADO RESPONSIVE) ---
const ERPSidebar = ({ role, activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuConfig = {
    superadmin: [
      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
      { id: 'clientes', label: 'Clientes', icon: '👥' },
      { id: 'servicios', label: 'Catálogo', icon: '📋' },
      { id: 'ot', label: 'Órdenes de Trabajo', icon: '🛠️' },
      { id: 'ventas', label: 'Para Facturar', icon: '💰' },
      { id: 'cobranza', label: 'Cuentas por Cobrar', icon: '📁' },
      { id: 'pagos', label: 'Pagos', icon: '💳' },
      { id: 'usuarios', label: 'Accesos / TI', icon: '🔐' },
    ],
    admin: [
      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
      { id: 'ot', label: 'Órdenes de Trabajo', icon: '🛠️' },
      { id: 'cobranza', label: 'Cuentas por Cobrar', icon: '📁' },
    ],
    usuario: [
      { id: 'dashboard', label: 'Mi Resumen', icon: '🏠' },
      { id: 'mis-facturas', label: 'Mis Documentos', icon: '📄' },
      { id: 'mis-pagos', label: 'Mis Pagos', icon: '✅' },
    ]
  };

  const menuItems = menuConfig[role] || menuConfig['usuario'];

  const handleTabClick = (id) => {
    setActiveTab(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Botón flotante para móvil */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-6 right-6 z-[100] bg-blue-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-2xl border-4 border-white"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[80] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menú Lateral */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-[90]
        w-72 md:w-64 bg-[#0a1128] text-white p-4 flex flex-col border-r border-slate-800
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="mb-8 px-2 mt-4 text-left">
          <p className="text-[10px] font-black text-blue-400 tracking-[0.2em] uppercase">Sistema ERP</p>
          <p className="text-xs text-slate-400 italic">Nivel: {role}</p>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

// --- COMPONENTE: PORTFOLIO HOME (CV INTEGRAL) ---
const PortfolioHome = () => {
  const [lang, setLang] = useState('es');
  const content = {
    es: {
      role: "Fullstack Developer & IT Support Specialist",
      profileTitle: "Perfil Profesional",
      profileDesc: "Junior Fullstack Developer con experiencia en aplicaciones web responsivas (HTML5, CSS3, JS, PHP, Node.js) y diseño de bases de datos (SQL). Especialista en soporte IT competente en Active Directory y Azure AD. Enfocado en la automatización de flujos de trabajo y soluciones prácticas.",
      contactTitle: "Contacto",
      stackTitle: "Stack Técnico",
      workTitle: "Trayectoria Laboral",
      langFooter: ["Español: Nativo", "Inglés: B1 Técnico"],
      jobs: [
        { title: "Jr. Fullstack Developer", company: "PUNTOACTIVO", date: "NOV 2023 - PRESENTE", desc: ["Desarrollo de apps responsivas y escalables con arquitectura modular.", "Integración y diseño de APIs RESTful para comunicación Front-End/Back-End.", "Gestión de bases de datos PostgreSQL y MySQL para sistemas CRUD.", "Pruebas manuales y depuración de endpoints para asegurar el rendimiento."] },
        { title: "Support Engineer T2", company: "TELEPERFORMANCE", date: "ENE 2022 - OCT 2023", desc: ["Administración avanzada de Active Directory, Azure AD y licencias Office 365.", "Soporte técnico remoto y presencial Nivel 1 y 2 para sistemas internos.", "Configuración de VPN (Global Protect) y telefonía VoIP.", "Entrenamiento de nuevos colaboradores y gestión de tickets en ServiceNow."] },
        { title: "Domotic Developer Jr", company: "ALIVE", date: "TIEMPO ANTERIOR", desc: ["Desarrollo en lenguajes C#, C y C++ para sistemas domóticos.", "Gestión de cableado estructurado y bases de datos SQL.", "Calibración de sensores e instalación de racks de switches."] },
        { title: "Prácticas Profesionales", company: "WEISS TECHNIC", date: "CONCLUIDO", desc: ["Mantenimiento preventivo y correctivo de equipos tecnológicos.", "Medición de voltajes en cámaras de refrigeración.", "Organización de almacén de herramientas e instalación de red local."] }
      ]
    },
    en: {
      role: "Fullstack Developer & IT Support Specialist",
      profileTitle: "Professional Profile",
      profileDesc: "Junior Fullstack Developer with experience in responsive web apps (HTML5, CSS3, JS, PHP, Node.js) and database design (SQL). IT Support Specialist proficient in Active Directory and Azure AD. Focused on workflow automation and practical solutions.",
      contactTitle: "Contact",
      stackTitle: "Technical Stack",
      workTitle: "Work Experience",
      langFooter: ["Spanish: Native", "English: B1 Technical"],
      jobs: [
        { title: "Jr. Fullstack Developer", company: "PUNTOACTIVO", date: "NOV 2023 - PRESENT", desc: ["Development of responsive and scalable apps with modular architecture.", "Integration and design of RESTful APIs for Front-End/Back-End communication.", "PostgreSQL and MySQL database management for CRUD systems.", "Manual testing and endpoint debugging to ensure application performance."] },
        { title: "Support Engineer T2", company: "TELEPERFORMANCE", date: "JAN 2022 - OCT 2023", desc: ["Advanced administration of Active Directory, Azure AD, and Office 365 licenses.", "Level 1 & 2 remote and on-site technical support for internal systems.", "VPN (Global Protect) configuration and VoIP phone support.", "Training new coworkers and ticket management via ServiceNow."] },
        { title: "Domotic Developer Jr", company: "ALIVE", date: "PREVIOUS", desc: ["Development in C#, C, and C++ languages for home automation.", "Structured cabling management and SQL databases.", "Sensor calibration and installation of switch racks."] },
        { title: "Professional Internship", company: "WEISS TECHNIC", date: "COMPLETED", desc: ["Preventive and corrective maintenance of technological equipment.", "Voltage measurement in refrigeration chambers.", "Tool warehouse organization and local network installation."] }
      ]
    }
  };
  const t = content[lang];
  return (
    <div className="bg-[#e2e8f0] min-h-screen py-0 md:py-12 px-0 md:px-4 font-sans selection:bg-blue-100 text-left">
      <div className="max-w-5xl mx-auto flex justify-center md:justify-end gap-0 mb-6 px-4 md:px-0 pt-6 md:pt-0">
        <div className="inline-flex bg-white rounded-lg shadow-sm p-1 border border-gray-200 w-full md:w-auto">
          <button onClick={() => setLang('es')} className={`flex-1 md:flex-none px-6 py-2 md:py-1 text-[11px] font-black rounded transition-all ${lang === 'es' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-blue-600'}`}>ESP</button>
          <button onClick={() => setLang('en')} className={`flex-1 md:flex-none px-6 py-2 md:py-1 text-[11px] font-black rounded transition-all ${lang === 'en' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-blue-600'}`}>ENG</button>
        </div>
      </div>
      <div className="max-w-5xl mx-auto bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col md:flex-row overflow-hidden border-t md:border-t-0 border-gray-100 text-left">
        <div className="w-full md:w-[35%] bg-[#0a1128] text-white p-8 md:p-12">
          <div className="mb-10 text-left">
            <div className="w-16 h-16 border-[3px] border-blue-500 flex items-center justify-center text-2xl font-black mb-6">RM</div>
            <h1 className="text-3xl font-black leading-[0.9] tracking-tighter uppercase">Roberto <br /> Macias</h1>
            <div className="h-[3px] w-10 bg-blue-500 mt-4"></div>
          </div>
          <div className="space-y-10 text-white text-left font-sans">
            <section>
              <h3 className="text-[11px] font-black tracking-[0.2em] text-blue-400 mb-5 uppercase">{t.contactTitle}</h3>
              <div className="space-y-4 text-[13px] text-gray-300">
                <p>✉️ 17100518lrmm@gmail.com</p>
                <p>📞 +52 33 1024 7786</p>
                <p>📍 Guadalajara, Mexico</p>
              </div>
            </section>
            <section>
              <h3 className="text-[11px] font-black tracking-[0.2em] text-blue-400 mb-5 uppercase">{t.stackTitle}</h3>
              <div className="space-y-6 text-[13px] text-gray-300">
                <p><span className="text-blue-400 font-bold block text-[10px] uppercase font-sans">{`<>`} Web Dev</span> HTML5, CSS3, Tailwind, JS, PHP, Laravel, Node.js, React</p>
                <p><span className="text-blue-400 font-bold block text-[10px] uppercase font-sans">🗄️ Databases</span> MySQL, PostgreSQL, SQL</p>
                <p><span className="text-blue-400 font-bold block text-[10px] uppercase font-sans">🖥️ IT Systems</span> Active Directory, Azure AD, VPN</p>
              </div>
            </section>
          </div>
        </div>
        <div className="w-full md:w-[65%] bg-white p-8 md:p-12 text-slate-800 text-left font-sans">
          <p className="text-[11px] font-black tracking-[0.3em] text-gray-400 uppercase mb-10">{t.role}</p>
          <section className="bg-[#f8fafc] p-8 mb-12 border-l-[6px] border-blue-600 shadow-sm text-left">
            <h3 className="text-[14px] font-black text-slate-900 mb-4 uppercase">{t.profileTitle}</h3>
            <p className="text-gray-600 text-[14px] leading-relaxed italic">"{t.profileDesc}"</p>
          </section>
          <section className="text-left">
            <h3 className="text-[14px] font-black text-slate-900 mb-8 uppercase tracking-widest border-b pb-2">{t.workTitle}</h3>
            <div className="space-y-10">
              {t.jobs.map((job, idx) => (
                <div key={idx} className="relative group text-left">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-baseline">
                    <h4 className="font-black text-slate-900 text-sm uppercase">{job.title}</h4>
                    <span className="text-[10px] font-bold text-gray-400">{job.date}</span>
                  </div>
                  <p className="text-blue-600 font-black text-[11px] mb-3">{job.company}</p>
                  <ul className="text-[13px] text-gray-600 space-y-1.5 list-disc ml-4">
                    {job.desc.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>
          <div className="mt-16 pt-6 border-t border-gray-100 flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            <span>{t.langFooter[0]}</span>
            <span>{t.langFooter[1]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE: ERPHOME (DASHBOARD DINÁMICO) ---
const ERPHome = () => {
  const { user, login, logout } = useAuth();
  const { clients, orders, services } = useData(); 
  const [activeTab, setActiveTab] = useState('dashboard');
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const demoUsers = [
    { user: 'superadmin', pass: 'root2026', role: 'superadmin', label: 'Dueño / TI (Todo)', color: 'bg-purple-600' },
    { user: 'admin_ventas', pass: 'admin123', role: 'admin', label: 'Gerente (Ventas/Factura)', color: 'bg-blue-600' },
    { user: 'cliente_demo', pass: 'cliente456', role: 'usuario', label: 'Cliente (Solo ver facturas)', color: 'bg-green-600' }
  ];

  const handleManualLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const found = demoUsers.find(u => u.user === formData.username && u.pass === formData.password);
      if (found) { login({ name: found.user, role: found.role }); }
      else { setError('Usuario o contraseña incorrectos'); }
      setLoading(false);
    }, 1000);
  };

  if (user) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 text-left relative overflow-x-hidden">
        <ERPSidebar role={user.role} activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-4 md:p-10 pb-24 md:pb-10 text-left">
          <header className="flex justify-between items-center mb-8 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-left">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{activeTab.replace('-', ' ')}</h2>
              <p className="text-slate-400 text-xs font-medium tracking-widest uppercase">Módulo de {user.role}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-black text-slate-900 uppercase">{user.name}</p>
                <button onClick={logout} className="text-[10px] text-red-500 font-bold hover:underline tracking-widest uppercase">Salir</button>
              </div>
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-black shadow-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </header>

          <div className="animate-fadeIn">
            {activeTab === 'dashboard' ? (
              <div className="space-y-8 text-left font-sans">
                {/* HEADER DE BIENVENIDA */}
                <div className="bg-[#0a1128] p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
                  <div className="relative z-10">
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Resumen Operativo</h3>
                    <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.2em]">Estado financiero al {new Date().toLocaleDateString('es-MX')}</p>
                  </div>
                  <div className="absolute -right-10 -top-10 text-[12rem] opacity-10 grayscale">📊</div>
                </div>

                {/* CARDS DINÁMICAS MEJORADAS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* VENTAS TOTALES */}
                  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Ventas Totales</p>
                    <div className="flex items-end justify-between">
                      <p className="text-2xl font-black text-slate-900">
                        ${orders.filter(o => o.enCobranza || o.pagada).reduce((acc, o) => acc + (o.montoTotal || 0), 0).toLocaleString()}
                      </p>
                      <span className="text-blue-600 text-[10px] font-black bg-blue-50 px-2 py-1 rounded-lg uppercase">Total</span>
                    </div>
                  </div>

                  {/* COBRANZA PENDIENTE */}
                  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Cuentas por Cobrar</p>
                    <div className="flex items-end justify-between">
                      <p className="text-2xl font-black text-red-600">
                        ${orders.filter(o => o.enCobranza).reduce((acc, o) => acc + (o.saldoPendiente ?? o.montoTotal), 0).toLocaleString()}
                      </p>
                      <span className="text-red-600 text-[10px] font-black bg-red-50 px-2 py-1 rounded-lg uppercase">Pendiente</span>
                    </div>
                  </div>

                  {/* INGRESOS REALES */}
                  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Efectivo en Caja</p>
                    <div className="flex items-end justify-between">
                      <p className="text-2xl font-black text-green-600">
                        ${orders.reduce((acc, o) => acc + (o.pagosRelacionados?.reduce((pAcc, p) => pAcc + p.monto, 0) || 0), 0).toLocaleString()}
                      </p>
                      <span className="text-green-600 text-[10px] font-black bg-green-50 px-2 py-1 rounded-lg uppercase">Real</span>
                    </div>
                  </div>

                  {/* EFICIENCIA */}
                  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Eficiencia de Cobro</p>
                    <div className="flex items-end justify-between">
                      <p className="text-2xl font-black text-blue-600">
                        {Math.round((orders.reduce((acc, o) => acc + (o.pagosRelacionados?.reduce((pAcc, p) => pAcc + p.monto, 0) || 0), 0) / 
                        (orders.filter(o => o.enCobranza || o.pagada).reduce((acc, o) => acc + (o.montoTotal || 0), 0) || 1)) * 100)}%
                      </p>
                      <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1">
                        <div 
                          className="h-full bg-blue-600 transition-all duration-1000" 
                          style={{ width: `${Math.min(100, Math.round((orders.reduce((acc, o) => acc + (o.pagosRelacionados?.reduce((pAcc, p) => pAcc + p.monto, 0) || 0), 0) / (orders.filter(o => o.enCobranza || o.pagada).reduce((acc, o) => acc + (o.montoTotal || 0), 0) || 1)) * 100))}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ÚLTIMOS MOVIMIENTOS Y ESTADÍSTICAS RÁPIDAS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Últimos Movimientos de Caja</h4>
                      <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">Tiempo Real</span>
                    </div>
                    <div className="space-y-4">
                      {orders.flatMap(o => (o.pagosRelacionados || []).map(p => ({ ...p, folio: o.folio, client: o.clientName })))
                        .sort((a, b) => b.idPago - a.idPago)
                        .slice(0, 5)
                        .map((mov, i) => (
                          <div key={i} className="flex justify-between items-center p-5 bg-gray-50 rounded-[1.5rem] border border-transparent hover:border-blue-100 transition-all">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm border border-gray-100">💰</div>
                              <div>
                                <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{mov.client}</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase">{mov.metodo} • {mov.referencia}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-black text-green-600 tracking-tighter">+ ${mov.monto.toLocaleString()}</p>
                              <p className="text-[9px] text-gray-400 font-bold uppercase">{mov.folio}</p>
                            </div>
                          </div>
                        ))}
                      {orders.every(o => !o.pagosRelacionados?.length) && (
                        <div className="py-20 text-center flex flex-col items-center opacity-30">
                          <span className="text-4xl mb-2">📉</span>
                          <p className="font-black text-xs uppercase tracking-widest">Sin ingresos registrados</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] mb-8 text-center">Resumen de Inventario</h4>
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-gray-400 uppercase">Clientes Activos</span>
                          <span className="text-sm font-black text-slate-900">{clients.length}</span>
                        </div>
                        <div className="w-full h-px bg-gray-50"></div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-gray-400 uppercase">Servicios en Catálogo</span>
                          <span className="text-sm font-black text-slate-900">{services.length}</span>
                        </div>
                        <div className="w-full h-px bg-gray-50"></div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-gray-400 uppercase">Total Órdenes</span>
                          <span className="text-sm font-black text-slate-900">{orders.length}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-10 p-6 bg-blue-600 rounded-[2rem] text-white text-center shadow-lg shadow-blue-200">
                      <p className="text-[10px] font-black uppercase tracking-widest mb-1">Status Sistema</p>
                      <p className="text-xs font-bold opacity-80 uppercase tracking-tighter italic">Sincronizado Cloud 2026</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : activeTab === 'clientes' ? (
              <ClientsModule />
            ) : activeTab === 'servicios' ? (
              <ServicesModule />
            ) : activeTab === 'ot' ? (
              <OTModule />
            ) : activeTab === 'ventas' ? ( 
              <SalesModule />
            ) : activeTab === 'cobranza' ? (
              <AccountsReceivable />
            ) : activeTab === 'pagos' ? (
              <Payments />
            ) : (
              <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-gray-100 text-center flex flex-col items-center">
                <div className="text-4xl mb-4 grayscale">⚙️</div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Módulo de {activeTab} en desarrollo...</p>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-gray-100 p-4 md:p-8 animate-fadeIn flex flex-col items-center">
      <div className="max-w-md w-full mb-6 bg-[#0a1128] rounded-2xl p-4 shadow-lg text-left font-sans">
        <p className="text-[10px] font-black text-blue-400 tracking-[0.2em] uppercase mb-3 text-left">🔑 Credenciales de Muestra</p>
        <div className="space-y-2">
          {demoUsers.map((u, i) => (
            <div key={i} className="flex justify-between items-center text-[11px] bg-slate-800/50 p-2 rounded border border-slate-700 text-left">
              <span className="text-gray-300 font-mono text-left">User: <b className="text-white">{u.user}</b> | Pass: <b className="text-white">{u.pass}</b></span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-black text-white ${u.color}`}>{u.role}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 text-left font-sans">
        <div className="bg-blue-600 p-8 text-white text-center">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-xl">💼</div>
          <h2 className="text-2xl font-black tracking-tight uppercase">ERP General</h2>
          <p className="text-blue-100 text-[10px] font-bold tracking-widest mt-1 uppercase">Cloud System</p>
        </div>
        <form onSubmit={handleManualLogin} className="p-8 space-y-5 text-left">
          {error && <p className="bg-red-50 text-red-500 p-3 rounded-lg text-xs font-bold text-center border border-red-100">{error}</p>}
          <div className="text-left">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Usuario</label>
            <input type="text" required className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm" placeholder="superadmin" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} />
          </div>
          <div className="text-left">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contraseña</label>
            <input type="password" required className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-4 rounded-xl font-black text-xs tracking-widest uppercase hover:bg-blue-700 transition-all shadow-lg">
            {loading ? 'Verificando...' : 'Entrar al Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<PortfolioHome />} />
            <Route path="/erp" element={<ERPHome />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;