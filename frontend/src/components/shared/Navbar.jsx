import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Función para cerrar el menú al hacer clic en un link
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-[#0a1128] text-white p-4 sticky top-0 z-50 shadow-lg border-b border-slate-800">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo / Nombre */}
        <div className="text-xl font-black tracking-tighter">
          <Link to="/" onClick={closeMenu} className="hover:text-blue-500 transition-colors">
            ROBERTO <span className="text-blue-500">MACIAS</span>
          </Link>
        </div>

        {/* Links Escritorio */}
        <div className="hidden md:flex items-center space-x-8 text-[11px] font-black tracking-[0.2em] uppercase">
          <Link to="/" className="hover:text-blue-500 transition-colors">Sobre Mí / CV</Link>
          <Link to="/erp" className="hover:text-blue-500 transition-colors">ERP General</Link>
          <Link to="/crm" className="hover:text-blue-500 transition-colors">CRM Inmobiliario</Link>
        </div>

        {/* Botón Hamburguesa Móvil */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 focus:outline-none"
        >
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 bg-white transition-transform ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-opacity ${isOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-transform ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </button>
      </div>

      {/* Menú Desplegable Móvil */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col space-y-4 p-6 bg-[#0a1128] border-t border-slate-800 text-[11px] font-black tracking-[0.2em] uppercase">
          <Link to="/" onClick={closeMenu} className="hover:text-blue-500 transition-colors">Sobre Mí / CV</Link>
          <Link to="/erp" onClick={closeMenu} className="hover:text-blue-500 transition-colors">ERP General</Link>
          <Link to="/crm" onClick={closeMenu} className="hover:text-blue-500 transition-colors">CRM Inmobiliario</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;