import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { menuItems, menuCategories } from '../data/menu';
import { useStore } from '../store/useStore';

export function Menu() {
  const { language, addToCart } = useStore();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleFlip = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredItems = menuItems.filter(item => {
    return activeCategory === 'all' || item.category === activeCategory;
  });

  const t = {
    title: { fr: 'Notre Menu', en: 'Our Menu' },
    all: { fr: 'Tous', en: 'All' },
    add: { fr: 'Ajouter', en: 'Add' },
    ingredients: { fr: 'Ingrédients', en: 'Ingredients' },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-zinc-800 pb-8 gap-6">
        <div>
          <h1 className="text-5xl md:text-6xl font-serif text-amber-500 mb-4">{t.title[language]}</h1>
          <p className="text-zinc-400 max-w-xl">
            {language === 'fr' 
              ? 'Découvrez nos créations signatures, nos classiques revisités et nos inspirations du moment.'
              : 'Discover our signature creations, reimagined classics, and current inspirations.'}
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-12">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-colors ${
            activeCategory === 'all' 
              ? 'bg-amber-500 text-zinc-950' 
              : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          {t.all[language]}
        </button>
        {menuCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-colors ${
              activeCategory === cat.id 
                ? 'bg-amber-500 text-zinc-950' 
                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            {cat.name[language]}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredItems.map(item => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              key={item.id}
              className="relative h-[320px] perspective-1000"
              onClick={(e) => toggleFlip(item.id, e)}
            >
              <motion.div
                className="w-full h-full relative preserve-3d cursor-pointer"
                animate={{ rotateY: flippedCards[item.id] ? 180 : 0 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
              >
                {/* Front */}
                <div className="absolute inset-0 backface-hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between overflow-hidden group hover:border-amber-500/50 transition-colors">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110" />
                  
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-mono text-amber-500 uppercase tracking-widest">
                        {menuCategories.find(c => c.id === item.category)?.name[language]}
                      </span>
                      <button 
                        className="text-zinc-500 hover:text-amber-500 transition-colors p-1"
                        onClick={(e) => toggleFlip(item.id, e)}
                      >
                        <Info size={18} />
                      </button>
                    </div>
                    <h3 className="text-2xl font-serif text-zinc-100 leading-tight">{item.name}</h3>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <span className="text-xl font-mono text-zinc-300">${item.price.toFixed(2)}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({ id: item.id, name: item.name, price: item.price, quantity: 1, type: 'menu' });
                        toast.success(language === 'fr' ? `${item.name} ajouté au panier` : `${item.name} added to cart`);
                      }}
                      className="w-10 h-10 bg-amber-500 text-zinc-950 rounded-full flex items-center justify-center hover:bg-amber-400 transition-colors shadow-lg"
                      aria-label={t.add[language]}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                {/* Back */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-zinc-800 border border-amber-500/30 rounded-2xl p-6 flex flex-col justify-center text-center">
                  <h4 className="text-amber-500 font-bold uppercase tracking-widest text-xs mb-4">{t.ingredients[language]}</h4>
                  <p className="text-zinc-300 font-serif text-lg leading-relaxed italic">
                    {item.description}
                  </p>
                  <button 
                    className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300"
                    onClick={(e) => toggleFlip(item.id, e)}
                  >
                    <Info size={18} />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
