import Layout from '../components/Layout';
import { MessageCircle, Phone, Send } from 'lucide-react';
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  CONTACT_WHATSAPP_URL,
} from '../constants/contact';

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
              <a
                href={CONTACT_WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-3"
              >
                <MessageCircle className="w-5 h-5" />
                Abrir WhatsApp
              </a>
            </div>

            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-8 border border-[#229ED9]/30">
              <div className="w-14 h-14 rounded-lg bg-[#229ED9]/20 flex items-center justify-center mb-4">
                <Send className="w-7 h-7 text-[#229ED9]" />
              </div>
              <h3 className="text-2xl text-white mb-3">Telegram</h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Contáctanos directamente por Telegram para soporte y postulaciones.
              </p>
              
              <a
                href="https://t.me/DBE593"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center justify-center bg-[#24A1DE] hover:bg-[#1b8fc9] text-white px-5 py-2.5 rounded-lg transition-all shadow-[0_0_18px_rgba(36,161,222,0.35)]"
              >
                Abrir Telegram
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
                href={`tel:${CONTACT_PHONE_TEL}`}
                className="text-[#d4af37] hover:text-[#d4af37]/80 transition-colors"
              >
                {CONTACT_PHONE_DISPLAY}
              </a>
            </div>
          </div>

          <div className="rounded-2xl p-6 sm:p-8 border border-[#229ED9]/30 bg-gradient-to-r from-[#051017] via-[#0a0a0a] to-[#151008] shadow-[0_0_40px_rgba(34,158,217,0.15)]">
            <div className="inline-flex items-center rounded-full border border-[#229ED9]/50 bg-[#229ED9]/10 px-4 py-1 mb-4">
              <span className="text-[#7dd3fc] text-xs tracking-[0.2em]">NUEVAS VACANTES</span>
            </div>
            <h3 className="text-2xl sm:text-4xl text-white leading-tight mb-3">
              ¿QUIERES TRABAJAR CON NOSOTROS?
            </h3>
            <p className="text-base sm:text-lg text-gray-200 mb-6">
              Escanea el código QR y envíanos un mensaje por Telegram o Whatsapp. Proceso directo,
              reservado y rápido.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 place-items-center">
              <a
                href="https://t.me/DBE593"
                target="_blank"
                rel="noreferrer"
                className="block w-full"
              >
                <img
                  src="/images/telegram.png"
                  alt="Código QR de Telegram"
                  className="w-full max-w-[320px] mx-auto"
                />
              </a>
              <img
                src="/images/wpp.png"
                alt="Código QR de WhatsApp"
                className="w-full max-w-[320px] mx-auto"
              />
            </div>
            <div className="mt-5 text-center">
              <span className="inline-flex items-center justify-center rounded-full bg-[#229ED9] text-white px-5 py-2 text-sm font-medium shadow-[0_0_24px_rgba(34,158,217,0.45)]">
                Escanea el codigo y envianos un mensaje!
              </span>
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
