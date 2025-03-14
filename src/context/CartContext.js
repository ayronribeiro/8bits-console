import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const getImageUrl = (product) => {
  try {
    const imageUrl = product.attributes.imagemPrincipal?.data?.attributes?.url;
    if (!imageUrl) {
      return 'https://via.placeholder.com/100x100?text=Sem+Imagem';
    }
    console.log('URL original no carrinho:', imageUrl);
    if (imageUrl.includes('media.strapiapp.com')) {
      return imageUrl;
    }
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    // Para URLs relativas
    return `https://certain-dinosaur-423c97af88.media.strapiapp.com${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  } catch (error) {
    console.error('Erro ao processar URL da imagem no carrinho:', error);
    return 'https://via.placeholder.com/100x100?text=Sem+Imagem';
  }
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === product.id);
      
      if (existingItem) {
        return currentCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, {
        id: product.id,
        title: product.attributes.tituleProduto,
        price: product.attributes.precoProduto,
        image: getImageUrl(product),
        quantity: 1
      }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(currentCart => currentCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setCart(currentCart =>
      currentCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 
