import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  schema?: object;
}

export const SEOProvider: React.FC<SEOProps> = ({
  title = "MATRIARCH | Premium Selection Protocol",
  description = "Delhi's most exclusive verification-based dating protocol. Join the sanctuary of verified professionals.",
  canonical = "https://www.matriarchindia.com/",
  ogType = "website",
  ogImage = "https://www.matriarchindia.com/og-image.jpg",
  schema
}) => {
  const fullTitle = title.length > 60 ? title.substring(0, 57) + "..." : title;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Social */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export const defaultSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Matriarch",
  "operatingSystem": "Web, iOS, Android",
  "applicationCategory": "LifestyleApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "INR"
  },
  "author": {
    "@type": "Organization",
    "name": "Matriarch India",
    "url": "https://www.matriarchindia.com"
  }
};
