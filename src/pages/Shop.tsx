import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { shopItems } from '../data/shop';
import { useStore } from '../store/useStore';

export function Shop() {
  const { language, addToCart } = useStore();

  const t = {
    title: { fr: 'Boutique', en: 'Shop' },
    subtitle: { fr: 'Affichez vos couleurs', en: 'Show your colors' },
    add: { fr: 'Ajouter au panier', en: 'Add to cart' },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-16 border-b border-zinc-800 pb-8">
        <h1 className="text-5xl md:text-6xl font-serif text-amber-500 mb-4">{t.title[language]}</h1>
        <p className="text-zinc-400 max-w-xl text-lg">
          {language === 'fr' 
            ? 'Vêtements, articles promotionnels et souvenirs du Bar Le Jockey.'
            : 'Clothing, promotional items, and souvenirs from Bar Le Jockey.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {shopItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-colors flex flex-col"
          >
            <div className="aspect-square overflow-hidden relative bg-zinc-950">
              <img 
                src={item.image} 
                alt={item.name[language]} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100 mix-blend-luminosity hover:mix-blend-normal"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
            </div>
            
            <div className="p-6 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-serif text-zinc-100 leading-tight pr-4">
                  {item.name[language]}
                </h3>
                <span className="text-amber-500 font-mono font-bold">${item.price.toFixed(2)}</span>
              </div>
              
              <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-1">
                {item.description[language]}
              </p>
              
              <button 
                onClick={() => {
                  addToCart({ id: item.id, name: item.name, price: item.price, quantity: 1, type: 'shop' });
                  toast.success(language === 'fr' ? `${item.name.fr} ajouté au panier` : `${item.name.en} added to cart`);
                }}
                className="w-full py-3 bg-zinc-950 hover:bg-amber-500 text-zinc-100 hover:text-zinc-950 font-bold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 transition-colors border border-zinc-800 hover:border-amber-500"
              >
                <Plus size={16} />
                {t.add[language]}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
