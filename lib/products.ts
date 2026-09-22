export type ProductVariant = {
  id: string;
  sku?: string;
  color: string;
  size: string;
  price: number;
  stock: number;
};

export type Product = {
  _id?: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  stock?: number;
  comparePrice?: number;
  image: string;
  description: string;
  variants: ProductVariant[];
};

export const products: Product[] = [
  {
    slug: "royal-red-kanjivaram-silk-saree",
    name: "Royal Red Kanjivaram Silk Saree",
    category: "Silk Sarees",
    price: 8999,
    comparePrice: 10999,
    image: "/products/royal-red-kanjivaram.jpg",
    description:
      "A luxurious red Kanjivaram-inspired silk saree featuring traditional golden zari detailing.",
    variants: [
      {
        id: "red-kanji-1",
        color: "Royal Red",
        size: "Free Size",
        price: 8999,
        stock: 12,
      },
      {
        id: "red-kanji-2",
        color: "Deep Red",
        size: "Free Size",
        price: 9299,
        stock: 8,
      },
    ],
  },

  {
    slug: "emerald-green-kanjivaram-silk-saree",
    name: "Emerald Green Kanjivaram Silk Saree",
    category: "Silk Sarees",
    price: 9499,
    comparePrice: 11999,
    image: "/products/emerald-green-kanjivaram.jpg",
    description:
      "Elegant emerald green silk saree designed with a rich traditional border for festive occasions.",
    variants: [
      {
        id: "green-kanji-1",
        color: "Emerald Green",
        size: "Free Size",
        price: 9499,
        stock: 10,
      },
      {
        id: "green-kanji-2",
        color: "Bottle Green",
        size: "Free Size",
        price: 9799,
        stock: 6,
      },
    ],
  },

  {
    slug: "royal-blue-kanjivaram-silk-saree",
    name: "Royal Blue Kanjivaram Silk Saree",
    category: "Silk Sarees",
    price: 9299,
    comparePrice: 11499,
    image: "/products/royal-blue-kanjivaram.jpg",
    description:
      "A sophisticated royal blue silk saree with a timeless zari border.",
    variants: [
      {
        id: "blue-kanji-1",
        color: "Royal Blue",
        size: "Free Size",
        price: 9299,
        stock: 14,
      },
      {
        id: "blue-kanji-2",
        color: "Navy Blue",
        size: "Free Size",
        price: 9599,
        stock: 7,
      },
    ],
  },

  {
    slug: "magenta-pink-kanjivaram-saree",
    name: "Magenta Pink Kanjivaram Saree",
    category: "Silk Sarees",
    price: 8799,
    comparePrice: 10499,
    image: "/products/magenta-pink-kanjivaram.jpg",
    description:
      "A vibrant magenta silk saree that brings a luxurious traditional look to celebrations.",
    variants: [
      {
        id: "magenta-1",
        color: "Magenta",
        size: "Free Size",
        price: 8799,
        stock: 11,
      },
      {
        id: "magenta-2",
        color: "Pink",
        size: "Free Size",
        price: 8999,
        stock: 5,
      },
    ],
  },

  {
    slug: "mustard-gold-silk-saree",
    name: "Mustard Gold Silk Saree",
    category: "Silk Sarees",
    price: 8299,
    comparePrice: 9999,
    image: "/products/mustard-gold-silk.jpg",
    description:
      "A warm mustard silk saree with elegant golden accents, perfect for festive celebrations.",
    variants: [
      {
        id: "mustard-1",
        color: "Mustard",
        size: "Free Size",
        price: 8299,
        stock: 9,
      },
      {
        id: "mustard-2",
        color: "Golden Yellow",
        size: "Free Size",
        price: 8499,
        stock: 4,
      },
    ],
  },

  {
    slug: "maroon-pure-silk-saree",
    name: "Maroon Pure Silk Saree",
    category: "Pure Silk",
    price: 8499,
    comparePrice: 9999,
    image: "/products/maroon-pure-silk.jpg",
    description:
      "A deep maroon pure silk saree crafted for weddings and special occasions.",
    variants: [
      {
        id: "maroon-1",
        color: "Maroon",
        size: "Free Size",
        price: 8499,
        stock: 13,
      },
      {
        id: "maroon-2",
        color: "Wine",
        size: "Free Size",
        price: 8799,
        stock: 6,
      },
    ],
  },

  {
    slug: "aqua-gold-silk-saree",
    name: "Aqua Gold Silk Saree",
    category: "Silk Sarees",
    price: 7499,
    comparePrice: 8999,
    image: "/products/aqua-gold-silk.jpg",
    description:
      "A refreshing aqua silk saree paired with subtle golden detailing.",
    variants: [
      {
        id: "aqua-1",
        color: "Aqua",
        size: "Free Size",
        price: 7499,
        stock: 15,
      },
      {
        id: "aqua-2",
        color: "Sea Green",
        size: "Free Size",
        price: 7699,
        stock: 8,
      },
    ],
  },

  {
    slug: "teal-designer-silk-saree",
    name: "Teal Designer Silk Saree",
    category: "Designer Sarees",
    price: 8499,
    comparePrice: 9999,
    image: "/products/teal-designer-silk.jpg",
    description:
      "A contemporary teal silk saree combining traditional elegance with a modern silhouette.",
    variants: [
      {
        id: "teal-1",
        color: "Teal",
        size: "Free Size",
        price: 8499,
        stock: 7,
      },
      {
        id: "teal-2",
        color: "Dark Teal",
        size: "Free Size",
        price: 8699,
        stock: 4,
      },
    ],
  },

  {
    slug: "royal-purple-banarasi-saree",
    name: "Royal Purple Banarasi Saree",
    category: "Banarasi Sarees",
    price: 9999,
    comparePrice: 11999,
    image: "/products/royal-purple-banarasi.jpg",
    description:
      "A rich purple Banarasi-style saree with intricate traditional detailing.",
    variants: [
      {
        id: "purple-ban-1",
        color: "Royal Purple",
        size: "Free Size",
        price: 9999,
        stock: 10,
      },
      {
        id: "purple-ban-2",
        color: "Plum",
        size: "Free Size",
        price: 10299,
        stock: 5,
      },
    ],
  },

  {
    slug: "coral-pink-kanchipuram-saree",
    name: "Coral Pink Kanchipuram Saree",
    category: "Kanchipuram Sarees",
    price: 7999,
    comparePrice: 9499,
    image: "/products/coral-pink-kanchipuram.jpg",
    description:
      "A graceful coral pink saree with traditional Kanchipuram-inspired detailing.",
    variants: [
      {
        id: "coral-1",
        color: "Coral Pink",
        size: "Free Size",
        price: 7999,
        stock: 12,
      },
      {
        id: "coral-2",
        color: "Peach Pink",
        size: "Free Size",
        price: 8199,
        stock: 6,
      },
    ],
  },

  {
    slug: "yellow-pink-bridal-silk-saree",
    name: "Yellow & Pink Bridal Silk Saree",
    category: "Bridal Sarees",
    price: 9499,
    comparePrice: 11999,
    image: "/products/yellow-pink-bridal.jpg",
    description:
      "A vibrant yellow and pink bridal saree designed for weddings and grand celebrations.",
    variants: [
      {
        id: "bridal-yellow-1",
        color: "Yellow Pink",
        size: "Free Size",
        price: 9499,
        stock: 8,
      },
      {
        id: "bridal-yellow-2",
        color: "Golden Pink",
        size: "Free Size",
        price: 9799,
        stock: 4,
      },
    ],
  },

  {
    slug: "wine-red-banarasi-silk-saree",
    name: "Wine Red Banarasi Silk Saree",
    category: "Banarasi Sarees",
    price: 8999,
    comparePrice: 10999,
    image: "/products/wine-red-banarasi.jpg",
    description:
      "A luxurious wine-red Banarasi silk saree with classic woven detailing.",
    variants: [
      {
        id: "wine-1",
        color: "Wine Red",
        size: "Free Size",
        price: 8999,
        stock: 9,
      },
      {
        id: "wine-2",
        color: "Burgundy",
        size: "Free Size",
        price: 9299,
        stock: 5,
      },
    ],
  },

  {
    slug: "peacock-blue-silk-saree",
    name: "Peacock Blue Silk Saree",
    category: "Silk Sarees",
    price: 8799,
    comparePrice: 10499,
    image: "/products/peacock-blue-silk.jpg",
    description:
      "A stunning peacock blue silk saree inspired by traditional Indian craftsmanship.",
    variants: [
      {
        id: "peacock-1",
        color: "Peacock Blue",
        size: "Free Size",
        price: 8799,
        stock: 11,
      },
      {
        id: "peacock-2",
        color: "Turquoise",
        size: "Free Size",
        price: 8999,
        stock: 7,
      },
    ],
  },

  {
    slug: "rose-pink-designer-saree",
    name: "Rose Pink Designer Saree",
    category: "Designer Sarees",
    price: 6999,
    comparePrice: 8499,
    image: "/products/rose-pink-designer.jpg",
    description:
      "A delicate rose pink designer saree with an elegant contemporary finish.",
    variants: [
      {
        id: "rose-1",
        color: "Rose Pink",
        size: "Free Size",
        price: 6999,
        stock: 16,
      },
      {
        id: "rose-2",
        color: "Dusty Pink",
        size: "Free Size",
        price: 7199,
        stock: 8,
      },
    ],
  },

  {
    slug: "deep-green-kanchipuram-saree",
    name: "Deep Green Kanchipuram Saree",
    category: "Kanchipuram Sarees",
    price: 9199,
    comparePrice: 10999,
    image: "/products/deep-green-kanchipuram.jpg",
    description:
      "A deep green traditional saree with a rich festive appearance.",
    variants: [
      {
        id: "deep-green-1",
        color: "Deep Green",
        size: "Free Size",
        price: 9199,
        stock: 10,
      },
      {
        id: "deep-green-2",
        color: "Forest Green",
        size: "Free Size",
        price: 9399,
        stock: 5,
      },
    ],
  },

  {
    slug: "lavender-soft-silk-saree",
    name: "Lavender Soft Silk Saree",
    category: "Soft Silk",
    price: 7299,
    comparePrice: 8999,
    image: "/products/lavender-soft-silk.jpg",
    description:
      "A soft lavender silk saree offering a graceful and sophisticated look.",
    variants: [
      {
        id: "lavender-1",
        color: "Lavender",
        size: "Free Size",
        price: 7299,
        stock: 14,
      },
      {
        id: "lavender-2",
        color: "Lilac",
        size: "Free Size",
        price: 7499,
        stock: 7,
      },
    ],
  },

  {
    slug: "black-gold-designer-saree",
    name: "Black & Gold Designer Saree",
    category: "Designer Sarees",
    price: 7899,
    comparePrice: 9499,
    image: "/products/black-gold-designer.jpg",
    description:
      "A bold black saree enhanced with luxurious golden accents.",
    variants: [
      {
        id: "black-gold-1",
        color: "Black Gold",
        size: "Free Size",
        price: 7899,
        stock: 9,
      },
      {
        id: "black-gold-2",
        color: "Black",
        size: "Free Size",
        price: 8099,
        stock: 4,
      },
    ],
  },

  {
    slug: "traditional-kerala-kasavu-saree",
    name: "Traditional Kerala Kasavu Saree",
    category: "Kerala Sarees",
    price: 3299,
    comparePrice: 3999,
    image: "/products/traditional-kerala-kasavu.jpg",
    description:
      "A timeless Kerala Kasavu saree featuring a classic cream and golden combination.",
    variants: [
      {
        id: "kasavu-1",
        color: "Cream Gold",
        size: "Free Size",
        price: 3299,
        stock: 20,
      },
      {
        id: "kasavu-2",
        color: "Off White Gold",
        size: "Free Size",
        price: 3499,
        stock: 12,
      },
    ],
  },

  {
    slug: "ivory-gold-festive-saree",
    name: "Ivory Gold Festive Saree",
    category: "Festive Sarees",
    price: 6799,
    comparePrice: 7999,
    image: "/products/ivory-gold-festive.jpg",
    description:
      "An elegant ivory saree with subtle golden detailing for festive occasions.",
    variants: [
      {
        id: "ivory-1",
        color: "Ivory Gold",
        size: "Free Size",
        price: 6799,
        stock: 13,
      },
      {
        id: "ivory-2",
        color: "Cream Gold",
        size: "Free Size",
        price: 6999,
        stock: 7,
      },
    ],
  },

  {
    slug: "orange-red-wedding-silk-saree",
    name: "Orange Red Wedding Silk Saree",
    category: "Bridal Sarees",
    price: 9299,
    comparePrice: 11499,
    image: "/products/orange-red-wedding-silk.jpg",
    description:
      "A vibrant orange-red silk saree created for weddings and traditional celebrations.",
    variants: [
      {
        id: "orange-red-1",
        color: "Orange Red",
        size: "Free Size",
        price: 9299,
        stock: 8,
      },
      {
        id: "orange-red-2",
        color: "Rust Red",
        size: "Free Size",
        price: 9499,
        stock: 4,
      },
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}