import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Globe, User, LayoutDashboard, MessageSquare } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 py-4 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/80 backdrop-blur-md border border-slate-200 shadow-lg rounded-2xl px-6 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white text-[10px] font-black">RM</div>
            <span className="font-black text-sm uppercase tracking-tighter hidden sm:block">Roberto Macias</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex gap-8 items-center">
            <Link to="/" className="text-[10px] font-black uppercase tracking-widest hover:text-blue-600 transition-colors flex items-center gap-2"><User size={14}/> CV</Link>
            <Link to="/erp" className="text-[10px] font-black uppercase tracking-widest hover:text-blue-600 transition-colors flex items-center gap-2"><LayoutDashboard size={14}/> ERP</Link>
            <Link to="/crm" className="text-[10px] font-black uppercase tracking-widest hover:text-blue-600 transition-colors flex items-center gap-2"><MessageSquare size={14}/> CRM + IA</Link>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-2 bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-4 shadow-2xl">
            <Link to="/" onClick={() => setIsOpen(false)} className="font-bold text-sm uppercase px-4 py-2 hover:bg-slate-50 rounded-lg">CV</Link>
            <Link to="/erp" onClick={() => setIsOpen(false)} className="font-bold text-sm uppercase px-4 py-2 hover:bg-slate-50 rounded-lg">ERP Proyecto</Link>
            <Link to="/crm" onClick={() => setIsOpen(false)} className="font-bold text-sm uppercase px-4 py-2 hover:bg-slate-50 rounded-lg">CRM + IA</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;