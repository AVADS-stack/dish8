import { Helmet } from "react-helmet-async";

const SITE = {
  name: "Dish8",
  url: "https://dish8.vercel.app",
  description:
    "Explore 19+ world cuisines, pick your meals for the week, and get fresh food delivered. Starting at $9.99/meal with subscription.",
  image: "https://dish8.vercel.app/og-image.svg",
};

export default function SEO({
  title,
  description,
  path = "/",
  type = "website",
  image,
  jsonLd,
}) {
  const pageTitle = title ? `${title} — ${SITE.name}` : `${SITE.name} — Your Meal, Your Way`;
  const pageDesc = description || SITE.description;
  const pageUrl = `${SITE.url}${path}`;
  const pageImage = image || SITE.image;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDesc} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:site_name" content={SITE.name} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDesc} />
      <meta name="twitter:image" content={pageImage} />

      {/* JSON-LD structured data */}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}

// Pre-built JSON-LD schemas
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Dish8 LLC",
  url: SITE.url,
  logo: `${SITE.url}/favicon.svg`,
  description: SITE.description,
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@dish8.com",
    contactType: "customer service",
  },
};

export const foodServiceSchema = {
  "@context": "https://schema.org",
  "@type": "FoodService",
  name: "Dish8",
  url: SITE.url,
  description: SITE.description,
  servesCuisine: [
    "Italian","Chinese","Japanese","Indian","Mexican","Thai","French",
    "Korean","Vietnamese","Greek","Spanish","Lebanese","Ethiopian",
    "Turkish","Moroccan","Brazilian","Peruvian","Caribbean","German",
  ],
  priceRange: "$9.99 per meal",
  areaServed: { "@type": "Country", name: "United States" },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Subscription Plans",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Lunch Only",
        price: "99.99",
        priceCurrency: "USD",
        description: "7 days of lunch every day for 30 days",
      },
      {
        "@type": "Offer",
        name: "Dinner Only",
        price: "99.99",
        priceCurrency: "USD",
        description: "7 days of dinner every day for 30 days",
      },
      {
        "@type": "Offer",
        name: "Lunch & Dinner",
        price: "199.99",
        priceCurrency: "USD",
        description: "7 days of both lunch & dinner every day for 30 days",
      },
    ],
  },
};
