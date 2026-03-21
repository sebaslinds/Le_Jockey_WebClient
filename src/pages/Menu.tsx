import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Info, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import { menuItems, menuCategories } from '../data/menu';
import { useStore } from '../store/useStore';

export function Menu() {
  const { language, addToCart } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string>(searchParams.get('category') || 'all');
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleAddToCart = (portion: 'simple' | 'double') => {
    if (!selectedItem) return;
    
    const finalPrice = portion === 'double' ? selectedItem.price + 3 : selectedItem.price;
    addToCart({ 
      id: selectedItem.id, 
      name: selectedItem.name, 
      price: finalPrice, 
      quantity: 1, 
      type: 'menu',
      alcohol_portion: portion
    });
    
    toast.success(language === 'fr' ? `${selectedItem.name} ajouté au panier` : `${selectedItem.name} added to cart`);
    setSelectedItem(null);
  };

  useEffect(() => {
    const category = searchParams.get('category');
    if (category && menuCategories.some(c => c.id === category)) {
      setActiveCategory(category);
    } else if (!category) {
      setActiveCategory('all');
    }
  }, [searchParams]);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    if (categoryId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryId);
    }
    setSearchParams(searchParams);
  };

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
      {/* Menu Header Banner */}
      <div 
        className="w-full h-48 md:h-64 lg:h-80 rounded-2xl mb-12 bg-cover bg-center bg-no-repeat border border-zinc-800"
        style={{ backgroundImage: "url('/menu-bg.jpg')" }}
      >
        {/* The image itself contains the word "MENU", so we remove the text title and description */}
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-12">
        <button
          onClick={() => handleCategoryChange('all')}
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
            onClick={() => handleCategoryChange(cat.id)}
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
                        setSelectedItem(item);
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

      {/* Portion Selection Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <h3 className="text-2xl font-serif text-amber-500 mb-2">{selectedItem.name}</h3>
              <p className="text-zinc-300 mb-6">
                {language === 'fr' ? 'Choisissez votre portion :' : 'Choose your portion:'}
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleAddToCart('simple')}
                  className="w-full flex justify-between items-center p-4 rounded-xl border border-zinc-700 hover:border-amber-500 hover:bg-amber-500/10 transition-all group"
                >
                  <span className="font-bold text-zinc-100 group-hover:text-amber-500">Simple</span>
                  <span className="font-mono text-zinc-400">${selectedItem.price.toFixed(2)}</span>
                </button>
                
                <button
                  onClick={() => handleAddToCart('double')}
                  className="w-full flex justify-between items-center p-4 rounded-xl border border-zinc-700 hover:border-amber-500 hover:bg-amber-500/10 transition-all group"
                >
                  <span className="font-bold text-zinc-100 group-hover:text-amber-500">Double (+3$)</span>
                  <span className="font-mono text-zinc-400">${(selectedItem.price + 3).toFixed(2)}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
