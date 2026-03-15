export interface ShopItem {
  id: string;
  name: { fr: string; en: string };
  description: { fr: string; en: string };
  price: number;
  image: string;
}

export const shopItems: ShopItem[] = [
  {
    id: 's1',
    name: { fr: 'T-Shirt Classique Jockey', en: 'Classic Jockey T-Shirt' },
    description: { fr: 'T-shirt noir avec le logo classique du Bar Le Jockey.', en: 'Black t-shirt with the classic Bar Le Jockey logo.' },
    price: 25.00,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 's2',
    name: { fr: 'Casquette Jockey', en: 'Jockey Cap' },
    description: { fr: 'Casquette brodée, parfaite pour cacher une mauvaise journée de cheveux.', en: 'Embroidered cap, perfect for hiding a bad hair day.' },
    price: 20.00,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 's3',
    name: { fr: 'Verre à Cocktail Jockey', en: 'Jockey Cocktail Glass' },
    description: { fr: 'Verre officiel pour recréer nos cocktails à la maison.', en: 'Official glass to recreate our cocktails at home.' },
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 's4',
    name: { fr: 'Affiche "Lundis de l\'Humour"', en: '"Comedy Mondays" Poster' },
    description: { fr: 'Affiche sérigraphiée en édition limitée.', en: 'Limited edition silkscreen poster.' },
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1583407723467-9b2d22504831?auto=format&fit=crop&q=80&w=800'
  }
];
