import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // --- 1. ESTADO DE CLIENTES (Mantenido con desglose de dirección) ---
  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem('erp_clients');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        razonSocial: 'INDUSTRIAS METALÚRGICAS S.A.',
        rfc: 'IME-920314-H32',
        regimen: '601',
        cp: '44100',
        calle: 'Av. de las Industrias',
        numExt: '1024',
        numInt: '',
        colonia: 'Zona Industrial',
        municipio: 'Guadalajara',
        estado: 'Jalisco',
        usoCFDI: 'G03',
        formaPago: '03',
        metodoPago: 'PUE',
        contacts: [{ name: 'Juan Pérez', email: 'juan@metal.com', whatsapp: '3312345678' }]
      },
      {
        id: 2,
        razonSocial: 'CONSTRUCTORA DEL SOL S.A. DE C.V.',
        rfc: 'CSO-150620-ABC',
        regimen: '601',
        cp: '45010',
        calle: 'Calzada del Sol',
        numExt: '500',
        numInt: 'A',
        colonia: 'Puerta de Hierro',
        municipio: 'Zapopan',
        estado: 'Jalisco',
        usoCFDI: 'G01',
        formaPago: '03',
        metodoPago: 'PPD',
        contacts: [{ name: 'Ing. Alberto Ruiz', email: 'alberto@delsol.com', whatsapp: '3322114455' }]
      }
    ];
  });

  // --- 2. ESTADO DE ÓRDENES DE TRABAJO (OT) ---
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('erp_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // --- 3. ESTADO DE SERVICIOS (Actualizado con Datos Fiscales SAT) ---
  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem('erp_services');
    return saved ? JSON.parse(saved) : [
      { 
        id: 1, 
        nombre: 'AFILADO DE DISCO CARBURO', 
        precio: 150, 
        unidad: 'H87', 
        unidadTexto: 'Pieza',
        claveSAT: '73152104',
        impuestoTasa: '0.160000',
        objetoImpuesto: '02'
      },
      { 
        id: 2, 
        nombre: 'RECTIFICADO DE CUCHILLA', 
        precio: 380, 
        unidad: 'INH', 
        unidadTexto: 'Pulgada',
        claveSAT: '73152104',
        impuestoTasa: '0.160000',
        objetoImpuesto: '02'
      },
      { 
        id: 3, 
        nombre: 'MANTENIMIENTO GENERAL', 
        precio: 850, 
        unidad: 'E48', 
        unidadTexto: 'Unidad de servicio',
        claveSAT: '72101500',
        impuestoTasa: '0.160000',
        objetoImpuesto: '02'
      }
    ];
  });

  // --- PERSISTENCIA ---
  useEffect(() => {
    localStorage.setItem('erp_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('erp_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('erp_services', JSON.stringify(services));
  }, [services]);


  // --- ACCIONES GLOBALES ---

  // CLIENTES
  const addClient = (data) => setClients([...clients, { ...data, id: Date.now() }]);
  const updateClient = (id, updatedData) => {
    setClients(clients.map(c => c.id === id ? { ...updatedData, id } : c));
  };
  const deleteClient = (id) => setClients(clients.filter(c => c.id !== id));

  // ÓRDENES DE TRABAJO (OT)
  const addOrder = (order) => {
    const newOrder = {
      ...order,
      id: Date.now(),
      clientId: parseInt(order.clientId), // Aseguramos ID numérico para filtros de Ventas
      folio: `OT-${orders.length + 101}`,
      estado: order.estado || 'Activa',
      saldoPendiente: parseFloat(order.montoTotal) || 0,
      estadoPago: 'Pendiente',
      listoParaCobrar: order.estado === 'Finalizada', // Si se crea finalizada, se activa bandera
      enCobranza: false,
      pagosRelacionados: []
    };
    setOrders([...orders, newOrder]);
  };

  const updateOrder = (id, updatedData) => {
    setOrders(orders.map(o => {
        if(o.id === id) {
            const nuevoMonto = parseFloat(updatedData.montoTotal) || o.montoTotal;
            const pagosRealizados = o.pagosRelacionados?.reduce((acc, p) => acc + (parseFloat(p.monto) || 0), 0) || 0;
            const nuevoSaldo = nuevoMonto - pagosRealizados;

            // Mantenemos o actualizamos banderas de facturación según el nuevo estado
            const isFin = updatedData.estado === 'Finalizada';

            return { 
                ...updatedData, 
                id,
                clientId: parseInt(updatedData.clientId),
                saldoPendiente: nuevoSaldo,
                listoParaCobrar: isFin ? true : (updatedData.listoParaCobrar ?? o.listoParaCobrar),
                enCobranza: updatedData.enCobranza ?? o.enCobranza,
                estadoPago: nuevoSaldo <= 0 ? 'Pagado' : (pagosRealizados > 0 ? 'Parcial' : 'Pendiente')
            };
        }
        return o;
    }));
  };

  const deleteOrder = (id) => {
    setOrders(orders.filter(o => o.id !== id));
  };

  const updateOrderStatus = (id, newStatus) => {
    setOrders(orders.map(o => {
      if(o.id === id) {
        const isFin = newStatus === 'Finalizada';
        return { 
            ...o, 
            estado: newStatus,
            // Activamos la visibilidad para el módulo de Ventas si se finaliza
            listoParaCobrar: isFin ? true : o.listoParaCobrar,
            enCobranza: isFin ? false : o.enCobranza
        };
      }
      return o;
    }));
  };

  // REGISTRAR PAGO
  const registrarPagoAFactura = (orderId, datosPago) => {
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        const montoAbono = parseFloat(datosPago.monto);
        const saldoActual = (o.saldoPendiente ?? o.montoTotal);
        const nuevoSaldo = saldoActual - montoAbono;
        
        return {
          ...o,
          saldoPendiente: nuevoSaldo,
          estadoPago: nuevoSaldo <= 0 ? 'Pagado' : 'Parcial',
          pagosRelacionados: [
            ...(o.pagosRelacionados || []), 
            { 
                ...datosPago, 
                idPago: Date.now(), 
                fechaReal: new Date().toLocaleString() 
            }
          ]
        };
      }
      return o;
    }));
  };

  // SERVICIOS
  const addService = (data) => setServices([...services, { ...data, id: Date.now() }]);
  
  const updateService = (id, updatedData) => {
    setServices(services.map(s => s.id === id ? { ...updatedData, id } : s));
  };

  const deleteService = (id) => setServices(services.filter(s => s.id !== id));

  return (
    <DataContext.Provider value={{ 
      clients, addClient, updateClient, deleteClient,
      orders, addOrder, updateOrder, deleteOrder, updateOrderStatus, registrarPagoAFactura,
      services, addService, updateService, deleteService
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);