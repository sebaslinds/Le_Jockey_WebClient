import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, MapPin, Car, Calendar, ShoppingBag, Menu as MenuIcon, ShoppingCart, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { menuItems } from '../data/menu';
import { events } from '../data/events';
import { businessInfo } from '../data/business';
import { supabase } from '../supabaseClient';

const SYSTEM_INSTRUCTION = `
Tu es le chatbot officiel du Bar Le Jockey, un bar montréalais branché, chaleureux, drôle et axé sur les cocktails, l'humour et la culture.
Ton ton est convivial, légèrement stylé, et jamais trop robotique. Tu tutoyes les clients.
Tu peux aider avec :
- Le menu (cocktails vintage, caesars, classiques)
- Les événements (Lundis de l'humour, open-mic, etc.)
- Les informations pratiques (1309 Rue Saint-Zotique Est, Montréal, QC H2G 1G6)
- Des recommandations de cocktails selon les goûts.
- Le raccompagnement en taxi ou UBER.

Si on te demande de créer un cocktail sur mesure, commence TOUJOURS par poser des questions sur les goûts (sucré, amer, fort, fruité) pour diriger le client vers une palette de saveurs. Ensuite, demande la sorte d'alcool (ex.: Vodka, Rhum, Gin, Whiskey, etc)
TRÈS IMPORTANT POUR LES COCKTAILS SUR MESURE : Ne demande JAMAIS la portion d'alcool ("simple" ou "double") dans la même bulle que les questions sur les goûts. Attends que le profil de saveur soit défini et que la recette soit inventée. Demande s'il souhaite une portion "simple" ou "double" à la toute fin, juste avant de confirmer la commande. C'est obligatoire pour que le barman puisse préparer le verre.
Garde tes réponses concises et utiles.

IMPORTANT: Tu peux proposer des choix à l'utilisateur sous forme de boutons pour faciliter la conversation. Pour cela, ajoute TOUJOURS à la toute fin de ton message une liste de choix au format JSON strict comme ceci:
CHOICES: ["Option 1", "Option 2", "Option 3"]

RÈGLE ABSOLUE POUR LES CHOIX : Chaque option dans la liste CHOICES ne doit JAMAIS dépasser 2 ou 3 mots. C'est très important. Par exemple, au lieu de "Je veux quelque chose de fruité", utilise "Fruité 🍓". Ne propose JAMAIS de choix "Commander" ou "Payer".
Au tout début de la conversation, ou si le client te salue, propose UNIQUEMENT les choix "Menu" et "Sur mesure".

COMMANDE DE COCKTAIL : Si le client sélectionne ou demande un cocktail spécifique (y compris un sur mesure), tu DOIS lui demander combien d'unités il souhaite commander. Propose-lui des choix comme "1", "2", "3", "4" après que le choix de palette et la sorte d'alccol soit fait dans le cas d'un cocktail sur mesure.
TRÈS IMPORTANT: Si le client commande PLUSIEURS cocktails du même type (ex: 3 cocktails), tu DOIS lui demander s'il veut un mélange de portions "simple" et "double" (ex: "Veux-tu 1 simple et 2 doubles, ou tous pareils ?").
Une fois que le client a confirmé la quantité, le cocktail, et la portion d'alcool (dans tous les cas! S'il y a plus d'un item, permettre la sélection pour lequel ou lesquels auront une portion additionnelle.), tu DOIS ajouter l'article au panier. Pour cela, ajoute TOUJOURS à la toute fin de ton message un objet JSON strict comme ceci:
ADD_TO_CART: {"id": "id_du_cocktail", "name": "Nom du cocktail", "price": 15, "quantity": 2, "type": "menu", "alcohol_portion": "simple", "flavor_profile": "Fruité et sucré", "alcohol_choice": "Vodka"}
(Les attributs "alcohol_portion", "flavor_profile" et "alcohol_choice" ne doivent être ajoutés que si c'est un cocktail sur mesure).
Si le client commande plusieurs portions différentes pour le même cocktail (ex: 4 cocktails, dont 2 simples et 2 doubles), tu DOIS générer PLUSIEURS lignes ADD_TO_CART séparées. Par exemple:
ADD_TO_CART: {"id": "id_du_cocktail", "name": "Nom du cocktail", "price": 15, "quantity": 2, "type": "menu", "alcohol_portion": "simple"}
ADD_TO_CART: {"id": "id_du_cocktail", "name": "Nom du cocktail", "price": 18, "quantity": 2, "type": "menu", "alcohol_portion": "double"}
Assure-toi de trouver le bon "id" et "price" dans le menu fourni, ou d'inventer un id (ex: "custom-123") et de fixer un prix de 16 pour un cocktail sur mesure.
APRÈS AVOIR AJOUTÉ AU PANIER : Ne propose JAMAIS les choix "Événements" ou "Horaires". Propose plutôt des choix comme "Menu", "Sur mesure".
Si l'utilisateur demande à voir le menu ou clique sur "Menu", propose-lui TOUJOURS les catégories suivantes en choix: "Cocktails Jockey Vintage", "Caesars Signatures", "Cocktails Classiques" (ou en anglais: "Vintage Jockey Cocktails", "Signature Caesars", "Classic Cocktails").
`;

