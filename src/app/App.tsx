import { useState } from 'react';
import { MapPin, ShoppingCart, Mic, Utensils, Pizza, Leaf, IceCream, ChefHat, Soup, Croissant, Coffee, UtensilsCrossed, UserCircle } from 'lucide-react';
import { VoiceAssistant } from './components/VoiceAssistant';
import { FoodCard } from './components/FoodCard';
import { LocationSelector } from './components/LocationSelector';
import { Cart, CartItem } from './components/Cart';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { Profile } from './components/Profile';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  icon: JSX.Element;
}

interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  deliveryTime: string;
  image: string;
  category: string;
  badge?: string;
}

const categories: Category[] = [
  { id: 'all', name: 'All', icon: <Utensils className="w-4 h-4" /> },
  { id: 'appetizers', name: 'Appetizers', icon: <UtensilsCrossed className="w-4 h-4" /> },
  { id: 'soups', name: 'Soups & Salads', icon: <Soup className="w-4 h-4" /> },
  { id: 'breads', name: 'Breads', icon: <Croissant className="w-4 h-4" /> },
  { id: 'biryani', name: 'Biryanis', icon: <ChefHat className="w-4 h-4" /> },
  { id: 'veg-curries', name: 'Veg Curries', icon: <Leaf className="w-4 h-4" /> },
  { id: 'non-veg', name: 'Non-Veg', icon: <Pizza className="w-4 h-4" /> },
  { id: 'south-indian', name: 'South Indian', icon: <Utensils className="w-4 h-4" /> },
  { id: 'street-food', name: 'Street Food', icon: <ChefHat className="w-4 h-4" /> },
  { id: 'rice', name: 'Rice Varieties', icon: <Utensils className="w-4 h-4" /> },
  { id: 'desserts', name: 'Desserts', icon: <IceCream className="w-4 h-4" /> },
  { id: 'beverages', name: 'Beverages', icon: <Coffee className="w-4 h-4" /> },
];

