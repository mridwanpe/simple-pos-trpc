import { create } from "zustand";

type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

type AddToCartItem = Omit<CartItem, "quantity">;

interface CreateCart {
  items: CartItem[];
  addToCart: (newItem: AddToCartItem) => void;
}

const useCartStore = create<CreateCart>()((set) => ({
  items: [],
  addToCart: (newItem) => {
    set((currentState) => {
      const duplicateItems = [...currentState.items];

      const existingItemIndex = duplicateItems.findIndex(
        (item) => item.productId === newItem.productId,
      );

      if (existingItemIndex === -1) {
        duplicateItems.push({
          ...newItem,
          quantity: 1,
        });
      } else {
        const itemToUpdate = duplicateItems[existingItemIndex];
        if (!itemToUpdate) return{
          ...currentState
        }

        itemToUpdate.quantity += 1;
      }

      return {
        ...currentState,
        items: duplicateItems,
      };
    });
    alert("Product added to cart");
  },
}));

export default useCartStore;
