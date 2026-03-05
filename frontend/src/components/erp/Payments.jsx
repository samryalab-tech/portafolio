import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';

const Payments = () => {
  const { orders, registrarPagoAFactura } = useData();
  const [selectedOT, setSelectedOT] = useState(null);
  const [success, setSuccess] = useState(false);

  // Filtramos solo lo que está en cobranza y que aún tiene saldo pendiente
  const facturasPendientes = useMemo(() => {
    return orders.filter(o => o.enCobranza && (o.saldoPendiente === undefined || o.saldoPendiente > 0));
  }, [orders]);

  const handlePayment = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const monto = parseFloat(fd.get('monto'));
    
    const saldoActual = selectedOT.saldoPendiente !== undefined ? selectedOT.saldoPendiente : selectedOT.montoTotal;

    registrarPagoAFactura(selectedOT.id, {
      monto,
      metodo: fd.get('metodo'),
      referencia: fd.get('referencia'),
      tipoPago: monto >= saldoActual ? 'Total' : 'Parcial'
    });

    setSelectedOT(null);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-left font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Registro de Pagos</h3>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Ligar ingresos a folios de facturación</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* LISTADO DE FACTURAS PENDIENTES */}
        <div className="lg:col-span-2 space-y-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 text-left">Facturas con saldo pendiente:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facturasPendientes.length > 0 ? facturasPendientes.map(f => (
              <button 
                key={f.id} 
                onClick={() => setSelectedOT(f)}
                className={`p-6 rounded-[2.5rem] border-2 text-left transition-all relative overflow-hidden shadow-sm ${
                  selectedOT?.id === f.id ? 'border-blue-600 bg-blue-50/50 shadow-blue-100' : 'border-gray-100 bg-white hover:border-blue-200'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg uppercase">{f.folio}</span>
                    <h5 className="text-xs font-black text-slate-800 uppercase mt-3 leading-tight">{f.clientName}</h5>
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase">{f.tipoDocumento}</span>
                </div>

                <div className="flex justify-between items-end border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Saldo Actual</p>
                    <p className="text-xl font-black text-slate-900">
                      ${(f.saldoPendiente !== undefined ? f.saldoPendiente : f.montoTotal).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-slate-300 uppercase italic">Original: ${f.montoTotal.toLocaleString()}</p>
                  </div>
                </div>
              </button>
            )) : (
              <div className="col-span-full py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 text-center">
                <p className="text-gray-300 font-black uppercase text-xs tracking-widest">No hay folios pendientes de pago</p>
              </div>
            )}
          </div>
        </div>

        {/* PANEL DE COBRO (FORMULARIO) */}
        <div className="bg-[#0a1128] text-white p-10 rounded-[3rem] shadow-2xl sticky top-4">
          {selectedOT ? (
            <form onSubmit={handlePayment} className="space-y-6 animate-fadeIn">
              <div className="text-left mb-6">
                <h4 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Aplicar Pago a:</h4>
                <p className="text-lg font-black uppercase leading-tight">{selectedOT.folio}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{selectedOT.clientName}</p>
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Monto a abonar</label>
                <input 
                  name="monto" 
                  type="number" 
                  step="0.01" 
                  max={selectedOT.saldoPendiente !== undefined ? selectedOT.saldoPendiente : selectedOT.montoTotal} 
                  required 
                  className="w-full p-4 bg-slate-800 border-none rounded-2xl text-lg font-black outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                  placeholder="0.00" 
                  defaultValue={selectedOT.saldoPendiente !== undefined ? selectedOT.saldoPendiente : selectedOT.montoTotal}
                />
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Método de Pago</label>
                <select name="metodo" className="w-full p-4 bg-slate-800 border-none rounded-2xl text-xs font-black outline-none cursor-pointer">
                  <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Depósito">Depósito</option>
                  <option value="Tarjeta">Tarjeta</option>
                </select>
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Referencia (ID Transacción)</label>
                <input 
                  name="referencia" 
                  type="text" 
                  required 
                  className="w-full p-4 bg-slate-800 border-none rounded-2xl text-xs font-black outline-none" 
                  placeholder="Ej: AB-12345678" 
                />
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/40">
                Confirmar Registro
              </button>
            </form>
          ) : (
            <div className="py-24 text-center opacity-30 flex flex-col items-center gap-4">
              <span className="text-4xl">💳</span>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
                Selecciona una factura <br /> de la lista para <br /> registrar su pago
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* ALERTA DE ÉXITO ESTILO SWEETALERT TAILWIND */}
      {success && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fadeIn pointer-events-none">
          <div className="bg-green-600 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl animate-scaleIn flex items-center gap-4">
            <span className="text-xl">✅</span>
            Pago aplicado correctamente
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;