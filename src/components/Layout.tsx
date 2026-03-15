import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Globe, Menu as MenuIcon, X, Instagram, Facebook, MapPin } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Chatbot } from './Chatbot';
import { CartDrawer } from './CartDrawer';
import { businessInfo } from '../data/business';

export function Layout() {
  const { language, setLanguage, cart, setCartOpen } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = location.pathname === '/' 
    ? [] 
    : [{ path: '/', label: { fr: 'Accueil', en: 'Home' } }];

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500/30">
      {/* Header */}
      <header className="fixed top-0 w-full z-40 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Spacer to keep layout balanced */}
          <div className="w-10 sm:w-[140px]"></div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium tracking-wide uppercase transition-colors hover:text-amber-500 ${
                  location.pathname === link.path ? 'text-amber-500' : 'text-zinc-400'
                }`}
              >
                {link.label[language]}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-xs font-bold uppercase text-zinc-400 hover:text-amber-500 transition-colors"
            >
              <Globe size={16} />
              {language === 'fr' ? 'EN' : 'FR'}
            </button>

            <div className="hidden sm:flex items-center gap-4 text-zinc-400">
              <a href={businessInfo.socials.facebook} target="_blank" rel="noreferrer" className="hover:text-amber-500 transition-colors">
                <Facebook size={18} />
              </a>
              <a href={businessInfo.socials.instagram} target="_blank" rel="noreferrer" className="hover:text-amber-500 transition-colors">
                <Instagram size={18} />
              </a>
            </div>

            <button 
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-zinc-100 hover:text-amber-500 transition-colors"
            >
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-amber-500 text-zinc-950 text-xs font-bold flex items-center justify-center rounded-full transform translate-x-1 -translate-y-1">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-zinc-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-zinc-950 pt-24 px-6 md:hidden"
          >
            <nav className="flex flex-col gap-6 text-2xl font-serif">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`hover:text-amber-500 transition-colors ${
                    location.pathname === link.path ? 'text-amber-500' : 'text-zinc-100'
                  }`}
                >
                  {link.label[language]}
                </Link>
              ))}
            </nav>
            <div className="mt-12 flex gap-6 text-zinc-400">
              <a href={businessInfo.socials.facebook} target="_blank" rel="noreferrer">
                <Facebook size={24} />
              </a>
              <a href={businessInfo.socials.instagram} target="_blank" rel="noreferrer">
                <Instagram size={24} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-20 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 border-t border-zinc-800 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h4 className="font-bold text-zinc-100 mb-6 uppercase tracking-wider text-sm">
              {language === 'fr' ? 'À propos' : 'About'}
            </h4>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
              {language === 'fr' 
                ? 'Bar de quartier Montréalais, axé cocktails, humour, culture, événements et ambiance conviviale.'
                : 'Montreal neighborhood bar, focused on cocktails, comedy, culture, events, and a friendly atmosphere.'}
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-zinc-100 mb-6 uppercase tracking-wider text-sm">Contact</h4>
            <div className="space-y-3 text-zinc-400 text-sm">
              <p>{businessInfo.address}</p>
              <p>{businessInfo.phone}</p>
              <p>{businessInfo.email}</p>
              <a 
                href="https://maps.google.com/?q=1309+Rue+Saint-Zotique+Est,+Montréal" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 mt-2"
              >
                <MapPin size={16} />
                {language === 'fr' ? 'Voir sur la carte' : 'View on map'}
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-zinc-100 mb-6 uppercase tracking-wider text-sm">
              {language === 'fr' ? 'Heures d\'ouverture' : 'Opening Hours'}
            </h4>
            <ul className="space-y-2 text-zinc-400 text-sm mb-6">
              {businessInfo.hours[language].map((h, i) => (
                <li key={i} className="flex justify-between border-b border-zinc-800/50 pb-2">
                  <span>{h.day}</span>
                  <span className="font-mono">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>

      <Chatbot />
      <CartDrawer />
    </div>
  );
}
