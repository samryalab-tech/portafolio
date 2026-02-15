import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, MoreVertical, Trash2, Mail, Phone } from 'lucide-react';

const ERPDirectorio = ({ db, setDb }) => {
  const [filter, setFilter] = useState('Todos');

  const addEntity = () => {
    const nombre = prompt("Nombre de la Empresa:");
    if (!nombre) return;
    const tipo = prompt("Tipo (Cliente / Proveedor):");
    
    const newEntity = {
      id: Date.now(),
      nombre,
      rfc: 'XAXX010101000',
      tipo: tipo || 'Cliente',
      saldo: 0
    };

    if (newEntity.tipo === 'Cliente') {
      setDb({ ...db, clientes: [...db.clientes, newEntity] });
    } else {
      setDb({ ...db, proveedores: [...db.proveedores, newEntity] });
    }
  };

  const allEntities = [...db.clientes, ...db.proveedores];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black tracking-tight">Directorio Comercial</h3>
        <button onClick={addEntity} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase flex items-center gap-2 shadow-lg shadow-blue-100">
          <Plus size={18}/> Nuevo Registro
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {allEntities.map((ent) => (
          <div key={ent.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${ent.tipo === 'Cliente' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                {ent.tipo === 'Cliente' ? <Building2 size={24}/> : <Truck size={24}/>}
              </div>
              <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${ent.tipo === 'Cliente' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                {ent.tipo}
              </span>
            </div>
            <h4 className="font-black text-slate-800 text-lg mb-1">{ent.nombre}</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-4">{ent.rfc}</p>
            <div className="flex gap-2">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"><Mail size={14}/></div>
              <div className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"><Phone size={14}/></div>
              <button className="ml-auto text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ERPDirectorio;