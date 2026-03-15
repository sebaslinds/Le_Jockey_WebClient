export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image?: string;
}

export const menuCategories = [
  { id: 'vintage', name: { fr: 'Cocktails Jockey Vintage', en: 'Vintage Jockey Cocktails' } },
  { id: 'caesars', name: { fr: 'Caesars Signatures', en: 'Signature Caesars' } },
  { id: 'classiques', name: { fr: 'Cocktails Classiques', en: 'Classic Cocktails' } },
];

export const menuItems: MenuItem[] = [
  // COCKTAILS JOCKEY VINTAGE
  { id: 'v1', name: 'Fête Foraine', price: 15.5, description: 'Gin, Citron, Sucre, Barbe à Papa, Soda', category: 'vintage' },
  { id: 'v2', name: 'Habana Ruby', price: 15.5, description: 'Rhum Blanc, Purée de Framboise, Menthe, Sucre, Lime, Soda', category: 'vintage' },
  { id: 'v3', name: 'Xalapa', price: 16, description: 'Tequila, Liqueur de Poire Belle de Brillet, Jalapeno, Sucre, Lime', category: 'vintage' },
  { id: 'v4', name: 'Peter’s Cup', price: 15.5, description: 'Gin, Pimm’s, Citron, Sucre, Concombre, Soda', category: 'vintage' },
  { id: 'v5', name: 'Lafayette', price: 17, description: 'Bourbon, Chartreuse, Concombre, Sucre, Citron, Poivre, Soda', category: 'vintage' },
  { id: 'v6', name: 'Tokyo Express', price: 15, description: 'Saké, Campari, Fleur de Sureau, Citron, Sucre, Blanc d’Oeuf', category: 'vintage' },
  { id: 'v7', name: 'Orange Lindsay', price: 16, description: 'Rhum Épicé Chic Choc, Liqueur de Mandarine, Cube de Sucre Blanc, Orange, Citron à Flambée d’Angostura et Rhum Overproof', category: 'vintage' },
  { id: 'v8', name: 'Poire Picole', price: 16, description: 'Rhum Blanc, Belle de Brillet, Pimm’s, Citron, Sirop d’Érable Canadien, Soda', category: 'vintage' },

  // CAESARS SIGNATURES
  { id: 'c1', name: 'Caraï-Bloody', price: 15, description: 'Rhum Épicé Chic Choc, Clamato, Ananas, Sauce Worcestershire, Tabasco, Citron, Rim Cannelle Épicée', category: 'caesars' },
  { id: 'c2', name: 'Smokey Caesar', price: 16, description: 'Vodka, Clamato, Tabasco Chipotle, Sauce Worcestershire, Rim d’Épices à Steak, Flocons de Bacon, Saucisson Pork Chop', category: 'caesars' },
  { id: 'c3', name: 'Bloody Surfer', price: 15, description: 'Tequila, Clamato, Lime, Tabasco Jalapeno, Sauce Worcestershire, Bière Blonde, Chips de Maïs, Rim De Gras Sel', category: 'caesars' },
  { id: 'c4', name: 'Shogun', price: 17, description: 'Saké, Gin, Sauce Caesar, Wasabi, Soya, Sriracha, Citron, Gingembre, Huile Sésame, Rim Shogun maison', category: 'caesars' },

  // COCKTAILS CLASSIQUES
  { id: 'cl1', name: 'Gimlet Concombre', price: 15, description: 'Gin, Concombre, Lime, Sucre', category: 'classiques' },
  { id: 'cl2', name: 'Martini Gin / Vodka', price: 16, description: 'Vermouth Blanc, Olive + Dirty', category: 'classiques' },
  { id: 'cl3', name: 'Negroni', price: 16, description: 'Gin, Campari, Vermouth Rouge', category: 'classiques' },
  { id: 'cl4', name: 'Old Fashioned', price: 16, description: 'Bourbon, Cube de Sucre Blanc, Zeste d’Orange, Angostura', category: 'classiques' },
  { id: 'cl5', name: 'Espresso Martini', price: 15, description: 'Vodka, Liqueur de Café, Café, Sucre', category: 'classiques' },
  { id: 'cl6', name: 'Piña Colada', price: 16, description: 'Rhum Brun, Lait de Coco, Sucre, Ananas, Cerises Marasquin, Coconut', category: 'classiques' },
  { id: 'cl7', name: 'Tom Collins', price: 15, description: 'Gin, Citron, Sucre, Soda', category: 'classiques' },
  { id: 'cl8', name: 'Margarita Épicée', price: 15, description: 'Tequila, Liqueur d’Orange, Lime, Sel + Avec Glace/Sans Glace', category: 'classiques' },
  { id: 'cl9', name: 'Corpse Reviver', price: 16, description: 'Gin, Absinthe, Liqueur d’Orange, Lillet Blanc, Citron', category: 'classiques' },
  { id: 'cl10', name: 'Mojito', price: 15, description: 'Rhum Blanc, Sucre de Canne Brut, Lime, Menthe, Soda, Angostura', category: 'classiques' },
  { id: 'cl11', name: 'Last Word', price: 17, description: 'Gin, Chartreuse, Maraschino, Lime', category: 'classiques' },
  { id: 'cl12', name: 'Aperol Spritz', price: 14, description: 'Aperol, Prosecco, Soda, Orange', category: 'classiques' },
  { id: 'cl13', name: 'Mai Tai', price: 16, description: 'Rhum Brun & Blanc, Liqueur d’Orange, Sirop d’Orgeat, Lime, Menthe', category: 'classiques' },
  { id: 'cl14', name: 'Caïpirinha', price: 15, description: 'Cachaça, Lime, Sucre de Canne', category: 'classiques' },
  { id: 'cl15', name: 'Daiquiri', price: 15, description: 'Rhum Brun, Lime, Sucre + Avec Glace/Sans Glace', category: 'classiques' },
  { id: 'cl16', name: 'Cosmopolitain', price: 15, description: 'Vodka, Liqueur d’Orange, Lime, Cranberry', category: 'classiques' },
  { id: 'cl17', name: 'Mint Julep', price: 15.5, description: 'Bourbon, Menthe, Sucre, Glace Concassée', category: 'classiques' },
  { id: 'cl18', name: 'Ti-Punch', price: 15, description: 'Rhum Agricole St-James Brun, Sucre de Canne, Lime', category: 'classiques' },
  { id: 'cl19', name: 'Zombie', price: 16, description: 'Rhum Blanc & Brun, Abricot Brandy, Ananas, Pamplemousse, Lime, Sucre, Grenadine', category: 'classiques' },
  { id: 'cl20', name: 'Long Island Iced Tea', price: 16, description: 'Vodka, Rhum, Gin, Tequila, Triple Sec, Citron, Cola', category: 'classiques' },
];
