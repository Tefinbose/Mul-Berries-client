type ProductStructuredDataProps = {
  name: string;
  description: string;
  slug: string;
  price: number;
  image: string;
  category: string;
};

export default function ProductStructuredData({
  name,
  description,
  slug,
  price,
  image,
  category,
}: ProductStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",

    name,

    description,

    image: [image],

    category,

    brand: {
      "@type": "Brand",
      name: "Mulberries",
    },

    offers: {
      "@type": "Offer",

      url: `https://mulberries.shop/products/${slug}`,

      priceCurrency: "INR",

      price: price,

      availability: "https://schema.org/InStock",

      itemCondition:
        "https://schema.org/NewCondition",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}