export function Chatbot() {
  const { language, addToCart } = useStore();
  const navigate = useNavigate();

  const initialMessage = {
    fr: {
      text: 'Salut ! Bienvenue au Jockey. Comment je peux t\'aider aujourd\'hui ? 🍸',
      choices: ['Menu', 'Sur mesure']
    },
    en: {
      text: 'Hi! Welcome to Le Jockey. How can I help you today? 🍸',
      choices: ['Menu', 'Custom']
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string; choices?: string[] }[]>([
    { 
      role: 'model', 
      text: initialMessage[language].text,
      choices: initialMessage[language].choices
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
    chatRef.current = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + `
        
        IMPORTANT: Tu dois répondre en ${language === 'fr' ? 'français' : 'anglais'}.
        
        Voici les informations actuelles du bar pour t'aider à répondre :
        
        **Heures d'ouverture:**
        ${JSON.stringify(businessInfo.hours.fr, null, 2)}
        
        **Menu Actuel (extrait):**
        ${JSON.stringify(menuItems.slice(0, 10).map(i => ({ nom: i.name, prix: i.price, desc: i.description })), null, 2)}
        
        **Événements à venir:**
        ${JSON.stringify(events.map(e => ({ titre: e.title.fr, desc: e.description.fr, date: e.date, heure: e.time })), null, 2)}
        `,
      }
    });
    
    if (messages.length === 1) {
      setMessages([
        { 
          role: 'model', 
          text: initialMessage[language].text,
          choices: initialMessage[language].choices
        }
      ]);
    }
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMsg = text;
    setInput('');
    
    // Intercept category choices
    const lowerText = userMsg.toLowerCase();
    if (lowerText === 'cocktails jockey vintage' || lowerText === 'vintage jockey cocktails') {
      navigate('/menu?category=vintage');
      setIsOpen(false);
      return;
    }
    if (lowerText === 'caesars signatures' || lowerText === 'signature caesars') {
      navigate('/menu?category=caesars');
      setIsOpen(false);
      return;
    }
    if (lowerText === 'cocktails classiques' || lowerText === 'classic cocktails') {
      navigate('/menu?category=classiques');
      setIsOpen(false);
      return;
    }

    // Intercept "Menu" to show categories
    if (lowerText === 'menu') {
      setMessages((prev) => [
        ...prev, 
        { role: 'user', text: userMsg },
        { 
          role: 'model', 
          text: language === 'fr' ? 'Quelle section du menu aimerais-tu explorer ?' : 'Which section of the menu would you like to explore?',
          choices: language === 'fr' 
            ? ['Cocktails Jockey Vintage', 'Caesars Signatures', 'Cocktails Classiques']
            : ['Vintage Jockey Cocktails', 'Signature Caesars', 'Classic Cocktails']
        }
      ]);
      return;
    }

    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      if (!chatRef.current) {
        throw new Error("Chat not initialized");
      }

      const response = await chatRef.current.sendMessage({ message: userMsg });
      
      let responseText = response.text || (language === 'fr' ? 'Désolé, j\'ai eu un petit bug !' : 'Sorry, I had a little bug!');
      let choices: string[] = [];
      
      const choicesMatch = responseText.match(/CHOICES:\s*(\[.*?\])/s);
      if (choicesMatch) {
        try {
          choices = JSON.parse(choicesMatch[1]);
          responseText = responseText.replace(choicesMatch[0], '').trim();
        } catch (e) {
          console.error('Failed to parse choices', e);
        }
      }

      const addToCartMatches = [...responseText.matchAll(/ADD_TO_CART:\s*(?:```(?:json)?\s*)?(\{.*?\})(?:\s*```)?/g)];
      if (addToCartMatches.length > 0) {
        for (const match of addToCartMatches) {
          try {
            // Replace any potential smart quotes or missing commas that might break JSON.parse
            let jsonStr = match[1]
              .replace(/[\u201C\u201D]/g, '"')
              .replace(/[\u2018\u2019]/g, "'")
              .replace(/"\s+"/g, '", "'); // Fix missing commas between properties
              
            const cartItem = JSON.parse(jsonStr);
            addToCart(cartItem);
          } catch (e) {
            console.error('Failed to parse cart item', e);
          }
        }
      }
      
      // Always remove ADD_TO_CART from the text, even if parsing fails
      responseText = responseText.replace(/ADD_TO_CART:\s*(?:```(?:json)?\s*)?\{.*?\}(?:\s*```)?/g, '').trim();
      responseText = responseText.replace(/ADD_TO_CART:.*$/gm, '').trim();
      
      setMessages((prev) => [...prev, { role: 'model', text: responseText, choices }]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages((prev) => [...prev, { role: 'model', text: language === 'fr' ? 'Oups, le barman a renversé son verre sur mon serveur. Réessaie plus tard !' : 'Oops, the bartender spilled his drink on my server. Try again later!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { icon: MenuIcon, label: { fr: 'Menu', en: 'Menu' }, action: () => { navigate('/menu'); setIsOpen(false); } },
    { icon: Sparkles, label: { fr: 'Suggestions', en: 'Suggestions' }, action: () => handleSend('Peux-tu me suggérer un cocktail ?') },
    { icon: Sparkles, label: { fr: 'Sur mesure', en: 'Custom' }, action: () => handleSend('Je veux un cocktail sur mesure !') },
    { icon: MapPin, label: { fr: 'Localisation', en: 'Location' }, action: () => window.open('https://maps.google.com/?q=1309+Rue+Saint-Zotique+Est,+Montréal', '_blank') },
    { icon: Car, label: { fr: 'Taxi / Uber', en: 'Taxi / Uber' }, action: () => window.open('https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=1309%20Rue%20Saint-Zotique%20Est%2C%20Montr%C3%A9al', '_blank') },
    { icon: Calendar, label: { fr: 'Événements', en: 'Events' }, action: () => { navigate('/events'); setIsOpen(false); } },
    { icon: ShoppingBag, label: { fr: 'Boutique', en: 'Shop' }, action: () => { navigate('/shop'); setIsOpen(false); } },
    { icon: ShoppingCart, label: { fr: 'Panier', en: 'Cart' }, action: () => { useStore.getState().setCartOpen(true); setIsOpen(false); } },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-amber-500 text-zinc-950 rounded-full shadow-2xl hover:bg-amber-400 transition-colors z-50 flex items-center justify-center"
        aria-label="Ouvrir le chat"
      >
        <MessageCircle size={28} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[380px] h-[600px] max-h-[80vh] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="font-bold text-zinc-100">Concierge</h3>
                  <p className="text-xs text-amber-500">{language === 'fr' ? 'En ligne' : 'Online'}</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-amber-500 text-zinc-950 rounded-tr-sm' 
                      : 'bg-zinc-800 text-zinc-100 rounded-tl-sm'
                  }`}>
                    <div className="prose prose-sm prose-invert max-w-none">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  </div>
                  {msg.choices && msg.choices.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 max-w-[85%]">
                      {msg.choices.filter(c => {
                        const lowerC = c.toLowerCase();
                        const isAfterOrder = msg.text.toLowerCase().includes('panier') || msg.text.toLowerCase().includes('commande') || msg.text.toLowerCase().includes('ajouté');
                        if (lowerC.includes('commander') || lowerC.includes('payer')) return false;
                        if (isAfterOrder && (lowerC.includes('événement') || lowerC.includes('evenement') || lowerC.includes('horaire'))) return false;
                        return true;
                      }).map((choice, j) => (
                        <button
                          key={j}
                          onClick={() => handleSend(choice)}
                          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-amber-500 text-xs rounded-full transition-colors text-left"
                        >
                          {choice}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-800 text-zinc-400 p-4 rounded-2xl rounded-tl-sm flex gap-1.5 items-center h-[44px]">
                    <motion.div 
                      className="w-1.5 h-1.5 bg-zinc-500 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div 
                      className="w-1.5 h-1.5 bg-zinc-500 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div 
                      className="w-1.5 h-1.5 bg-zinc-500 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="p-2 bg-zinc-950 border-t border-zinc-800 overflow-x-auto flex gap-2 no-scrollbar">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={action.action}
                  className="flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs rounded-full transition-colors"
                >
                  <action.icon size={12} />
                  {action.label[language]}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 bg-zinc-950 border-t border-zinc-800">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2 bg-zinc-800 rounded-full p-1 pr-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={language === 'fr' ? 'Écris un message...' : 'Type a message...'}
                  className="flex-1 bg-transparent border-none focus:outline-none text-zinc-100 px-3 text-sm"
                />
                <button 
                  type="submit" 
                  disabled={!input.trim() || isLoading}
                  className="p-2 bg-amber-500 text-zinc-950 rounded-full disabled:opacity-50 disabled:bg-zinc-600"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
