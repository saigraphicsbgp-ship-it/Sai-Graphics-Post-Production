import React from 'react';
import { Phone, MessageSquare } from 'lucide-react';

interface FloatingActionsProps {
  mobileNumber: string;
  whatsappNumber: string;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  mobileNumber,
  whatsappNumber
}) => {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3 pointer-events-auto">
      {/* WhatsApp Floating Trigger */}
      <a
        href={`https://wa.me/91${whatsappNumber}?text=Hello%20Sai%20Graphics,%20I%20would%20like%20to%20inquire%20about%20your%20editing%20services.`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-[0_4px_20px_rgba(16,185,129,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 group relative"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="absolute right-14 whitespace-nowrap bg-black/80 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity border border-white/10">
          WhatsApp Chat
        </span>
      </a>

      {/* Call Floating Trigger */}
      <a
        href={`tel:${mobileNumber}`}
        aria-label="Call Sai Graphics"
        className="w-12 h-12 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c59b27] text-slate-950 flex items-center justify-center shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 group relative"
      >
        <Phone className="w-5 h-5" />
        <span className="absolute right-14 whitespace-nowrap bg-black/80 backdrop-blur-md text-[#f3e5ab] text-xs px-2.5 py-1 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity border border-white/10">
          Call: {mobileNumber}
        </span>
      </a>
    </div>
  );
};
