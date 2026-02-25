import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product) => {
        const { items } = get();
        const existing = items.find(
          (i) => i._id === product._id && i.selectedSize === product.selectedSize
        );
        if (existing) {
          set({
            items: items.map((i) =>
              i._id === product._id && i.selectedSize === product.selectedSize
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] });
        }
      },

      removeItem: (id, size) => {
        set({
          items: get().items.filter(
            (i) => !(i._id === id && i.selectedSize === size)
          ),
        });
      },

      updateQuantity: (id, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id, size);
          return;
        }
        set({
          items: get().items.map((i) =>
            i._id === id && i.selectedSize === size ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      get totalItems() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      get totalPrice() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },
    }),
    {
      name: 'biigggx-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export default useCartStore;