const foodItems: FoodItem[] = [
  // Appetizers / Starters
  {
    id: 1,
    name: 'Paneer Tikka',
    description: 'Grilled spiced cottage cheese marinated in yogurt and aromatic spices',
    price: 8.99,
    rating: 4.7,
    deliveryTime: '15-20 min',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYW5lZXIlMjB0aWtrYSUyMGdyaWxsZWR8ZW58MXx8fHwxNzY3NzE3MTg1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'appetizers',
    badge: 'Popular',
  },
  {
    id: 2,
    name: 'Chicken 65',
    description: 'Deep-fried spicy chicken bites with curry leaves and green chilies',
    price: 9.99,
    rating: 4.8,
    deliveryTime: '15-20 min',
    image: 'https://images.unsplash.com/photo-1690519315565-c31ce99f8d58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwNjUlMjBmcmllZHxlbnwxfHx8fDE3Njc3MTcxODR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'appetizers',
    badge: 'Bestseller',
  },
  {
    id: 3,
    name: 'Samosa',
    description: 'Crispy potato and peas stuffed pastry triangles with tamarind chutney',
    price: 4.99,
    rating: 4.6,
    deliveryTime: '10-15 min',
    image: 'https://images.unsplash.com/photo-1697155836252-d7f969108b5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW1vc2ElMjBpbmRpYW4lMjBzbmFja3xlbnwxfHx8fDE3Njc2MTIzMDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'appetizers',
  },
  {
    id: 4,
    name: 'Onion Bhaji',
    description: 'Crispy onion fritters with chickpea flour and Indian spices',
    price: 5.99,
    rating: 4.5,
    deliveryTime: '10-15 min',
    image: 'https://images.unsplash.com/photo-1666190091191-0cd0c5c8c5b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWtvcmElMjBmcml0dGVyc3xlbnwxfHx8fDE3Njc2OTY1NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'appetizers',
  },
  {
    id: 5,
    name: 'Fish Amritsari',
    description: 'Battered and fried fish starter with carom seeds and spices',
    price: 11.99,
    rating: 4.7,
    deliveryTime: '15-20 min',
    image: 'https://images.unsplash.com/photo-1620894580123-466ad3a0ca06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwY3VycnklMjBrZXJhbGF8ZW58MXx8fHwxNzY3NzE3MTg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'appetizers',
  },

  // Soups & Salads
  {
    id: 6,
    name: 'Mulligatawny Soup',
    description: 'Spiced lentil soup with vegetables and aromatic Indian spices',
    price: 5.99,
    rating: 4.5,
    deliveryTime: '10-15 min',
    image: 'https://images.unsplash.com/photo-1730312382513-62e9454f4797?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYXNhbSUyMHNvdXAlMjB0b21hdG98ZW58MXx8fHwxNzY3NzE3MTkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'soups',
  },
  {
    id: 7,
    name: 'Kachumber Salad',
    description: 'Fresh cucumber, tomato, and onion salad with lemon dressing',
    price: 4.99,
    rating: 4.4,
    deliveryTime: '5-10 min',
    image: 'https://images.unsplash.com/photo-1677653805080-59c57727c84e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxhZCUyMGZyZXNoJTIwdmVnZXRhYmxlc3xlbnwxfHx8fDE3Njc2NjIzMTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'soups',
    badge: 'Healthy',
  },
  {
    id: 8,
    name: 'Rasam',
    description: 'Tangy South-Indian tomato and tamarind soup with spices',
    price: 4.99,
    rating: 4.6,
    deliveryTime: '10-15 min',
    image: 'https://images.unsplash.com/photo-1730312382513-62e9454f4797?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYXNhbSUyMHNvdXAlMjB0b21hdG98ZW58MXx8fHwxNzY3NzE3MTkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'soups',
  },

  // Breads & Wraps
  {
    id: 9,
    name: 'Plain Naan',
    description: 'Tandoori leavened bread, soft and fluffy',
    price: 2.99,
    rating: 4.7,
    deliveryTime: '10-15 min',
    image: 'https://images.unsplash.com/photo-1763951718950-c536b1295213?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWFuJTIwYnJlYWQlMjB0YW5kb29yfGVufDF8fHx8MTc2NzcxNzE5MHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'breads',
  },
  {
    id: 10,
    name: 'Roti / Chapati',
    description: 'Whole-wheat flatbread, freshly made',
    price: 1.99,
    rating: 4.6,
    deliveryTime: '10-15 min',
    image: 'https://images.unsplash.com/photo-1763951719324-d1ff7eff0f7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3RpJTIwY2hhcGF0aSUyMGZsYXRicmVhZHxlbnwxfHx8fDE3Njc3MTcxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'breads',
  },
  {
    id: 11,
    name: 'Malabar Parotta',
    description: 'Flaky layered Kerala-style bread',
    price: 3.99,
    rating: 4.8,
    deliveryTime: '15-20 min',
    image: 'https://images.unsplash.com/photo-1634976997107-8cfa3b4ec10f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJvdHRhJTIwa2VyYWxhJTIwYnJlYWR8ZW58MXx8fHwxNzY3NzE3MTkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'breads',
    badge: 'Popular',
  },
  {
    id: 12,
    name: 'Masala Dosa',
    description: 'Thin fermented rice-lentil crepe with spiced potato filling',
    price: 7.99,
    rating: 4.9,
    deliveryTime: '15-20 min',
    image: 'https://images.unsplash.com/photo-1708146464361-5c5ce4f9abb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXNhbGElMjBkb3NhJTIwaW5kaWFufGVufDF8fHx8MTc2NzYxNDEzOHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'south-indian',
    badge: 'Bestseller',
  },

  // Rice & Biryanis
  {
    id: 13,
    name: 'Vegetable Biryani',
    description: 'Fragrant basmati rice with mixed vegetables and aromatic spices',
    price: 11.99,
    rating: 4.6,
    deliveryTime: '25-30 min',
    image: 'https://images.unsplash.com/photo-1666190092689-e3968aa0c32c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ5YW5pJTIwcmljZSUyMGluZGlhbnxlbnwxfHx8fDE3Njc3MTcxODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'biryani',
  },
  {
    id: 14,
    name: 'Chicken Biryani',
    description: 'Hyderabadi-style aromatic rice with tender chicken and whole spices',
    price: 13.99,
    rating: 4.9,
    deliveryTime: '30-35 min',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYmlyeWFuaXxlbnwxfHx8fDE3Njc2ODQ3Njd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'biryani',
    badge: 'Bestseller',
  },
  {
    id: 15,
    name: 'Egg Biryani',
    description: 'Flavorful rice layered with boiled eggs and spices',
    price: 10.99,
    rating: 4.5,
    deliveryTime: '20-25 min',
    image: 'https://images.unsplash.com/photo-1666190092689-e3968aa0c32c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ5YW5pJTIwcmljZSUyMGluZGlhbnxlbnwxfHx8fDE3Njc3MTcxODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'biryani',
  },
  {
    id: 16,
    name: 'Lemon Rice',
    description: 'South-Indian style tangy rice with lemon, peanuts and curry leaves',
    price: 6.99,
    rating: 4.5,
    deliveryTime: '15-20 min',
    image: 'https://images.unsplash.com/photo-1552033809-48a1213d359d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZW1vbiUyMHJpY2UlMjBzb3V0aHxlbnwxfHx8fDE3Njc3MTcxODF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'rice',
  },
  {
    id: 17,
    name: 'Tomato Rice',
    description: 'Flavorful rice cooked with tomatoes and South-Indian spices',
    price: 6.99,
    rating: 4.4,
    deliveryTime: '15-20 min',
    image: 'https://images.unsplash.com/photo-1552033809-48a1213d359d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZW1vbiUyMHJpY2UlMjBzb3V0aHxlbnwxfHx8fDE3Njc3MTcxODF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'rice',
  },

  // Veg Curries
  {
    id: 18,
    name: 'Paneer Butter Masala',
    description: 'Cottage cheese in rich creamy tomato gravy',
    price: 10.99,
    rating: 4.8,
    deliveryTime: '20-25 min',
    image: 'https://images.unsplash.com/photo-1701579231378-3726490a407b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYW5lZXIlMjBidXR0ZXIlMjBtYXNhbGF8ZW58MXx8fHwxNzY3NzEzMDE3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'veg-curries',
    badge: 'Popular',
  },
  {
    id: 19,
    name: 'Chana Masala',
    description: 'Chickpea curry with onion-tomato gravy and aromatic spices',
    price: 8.99,
    rating: 4.6,
    deliveryTime: '20-25 min',
    image: 'https://images.unsplash.com/photo-1587033649773-5c231faa21e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFuYSUyMG1hc2FsYSUyMGNoaWNrcGVhc3xlbnwxfHx8fDE3Njc3MTcxODJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'veg-curries',
  },
  {
    id: 20,
    name: 'Aloo Gobi',
    description: 'Potato and cauliflower dry curry with Indian spices',
    price: 8.99,
    rating: 4.5,
    deliveryTime: '20-25 min',
    image: 'https://images.unsplash.com/photo-1640542509430-f529fdfce835?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbG9vJTIwZ29iaSUyMGN1cnJ5fGVufDF8fHx8MTc2NzcxNzE4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'veg-curries',
  },
  {
    id: 21,
    name: 'Dal Tadka',
    description: 'Yellow lentils tempered with ghee, cumin, and garlic',
    price: 7.99,
    rating: 4.7,
    deliveryTime: '15-20 min',
    image: 'https://images.unsplash.com/photo-1587033649773-5c231faa21e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFuYSUyMG1hc2FsYSUyMGNoaWNrcGVhc3xlbnwxfHx8fDE3Njc3MTcxODJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'veg-curries',
  },

  // Non-Veg Curries
  {
    id: 22,
    name: 'Butter Chicken',
    description: 'Tender chicken in rich tomato-butter gravy with cream',
    price: 13.99,
    rating: 4.9,
    deliveryTime: '25-30 min',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXR0ZXIlMjBjaGlja2VuJTIwY3Vycnl8ZW58MXx8fHwxNzY3NjUzODAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'non-veg',
    badge: 'Bestseller',
  },
  {
    id: 23,
    name: 'Mutton Rogan Josh',
    description: 'Kashmiri mutton curry with aromatic spices and yogurt',
    price: 15.99,
    rating: 4.7,
    deliveryTime: '30-35 min',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXR0ZXIlMjBjaGlja2VuJTIwY3Vycnl8ZW58MXx8fHwxNzY3NjUzODAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'non-veg',
  },
  {
    id: 24,
    name: 'Prawn Curry',
    description: 'Coastal style shrimp curry with coconut and spices',
    price: 14.99,
    rating: 4.6,
    deliveryTime: '25-30 min',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXR0ZXIlMjBjaGlja2VuJTIwY3Vycnl8ZW58MXx8fHwxNzY3NjUzODAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'non-veg',
  },
  {
    id: 25,
    name: 'Kerala Fish Curry',
    description: 'Coconut-tamarind based fish curry with curry leaves',
    price: 13.99,
    rating: 4.7,
    deliveryTime: '25-30 min',
    image: 'https://images.unsplash.com/photo-1620894580123-466ad3a0ca06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwY3VycnklMjBrZXJhbGF8ZW58MXx8fHwxNzY3NzE3MTg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'non-veg',
  },
  {
    id: 26,
    name: 'Chettinad Chicken',
    description: 'Spicy aromatic Tamil Nadu curry with freshly ground spices',
    price: 13.99,
    rating: 4.8,
    deliveryTime: '25-30 min',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXR0ZXIlMjBjaGlja2VuJTIwY3Vycnl8ZW58MXx8fHwxNzY3NjUzODAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'non-veg',
  },

  // South-Indian Breakfast
  {
    id: 27,
    name: 'Idli with Sambar',
    description: 'Steamed rice-lentil cakes served with sambar and chutney',
    price: 5.99,
    rating: 4.7,
    deliveryTime: '15-20 min',
    image: 'https://images.unsplash.com/photo-1644289450169-bc58aa16bacb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpZGxpJTIwc2FtYmFyJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2NzcxNzE3OHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'south-indian',
    badge: 'Healthy',
  },
  {
    id: 28,
    name: 'Medu Vada',
    description: 'Crispy lentil doughnut served with sambar and chutney',
    price: 5.99,
    rating: 4.6,
    deliveryTime: '15-20 min',
    image: 'https://images.unsplash.com/photo-1666190091191-0cd0c5c8c5b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWtvcmElMjBmcml0dGVyc3xlbnwxfHx8fDE3Njc2OTY1NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'south-indian',
  },
  {
    id: 29,
    name: 'Uttapam',
    description: 'Thick pancake topped with onions, tomatoes and green chilies',
    price: 6.99,
    rating: 4.5,
    deliveryTime: '15-20 min',
    image: 'https://images.unsplash.com/photo-1630441508966-431c08536d1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1dHRhcGFtJTIwcGFuY2FrZXxlbnwxfHx8fDE3Njc3MTcxNzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'south-indian',
  },
  {
    id: 30,
    name: 'Ven Pongal',
    description: 'Comforting rice and moong dal dish with ghee and pepper',
    price: 6.99,
    rating: 4.6,
    deliveryTime: '15-20 min',
    image: 'https://images.unsplash.com/photo-1707270686195-7415251cc9c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb25nYWwlMjByaWNlJTIwZGlzaHxlbnwxfHx8fDE3Njc3MTcxNzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'south-indian',
  },
  {
    id: 31,
    name: 'Mysore Masala Dosa',
    description: 'Crispy dosa with spicy red chutney and potato filling',
    price: 8.99,
    rating: 4.8,
    deliveryTime: '20-25 min',
    image: 'https://images.unsplash.com/photo-1708146464361-5c5ce4f9abb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXNhbGElMjBkb3NhJTIwaW5kaWFufGVufDF8fHx8MTc2NzYxNDEzOHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'south-indian',
    badge: 'Popular',
  },
  {
    id: 32,
    name: 'Rava Dosa',
    description: 'Crispy semolina crepe with onions and cumin',
    price: 7.99,
    rating: 4.6,
    deliveryTime: '15-20 min',
    image: 'https://images.unsplash.com/photo-1695666403934-5929e4690900?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFpbiUyMGRvc2ElMjBzb3V0aCUyMGluZGlhbnxlbnwxfHx8fDE3Njc3MTcxNzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'south-indian',
  },
  {
    id: 33,
    name: 'Appam with Stew',
    description: 'Soft lacy rice pancakes served with vegetable stew',
    price: 8.99,
    rating: 4.7,
    deliveryTime: '20-25 min',
    image: 'https://images.unsplash.com/photo-1644289450169-bc58aa16bacb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpZGxpJTIwc2FtYmFyJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2NzcxNzE3OHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'south-indian',
  },
  {
    id: 34,
    name: 'Upma',
    description: 'Savory semolina porridge with vegetables and spices',
    price: 5.99,
    rating: 4.4,
    deliveryTime: '10-15 min',
    image: 'https://images.unsplash.com/photo-1644289450169-bc58aa16bacb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cG1hJTIwYnJlYWtmYXN0JTIwaW5kaWFufGVufDF8fHx8MTc2NzcxNzE4MHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'south-indian',
  },

  // Street Food
  {
    id: 35,
    name: 'Pav Bhaji',
    description: 'Mumbai-style mashed vegetables served with buttered buns',
    price: 7.99,
    rating: 4.8,
    deliveryTime: '15-20 min',
    image: 'https://images.unsplash.com/photo-1591200571589-195fc9ce8742?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXYlMjBiaGFqaSUyMG11bWJhaXxlbnwxfHx8fDE3Njc3MTcxODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'street-food',
    badge: 'Popular',
  },
  {
    id: 36,
    name: 'Vada Pav',
    description: 'Potato fritter sandwich in soft bun with chutneys',
    price: 4.99,
    rating: 4.7,
    deliveryTime: '10-15 min',
    image: 'https://images.unsplash.com/photo-1554978991-33ef7f31d658?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YWRhJTIwcGF2JTIwc3RyZWV0fGVufDF8fHx8MTc2NzcxNzE4Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'street-food',
  },
  {
    id: 37,
    name: 'Pani Puri',
    description: 'Crispy hollow puris filled with spiced water and potato',
    price: 5.99,
    rating: 4.9,
    deliveryTime: '10-15 min',
    image: 'https://images.unsplash.com/photo-1649140041688-0f75446e707e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYW5pJTIwcHVyaSUyMGdvbGdhcHBhfGVufDF8fHx8MTc2NzcxNzE4N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'street-food',
    badge: 'Bestseller',
  },
  {
    id: 38,
    name: 'Bhel Puri',
    description: 'Chaat with puffed rice, vegetables, tamarind and mint chutney',
    price: 5.99,
    rating: 4.6,
    deliveryTime: '10-15 min',
    image: 'https://images.unsplash.com/photo-1649140041688-0f75446e707e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYW5pJTIwcHVyaSUyMGdvbGdhcHBhfGVufDF8fHx8MTc2NzcxNzE4N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'street-food',
  },

  // Rice Varieties
  {
    id: 39,
    name: 'Curd Rice',
    description: 'Comforting South-Indian rice mixed with yogurt and tempering',
    price: 5.99,
    rating: 4.5,
    deliveryTime: '10-15 min',
    image: 'https://images.unsplash.com/photo-1633383718081-22ac93e3db65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXJkJTIwcmljZSUyMHlvZ3VydHxlbnwxfHx8fDE3Njc3MTcxODF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'rice',
    badge: 'Healthy',
  },
  {
    id: 40,
    name: 'Coconut Rice',
    description: 'Fragrant rice with grated coconut and South-Indian spices',
    price: 6.99,
    rating: 4.6,
    deliveryTime: '15-20 min',
    image: 'https://images.unsplash.com/photo-1715941873444-e8ec67753c98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NvbnV0JTIwcmljZSUyMGluZGlhbnxlbnwxfHx8fDE3Njc3MTcxODJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'rice',
  },
  {
    id: 41,
    name: 'Tamarind Rice',
    description: 'Tangy rice with tamarind, peanuts and curry leaves (Puliyodarai)',
    price: 6.99,
    rating: 4.7,
    deliveryTime: '15-20 min',
    image: 'https://images.unsplash.com/photo-1552033809-48a1213d359d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZW1vbiUyMHJpY2UlMjBzb3V0aHxlbnwxfHx8fDE3Njc3MTcxODF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'rice',
  },
  {
    id: 42,
    name: 'Bisi Bele Bath',
    description: 'Karnataka-style rice, lentils and vegetables with special spice mix',
    price: 7.99,
    rating: 4.7,
    deliveryTime: '20-25 min',
    image: 'https://images.unsplash.com/photo-1715941873444-e8ec67753c98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NvbnV0JTIwcmljZSUyMGluZGlhbnxlbnwxfHx8fDE3Njc3MTcxODJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'rice',
  },

  // Desserts
  {
    id: 43,
    name: 'Gulab Jamun',
    description: 'Milk-based syrupy dumplings, soft and sweet',
    price: 4.99,
    rating: 4.8,
    deliveryTime: '10-15 min',
    image: 'https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxndWxhYiUyMGphbXVuJTIwZGVzc2VydHxlbnwxfHx8fDE3Njc2NzU0MTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'desserts',
    badge: 'Popular',
  },
  {
    id: 44,
    name: 'Rasmalai',
    description: 'Cheese balls soaked in sweetened, flavored milk',
    price: 5.99,
    rating: 4.7,
    deliveryTime: '10-15 min',
    image: 'https://images.unsplash.com/photo-1516709315038-c53bf87e8f48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYXNndWxsYSUyMHN3ZWV0JTIwYmVuZ2FsaXxlbnwxfHx8fDE3Njc3MTcxODd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'desserts',
  },
  {
    id: 45,
    name: 'Payasam / Kheer',
    description: 'Sweet rice or vermicelli pudding with milk and nuts',
    price: 4.99,
    rating: 4.6,
    deliveryTime: '10-15 min',
    image: 'https://images.unsplash.com/photo-1708782340357-b7b38d653979?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraGVlciUyMHBheWFzYW0lMjBwdWRkaW5nfGVufDF8fHx8MTc2NzcxNzE4OHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'desserts',
  },
  {
    id: 46,
    name: 'Kulfi',
    description: 'Traditional Indian frozen dessert with cardamom and pistachios',
    price: 4.99,
    rating: 4.7,
    deliveryTime: '5-10 min',
    image: 'https://images.unsplash.com/photo-1762999001316-27e31c06d3cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrdWxmaSUyMGljZSUyMGNyZWFtfGVufDF8fHx8MTc2NzYwMzM0MXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'desserts',
  },
  {
    id: 47,
    name: 'Mysore Pak',
    description: 'Traditional South-Indian sweet made with ghee, sugar and gram flour',
    price: 5.99,
    rating: 4.6,
    deliveryTime: '5-10 min',
    image: 'https://images.unsplash.com/photo-1751292271911-232b8ef4219e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxteXNvcmUlMjBwYWslMjBzd2VldHxlbnwxfHx8fDE3Njc3MTcxODh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'desserts',
  },
  {
    id: 48,
    name: 'Kesari Bath',
    description: 'Sweet semolina pudding with saffron and nuts',
    price: 4.99,
    rating: 4.5,
    deliveryTime: '10-15 min',
    image: 'https://images.unsplash.com/photo-1708782340357-b7b38d653979?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraGVlciUyMHBheWFzYW0lMjBwdWRkaW5nfGVufDF8fHx8MTc2NzcxNzE4OHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'desserts',
  },

  // Beverages
  {
    id: 49,
    name: 'South Indian Filter Coffee',
    description: 'Strong coffee decoction with frothed milk, traditional style',
    price: 2.99,
    rating: 4.9,
    deliveryTime: '5-10 min',
    image: 'https://images.unsplash.com/photo-1668236482744-b48b28650f12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWx0ZXIlMjBjb2ZmZWUlMjBzb3V0aHxlbnwxfHx8fDE3Njc3MTcxODh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'beverages',
    badge: 'Bestseller',
  },
  {
    id: 50,
    name: 'Masala Chai',
    description: 'Spiced Indian tea with ginger, cardamom and milk',
    price: 2.49,
    rating: 4.8,
    deliveryTime: '5-10 min',
    image: 'https://images.unsplash.com/photo-1698619952010-3bc850cbcb3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXNhbGElMjBjaGFpJTIwdGVhfGVufDF8fHx8MTc2NzcxNzE4OXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'beverages',
    badge: 'Popular',
  },
  {
    id: 51,
    name: 'Sweet Lassi',
    description: 'Chilled sweet yogurt drink, refreshing and creamy',
    price: 3.99,
    rating: 4.7,
    deliveryTime: '5-10 min',
    image: 'https://images.unsplash.com/photo-1709620061649-b352f63ea4cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXNzaSUyMHlvZ3VydCUyMGRyaW5rfGVufDF8fHx8MTc2NzY3NTY1N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'beverages',
  },
  {
    id: 52,
    name: 'Badam Milk',
    description: 'Almond-flavored sweetened milk drink',
    price: 3.99,
    rating: 4.6,
    deliveryTime: '5-10 min',
    image: 'https://images.unsplash.com/photo-1760812990908-70aff19fc16e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWRhbSUyMG1pbGslMjBhbG1vbmR8ZW58MXx8fHwxNzY3NzE3MTkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'beverages',
  },
];

