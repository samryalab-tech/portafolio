import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

const ServicesModule = () => {
  const { services, addService, deleteService, updateService } = useData();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUnidad, setFilterUnidad] = useState('Todas');

  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    unidad: 'H87', // Clave SAT por defecto: Pieza
    unidadTexto: 'Pieza',
    descripcion: '',
    claveSAT: '', // Obligatorio para facturar
    sku: '',      // Opcional
    impuestoTipo: '002', // IVA
    impuestoFactor: 'Tasa',
    impuestoTasa: '0.160000',
    objetoImpuesto: '02' // Sí objeto de impuesto
  });

  // Catálogo simplificado de unidades SAT comunes
  const catUnidades = [
    { id: 'H87', label: 'H87 - Pieza' },
    { id: 'E48', label: 'E48 - Unidad de servicio' },
    { id: 'ACT', label: 'ACT - Actividad' },
    { id: 'DAY', label: 'DAY - Día' },
    { id: 'MON', label: 'MON - Mes' },
    { id: 'INH', label: 'INH - Pulgada' }
  ];

  const handleOpenModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        ...service,
        claveSAT: service.claveSAT || '',
        impuestoTasa: service.impuestoTasa || '0.160000',
        objetoImpuesto: service.objetoImpuesto || '02'
      });
    } else {
      setEditingService(null);
      setFormData({ 
        nombre: '', 
        precio: '', 
        unidad: 'H87', 
        unidadTexto: 'Pieza', 
        descripcion: '',
        claveSAT: '',
        sku: '',
        impuestoTipo: '002',
        impuestoFactor: 'Tasa',
        impuestoTasa: '0.160000',
        objetoImpuesto: '02'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validación básica de Clave SAT (8 dígitos)
    if (formData.claveSAT.length < 8) {
      return alert("La clave de producto/servicio SAT debe ser de 8 dígitos.");
    }

    if (editingService) {
      updateService(editingService.id, formData);
    } else {
      addService(formData);
    }
    setIsModalOpen(false);
  };

  const filteredServices = services.filter(s => {
    const matchesSearch = s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (s.claveSAT || '').includes(searchTerm);
    const matchesUnidad = filterUnidad === 'Todas' || s.unidad === filterUnidad;
    return matchesSearch && matchesUnidad;
  });

  return (
    <div className="space-y-6 animate-fadeIn text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Catálogo de Productos y Servicios</h3>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Configuración Fiscal de Artículos</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          + Nuevo Ítem
        </button>
      </div>

      {/* FILTROS */}
      <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 grayscale">🔍</span>
          <input 
            type="text" 
            placeholder="Buscar por nombre o Clave SAT..." 
            className="w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-xs font-bold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4 w-full lg:w-auto bg-gray-50 px-4 py-2 rounded-2xl">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Unidad:</span>
          <select 
            className="bg-transparent border-none text-xs font-bold text-slate-600 outline-none cursor-pointer"
            value={filterUnidad}
            onChange={(e) => setFilterUnidad(e.target.value)}
          >
            <option value="Todas">Todas</option>
            {catUnidades.map(u => <option key={u.id} value={u.id}>{u.id}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner">📦</div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenModal(service)} className="p-3 bg-gray-50 hover:bg-blue-50 rounded-xl text-blue-600 transition-colors">✏️</button>
                <button onClick={() => deleteService(service.id)} className="p-3 bg-gray-50 hover:bg-red-50 rounded-xl text-red-500 transition-colors">🗑️</button>
              </div>
            </div>
            
            <div className="mb-4">
              <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-widest mr-2">{service.unidad}</span>
              <span className="text-[9px] font-black text-slate-400 bg-gray-50 px-2 py-1 rounded-md uppercase tracking-widest">SAT: {service.claveSAT || 'S/N'}</span>
            </div>

            <h4 className="font-black text-slate-900 uppercase text-sm mb-2">{service.nombre}</h4>
            <p className="text-[10px] text-slate-400 font-medium line-clamp-2 min-h-[30px]">{service.descripcion || 'Sin descripción adicional'}</p>
            
            <div className="flex items-end justify-between mt-6 border-t border-gray-50 pt-6">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-gray-300 uppercase">Precio Unitario</span>
                <p className="text-2xl font-black text-slate-900 leading-none">${service.precio}</p>
              </div>
              <span className="text-[8px] font-black bg-green-50 text-green-600 px-2 py-1 rounded-full uppercase">IVA {parseFloat(service.impuestoTasa) * 100}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL OPTIMIZADO: RESPONSIVO + FISCAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] flex flex-col rounded-[3rem] shadow-2xl overflow-hidden animate-scaleIn">
            
            {/* Header Fijo */}
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white">
              <div className="text-left">
                <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                  {editingService ? 'Editar Producto' : 'Registro de Producto'}
                </h4>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">Catálogo SAT 2026</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-gray-50 text-slate-400 hover:text-red-500 rounded-full transition-all text-xl">✕</button>
            </div>

            {/* Cuerpo con Scroll Interno */}
            <div className="flex-1 overflow-y-auto p-8 sm:p-10 custom-scrollbar scroll-smooth bg-white">
              <form id="service-form" onSubmit={handleSubmit} className="space-y-10 text-left">
                
                {/* 1. DATOS BÁSICOS */}
                <section className="space-y-6">
                  <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] border-b-2 border-blue-50 pb-2">1. Identificación Comercial</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Nombre Comercial del Ítem</label>
                      <input 
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 uppercase" 
                        required value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value.toUpperCase()})}
                        placeholder="Ej: Afilado de Disco de Carburo"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Precio Unitario (Sin IVA)</label>
                      <input 
                        type="number" step="0.01" className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-black outline-none focus:ring-2 focus:ring-blue-500/20" 
                        required value={formData.precio} onChange={e => setFormData({...formData, precio: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1">SKU / ID Interno</label>
                      <input className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-bold outline-none uppercase" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} placeholder="Ej: PROD-102" />
                    </div>
                  </div>
                </section>

                {/* 2. DATOS FISCALES SAT */}
                <section className="space-y-6">
                  <h5 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] border-b-2 border-blue-50 pb-2">2. Clasificación SAT (Obligatorio)</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Clave Producto/Servicio</label>
                      <input 
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-black outline-none focus:ring-2 focus:ring-blue-500/20" 
                        required value={formData.claveSAT} onChange={e => setFormData({...formData, claveSAT: e.target.value.replace(/\D/g,'')})}
                        maxLength={8} placeholder="Ej: 82101504"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Clave de Unidad SAT</label>
                      <select 
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-bold outline-none"
                        value={formData.unidad}
                        onChange={e => {
                          const label = catUnidades.find(u => u.id === e.target.value).label.split(' - ')[1];
                          setFormData({...formData, unidad: e.target.value, unidadTexto: label});
                        }}
                      >
                        {catUnidades.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
                      </select>
                    </div>
                  </div>
                </section>

                {/* 3. IMPUESTOS */}
                <section className="space-y-6">
                  <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] border-b-2 border-blue-50 pb-2">3. Configuración de Impuestos</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Objeto de Impuesto</label>
                      <select className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-bold outline-none" value={formData.objetoImpuesto} onChange={e => setFormData({...formData, objetoImpuesto: e.target.value})}>
                        <option value="01">01 - No objeto de impuesto</option>
                        <option value="02">02 - Sí objeto de impuesto</option>
                        <option value="03">03 - Sí objeto de impuesto y no obligado al desglose</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Tasa de IVA</label>
                      <select className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-bold outline-none" value={formData.impuestoTasa} onChange={e => setFormData({...formData, impuestoTasa: e.target.value})}>
                        <option value="0.160000">16% (General)</option>
                        <option value="0.080000">8% (Frontera)</option>
                        <option value="0.000000">0% (Exento/Cero)</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Descripción para el Comprobante (Opcional)</label>
                    <textarea 
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-medium outline-none resize-none"
                      rows="3" value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})}
                      placeholder="Detalles técnicos que aparecerán en la factura..."
                    />
                  </div>
                </section>
              </form>
            </div>

            {/* Footer Fijo */}
            <div className="px-10 py-8 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest hover:text-slate-600">Cancelar</button>
              <button form="service-form" type="submit" className="flex-[2] bg-[#0a1128] text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all">
                {editingService ? 'Actualizar Información' : 'Registrar en Catálogo'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 0px; background: transparent; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default ServicesModule;