import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Landmark, Wallet, 
  Briefcase, Plus, Smartphone, Monitor,
  Building2, Truck, ArrowUpRight, 
  ArrowDownLeft, Search, TrendingUp
} from 'lucide-react';

const ERP = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileView, setIsMobileView] = useState(false);

  // --- BASE DE DATOS (Mantenemos la lógica robusta) ---
  const [db, setDb] = useState({
    balance: 145800.00,
    movimientos: [
      { id: 1, tipo: 'ingreso', desc: 'Venta de Licencias Pepsi', monto: 15000, fecha: 'Hoy', cat: 'Ventas' },
      { id: 2, tipo: 'egreso', desc: 'Servidor AWS Mensual', monto: 2400, fecha: 'Ayer', cat: 'Infraestructura' },
      { id: 3, tipo: 'egreso', desc: 'Pago Renta Oficina', monto: 8000, fecha: '12 Feb', cat: 'Gastos Fijos' }
    ],
    clientes: [
      { id: 1, nombre: 'Pepsi Co. GDL', rfc: 'PEP900101ABC', saldo: 5500, total: 15000 },
      { id: 2, nombre: 'Amazon MX', rfc: 'AMA150505HGT', saldo: 22000, total: 22000 }
    ],
    proveedores: [
      { id: 101, nombre: 'Papelería Central', rfc: 'PAP880808XYZ', deuda: 4500 },
      { id: 102, nombre: 'CFE Servicios', rfc: 'CFE330303MET', deuda: 1200 }
    ]
  });

  const aplicarAbono = (id, monto) => {
    setDb(prev => ({
      ...prev,
      balance: prev.balance + monto,
      movimientos: [{ id: Date.now(), tipo: 'ingreso', desc: `Abono Cliente ID:${id}`, monto, fecha: 'Hoy', cat: 'Cobranza' }, ...prev.movimientos],
      clientes: prev.clientes.map(c => c.id === id ? { ...c, saldo: c.saldo - monto } : c)
    }));
  };

  // --- VISTAS INTERNAS ---
  const RenderDashboard = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-600/20 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2 relative z-10">Balance Total</p>
          <h2 className="text-4xl font-black relative z-10">${db.balance.toLocaleString()}</h2>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Por Cobrar (CXC)</p>
          <h2 className="text-3xl font-black text-emerald-600">${db.clientes.reduce((a,b)=>a+b.saldo,0).toLocaleString()}</h2>
        </div>
        <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white flex flex-col items-center justify-center group cursor-pointer hover:bg-blue-700 transition-all" onClick={() => setActiveTab('finanzas')}>
           <Plus size={32} />
           <p className="text-[10px] font-black uppercase mt-2">Operación Rápida</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 italic flex items-center gap-2"><TrendingUp size={16}/> Flujo de Efectivo</h3>
          <div className="h-44 flex items-end justify-between gap-3">
            {[40, 90, 60, 100, 75, 85, 95].map((h, i) => (
              <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} className="w-full bg-slate-100 hover:bg-blue-600 rounded-t-xl transition-all" />
            ))}
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 italic">Movimientos Recientes</h3>
          <div className="space-y-4">
            {db.movimientos.slice(0, 3).map(m => (
              <div key={m.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${m.tipo==='ingreso' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}><ArrowUpRight size={14}/></div>
                  <span className="text-xs font-bold text-slate-700">{m.desc}</span>
                </div>
                <span className="text-xs font-black text-slate-900">${m.monto.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className={`min-h-screen bg-[#F8FAFC] flex transition-all duration-500 ${isMobileView ? 'p-6 md:p-12 justify-center bg-slate-200' : ''}`}>
      
      {/* SIDEBAR FIJO */}
      {!isMobileView && (
        <aside className="w-72 bg-white border-r border-slate-100 h-screen sticky top-0 p-8 flex flex-col z-50">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-lg shadow-blue-100"><Landmark size={24}/></div>
            <h1 className="font-black text-2xl tracking-tighter italic text-slate-800">FINCORE</h1>
          </div>
          <nav className="flex-grow space-y-3">
            <SidebarLink active={activeTab==='dashboard'} onClick={()=>setActiveTab('dashboard')} icon={<LayoutDashboard size={20}/>} label="Dashboard" />
            <SidebarLink active={activeTab==='directorio'} onClick={()=>setActiveTab('directorio')} icon={<Users size={20}/>} label="Directorio" />
            <SidebarLink active={activeTab==='finanzas'} onClick={()=>setActiveTab('finanzas')} icon={<Wallet size={20}/>} label="Finanzas" />
            <SidebarLink active={activeTab==='nomina'} onClick={()=>setActiveTab('nomina')} icon={<Briefcase size={20}/>} label="RRHH" />
          </nav>
          <button onClick={()=>setIsMobileView(true)} className="mt-8 w-full bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl">
            <Smartphone size={20}/> <span className="text-[10px] font-black uppercase tracking-widest">Ver en Celular</span>
          </button>
        </aside>
      )}

      {/* CONTENEDOR DE CONTENIDO (Aquí aplicamos el margen superior) */}
      <div className={`flex-grow transition-all duration-700 ${isMobileView ? 'w-[375px] h-[780px] border-[12px] border-slate-900 rounded-[3.5rem] bg-white shadow-2xl overflow-y-auto relative' : 'relative'}`}>
        
        {/* HEADER CON Z-INDEX AJUSTADO */}
        <header className="p-8 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-md z-[40] border-b border-slate-50">
           <div>
             <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">{activeTab}</h2>
             <p className="text-2xl font-black text-slate-900 tracking-tighter italic">Software Pro</p>
           </div>
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl border-4 border-blue-50 flex items-center justify-center font-black text-white text-sm shadow-md">RM</div>
           </div>
        </header>

        {/* BOTÓN PARA SALIR DE VISTA MÓVIL */}
        {isMobileView && (
          <button onClick={()=>setIsMobileView(false)} className="fixed bottom-10 right-10 z-[60] bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center gap-2">
            <Monitor size={20}/> <span className="text-xs font-bold">Desktop</span>
          </button>
        )}

        {/* ÁREA DE CONTENIDO CON PADDING SUPERIOR EXTRA */}
        <main className="p-8 pt-12"> 
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && <RenderDashboard />}
            {activeTab === 'directorio' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {[...db.clientes, ...db.proveedores].map(e => (
                   <div key={e.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-4 mb-4">
                         <div className="p-3 bg-slate-50 rounded-xl text-blue-600"><Building2 size={24}/></div>
                         <div>
                            <h4 className="font-black text-slate-800">{e.nombre}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">{e.rfc}</p>
                         </div>
                      </div>
                   </div>
                 ))}
              </motion.div>
            )}
            {activeTab === 'finanzas' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-8 rounded-[2.5rem] border border-slate-100">
                <h3 className="text-2xl font-black mb-8 italic">Cuentas por Cobrar</h3>
                <div className="space-y-4">
                  {db.clientes.map(c => (
                    <div key={c.id} className="p-6 bg-slate-50 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-4">
                      <span className="font-black text-slate-700 uppercase text-xs tracking-widest">{c.nombre}</span>
                      <div className="flex gap-2">
                        <button onClick={() => aplicarAbono(c.id, 1000)} className="px-5 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase hover:bg-slate-900 hover:text-white transition-all">Abonar $1k</button>
                        <button onClick={() => aplicarAbono(c.id, c.saldo)} className="px-5 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase">Liquidar</button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

const SidebarLink = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-400 hover:bg-slate-50'}`}>
    {icon}
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default ERP;