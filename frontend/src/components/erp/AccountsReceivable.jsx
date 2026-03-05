import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';

const AccountsReceivable = () => {
  const { orders } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  // --- LÓGICA DE CÁLCULO DE VENCIMIENTOS ---
  const stats = useMemo(() => {
    const hoy = new Date();
    let vencido = 0;      // > 30 días
    let estaSemana = 0;   // 0 a 5 días (L-V)
    let proximos = 0;     // 6 a 30 días

    orders.filter(o => o.enCobranza && o.estadoPago !== 'Pagado').forEach(o => {
      // Usamos la fecha de facturación si existe, si no la de creación
      const fechaRef = new Date(o.fechaFacturacion || o.fechaCreacion);
      const diffTime = Math.abs(hoy - fechaRef);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const saldo = o.saldoPendiente !== undefined ? o.saldoPendiente : o.montoTotal;

      if (diffDays > 30) {
        vencido += saldo;
      } else if (diffDays <= 5) {
        estaSemana += saldo;
      } else {
        proximos += saldo;
      }
    });

    return { vencido, estaSemana, proximos };
  }, [orders]);

  const filteredAR = orders.filter(o => 
    o.enCobranza && 
    (o.folio?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     o.clientName?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-fadeIn text-left font-sans">
      {/* INDICADORES DE VENCIMIENTO (ESTILO CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border-l-[12px] border-red-500 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 text-left">Vencido (+30 días)</p>
          <p className="text-3xl font-black text-red-600 text-left">${stats.vencido.toLocaleString()}</p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border-l-[12px] border-orange-500 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 text-left">Vence esta semana (L-V)</p>
          <p className="text-3xl font-black text-orange-600 text-left">${stats.estaSemana.toLocaleString()}</p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border-l-[12px] border-blue-500 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 text-left">Próximos (8-30 días)</p>
          <p className="text-3xl font-black text-blue-600 text-left">${stats.proximos.toLocaleString()}</p>
        </div>
      </div>

      {/* TABLA DE CARTERA */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-left">
            <h4 className="font-black text-slate-800 uppercase text-sm tracking-widest">Cartera de Cobranza</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Control de facturas y documentos</p>
          </div>
          <input 
            type="text" 
            placeholder="Filtrar por folio o cliente..." 
            className="w-full md:w-80 p-4 bg-gray-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="p-6">Folio / Documento</th>
                <th className="p-6">Cliente</th>
                <th className="p-6 text-center">Archivos</th>
                <th className="p-6 text-right">Monto / Saldo</th>
                <th className="p-6 text-center">Estado Pago</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredAR.length > 0 ? filteredAR.map((ot) => (
                <tr key={ot.id} className="hover:bg-slate-50 transition-all">
                  <td className="p-6">
                    <p className="text-xs font-black text-slate-900 uppercase">{ot.folio}</p>
                    <p className="text-[9px] font-bold text-blue-500 uppercase tracking-tighter">{ot.tipoDocumento || 'Venta'}</p>
                  </td>
                  <td className="p-6 text-xs font-bold text-slate-600 uppercase">
                    {ot.clientName}
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center gap-2">
                      <button title="Descargar PDF" className="w-9 h-9 bg-red-50 text-red-500 rounded-xl flex items-center justify-center text-xs hover:bg-red-500 hover:text-white transition-all shadow-sm">📄</button>
                      <button title="Ver XML" className="w-9 h-9 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center text-[10px] font-black hover:bg-blue-500 hover:text-white transition-all shadow-sm">{`</>`}</button>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <p className="text-sm font-black text-slate-900">${(ot.saldoPendiente ?? ot.montoTotal).toLocaleString()}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Total: ${ot.montoTotal.toLocaleString()}</p>
                  </td>
                  <td className="p-6 text-center">
                    <span className={`text-[9px] font-black px-4 py-2 rounded-full uppercase ${
                      ot.estadoPago === 'Pagado' ? 'bg-green-100 text-green-600' : 
                      ot.estadoPago === 'Parcial' ? 'bg-orange-100 text-orange-600' : 
                      'bg-red-100 text-red-600'
                    }`}>
                      {ot.estadoPago || 'Pendiente'}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-20 text-center">
                    <p className="text-gray-300 font-black uppercase text-xs tracking-[0.3em]">No hay documentos en cobranza</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountsReceivable;