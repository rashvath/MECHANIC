import { PublicLanding } from "@/components/service/public-landing";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": "https://royalmechanic.in/#business",
        name: "Royal Mechanic",
        description:
          "Doorstep bike service and repair booking platform in Bengaluru.",
        url: "https://royalmechanic.in",
        image: "https://royalmechanic.in/images/logo.png",
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
        "@id": "https://royalmechanic.in/#website",
        name: "Royal Mechanic",
        url: "https://royalmechanic.in",
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
