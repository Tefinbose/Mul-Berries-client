"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  Product,
  ProductVariant,
} from "@/lib/products";
import {
  addToCartApi,
  clearCartApi,
  getCartApi,
  removeFromCartApi,
  updateCartItemApi,
} from "@/services/cartApi";

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
let cartSyncQueue = Promise.resolve();

function getToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("token");
}

function getVariantId(variant: ProductVariant) {
  return variant.sku || variant.id;
}

function enqueueCartSync(task: () => Promise<unknown>) {
  const request = cartSyncQueue.then(task).catch((error: unknown) => {
    if (
      error instanceof Error &&
      (error.message === "Cart item not found" ||
        error.message === "Cart not found")
    ) {
      return;
    }

    console.error("CART SYNC ERROR:", error);
  });

  cartSyncQueue = request.then(
    () => undefined,
    () => undefined
  );

  return request;
}

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
        const parsedCart: unknown =
          JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          startTransition(() => {
            setItems(parsedCart as CartItem[]);
          });
        } else {
          localStorage.removeItem(CART_STORAGE_KEY);
        }
      }
    } catch {
      localStorage.removeItem(CART_STORAGE_KEY);
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

    const token = getToken();

    if (token && product._id) {
      enqueueCartSync(() =>
        addToCartApi(
          {
            productId: product._id!,
            variantId: getVariantId(variant),
            quantity,
          },
          token
        )
      );
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
    const item = items.find(
      (currentItem) =>
        currentItem.product.slug === productSlug &&
        currentItem.variant.id === variantId
    );
    const token = getToken();

    if (token && item?.product._id) {
      enqueueCartSync(() =>
        removeFromCartApi(
          item.product._id!,
          token,
          getVariantId(item.variant)
        )
      );
    }

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
    const item = items.find(
      (currentItem) =>
        currentItem.product.slug === productSlug &&
        currentItem.variant.id === variantId
    );
    const nextQuantity = item
      ? Math.min(item.quantity + 1, item.variant.stock)
      : 0;
    const token = getToken();

    if (token && item?.product._id && nextQuantity > 0) {
      enqueueCartSync(async () => {
        const response = await getCartApi(token);
        const serverItem = response.cart?.items.find(
          (cartItem) =>
            (typeof cartItem.product === "string"
              ? cartItem.product
              : cartItem.product._id) === item.product!._id &&
            cartItem.variantId === getVariantId(item.variant)
        );

        if (!serverItem) {
          return addToCartApi(
            {
              productId: item.product!._id!,
              variantId: getVariantId(item.variant),
              quantity: 1,
            },
            token
          );
        }

        return updateCartItemApi(
          item.product!._id!,
          {
            quantity: serverItem.quantity + 1,
            variantId: getVariantId(item.variant),
          },
          token
        );
      });
    }

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
    const item = items.find(
      (currentItem) =>
        currentItem.product.slug === productSlug &&
        currentItem.variant.id === variantId
    );
    const nextQuantity = item ? item.quantity - 1 : 0;
    const token = getToken();

    if (token && item?.product._id) {
      const syncRequest =
        enqueueCartSync(async () => {
          const response = await getCartApi(token);
          const serverItem = response.cart?.items.find(
            (cartItem) =>
              (typeof cartItem.product === "string"
                ? cartItem.product
                : cartItem.product._id) === item.product!._id &&
              cartItem.variantId === getVariantId(item.variant)
          );

          if (!serverItem) {
            return;
          }

          if (serverItem.quantity > 1) {
            return updateCartItemApi(
              item.product!._id!,
              {
                quantity: serverItem.quantity - 1,
                variantId: getVariantId(item.variant),
              },
              token
            );
          }

          return removeFromCartApi(
            item.product!._id!,
            token,
            getVariantId(item.variant)
          );
        });

      void syncRequest;
    }

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
    const token = getToken();

    if (token) {
      enqueueCartSync(() => clearCartApi(token));
    }

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