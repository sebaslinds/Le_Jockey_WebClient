import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ExternalLink, RefreshCw } from 'lucide-react';
import { events } from '../data/events';
import { useStore } from '../store/useStore';

export function Events() {
  const { language } = useStore();

  const recurringEvents = events.filter(e => e.isRecurring);
  const specialEvents = events.filter(e => !e.isRecurring).sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());

  const t = {
    title: { fr: 'Événements', en: 'Events' },
    subtitle: { fr: 'Programmation', en: 'Programming' },
    recurring: { fr: 'Chaque semaine', en: 'Every week' },
    special: { fr: 'À venir', en: 'Upcoming' },
    tickets: { fr: 'Billets', en: 'Tickets' },
    free: { fr: 'Entrée libre', en: 'Free entry' },
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat(language === 'fr' ? 'fr-CA' : 'en-CA', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-16 border-b border-zinc-800 pb-8">
        <h1 className="text-5xl md:text-6xl font-serif text-amber-500 mb-4">{t.title[language]}</h1>
        <p className="text-zinc-400 max-w-xl text-lg">
          {language === 'fr' 
            ? 'Humour, contes, musique et plus encore. Découvrez ce qui se passe au Jockey.'
            : 'Comedy, storytelling, music, and more. Discover what\'s happening at Le Jockey.'}
        </p>
      </div>

      {/* Special Events */}
      <section className="mb-24">
        <div className="flex items-center gap-3 mb-8">
          <Calendar className="text-amber-500" size={24} />
          <h2 className="text-3xl font-serif text-zinc-100">{t.special[language]}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {specialEvents.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-amber-500/50 transition-colors group"
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center gap-2 text-amber-500 font-mono text-sm mb-3">
                    <Calendar size={14} />
                    <span className="uppercase tracking-wider">{formatDate(event.date!)}</span>
                    <span className="mx-2">•</span>
                    <Clock size={14} />
                    <span>{event.time}</span>
                  </div>
                  <h3 className="text-2xl font-serif text-zinc-100 mb-3 group-hover:text-amber-500 transition-colors">
                    {event.title[language]}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed mb-6">
                    {event.description[language]}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-zinc-800/50">
                  <span className="text-sm font-bold uppercase tracking-wider text-zinc-500">
                    {t.tickets[language]}
                  </span>
                  <a 
                    href="https://lepointdevente.com/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 text-amber-500 hover:text-amber-400 font-medium transition-colors"
                  >
                    {language === 'fr' ? 'Réserver' : 'Book now'} <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recurring Events */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <RefreshCw className="text-amber-500" size={24} />
          <h2 className="text-3xl font-serif text-zinc-100">{t.recurring[language]}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recurringEvents.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
              
              <div className="text-amber-500 font-mono text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                <Clock size={14} />
                {event.recurringPattern}
              </div>
              
              <h3 className="text-xl font-serif text-zinc-100 mb-3">{event.title[language]}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                {event.description[language]}
              </p>
              
              <div className="mt-auto inline-block px-3 py-1 bg-zinc-900 text-zinc-500 text-xs font-bold uppercase tracking-wider rounded-full border border-zinc-800">
                {t.free[language]}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
