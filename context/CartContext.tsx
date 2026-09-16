"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  Product,
  ProductVariant,
} from "@/lib/products";

export type CartItem = {
  product: Product;
  variant: ProductVariant;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;

  addToCart: (
    product: Product,
    variant: ProductVariant,
    quantity?: number
  ) => void;

  removeFromCart: (
    productSlug: string,
    variantId: string
  ) => void;

  increaseQuantity: (
    productSlug: string,
    variantId: string
  ) => void;

  decreaseQuantity: (
    productSlug: string,
    variantId: string
  ) => void;

  clearCart: () => void;
};

const CartContext = createContext<
  CartContextType | undefined
>(undefined);

const CART_STORAGE_KEY = "mulberries-cart";

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart =
        localStorage.getItem(CART_STORAGE_KEY);

      if (savedCart) {
        const parsedCart: CartItem[] =
          JSON.parse(savedCart);

        setItems(parsedCart);
      }
    } catch (error) {
      console.error(
        "Failed to load cart:",
        error
      );
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(items)
      );
    } catch (error) {
      console.error(
        "Failed to save cart:",
        error
      );
    }
  }, [items, isLoaded]);

  // Add product to cart
  const addToCart = (
    product: Product,
    variant: ProductVariant,
    quantity = 1
  ) => {
    if (quantity <= 0) {
      return;
    }

    setItems((currentItems) => {
      const existingItem =
        currentItems.find(
          (item) =>
            item.product.slug ===
              product.slug &&
            item.variant.id === variant.id
        );

      if (existingItem) {
        return currentItems.map((item) =>
          item.product.slug ===
              product.slug &&
            item.variant.id === variant.id
            ? {
                ...item,
                quantity:
                  item.quantity + quantity,
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          product,
          variant,
          quantity,
        },
      ];
    });
  };

  // Remove product
  const removeFromCart = (
    productSlug: string,
    variantId: string
  ) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) =>
          !(
            item.product.slug ===
              productSlug &&
            item.variant.id === variantId
          )
      )
    );
  };

  // Increase quantity
  const increaseQuantity = (
    productSlug: string,
    variantId: string
  ) => {
    setItems((currentItems) =>
      currentItems.map((item) => {
        if (
          item.product.slug ===
            productSlug &&
          item.variant.id === variantId
        ) {
          return {
            ...item,
            quantity: Math.min(
              item.quantity + 1,
              item.variant.stock
            ),
          };
        }

        return item;
      })
    );
  };

  // Decrease quantity
  const decreaseQuantity = (
    productSlug: string,
    variantId: string
  ) => {
    setItems((currentItems) =>
      currentItems
        .map((item) => {
          if (
            item.product.slug ===
              productSlug &&
            item.variant.id === variantId
          ) {
            return {
              ...item,
              quantity:
                item.quantity - 1,
            };
          }

          return item;
        })
        .filter(
          (item) => item.quantity > 0
        )
    );
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
  };

  // Total quantity
  const itemCount = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );
  }, [items]);

  // Subtotal
  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total +
        item.variant.price *
          item.quantity,
      0
    );
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}