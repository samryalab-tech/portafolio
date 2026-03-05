import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';

const SalesModule = () => {
  const { orders, clients, updateOrder } = useData();
  
  // Estados para Filtros
  const [clientFilter, setClientFilter] = useState('');
  const [docTypeFilter, setDocTypeFilter] = useState('Todos');
  const [folioSearch, setFolioSearch] = useState('');

  // Estados para selección y modales
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [viewOrder, setViewOrder] = useState(null); // Para ver detalle sin editar
  const [showPreview, setShowPreview] = useState(false); // Vista previa de Factura Global
  const [alertModal, setAlertModal] = useState(null); 
  const [confirmModal, setConfirmModal] = useState(null);

  // --- FILTRO DE ÓRDENES ---
  const billableOrders = useMemo(() => {
    return orders.filter(ot => {
      const isReady = ot.estado === 'Finalizada' && ot.listoParaCobrar && !ot.enCobranza;
      const matchesClient = clientFilter === '' || String(ot.clientId) === String(clientFilter);
      const matchesType = docTypeFilter === 'Todos' || ot.tipoDocumento === docTypeFilter;
      const matchesFolio = (ot.folio || '').toLowerCase().includes((folioSearch || '').toLowerCase());
      return isReady && matchesClient && matchesType && matchesFolio;
    });
  }, [orders, clientFilter, docTypeFilter, folioSearch]);

  const activeClientId = selectedOrders.length > 0 
    ? String(orders.find(o => o.id === selectedOrders[0])?.clientId)
    : null;

  const toggleSelectOrder = (id, clientId) => {
    if (activeClientId && String(clientId) !== activeClientId && !selectedOrders.includes(id)) {
      setAlertModal({
        type: 'warning',
        title: 'Selección restringida',
        text: 'Para facturar globalmente, todas las órdenes deben pertenecer al mismo cliente.'
      });
      return;
    }
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter(orderId => orderId !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  // Cálculos para la Factura Global / Preview
  const selectedData = useMemo(() => {
    const list = orders.filter(o => selectedOrders.includes(o.id));
    const subtotal = list.reduce((acc, o) => acc + (o.montoSubtotal || o.montoTotal || 0), 0);
    const iva = list.reduce((acc, o) => acc + (o.montoIva || 0), 0);
    const total = subtotal + iva;
    const client = list.length > 0 ? clients.find(c => c.id === list[0].clientId) : null;
    return { list, subtotal, iva, total, client };
  }, [selectedOrders, orders, clients]);

  const executeBillingProcess = (type) => {
    selectedOrders.forEach(id => {
      const original = orders.find(o => o.id === id);
      updateOrder(id, {
        ...original,
        listoParaCobrar: false, 
        enCobranza: true,       
        fechaFacturacion: new Date().toLocaleDateString('es-MX'),
        tipoDocumentoDefinitivo: type === 'Global' ? 'Factura Global' : original.tipoDocumento,
        idAgrupador: type === 'Global' ? `GLOB-${Date.now()}` : null
      });
    });
    
    setConfirmModal(null);
    setShowPreview(false);
    setSelectedOrders([]);
    setAlertModal({
      type: 'success',
      title: '¡Procesado!',
      text: 'Los documentos han sido enviados a Cobranza exitosamente.'
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn text-left font-sans pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Ventas / Facturación</h3>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Generación de comprobantes fiscales</p>
        </div>
        {selectedOrders.length > 0 && (
          <button 
            onClick={() => setShowPreview(true)}
            className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-100 animate-bounceIn"
          >
            📄 Revisar Factura ({selectedOrders.length})
          </button>
        )}
      </div>

      {/* FILTROS MEJORADOS */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Filtrar Cliente</label>
          <select className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-bold outline-none" value={clientFilter} onChange={(e) => setClientFilter(e.target.value)}>
            <option value="">Todos los Clientes</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.razonSocial}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Documento</label>
          <select className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-bold outline-none" value={docTypeFilter} onChange={(e) => setDocTypeFilter(e.target.value)}>
            <option value="Todos">Factura / Venta</option>
            <option value="Factura">Facturas</option>
            <option value="Venta">Notas de Venta</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Buscar Folio</label>
          <input type="text" placeholder="OT-000" className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-bold outline-none uppercase" value={folioSearch} onChange={(e) => setFolioSearch(e.target.value)} />
        </div>
        <button onClick={() => {setClientFilter(''); setDocTypeFilter('Todos'); setFolioSearch(''); setSelectedOrders([]);}} className="p-4 text-[10px] font-black text-blue-600 uppercase hover:bg-blue-50 rounded-2xl transition-all">Limpiar Filtros</button>
      </div>

      {/* TABLA DE ÓRDENES DISPONIBLES */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-16">Sel.</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Referencia</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Entidad Fiscal</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pre-Clasificación</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total Neto</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {billableOrders.map((ot) => {
                const isDisabled = activeClientId && String(ot.clientId) !== activeClientId;
                const isSelected = selectedOrders.includes(ot.id);
                return (
                  <tr key={ot.id} className={`group transition-all ${isDisabled ? 'opacity-30' : 'hover:bg-blue-50/30'}`}>
                    <td className="p-6 text-center">
                      <input 
                        type="checkbox" className="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        checked={isSelected} disabled={isDisabled} onChange={() => toggleSelectOrder(ot.id, ot.clientId)}
                      />
                    </td>
                    <td className="p-6">
                      <p className="text-xs font-black text-slate-900 uppercase">{ot.folio}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">{ot.fechaCreacion?.split(',')[0]}</p>
                    </td>
                    <td className="p-6">
                      <p className="text-xs font-bold text-slate-700 uppercase tracking-tight">{ot.clientName}</p>
                    </td>
                    <td className="p-6">
                      <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${ot.tipoDocumento === 'Factura' ? 'bg-purple-50 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>
                        {ot.tipoDocumento}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <p className="text-sm font-black text-slate-900">${ot.montoTotal?.toLocaleString()}</p>
                    </td>
                    <td className="p-6 text-center">
                      <button onClick={() => setViewOrder(ot)} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-lg hover:bg-[#0a1128] hover:text-white transition-all shadow-sm">🔍</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: VISOR DE DETALLE (NO EDICIÓN) */}
      {viewOrder && (
        <div className="fixed inset-0 z-[180] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-scaleIn">
            <div className="p-10 text-left">
              <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
                <div>
                  <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg uppercase">Resumen de Folio</span>
                  <h4 className="text-2xl font-black text-slate-900 uppercase mt-2">{viewOrder.folio}</h4>
                </div>
                <button onClick={() => setViewOrder(null)} className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-xl hover:bg-red-50 hover:text-red-500 transition-all">✕</button>
              </div>
              
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cliente Solicitante</p>
                  <p className="text-xs font-bold text-slate-800 uppercase">{viewOrder.clientName}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fecha de Registro</p>
                  <p className="text-xs font-bold text-slate-800 uppercase">{viewOrder.fechaCreacion}</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-[2rem] p-8 mb-8">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">
                      <th className="pb-3">Descripción del Servicio</th>
                      <th className="pb-3 text-center">Cant.</th>
                      <th className="pb-3 text-right">Unitario</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewOrder.serviciosSeleccionados?.map((s, i) => (
                      <tr key={i} className="text-xs font-bold text-slate-700">
                        <td className="py-3 uppercase">{s.nombre}</td>
                        <td className="py-3 text-center">{s.cantidad}</td>
                        <td className="py-3 text-right">${s.precio?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end border-t border-gray-100 pt-6">
                <div className="text-right space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Total de la Orden</p>
                  <p className="text-3xl font-black text-[#0a1128]">${viewOrder.montoTotal?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PREVIEW DE FACTURA GLOBAL */}
      {showPreview && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl animate-fadeIn">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] flex flex-col rounded-[3rem] shadow-2xl overflow-hidden animate-scaleIn">
            <div className="p-10 flex-1 overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-start mb-12">
                <div className="text-left">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-3xl font-black mb-6 shadow-xl">CFDI</div>
                  <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Borrador de Comprobante</h4>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mt-1 italic">Versión 4.0 Compliance</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Receptor del Pago</p>
                   <p className="text-sm font-black text-slate-900 uppercase">{selectedData.client?.razonSocial}</p>
                   <p className="text-xs font-bold text-slate-400 font-mono mt-1">{selectedData.client?.rfc}</p>
                </div>
              </div>

              <div className="space-y-4 mb-12">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conceptos Agrupados ({selectedOrders.length} folios)</p>
                <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
                   <table className="w-full text-left">
                     <thead>
                       <tr className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-200">
                         <th className="pb-4">Folio OT</th>
                         <th className="pb-4">Servicios Incluidos</th>
                         <th className="pb-4 text-right">Importe</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {selectedData.list.map(ot => (
                          <tr key={ot.id} className="text-xs font-bold text-slate-700">
                            <td className="py-4 text-blue-600 font-black">{ot.folio}</td>
                            <td className="py-4 uppercase text-[10px] leading-relaxed">
                              {ot.serviciosSeleccionados?.map(s => `${s.cantidad}x ${s.nombre}`).join(', ')}
                            </td>
                            <td className="py-4 text-right font-black">${ot.montoTotal?.toLocaleString()}</td>
                          </tr>
                        ))}
                     </tbody>
                   </table>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-t-2 border-dashed border-gray-100 pt-10">
                <div className="text-left space-y-4 max-w-sm">
                  <p className="text-[9px] font-black text-slate-300 uppercase leading-relaxed italic">
                    * Al confirmar, se generará una cuenta por cobrar unificada en el módulo de cobranza. Se mantendrá el historial de folios vinculados para auditoría.
                  </p>
                </div>
                <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] min-w-[320px] shadow-2xl">
                  <div className="space-y-3 mb-6 border-b border-white/10 pb-6">
                    <div className="flex justify-between text-[10px] font-black uppercase opacity-60"><span>Subtotal:</span><span>${selectedData.subtotal.toLocaleString()}</span></div>
                    <div className="flex justify-between text-[10px] font-black uppercase opacity-60"><span>IVA Trasladado:</span><span>${selectedData.iva.toLocaleString()}</span></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-widest text-blue-400">Total a Pagar:</span>
                    <span className="text-3xl font-black">${selectedData.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-10 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
              <button onClick={() => setShowPreview(false)} className="flex-1 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest hover:text-slate-600 transition-colors">Volver a Selección</button>
              <button 
                onClick={() => setConfirmModal({
                  type: 'Global',
                  title: 'Confirmar Facturación',
                  text: '¿Deseas procesar estos folios y enviarlos a cobranza?',
                  action: () => executeBillingProcess('Global')
                })}
                className="flex-[2] bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-blue-700 transition-all"
              >
                ✓ Confirmar y Enviar a Cobranza
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ALERTAS PERSONALIZADAS */}
      {alertModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl text-center animate-scaleIn">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 ${alertModal.type === 'warning' ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-500'}`}>
              {alertModal.type === 'warning' ? '⚠️' : '✅'}
            </div>
            <h4 className="text-lg font-black text-slate-900 uppercase mb-2">{alertModal.title}</h4>
            <p className="text-slate-500 text-sm mb-6 font-medium leading-relaxed">{alertModal.text}</p>
            <button onClick={() => setAlertModal(null)} className="w-full bg-[#0a1128] text-white p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg">Entendido</button>
          </div>
        </div>
      )}

      {confirmModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl text-center animate-scaleIn">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-6">❓</div>
            <h4 className="text-lg font-black text-slate-900 uppercase mb-2">{confirmModal.title}</h4>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed italic">"{confirmModal.text}"</p>
            <div className="flex flex-col gap-3">
              <button onClick={confirmModal.action} className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Sí, Procesar</button>
              <button onClick={() => setConfirmModal(null)} className="w-full bg-slate-100 text-slate-400 p-4 rounded-2xl font-black text-[10px] uppercase">Cancelar</button>
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

export default SalesModule;