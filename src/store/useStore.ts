import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'fr' | 'en';

export interface CartItem {
  id: string;
  name: { fr: string; en: string } | string;
  price: number;
  quantity: number;
  type: 'menu' | 'shop';
  alcohol_portion?: 'simple' | 'double';
  flavor_profile?: string;
  alcohol_choice?: string;
}

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setCartOpen: (isOpen: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'fr',
      setLanguage: (lang) => set({ language: lang }),
      cart: [],
      addToCart: (item) =>
        set((state) => {
          const getCartItemKey = (i: CartItem) => 
            `${i.id}-${i.alcohol_portion || 'none'}-${i.flavor_profile || 'none'}-${i.alcohol_choice || 'none'}`;
          
          const itemKey = getCartItemKey(item);
          const existing = state.cart.find((i) => getCartItemKey(i) === itemKey);
          
          if (existing) {
            return {
              cart: state.cart.map((i) =>
                getCartItemKey(i) === itemKey ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
              isCartOpen: true,
            };
          }
          return { cart: [...state.cart, item], isCartOpen: true };
        }),
      removeFromCart: (itemKeyToRemove) =>
        set((state) => {
          const getCartItemKey = (i: CartItem) => 
            `${i.id}-${i.alcohol_portion || 'none'}-${i.flavor_profile || 'none'}-${i.alcohol_choice || 'none'}`;
          return { cart: state.cart.filter((i) => getCartItemKey(i) !== itemKeyToRemove) };
        }),
      updateQuantity: (itemKeyToUpdate, quantity) =>
        set((state) => {
          const getCartItemKey = (i: CartItem) => 
            `${i.id}-${i.alcohol_portion || 'none'}-${i.flavor_profile || 'none'}-${i.alcohol_choice || 'none'}`;
          return {
            cart: state.cart.map((i) => (getCartItemKey(i) === itemKeyToUpdate ? { ...i, quantity } : i)),
          };
        }),
      clearCart: () => set({ cart: [] }),
      isCartOpen: false,
      setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
    }),
    {
      name: 'jockey-storage',
      partialize: (state) => ({ cart: state.cart, language: state.language }),
    }
  )
);
