import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
const CartUpdateContext = createContext();

export const useCart = () => useContext(CartContext);
export const useCartUpdate = () => useContext(CartUpdateContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(new Map());

  const addItem = (item) => {
    if (cart.has(item)) {
      cart.set(item, cart.get(item) + 1);
      setCart(new Map(cart));
    } else {
      cart.set(item, 1);
      setCart(new Map(cart));
    }
  };

  const removeItem = (item) => {
    cart.delete(item);
    setCart(new Map(cart));
  };

  return (
    <CartContext.Provider value={cart}>
      <CartUpdateContext.Provider value={{ addItem, removeItem }}>
        {children}
      </CartUpdateContext.Provider>
    </CartContext.Provider>
  );
};
