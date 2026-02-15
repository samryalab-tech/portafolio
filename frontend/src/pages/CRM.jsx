import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Bot, Sparkles, Send } from 'lucide-react';

const CRM = () => {
  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="flex items-center gap-2 text-purple-600 font-black text-xs uppercase tracking-widest mb-4">
            <Sparkles size={16}/> Inteligencia Artificial
          </div>
          <h1 className="text-5xl font-black text-slate-900 mb-12 tracking-tighter">CRM Inmobiliario + OpenAI</h1>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <p className="text-lg text-slate-600 leading-relaxed">
                Este proyecto utiliza la API de <strong>OpenAI</strong> para transformar la interacción con el cliente. La IA sugiere respuestas basadas en el historial del chat y el inventario de propiedades.
              </p>
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
                 <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><Bot className="text-blue-500"/> Automatización Inteligente</h4>
                 <p className="text-sm text-slate-500">Reduce el tiempo de respuesta en un 70% permitiendo a los agentes enfocarse en el cierre de ventas.</p>
              </div>
            </div>

            {/* CHAT SIMULATOR */}
            <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-200 h-[400px] flex flex-col">
              <div className="p-4 bg-slate-900 text-white rounded-t-[2rem] flex justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest">AI Preview</span>
              </div>
              <div className="flex-grow p-4 space-y-4">
                <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none text-xs text-slate-700 w-3/4 italic">¿La propiedad en Zapopan tiene jardín?</div>
                <div className="bg-blue-600 p-3 rounded-2xl rounded-tr-none text-xs text-white w-3/4 ml-auto shadow-lg shadow-blue-200">
                  <span className="font-black block text-[8px] opacity-70 mb-1">AI SUGGESTION</span>
                  Sí, cuenta con un jardín de 40m² y terraza techada. ¿Agendamos visita?
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 flex gap-2">
                <div className="flex-grow bg-slate-50 rounded-full h-8"></div>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white"><Send size={12}/></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CRM;