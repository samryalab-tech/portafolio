import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ClientsModule from '../components/erp/ClientsModule'; // <--- IMPORTACIÓN NUEVA

// ... (Componentes Sidebar y Login se mantienen igual que en tu código) ...

const ERPHome = () => {
  const { user, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    return <ERPLogin onLogin={login} />;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 animate-fadeIn text-left">
      <ERPSidebar role={user.role} activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 p-6 md:p-10">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-left">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              {activeTab.replace('-', ' ')}
            </h2>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Módulo del Sistema</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-black text-slate-900 uppercase">{user.name}</p>
              <button onClick={logout} className="text-[10px] text-red-500 font-bold hover:underline tracking-widest">SALIR</button>
            </div>
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-black shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="animate-fadeIn">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tarjetas de Dashboard (Tus OT Activas, CxC, etc.) */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">OT Activas</p>
                <div className="flex items-end justify-between"><p className="text-4xl font-black text-blue-600">12</p></div>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Por Cobrar (CxC)</p>
                <div className="flex items-end justify-between"><p className="text-4xl font-black text-slate-900">$45,200</p></div>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Validaciones</p>
                <div className="flex items-end justify-between"><p className="text-4xl font-black text-orange-500">3</p></div>
              </div>
            </div>
          )}

          {/* INYECCIÓN DEL MÓDULO DE CLIENTES */}
          {activeTab === 'clientes' && <ClientsModule />}

          {/* Otros módulos pendientes */}
          {activeTab !== 'dashboard' && activeTab !== 'clientes' && (
            <div className="bg-white p-20 rounded-3xl border-2 border-dashed border-gray-100 text-center flex flex-col items-center">
              <div className="text-4xl mb-4 grayscale">⚙️</div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Módulo de {activeTab} en desarrollo...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ERPHome;