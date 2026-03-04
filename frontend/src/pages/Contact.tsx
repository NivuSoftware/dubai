import Layout from '../components/Layout';
import { Mail, MessageCircle, Phone } from 'lucide-react';

export default function Contact() {
  return (
    <Layout>
      <div className="min-h-screen bg-black">
        <div className="bg-gradient-to-b from-[#0a0a0a] to-black py-20 px-6 lg:px-8 border-b border-[#a83d8e]/20">
          <div className="max-w-[1000px] mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-[#a83d8e] to-[#d4af37] bg-clip-text text-transparent">
              Contáctanos
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
              Elige el canal que prefieras. Te respondemos lo más rápido posible.
            </p>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-8 border border-[#25D366]/30">
              <div className="w-14 h-14 rounded-lg bg-[#25D366]/20 flex items-center justify-center mb-4">
                <MessageCircle className="w-7 h-7 text-[#25D366]" />
              </div>
              <h3 className="text-2xl text-white mb-3">WhatsApp</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Atención directa para consultas rápidas y soporte inmediato.
              </p>
              <button className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-3">
                <MessageCircle className="w-5 h-5" />
                Abrir WhatsApp
              </button>
            </div>

            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-8 border border-[#a83d8e]/20">
              <div className="w-14 h-14 rounded-lg bg-[#a83d8e]/20 flex items-center justify-center mb-4">
                <Mail className="w-7 h-7 text-[#a83d8e]" />
              </div>
              <h3 className="text-2xl text-white mb-3">Correo electrónico</h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Para solicitudes detalladas y seguimiento de casos.
              </p>
              <a
                href="mailto:support@dubai-directory.com"
                className="text-[#d4af37] hover:text-[#d4af37]/80 transition-colors break-all"
              >
                support@dubai-directory.com
              </a>
            </div>

            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-8 border border-[#d4af37]/20 md:col-span-2 xl:col-span-1">
              <div className="w-14 h-14 rounded-lg bg-[#d4af37]/20 flex items-center justify-center mb-4">
                <Phone className="w-7 h-7 text-[#d4af37]" />
              </div>
              <h3 className="text-2xl text-white mb-3">Teléfono</h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Canal recomendado para casos urgentes.
              </p>
              <a
                href="tel:+593999999999"
                className="text-[#d4af37] hover:text-[#d4af37]/80 transition-colors"
              >
                +593 99 999 9999
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a] rounded-xl p-6 border border-[#a83d8e]/20">
              <h3 className="text-xl text-white mb-3">Tiempo de respuesta</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Respondemos normalmente en menos de 24 horas en días hábiles. Si es un tema
                urgente de seguridad, usa WhatsApp o teléfono para atención inmediata.
              </p>
            </div>

            <div className="bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a] rounded-xl p-6 border border-[#a83d8e]/20">
              <h3 className="text-xl text-white mb-3">Horario de atención</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Lunes - Viernes</span>
                  <span>9:00 AM - 10:00 PM</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Sábado</span>
                  <span>10:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Domingo</span>
                  <span>12:00 PM - 6:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 text-center">
            <p className="text-gray-400 mb-4">¿Buscas respuestas rápidas?</p>
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => {
                  window.location.href = '/#faq';
                }, 100);
              }}
              className="border border-[#a83d8e] text-[#a83d8e] hover:bg-[#a83d8e] hover:text-white px-8 py-3 rounded-full transition-all hover:shadow-[0_0_20px_rgba(168,61,142,0.5)]"
            >
              Revisa nuestras preguntas frecuentes
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
