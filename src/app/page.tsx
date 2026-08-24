import { PublicLanding } from "@/components/service/public-landing";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": "https://royalmechanic.shop/#business",
        name: "Royal Mechanic",
        description:
          "Doorstep bike service and repair booking platform in Bengaluru.",
        url: "https://royalmechanic.shop",
        image: "https://royalmechanic.shop/images/logo.png",
        telephone: "+91-90000-00000",
        areaServed: "Bengaluru",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bengaluru",
          addressRegion: "Karnataka",
          addressCountry: "IN",
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://royalmechanic.shop/#website",
        name: "Royal Mechanic",
        url: "https://royalmechanic.shop",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PublicLanding />
    </>
  );
}
