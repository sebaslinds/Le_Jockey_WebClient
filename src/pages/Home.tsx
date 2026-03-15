import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, GlassWater, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

export function Home() {
  const { language } = useStore();

  const t = {
    heroTitle: { fr: 'Cocktails, Humour & Culture', en: 'Cocktails, Comedy & Culture' },
    heroSubtitle: { fr: 'L\'âme d\'un bar de quartier montréalais.', en: 'The soul of a Montreal neighborhood bar.' },
    ctaMenu: { fr: 'Menu', en: 'Menu' },
    ctaEvents: { fr: 'Événements', en: 'Events' },
    ctaShop: { fr: 'Boutique', en: 'Shop' },
    featured: { fr: 'À venir', en: 'Upcoming' },
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2000" 
            alt="Bar Le Jockey Interior" 
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-16 mb-6 md:mb-10">
              
              {/* Left Floating Event Tile */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
                className="hidden md:block relative w-48 lg:w-64 aspect-square rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-zinc-800/50 transform hover:scale-105 hover:rotate-2 transition-all duration-300 cursor-pointer flex-shrink-0"
              >
                <Link to="/events">
                  <img 
                    src="/lundis-humour.jpg" 
                    alt="Les Lundis de l'Humour au Jockey" 
                    className="w-full h-full object-cover bg-white"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-amber-500 font-bold text-sm uppercase tracking-wider">
                      {language === 'fr' ? "Voir l'événement" : "View event"} <ArrowRight size={14} className="inline ml-1" />
                    </span>
                  </div>
                </Link>
              </motion.div>

              <div className="w-full max-w-[280px] sm:max-w-md md:max-w-2xl lg:max-w-3xl flex justify-center">
                <img 
                  src="/Jockey-Logo-Blanc.png" 
                  alt="Le Jockey" 
                  className="w-full h-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = document.getElementById('hero-fallback-text');
                    if (fallback) fallback.style.display = 'block';
                  }}
                />
                <h1 id="hero-fallback-text" className="hidden text-5xl md:text-7xl font-serif font-bold text-zinc-100 tracking-tight text-center">
                  {t.heroTitle[language]}
                </h1>
              </div>
              
              {/* Right Floating Event Tile */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
                className="hidden md:block relative w-48 lg:w-64 aspect-square rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-zinc-800/50 transform hover:scale-105 hover:-rotate-2 transition-all duration-300 cursor-pointer flex-shrink-0"
              >
                <Link to="/events">
                  <img 
                    src="/mercredi-jockey.jpg" 
                    alt="Mercredi Jockey" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-amber-500 font-bold text-sm uppercase tracking-wider">
                      {language === 'fr' ? "Voir l'événement" : "View event"} <ArrowRight size={14} className="inline ml-1" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            </div>
            

            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/menu" 
                className="px-8 py-4 bg-zinc-900 text-amber-500 font-bold rounded-full hover:bg-zinc-800 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center border border-amber-500/30"
              >
                <GlassWater size={20} />
                {t.ctaMenu[language]}
              </Link>
              <Link 
                to="/events" 
                className="px-8 py-4 bg-zinc-900 text-amber-500 font-bold rounded-full hover:bg-zinc-800 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center border border-amber-500/30"
              >
                <Calendar size={20} />
                {t.ctaEvents[language]}
              </Link>
              <Link 
                to="/shop" 
                className="px-8 py-4 bg-zinc-900 text-amber-500 font-bold rounded-full hover:bg-zinc-800 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center border border-amber-500/30"
              >
                <ShoppingBag size={20} />
                {t.ctaShop[language]}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
