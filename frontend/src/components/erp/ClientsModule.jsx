import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

const ClientsModule = () => {
  const { clients, addClient, updateClient, deleteClient } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegimen, setFilterRegimen] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  const [formData, setFormData] = useState({
    razonSocial: '',
    rfc: '',
    regimen: '',
    cp: '',
    usoCFDI: 'G03', 
    formaPago: '03', 
    metodoPago: 'PUE', 
    // Campos de dirección desglosados
    calle: '',
    numExt: '',
    numInt: '',
    colonia: '',
    municipio: '',
    estado: '',
    contacts: [{ name: '', email: '', whatsapp: '' }]
  });

  const catRegimen = [
    { id: '601', label: '601 - General de Ley Personas Morales' },
    { id: '603', label: '603 - Personas Morales con Fines no Lucrativos' },
    { id: '605', label: '605 - Sueldos y Salarios' },
    { id: '606', label: '606 - Arrendamiento' },
    { id: '612', label: '612 - Personas Físicas con Actividades Empresariales' },
    { id: '626', label: '626 - Régimen Simplificado de Confianza (RESICO)' }
  ];

  const catUsoCFDI = [
    { id: 'G01', label: 'G01 - Adquisición de mercancías' },
    { id: 'G03', label: 'G03 - Gastos en general' },
    { id: 'S01', label: 'S01 - Sin efectos fiscales' },
    { id: 'CP01', label: 'CP01 - Pagos' }
  ];

  const catMetodoPago = [
    { id: 'PUE', label: 'PUE - Pago en una sola exhibición' },
    { id: 'PPD', label: 'PPD - Pago en parcialidades o diferido' }
  ];

  const catFormaPago = [
    { id: '01', label: '01 - Efectivo' },
    { id: '03', label: '03 - Transferencia electrónica' },
    { id: '04', label: '04 - Tarjeta de crédito' },
    { id: '99', label: '99 - Por definir' }
  ];

  const validateRFC = (rfc) => {
    const re = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/;
    return re.test(rfc.toUpperCase());
  };

  const validateEmail = (email) => {
    return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterRegimen('todos');
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          client.rfc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegimen = filterRegimen === 'todos' || client.regimen === filterRegimen;
    return matchesSearch && matchesRegimen;
  });

  const handleCreate = () => {
    setEditingClient(null);
    setFormData({ 
        razonSocial: '', rfc: '', regimen: '', cp: '', 
        usoCFDI: 'G03', formaPago: '03', metodoPago: 'PUE', 
        calle: '', numExt: '', numInt: '', colonia: '', municipio: '', estado: '',
        contacts: [{ name: '', email: '', whatsapp: '' }] 
    });
    setIsModalOpen(true);
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
        ...client,
        usoCFDI: client.usoCFDI || 'G03',
        formaPago: client.formaPago || '03',
        metodoPago: client.metodoPago || 'PUE'
    });
    setIsModalOpen(true);
  };

  const handleAddContact = () => {
    setFormData({ ...formData, contacts: [...formData.contacts, { name: '', email: '', whatsapp: '' }] });
  };

  const handleRemoveContact = (index) => {
    if (formData.contacts.length > 1) {
      const newContacts = formData.contacts.filter((_, i) => i !== index);
      setFormData({ ...formData, contacts: newContacts });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validateRFC(formData.rfc)) return alert("El RFC ingresado no tiene un formato válido.");
    const invalidEmail = formData.contacts.some(c => c.email && !validateEmail(c.email));
    if (invalidEmail) return alert("Uno de los correos electrónicos no es válido.");

    if (editingClient) updateClient(editingClient.id, formData);
    else addClient(formData);
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    deleteClient(deleteConfirm.id);
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Directorio de Clientes</h3>
          <p className="text-xs text-slate-400 font-medium tracking-widest uppercase">Estructura Fiscal Mexicana</p>
        </div>
        <button onClick={handleCreate} className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-blue-700 transition-all shadow-lg">
          + Nuevo Cliente
        </button>
      </div>

      <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
        <div className="w-full lg:flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 grayscale">🔍</span>
          <input 
            type="text" 
            placeholder="Buscar por nombre o RFC..." 
            className="w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-xs font-bold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4 items-center">
          <div className="w-full sm:w-auto flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl">
            <span className="text-[9px] font-black text-gray-400 uppercase">Régimen:</span>
            <select 
              className="bg-transparent border-none text-xs font-bold text-slate-600 outline-none"
              value={filterRegimen}
              onChange={(e) => setFilterRegimen(e.target.value)}
            >
              <option value="todos">Todos</option>
              {catRegimen.map(r => <option key={r.id} value={r.id}>{r.id}</option>)}
            </select>
          </div>
          <button onClick={clearFilters} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Limpiar</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <div key={client.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all relative group text-left">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm">🏢</div>
              <div className="flex gap-2 text-right">
                <button onClick={() => handleEdit(client)} className="p-3 bg-gray-50 hover:bg-blue-50 rounded-xl text-blue-600 transition-colors">✏️</button>
                <button onClick={() => setDeleteConfirm(client)} className="p-3 bg-gray-50 hover:bg-red-50 rounded-xl text-red-500 transition-colors">🗑️</button>
              </div>
            </div>
            
            <h4 className="font-black text-slate-900 leading-tight mb-2 uppercase text-sm">{client.razonSocial}</h4>
            <div className="flex flex-wrap gap-2 items-center mb-6">
               <p className="text-[10px] text-blue-600 font-mono font-black uppercase border border-blue-50 px-2 py-0.5 rounded-lg">{client.rfc}</p>
               <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase">CP {client.cp}</span>
            </div>
            
            <div className="space-y-4 border-t border-gray-50 pt-6">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{client.contacts.length} Contactos vinculados</span>
              <div className="flex flex-wrap gap-2">
                {client.contacts.map((contact, i) => (
                  <span key={i} className="text-[9px] bg-slate-50 text-slate-500 px-3 py-1.5 rounded-xl font-bold uppercase border border-slate-100">
                    {contact.name || 'S/N'}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] flex flex-col rounded-[3rem] shadow-2xl overflow-hidden animate-scaleIn">
            
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white">
              <div className="text-left">
                <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                  {editingClient ? 'Expediente Cliente' : 'Alta de Cliente'}
                </h4>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">CFDI Versión 4.0</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-gray-50 text-slate-400 hover:text-red-500 rounded-full transition-all text-xl">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 sm:p-10 custom-scrollbar scroll-smooth bg-white">
              <form id="client-form" className="space-y-12" onSubmit={handleSave}>
                
                {/* 1. INFORMACIÓN EMPRESA */}
                <section className="text-left space-y-6">
                  <h5 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] border-b-2 border-blue-50 pb-2 flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-600 rounded-full"></span> 1. Información Fiscal Empresa
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">Nombre o Razón Social (SAT)</label>
                      <input 
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600/20 uppercase" 
                        value={formData.razonSocial}
                        onChange={(e) => setFormData({...formData, razonSocial: e.target.value.toUpperCase()})}
                        required
                        placeholder="Tal como aparece en la constancia"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">RFC</label>
                      <input 
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-black outline-none focus:ring-2 focus:ring-blue-600/20 font-mono uppercase" 
                        value={formData.rfc}
                        onChange={(e) => setFormData({...formData, rfc: e.target.value.toUpperCase()})}
                        maxLength={13} required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">Régimen Fiscal</label>
                      <select 
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600/20"
                        value={formData.regimen}
                        onChange={(e) => setFormData({...formData, regimen: e.target.value})}
                        required
                      >
                        <option value="">Seleccionar Régimen...</option>
                        {catRegimen.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                      </select>
                    </div>
                  </div>
                </section>

                {/* 2. DOMICILIO FISCAL (DESGLOSADO) */}
                <section className="text-left space-y-6">
                  <h5 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] border-b-2 border-blue-50 pb-2 flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-600 rounded-full"></span> 2. Domicilio Fiscal
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">Calle</label>
                      <input className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600/20" value={formData.calle} onChange={(e) => setFormData({...formData, calle: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">Núm. Ext</label>
                      <input className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600/20" value={formData.numExt} onChange={(e) => setFormData({...formData, numExt: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">Núm. Int</label>
                      <input className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600/20" value={formData.numInt} onChange={(e) => setFormData({...formData, numInt: e.target.value})} />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">Colonia</label>
                      <input className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600/20" value={formData.colonia} onChange={(e) => setFormData({...formData, colonia: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">Código Postal</label>
                      <input className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600/20" value={formData.cp} maxLength={5} onChange={(e) => setFormData({...formData, cp: e.target.value.replace(/\D/g,'')})} required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">Municipio / Alc.</label>
                      <input className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600/20" value={formData.municipio} onChange={(e) => setFormData({...formData, municipio: e.target.value})} />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">Estado</label>
                      <input className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600/20" value={formData.estado} onChange={(e) => setFormData({...formData, estado: e.target.value})} />
                    </div>
                  </div>
                </section>

                {/* 3. PARÁMETROS FACTURACIÓN */}
                <section className="text-left space-y-6">
                  <h5 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] border-b-2 border-blue-50 pb-2 flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-600 rounded-full"></span> 3. Parámetros SAT
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">Uso de CFDI</label>
                      <select className="w-full p-4 bg-gray-50 border-none rounded-2xl text-[10px] font-bold outline-none" value={formData.usoCFDI} onChange={(e) => setFormData({...formData, usoCFDI: e.target.value})}>
                        {catUsoCFDI.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">Método Pago</label>
                      <select className="w-full p-4 bg-gray-50 border-none rounded-2xl text-[10px] font-bold outline-none" value={formData.metodoPago} onChange={(e) => setFormData({...formData, metodoPago: e.target.value})}>
                        {catMetodoPago.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">Forma Pago</label>
                      <select className="w-full p-4 bg-gray-50 border-none rounded-2xl text-[10px] font-bold outline-none" value={formData.formaPago} onChange={(e) => setFormData({...formData, formaPago: e.target.value})}>
                        {catFormaPago.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                      </select>
                    </div>
                  </div>
                </section>

                {/* 4. CONTACTOS */}
                <section className="text-left space-y-6 pb-6">
                  <h5 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] border-b-2 border-blue-50 pb-2 flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-600 rounded-full"></span> 4. Contactos de Notificación
                  </h5>
                  <div className="space-y-4">
                    {formData.contacts.map((contact, i) => (
                      <div key={i} className="flex flex-col gap-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 relative transition-all hover:bg-slate-100/50">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1 text-left">
                            <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Nombre</label>
                            <input className="w-full p-3 bg-white rounded-xl text-[11px] font-bold border-none shadow-sm outline-none" value={contact.name} onChange={(e) => { const newContacts = [...formData.contacts]; newContacts[i].name = e.target.value; setFormData({...formData, contacts: newContacts}); }} />
                          </div>
                          <div className="space-y-1 text-left">
                            <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Email Facturación</label>
                            <input className="w-full p-3 bg-white rounded-xl text-[11px] font-bold border-none shadow-sm outline-none font-sans" value={contact.email} onChange={(e) => { const newContacts = [...formData.contacts]; newContacts[i].email = e.target.value; setFormData({...formData, contacts: newContacts}); }} />
                          </div>
                          <div className="space-y-1 text-left">
                            <label className="text-[8px] font-black text-slate-400 uppercase ml-1">WhatsApp</label>
                            <input className="w-full p-3 bg-white rounded-xl text-[11px] font-bold border-none shadow-sm outline-none" value={contact.whatsapp} onChange={(e) => { const newContacts = [...formData.contacts]; newContacts[i].whatsapp = e.target.value; setFormData({...formData, contacts: newContacts}); }} />
                          </div>
                        </div>
                        {formData.contacts.length > 1 && (
                          <button type="button" onClick={() => handleRemoveContact(i)} className="absolute -top-3 -right-3 w-8 h-8 bg-white text-red-500 rounded-full shadow-md flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-red-100">🗑️</button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={handleAddContact} className="w-full py-4 border-2 border-dashed border-gray-200 rounded-[2rem] text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 hover:border-blue-200 transition-all">
                      + Vincular nuevo contacto
                    </button>
                  </div>
                </section>
              </form>
            </div>

            <div className="px-10 py-8 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Cancelar</button>
              <button form="client-form" type="submit" className="flex-[2] bg-[#0a1128] text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all">
                {editingClient ? 'Actualizar Expediente' : 'Registrar en Base de Datos'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white w-full max-sm:w-full max-w-sm rounded-[3rem] p-10 shadow-2xl text-center border border-gray-100 animate-scaleIn">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 italic">!</div>
            <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Eliminar Registro</h4>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">Estás por eliminar a <br /> <span className="font-bold text-slate-800 italic">"{deleteConfirm.razonSocial}"</span>.</p>
            <div className="flex flex-col gap-3">
              <button onClick={handleDelete} className="w-full bg-red-500 text-white p-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-100">Sí, eliminar</button>
              <button onClick={() => setDeleteConfirm(null)} className="w-full bg-slate-100 text-slate-500 p-5 rounded-2xl font-black text-[10px] uppercase">Cancelar</button>
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

export default ClientsModule;