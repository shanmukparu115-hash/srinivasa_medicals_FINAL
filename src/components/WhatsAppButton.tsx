import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  // The admin's actual WhatsApp number
  const phoneNumber = "919666930275"; 
  const message = encodeURIComponent("Hello, I would like to place an order.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#128C7E] hover:scale-110 transition-all duration-300"
      aria-label="Message on WhatsApp"
    >
      {/* Fallback to Lucide's MessageCircle if we don't have a WhatsApp specific icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-8 h-8"
      >
        <path d="M12.01 2.013c-5.46 0-9.89 4.43-9.89 9.89 0 1.76.46 3.42 1.28 4.88L2 22l5.37-1.39c1.4.76 2.99 1.18 4.64 1.18 5.46 0 9.89-4.43 9.89-9.89 0-5.46-4.43-9.89-9.89-9.89zm.01 16.48c-1.46 0-2.86-.38-4.08-1.07l-.3-.18-3.03.79.8-2.95-.19-.31c-.77-1.25-1.18-2.71-1.18-4.27 0-4.7 3.82-8.52 8.52-8.52 4.7 0 8.52 3.82 8.52 8.52 0 4.7-3.82 8.52-8.52 8.52zm4.67-6.38c-.26-.13-1.52-.75-1.75-.84-.24-.09-.41-.13-.59.13-.17.26-.66.84-.81 1.01-.15.17-.3.19-.56.06-.26-.13-1.09-.4-2.07-1.28-.77-.69-1.29-1.54-1.44-1.8-.15-.26-.02-.4.11-.53.12-.12.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.59-1.42-.81-1.95-.21-.51-.43-.44-.59-.45-.15-.01-.32-.01-.49-.01-.17 0-.46.06-.7.32-.24.26-.92.9-.92 2.19 0 1.29.94 2.54 1.07 2.71.13.17 1.84 2.81 4.46 3.94.62.27 1.11.43 1.49.55.62.2 1.19.17 1.64.1.5-.08 1.52-.62 1.73-1.22.22-.6.22-1.12.15-1.22-.07-.1-.24-.16-.5-.29z" />
      </svg>
    </a>
  );
};
