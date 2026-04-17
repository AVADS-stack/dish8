import { Helmet } from "react-helmet-async";

const SITE = {
  name: "Dish8",
  url: "https://dish8.com",
  description:
    "Explore 21+ world cuisines. Pick your weekly meals — 2 appetizers, a main course, and a side — delivered fresh for just $9.99/meal with subscription.",
  image: "https://dish8.com/og-image.svg",
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
      <meta property="og:locale" content="en_US" />

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
  url: "https://dish8.com",
  logo: "https://dish8.com/favicon.svg",
  description: SITE.description,
  address: {
    "@type": "PostalAddress",
    addressRegion: "Midwest",
    addressCountry: "US",
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: "accounts@dish8.com",
    contactType: "customer service",
  },
  sameAs: [
    "https://apps.apple.com/app/dish8/id6761668432",
  ],
};

export const foodServiceSchema = {
  "@context": "https://schema.org",
  "@type": "FoodService",
  name: "Dish8",
  url: "https://dish8.com",
  description: SITE.description,
  servesCuisine: [
    "American", "Pizza", "Italian", "Chinese", "Japanese", "Indian", "Mexican",
    "Thai", "French", "Korean", "Vietnamese", "Greek", "Spanish", "Lebanese",
    "Ethiopian", "Turkish", "Moroccan", "Brazilian", "Peruvian", "Caribbean", "German",
  ],
  priceRange: "$9.99 per meal",
  currenciesAccepted: "USD",
  paymentAccepted: "Credit Card",
  areaServed: {
    "@type": "Country",
    name: "United States",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Subscription Plans",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Lunch Only",
        price: "99.99",
        priceCurrency: "USD",
        description: "7 days of lunch every day for 30 days. Each meal $9.99 with delivery included.",
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "Dinner Only",
        price: "99.99",
        priceCurrency: "USD",
        description: "7 days of dinner every day for 30 days. Each meal $9.99 with delivery included.",
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "Lunch & Dinner",
        price: "199.99",
        priceCurrency: "USD",
        description: "7 days of both lunch and dinner every day for 30 days. Best value plan.",
        availability: "https://schema.org/InStock",
      },
    ],
  },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Dish8",
  url: "https://dish8.com",
  description: SITE.description,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://dish8.com/?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export const mobileAppSchema = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: "Dish8",
  operatingSystem: "iOS",
  applicationCategory: "FoodEstablishmentReservation",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  downloadUrl: "https://apps.apple.com/app/dish8/id6761668432",
  description: "21+ world cuisines, 800+ dishes, delivered for $9.99/meal.",
};
