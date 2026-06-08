'use client';
import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext<any>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState([
    { id: 'default-1', name: "4pc Cronut Gift Box", price: 55000, img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=150&h=150&q=80", qty: 1, type: 'regular' }
  ]);

  const [activeOrders, setActiveOrders] = useState([
    {
      id: 'ORD-8921A', date: '1 Juni 2026', total: 96800,
      items: [{ name: 'Matcha Pound Cake', qty: 1 }, { name: 'Signature Brownies', qty: 2 }],
      status: 2 
    }
  ]);

  const [points, setPoints] = useState(8025);
  const [globalSearchInput, setGlobalSearchInput] = useState('');
  
  // STATE NAVIGASI BARU AGAR INSTAN
  const [currentView, setCurrentView] = useState('home-view');

  const defaultReviews = [
      { user: "Rina S.", rating: 5, comment: "Rasanya premium banget, manisnya pas!" },
      { user: "Andi Wijaya", rating: 4, comment: "Enak, packaging rapi, cocok buat kado." }
  ];

  const [bestSellingItems, setBestSellingItems] = useState([
    { name: "4pc Cronut Gift Box", price: 55000, pax: 4, img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=300&h=200&q=80", rating: 4.9, sold: "2rb+", description: "Perpaduan sempurna antara tekstur renyah croissant dan manisnya donat.", freshLevel: "Dipanggang 1 jam lalu", stock: 15, reviews: [...defaultReviews] },
    { name: "Cronut & DKA Combo", price: 50000, pax: 4, img: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=300&h=200&q=80", rating: 4.8, sold: "1.5rb+", description: "Kombinasi Cronut lezat dan Kouign-Amann artisan untuk menemani harimu.", freshLevel: "Baru matang 2 jam lalu", stock: 8, reviews: [...defaultReviews] },
    { name: "4pc DKA Gift Box", price: 48000, pax: 4, img: "https://images.unsplash.com/photo-1612203985729-70726954388c?auto=format&fit=crop&w=300&h=200&q=80", rating: 4.9, sold: "3rb+", description: "Empat potong Dominique's Kouign-Amann (DKA) dengan karamelisasi sempurna.", freshLevel: "Dipanggang pagi ini", stock: 20, reviews: [...defaultReviews] },
    { name: "Cookie Shot Gift Box", price: 35000, pax: 3, img: "https://images.unsplash.com/photo-1618923850107-d1a234d7a73a?auto=format&fit=crop&w=300&h=200&q=80", rating: 4.7, sold: "800+", description: "Gelas cookie renyah dengan isian vanilla milk yang lumer di mulut.", freshLevel: "Baru matang 3 jam lalu", stock: 12, reviews: [...defaultReviews] },
    { name: "Signature Brownies", price: 28000, pax: 2, img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=300&h=200&q=80", rating: 4.9, sold: "5rb+", description: "Brownies fudgy premium dengan dark chocolate asli.", freshLevel: "Dipanggang 45 menit lalu", stock: 5, reviews: [...defaultReviews] },
    { name: "Strawberry Tart", price: 25000, pax: 1, img: "https://images.unsplash.com/photo-1514517521153-1be72277b32f?auto=format&fit=crop&w=300&h=200&q=80", rating: 4.8, sold: "1.2rb+", description: "Tart renyah dengan krim vanila dan potongan stroberi segar yang manis asam.", freshLevel: "Dibuat pagi ini", stock: 18, reviews: [...defaultReviews] },
    { name: "Classic Croissant", price: 18000, pax: 1, img: "https://images.unsplash.com/photo-1549903072-7e6e0bedb7fb?auto=format&fit=crop&w=300&h=200&q=80", rating: 4.9, sold: "10rb+", description: "Croissant mentega klasik dengan lapisan renyah khas Prancis.", freshLevel: "Baru keluar oven!", stock: 35, reviews: [...defaultReviews] },
    { name: "Cinnamon Roll Box", price: 32000, pax: 2, img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&h=200&q=80", rating: 4.7, sold: "900+", description: "Roti gulung kayu manis lembut dengan baluran cream cheese tebal.", freshLevel: "Dipanggang 2 jam lalu", stock: 10, reviews: [...defaultReviews] },
    { name: "Matcha Pound Cake", price: 24000, pax: 2, img: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=300&h=200&q=80", rating: 4.8, sold: "1.1rb+", description: "Pound cake padat dan lembut dengan rasa matcha Jepang premium.", freshLevel: "Dipanggang pagi ini", stock: 14, reviews: [...defaultReviews] },
    { name: "Blueberry Muffin Set", price: 22000, pax: 2, img: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=300&h=200&q=80", rating: 4.6, sold: "600+", description: "Muffin lembut dengan taburan blueberry segar di setiap gigitannya.", freshLevel: "Baru matang 1 jam lalu", stock: 22, reviews: [...defaultReviews] },
    { name: "Tiramisu Slice", price: 20000, pax: 1, img: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=300&h=200&q=80", rating: 4.9, sold: "4.5rb+", description: "Slice Tiramisu klasik Italia dengan mascarpone cheese dan bubuk kopi.", freshLevel: "Didinginkan semalam", stock: 9, reviews: [...defaultReviews] },
    { name: "Lemon Meringue Pie", price: 25000, pax: 1, img: "https://images.unsplash.com/photo-1513135065346-a098a63a71ee?auto=format&fit=crop&w=300&h=200&q=80", rating: 4.7, sold: "750+", description: "Pie lemon segar asam manis dipadukan dengan topping meringue lembut.", freshLevel: "Dibuat pagi ini", stock: 11, reviews: [...defaultReviews] },
    { name: "Choco Lava Cake", price: 22000, pax: 1, img: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=300&h=200&q=80", rating: 4.8, sold: "2.3rb+", description: "Kue coklat hangat dengan isian coklat lumer lezat di bagian tengahnya.", freshLevel: "Dibuat sesuai pesanan", stock: 50, reviews: [...defaultReviews] },
    { name: "Almond Danish", price: 20000, pax: 1, img: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=300&h=200&q=80", rating: 4.8, sold: "1.8rb+", description: "Pastry Danish renyah dengan krim almond manis panggang.", freshLevel: "Dipanggang 2 jam lalu", stock: 16, reviews: [...defaultReviews] },
    { name: "Red Velvet Cupcakes", price: 25000, pax: 2, img: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=300&h=200&q=80", rating: 4.9, sold: "3.2rb+", description: "Cupcake red velvet moist dengan frosting cream cheese klasik.", freshLevel: "Baru dihias 30 menit lalu", stock: 24, reviews: [...defaultReviews] },
    { name: "Artisan Baguette", price: 15000, pax: 1, img: "https://images.unsplash.com/photo-1597079910443-60c43fc4f729?auto=format&fit=crop&w=300&h=200&q=80", rating: 4.6, sold: "1.5rb+", description: "Roti panjang tradisional Prancis, renyah di luar dan lembut berongga di dalam.", freshLevel: "Baru matang 4 jam lalu", stock: 7, reviews: [...defaultReviews] }
  ]);

  return (
    <AppContext.Provider value={{ cartItems, setCartItems, activeOrders, setActiveOrders, points, setPoints, globalSearchInput, setGlobalSearchInput, bestSellingItems, setBestSellingItems, currentView, setCurrentView }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);