import useCartStore from '../store/cartStore';

/**
 * Convenience hook for cart operations
 */
export function useCart() {
  const {
    items,
    isOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
  } = useCartStore();

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const isEmpty = items.length === 0;

  const addToCart = (product, size) => {
    addItem({ ...product, selectedSize: size || 'One Size' });
    openCart();
  };

  return {
    items,
    isOpen,
    totalItems,
    totalPrice,
    isEmpty,
    addToCart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
  };
}

export default useCart;
