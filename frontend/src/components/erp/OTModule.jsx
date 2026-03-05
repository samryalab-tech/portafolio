import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';

const OTModule = () => {
  const { clients, orders, addOrder, updateOrder, deleteOrder, services, updateOrderStatus } = useData(); 
  
  // Estados para UI y Notificaciones
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [statusFilter, setStatusFilter] = useState('Pendientes'); 
  const [serviceSearch, setServiceSearch] = useState(''); 
  const [notification, setNotification] = useState(null);

  // Estados para CRUD y Menús
  const [editingOT, setEditingOT] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showStatusMenu, setShowStatusMenu] = useState(null);
  const [transferModal, setTransferModal] = useState(null);

  const [formData, setFormData] = useState({
    clientId: '',
    serviciosSeleccionados: [], 
    prioridad: 'Normal',
    estado: 'Activa',
    descripcion: ''
  });

  // Sistema de Notificaciones interno (Toasts elegantes)
  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Filtro Inteligente de Órdenes
  const filteredOrders = useMemo(() => {
    return orders.filter(ot => {
      const name = ot.clientName?.toLowerCase() || '';
      const folio = ot.folio?.toLowerCase() || '';
      const search = searchTerm.toLowerCase();
      const matchesSearch = name.includes(search) || folio.includes(search);
      
      if (statusFilter === 'Pendientes') {
        return matchesSearch && (ot.estado === 'Activa' || ot.estado === 'En Proceso');
      }
      if (statusFilter === 'Todos') return matchesSearch;
      return matchesSearch && ot.estado === statusFilter;
    });
  }, [orders, searchTerm, statusFilter]);

  // Filtro de Catálogo (Solo servicios existentes)
  const filteredServices = services.filter(s => 
    s.nombre.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  const handleStatusUpdate = (otId, newStatus) => {
    updateOrderStatus(otId, newStatus);
    setShowStatusMenu(null);
    if (newStatus === 'Finalizada') {
      const ot = orders.find(o => o.id === otId);
      setTransferModal(ot);
    }
    showToast(`Estado actualizado a: ${newStatus}`);
  };

  const confirmTransfer = (tipo) => {
    const currentOrder = orders.find(o => o.id === transferModal.id);
    updateOrder(transferModal.id, {
      ...currentOrder,
      estado: 'Finalizada',
      tipoDocumento: tipo,
      listoParaCobrar: true,
      enCobranza: true
    });
    setTransferModal(null);
    showToast(`Enviado a Cobranza como ${tipo}`);
  };

  const handleEditOT = (ot) => {
    setEditingOT(ot);
    setFormData({
      clientId: ot.clientId,
      serviciosSeleccionados: ot.serviciosSeleccionados || [],
      prioridad: ot.prioridad || 'Normal',
      estado: ot.estado || 'Activa',
      descripcion: ot.descripcion || ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteOT = () => {
    deleteOrder(deleteConfirm.id);
    setDeleteConfirm(null);
    showToast("Orden eliminada correctamente", "error");
  };

  const addServiceToOT = (service) => {
    const exists = formData.serviciosSeleccionados.find(s => s.id === service.id);
    if (exists) {
      setFormData({
        ...formData,
        serviciosSeleccionados: formData.serviciosSeleccionados.map(s =>
          s.id === service.id ? { ...s, cantidad: s.cantidad + 1 } : s
        )
      });
    } else {
      setFormData({
        ...formData,
        serviciosSeleccionados: [...formData.serviciosSeleccionados, { ...service, cantidad: 1 }]
      });
    }
    setServiceSearch('');
  };

  const updateItemPrice = (serviceId, newPrice) => {
    setFormData({
      ...formData,
      serviciosSeleccionados: formData.serviciosSeleccionados.map(s => 
        s.id === serviceId ? { ...s, precio: parseFloat(newPrice) || 0 } : s
      )
    });
  };

  const decreaseServiceQty = (serviceId) => {
    const target = formData.serviciosSeleccionados.find(s => s.id === serviceId);
    if (target.cantidad > 1) {
      setFormData({
        ...formData,
        serviciosSeleccionados: formData.serviciosSeleccionados.map(s =>
          s.id === serviceId ? { ...s, cantidad: s.cantidad - 1 } : s
        )
      });
    } else {
      setFormData({
        ...formData,
        serviciosSeleccionados: formData.serviciosSeleccionados.filter(s => s.id !== serviceId)
      });
    }
  };

  // Cálculo de Totales con IVA (Desglose Fiscal)
  const totals = useMemo(() => {
    const subtotal = formData.serviciosSeleccionados.reduce((acc, s) => acc + (s.precio * s.cantidad), 0);
    const iva = formData.serviciosSeleccionados.reduce((acc, s) => {
      const tasa = parseFloat(s.impuestoTasa) || 0.16; // 16% por defecto si no se define en el catálogo
      return acc + (s.precio * s.cantidad * tasa);
    }, 0);
    return { subtotal, iva, total: subtotal + iva };
  }, [formData.serviciosSeleccionados]);

  const handleSave = (e) => {
    e.preventDefault();
    if (formData.serviciosSeleccionados.length === 0) return showToast("Agrega al menos un servicio", "error");
    if (!formData.clientId) return showToast("Selecciona un cliente", "error");

    const client = clients.find(c => c.id === parseInt(formData.clientId));
    const dataToSave = {
      ...formData,
      clientName: client ? client.razonSocial : 'Cliente Desconocido',
      montoSubtotal: totals.subtotal,
      montoIva: totals.iva,
      montoTotal: totals.total,
      fechaCreacion: editingOT ? editingOT.fechaCreacion : new Date().toLocaleString('es-MX')
    };

    if (editingOT) updateOrder(editingOT.id, dataToSave);
    else addOrder(dataToSave);
    
    setIsModalOpen(false);
    setEditingOT(null);
    setFormData({ clientId: '', serviciosSeleccionados: [], prioridad: 'Normal', estado: 'Activa', descripcion: '' });
    showToast("Orden guardada con éxito");
  };

  return (
    <div className="space-y-6 animate-fadeIn text-left font-sans pb-20 relative">
      
      {/* SISTEMA DE TOASTS */}
      {notification && (
        <div className={`fixed top-6 right-6 z-[200] px-6 py-4 rounded-2xl shadow-2xl font-black text-[10px] uppercase tracking-[0.2em] animate-scaleIn text-white flex items-center gap-3 ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-600'}`}>
          <span>{notification.type === 'error' ? '✕' : '✓'}</span>
          {notification.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Órdenes de Trabajo</h3>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Producción y Taller</p>
        </div>
        <button onClick={() => { setEditingOT(null); setIsModalOpen(true); }} className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-blue-700 transition-all shadow-lg">+ Nueva OT</button>
      </div>

      {/* FILTROS RESPONSIVOS */}
      <div className="bg-white p-5 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 grayscale">🔍</span>
          <input 
            type="text" 
            placeholder="Buscar por folio o cliente..." 
            className="w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-xs font-bold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all font-sans"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="w-full md:w-auto bg-[#0a1128] text-white border-none rounded-2xl px-6 py-4 text-xs font-black outline-none shadow-md cursor-pointer uppercase tracking-widest"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="Pendientes">🛠️ Pendientes</option>
          <option value="Activa">Activa</option>
          <option value="En Proceso">En Proceso</option>
          <option value="Finalizada">✅ Finalizadas</option>
          <option value="Todos">Ver Todo</option>
        </select>
      </div>

      {/* GRID DE ÓRDENES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredOrders.length > 0 ? filteredOrders.map((ot) => (
          <div key={ot.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative group transition-all hover:shadow-xl">
            <div className={`absolute top-0 left-0 w-2 h-full rounded-l-full ${ot.estado === 'Finalizada' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
            
            <div className="flex justify-between items-start mb-6">
              <div className="text-left">
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg uppercase tracking-tight">{ot.folio}</span>
                <h4 className="font-black text-slate-900 uppercase text-sm mt-3 leading-tight">{ot.clientName}</h4>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-slate-900 leading-none">${ot.montoTotal?.toLocaleString()}</p>
                <div className="flex gap-1 justify-end mt-4">
                  <button onClick={() => handleEditOT(ot)} className="p-2 bg-gray-50 hover:bg-blue-50 rounded-xl text-blue-600 transition-all text-sm">✏️</button>
                  <button onClick={() => setDeleteConfirm(ot)} className="p-2 bg-gray-50 hover:bg-red-50 rounded-xl text-red-500 transition-all text-sm">🗑️</button>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 mb-8 border-l-4 border-slate-50 pl-5 text-left">
              {ot.serviciosSeleccionados?.map((s, i) => (
                <p key={i} className="text-[10px] font-bold text-slate-500 uppercase">
                  <span className="text-blue-600 font-black">{s.cantidad}x</span> {s.nombre}
                </p>
              ))}
            </div>

            <div className="flex justify-between items-center border-t border-gray-50 pt-6">
              <span className="text-[9px] font-black text-slate-300 uppercase italic">{ot.fechaCreacion?.split(',')[0]}</span>
              
              <div className="relative">
                <button 
                  onClick={() => setShowStatusMenu(showStatusMenu === ot.id ? null : ot.id)}
                  className={`text-[9px] font-black px-4 py-2 rounded-xl uppercase transition-all shadow-sm flex items-center gap-2 ${
                    ot.estado === 'Finalizada' ? 'bg-green-50 text-green-700' : 
                    ot.estado === 'En Proceso' ? 'bg-orange-50 text-orange-700' : 'bg-blue-50 text-blue-700'
                  }`}
                >
                  {ot.estado} <span>▾</span>
                </button>

                {showStatusMenu === ot.id && (
                  <div className="absolute bottom-full right-0 mb-3 w-40 bg-white rounded-[1.5rem] shadow-2xl border border-gray-100 py-3 z-[60] animate-scaleIn">
                    {['Activa', 'En Proceso', 'Finalizada'].map((st) => (
                      <button 
                        key={st}
                        onClick={() => handleStatusUpdate(ot.id, st)}
                        className="w-full text-left px-5 py-3 text-[10px] font-black uppercase text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 text-center">
            <p className="text-gray-300 font-black uppercase text-xs tracking-widest">Sin órdenes pendientes</p>
          </div>
        )}
      </div>

      {/* MODAL DECISIÓN (TRANSFERENCIA) */}
      {transferModal && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl text-center border border-gray-100 animate-scaleIn">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 italic font-black">?</div>
            <h4 className="text-xl font-black text-slate-900 uppercase mb-2 tracking-tighter">Orden Finalizada</h4>
            <p className="text-slate-500 text-xs mb-8 leading-relaxed font-medium">
              El folio <span className="font-bold text-slate-800 tracking-tight">{transferModal.folio}</span> ha concluido. <br/>¿Cómo procesamos el cobro?
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={() => confirmTransfer('Factura')} className="w-full bg-[#0a1128] text-white p-5 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase hover:bg-blue-600 transition-all shadow-xl">📄 Factura Fiscal</button>
              <button onClick={() => confirmTransfer('Venta')} className="w-full bg-slate-50 text-slate-600 p-5 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase hover:bg-slate-100 transition-all">🏷️ Nota de Venta</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIGURACIÓN OT (100% RESPONSIVO CON SCROLL INTERNO) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] flex flex-col rounded-[3rem] shadow-2xl overflow-hidden animate-scaleIn">
            
            {/* Header Fijo */}
            <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-white">
              <div className="text-left">
                <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{editingOT ? 'Editar Orden' : 'Configurar Nueva OT'}</h4>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5 tracking-[0.2em]">Taller 2026</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-gray-50 text-slate-400 rounded-full flex items-center justify-center text-xl hover:text-red-500 transition-all">✕</button>
            </div>

            {/* Cuerpo con Scroll Interno */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 custom-scrollbar bg-white">
              <form id="ot-form" onSubmit={handleSave} className="space-y-12">
                
                {/* Selección de Cliente y Prioridad */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cliente Solicitante *</label>
                    <select className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600/20" required value={formData.clientId} onChange={(e) => setFormData({...formData, clientId: e.target.value})}>
                      <option value="">-- Buscar en Directorio --</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.razonSocial}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nivel de Prioridad</label>
                    <select className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600/20" value={formData.prioridad} onChange={(e) => setFormData({...formData, prioridad: e.target.value})}>
                      <option value="Normal">Normal</option>
                      <option value="Urgente">🔥 Urgente</option>
                      <option value="Programada">📅 Programada</option>
                    </select>
                  </div>
                </div>

                {/* Buscador de Catálogo (Sin Registro Directo) */}
                <div className="space-y-6">
                  <div className="text-left">
                    <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Añadir Servicios al Folio</label>
                    <div className="relative mt-2">
                      <input 
                        type="text" 
                        className="w-full p-5 bg-gray-50 border-none rounded-[2rem] text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-sans" 
                        placeholder="Buscar servicio en el catálogo..." 
                        value={serviceSearch} 
                        onChange={(e) => setServiceSearch(e.target.value)} 
                      />
                      {serviceSearch && (
                        <div className="absolute z-[60] w-full mt-2 bg-white rounded-[2rem] shadow-2xl border border-gray-100 py-3 max-h-60 overflow-y-auto">
                          {filteredServices.map(s => (
                            <button key={s.id} type="button" onClick={() => addServiceToOT(s)} className="w-full text-left px-8 py-4 hover:bg-blue-50 flex justify-between items-center transition-colors border-b border-gray-50 last:border-0">
                              <span className="text-[11px] font-black uppercase text-slate-700">{s.nombre}</span>
                              <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">${s.precio}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Detalle de Servicios Seleccionados */}
                  <div className="bg-slate-50 rounded-[3rem] p-6 sm:p-8 space-y-4 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-left">Resumen de la Orden:</p>
                    {formData.serviciosSeleccionados.length > 0 ? formData.serviciosSeleccionados.map((s, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row items-center justify-between bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 gap-4 transition-all">
                        <div className="flex-1 text-center sm:text-left">
                          <p className="text-[11px] font-black text-slate-900 uppercase leading-tight mb-2">{s.nombre}</p>
                          <div className="flex items-center justify-center sm:justify-start gap-2">
                            <span className="text-[8px] font-black text-slate-400 uppercase">P. Unitario:</span>
                            <input 
                              type="number" 
                              className="w-20 p-1 bg-blue-50 rounded-lg text-[10px] font-black text-blue-600 text-center outline-none" 
                              value={s.precio} 
                              onChange={(e) => updateItemPrice(s.id, e.target.value)} 
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                            <button type="button" onClick={() => decreaseServiceQty(s.id)} className="px-4 py-2 hover:bg-gray-200 text-slate-600 font-black transition-colors">-</button>
                            <span className="px-4 py-2 bg-white text-xs font-black min-w-[40px] text-center">{s.cantidad}</span>
                            <button type="button" onClick={() => addServiceToOT(s)} className="px-4 py-2 hover:bg-gray-200 text-slate-600 font-black transition-colors">+</button>
                          </div>
                          <p className="text-xs font-black text-slate-900 min-w-[70px] text-right font-sans">${(s.precio * s.cantidad).toLocaleString()}</p>
                        </div>
                      </div>
                    )) : (
                        <div className="py-12 text-center text-slate-300 font-black uppercase text-[10px] tracking-[0.2em] italic">No hay servicios añadidos</div>
                    )}
                    
                    {/* Desglose Fiscal Final */}
                    <div className="pt-8 mt-4 border-t border-slate-200 space-y-3">
                      <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <span>Subtotal Neto:</span>
                        <span className="font-sans">${totals.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <span>Impuestos (IVA Estimado):</span>
                        <span className="font-sans">${totals.iva.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-blue-600 font-black pt-4 border-t border-slate-100 mt-2">
                        <span className="text-xs uppercase tracking-[0.3em]">Total Bruto:</span>
                        <span className="text-2xl font-black font-sans">${totals.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Descripción Técnica */}
                <div className="text-left space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Observaciones Técnicas</label>
                    <textarea 
                        className="w-full p-5 bg-gray-50 border-none rounded-[2rem] text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600/10 min-h-[100px] resize-none"
                        value={formData.descripcion}
                        onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                        placeholder="Especificaciones del trabajo..."
                    />
                </div>
              </form>
            </div>

            {/* Footer Fijo */}
            <div className="px-10 py-8 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest hover:text-slate-600 transition-colors">Cancelar</button>
              <button form="ot-form" type="submit" className="flex-[2] bg-[#0a1128] text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all">
                {editingOT ? 'Guardar Cambios' : 'Confirmar Orden'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[170] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl text-center border border-gray-100 animate-scaleIn">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 italic font-black">!</div>
            <h4 className="text-xl font-black text-slate-900 uppercase mb-2 tracking-tighter">Eliminar Folio</h4>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-8 italic">¿Confirmas la eliminación?</p>
            <div className="flex flex-col gap-3">
              <button onClick={handleDeleteOT} className="w-full bg-red-500 text-white p-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-100 transition-all">Sí, eliminar</button>
              <button onClick={() => setDeleteConfirm(null)} className="w-full bg-slate-100 text-slate-500 p-5 rounded-2xl font-black text-[10px] uppercase transition-all">Regresar</button>
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

export default OTModule;