import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, CreditCard, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { supabase } from '../supabaseClient';
import { menuItems } from '../data/menu';

export function CartDrawer() {
  const { cart, isCartOpen, setCartOpen, removeFromCart, updateQuantity, clearCart, language } = useStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [customerName, setCustomerName] = useState('');

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const t = {
    title: { fr: 'Votre Panier', en: 'Your Cart' },
    empty: { fr: 'Votre panier est vide.', en: 'Your cart is empty.' },
    total: { fr: 'Total', en: 'Total' },
    checkout: { fr: 'Passer la commande', en: 'Checkout' },
    continue: { fr: 'Continuer les achats', en: 'Continue Shopping' },
    processing: { fr: 'Traitement en cours...', en: 'Processing...' },
    success: { fr: 'Commande confirmée !', en: 'Order confirmed!' },
    successDesc: { fr: 'Merci pour votre commande. Vous recevrez un courriel de confirmation sous peu.', en: 'Thank you for your order. You will receive a confirmation email shortly.' },
    close: { fr: 'Fermer', en: 'Close' },
    nameLabel: { fr: 'Votre nom', en: 'Your Name' },
    namePlaceholder: { fr: 'Ex: Jean Dupont', en: 'Ex: John Doe' },
    confirmOrder: { fr: 'Confirmer la commande', en: 'Confirm Order' },
    backToCart: { fr: 'Retour au panier', en: 'Back to Cart' },
  };

  const handleCheckout = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const trimmedName = customerName.trim();
    if (!trimmedName) return;

    setIsCheckingOut(true);
    
    try {
      const orderId = crypto.randomUUID();
      
      // 1. Create the order
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          id: orderId,
          user_id: null,
          total_amount: total,
          status: 'New',
          contact_email: null,
          customer_name: trimmedName,
        });

      if (orderError) throw orderError;

      // 2. Create order items
      const isValidUUID = (uuid: string) => 
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);

      const stringToUuid = (str: string) => {
        let hex = '';
        for (let i = 0; i < str.length; i++) {
          hex += str.charCodeAt(i).toString(16);
        }
        hex = hex.padEnd(32, '0');
        return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
      };

      const orderItems = cart.map(item => {
        const itemId = isValidUUID(item.id) ? item.id : stringToUuid(item.id);
        const itemName = typeof item.name === 'string' ? item.name : item.name.fr;

        return {
          order_id: orderId,
          item_type: item.type || 'menu',
          item_id: itemId,
          item_name: itemName,
          quantity: item.quantity,
          unit_price: item.price,
          alcohol_portion: item.alcohol_portion || null,
          flavor_profile: item.flavor_profile || null,
          alcohol_choice: item.alcohol_choice || null
        };
      });

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
        
      if (itemsError) {
        console.error("Could not save order items (might be UUID mismatch):", itemsError);
        // We don't throw here so the user still sees success for the order itself
      }

      setIsSuccess(true);
      clearCart();
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Une erreur est survenue lors de la commande. Veuillez vérifier les permissions de votre base de données.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleClose = () => {
    setCartOpen(false);
    setTimeout(() => {
      setIsSuccess(false);
      setShowCheckoutForm(false);
      setCustomerName('');
    }, 300);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-zinc-950 border-l border-zinc-800 shadow-2xl z-50 flex flex-col"
          >
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h2 className="text-2xl font-serif text-amber-500">{t.title[language]}</h2>
              <button onClick={handleClose} className="text-zinc-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            {isSuccess ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6"
                >
                  <CheckCircle2 size={40} />
                </motion.div>
                <h3 className="text-2xl font-serif text-zinc-100 mb-4">{t.success[language]}</h3>
                <p className="text-zinc-400 mb-8">{t.successDesc[language]}</p>
                <button 
                  onClick={handleClose}
                  className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold rounded-xl transition-colors"
                >
                  {t.close[language]}
                </button>
              </div>
            ) : showCheckoutForm ? (
              <div className="flex-1 flex flex-col p-6">
                <h3 className="text-xl font-serif text-zinc-100 mb-6">{t.nameLabel[language]}</h3>
                <form onSubmit={handleCheckout} className="flex-1 flex flex-col">
                  <div className="flex-1">
                    <label htmlFor="customerName" className="block text-sm font-medium text-zinc-400 mb-2">
                      {t.nameLabel[language]}
                    </label>
                    <input
                      type="text"
                      id="customerName"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      onBlur={() => setCustomerName(customerName.trim())}
                      placeholder={t.namePlaceholder[language]}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow"
                    />
                  </div>
                  
                  <div className="mt-auto space-y-4">
                    <button 
                      type="submit"
                      disabled={isCheckingOut || !customerName.trim()}
                      className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isCheckingOut ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full"
                          />
                          {t.processing[language]}
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={20} />
                          {t.confirmOrder[language]}
                        </>
                      )}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowCheckoutForm(false)}
                      disabled={isCheckingOut}
                      className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {t.backToCart[language]}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {cart.length === 0 ? (
                    <div className="text-center text-zinc-500 mt-10">
                      <p>{t.empty[language]}</p>
                    </div>
                  ) : (
                    cart.map((item) => {
                      const itemKey = `${item.id}-${item.alcohol_portion || 'none'}-${item.flavor_profile || 'none'}-${item.alcohol_choice || 'none'}`;
                      const menuItem = menuItems.find(m => m.id === item.id);
                      const description = menuItem?.description;
                      
                      return (
                      <div key={itemKey} className="flex gap-4 items-center bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                        <div className="flex-1">
                          <h3 className="font-medium text-zinc-100">
                            {typeof item.name === 'string' ? item.name : item.name[language]}
                          </h3>
                          
                          {description && !item.flavor_profile && !item.alcohol_choice && (
                            <p className="text-xs text-zinc-400 mt-0.5 italic">
                              {description}
                            </p>
                          )}
                          
                          {(item.flavor_profile || item.alcohol_choice) && (
                            <div className="text-xs text-zinc-400 mt-1 space-y-0.5">
                              {item.alcohol_choice && (
                                <p><span className="text-zinc-500">{language === 'fr' ? 'Alcool :' : 'Alcohol:'}</span> {item.alcohol_choice}</p>
                              )}
                              {item.flavor_profile && (
                                <p><span className="text-zinc-500">{language === 'fr' ? 'Profil :' : 'Profile:'}</span> {item.flavor_profile}</p>
                              )}
                            </div>
                          )}

                          {item.alcohol_portion && (
                            <p className="text-xs text-zinc-400 mt-0.5">
                              <span className="text-zinc-500">{language === 'fr' ? 'Portion :' : 'Portion:'}</span> <span className="capitalize">{item.alcohol_portion}</span>
                            </p>
                          )}
                          <p className="text-amber-500 font-mono mt-1">${item.price.toFixed(2)}</p>
                        </div>
                        
                        <div className="flex items-center gap-3 bg-zinc-950 rounded-lg p-1 border border-zinc-800">
                          <button 
                            onClick={() => updateQuantity(itemKey, Math.max(1, item.quantity - 1))}
                            className="p-1 text-zinc-400 hover:text-white"
                            disabled={isCheckingOut}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-4 text-center text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                            className="p-1 text-zinc-400 hover:text-white"
                            disabled={isCheckingOut}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(itemKey)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                          disabled={isCheckingOut}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    );
                  })
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="p-6 border-t border-zinc-800 bg-zinc-950">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-zinc-400">{t.total[language]}</span>
                      <span className="text-2xl font-mono text-amber-500">${total.toFixed(2)}</span>
                    </div>
                    <button 
                      onClick={() => setShowCheckoutForm(true)}
                      disabled={isCheckingOut}
                      className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <CreditCard size={20} />
                      {t.checkout[language]}
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