function Dashboard() {
  const { user, updateProfile, logout } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showHero, setShowHero] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const filteredItems =
    selectedCategory === 'all'
      ? foodItems
      : foodItems.filter((item) => item.category === selectedCategory);

  const handleBrowseMenu = () => {
    setShowHero(false);
  };

  const handleAddToCart = (item: { id: number; name: string; price: number; image: string }) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        toast.success(`Added another ${item.name} to cart`);
        return prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        toast.success(`${item.name} added to cart`);
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(id);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const handleRemoveItem = (id: number) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      toast.success(`${item.name} removed from cart`);
    }
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    toast.success('Order placed successfully! Your food will arrive soon.');
    setCartItems([]);
    setIsCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold">E</span>
            </div>
            <span className="text-xl font-bold text-gray-900">EchoEats</span>
          </div>

          <LocationSelector />

          <div className="flex items-center gap-4">
            {/* Profile Button */}
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <UserCircle className="w-5 h-5 text-gray-700" />
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                {user?.name?.split(' ')[0] || 'Profile'}
              </span>
            </button>

            <Cart
              items={cartItems}
              isOpen={isCartOpen}
              onOpenChange={setIsCartOpen}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {showHero && (
        <section className="bg-gradient-to-br from-orange-50 to-white py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-orange-600 mb-4">
              <Mic className="w-4 h-4" />
              <span className="text-sm font-medium">Voice-powered ordering</span>
            </div>

            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Order food with <span className="text-orange-500">just your voice</span>
            </h1>

            <p className="text-gray-600 text-lg mb-8 max-w-xl">
              EchoEats brings you delicious meals from top restaurants. Simply speak and we'll take care of the rest.
            </p>

            <div className="flex gap-4 mb-12">
              <button className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2">
                <Mic className="w-5 h-5" />
                Start Voice Order
              </button>
              <button
                onClick={handleBrowseMenu}
                className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors border border-gray-200"
              >
                Browse Menu →
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-12">
              <div>
                <div className="text-3xl font-bold text-gray-900">500+</div>
                <div className="text-gray-600 text-sm">Restaurants</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">4.9★</div>
                <div className="text-gray-600 text-sm">App Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">30 min</div>
                <div className="text-gray-600 text-sm">Avg. Delivery</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category Filters */}
      <section className="bg-white border-b sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.icon}
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {/* Food Items */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Popular Near You</h2>
            <p className="text-gray-600 text-sm">{filteredItems.length} items available</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <FoodCard key={item.id} {...item} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </section>

      {/* Voice Assistant */}
      <VoiceAssistant onAddToCart={handleAddToCart} />

      {/* Profile Modal */}
      {isProfileOpen && user && (
        <Profile
          user={user}
          onClose={() => setIsProfileOpen(false)}
          onUpdateProfile={updateProfile}
          onLogout={logout}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AuthApp />
    </AuthProvider>
  );
}

function AuthApp() {
  const { isAuthenticated, login, signup } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  const handleLogin = (email: string, password: string) => {
    const success = login(email, password);
    if (success) {
      toast.success('Welcome back to EchoEats!');
    } else {
      toast.error('Invalid email or password');
    }
  };

  const handleSignup = (userData: any) => {
    signup(userData);
    toast.success('Account created successfully!');
  };

  if (!isAuthenticated) {
    if (authView === 'login') {
      return (
        <Login 
          onLogin={handleLogin} 
          onSwitchToSignup={() => setAuthView('signup')} 
        />
      );
    } else {
      return (
        <Signup 
          onSignup={handleSignup} 
          onSwitchToLogin={() => setAuthView('login')} 
        />
      );
    }
  }

  return <Dashboard />;
}