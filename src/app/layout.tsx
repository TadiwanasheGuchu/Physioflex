import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { StickyBookingBar } from "@/components/sticky-booking-bar";
import { ChatWidget } from "@/components/chat-widget";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
});

const BASE_URL = "https://physioflex.na";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Physioflex | Expert Physiotherapy in Swakopmund, Namibia",
    template: "%s | Physioflex Swakopmund",
  },
  description:
    "Book expert physiotherapy in Swakopmund, Namibia. Sports rehabilitation, pain management, manual therapy, and post-surgery recovery. HPCNA registered. Medical aid welcome.",
  keywords: [
    "physiotherapy Swakopmund",
    "physio Namibia",
    "sports rehabilitation Namibia",
    "back pain physio Swakopmund",
    "physiotherapist Swakopmund",
    "HPCNA physiotherapist",
    "Erongo physiotherapy",
  ],
  authors: [{ name: "Physioflex", url: BASE_URL }],
  creator: "Physioflex",
  publisher: "Physioflex",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "en_NA",
    url: BASE_URL,
    siteName: "Physioflex",
    title: "Physioflex | Expert Physiotherapy in Swakopmund, Namibia",
    description:
      "Book expert physiotherapy in Swakopmund. Sports rehab, pain management, manual therapy. HPCNA registered. Walk-ins & medical aid welcome.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Physioflex — Expert Physiotherapy in Swakopmund, Namibia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Physioflex | Expert Physiotherapy in Swakopmund, Namibia",
    description:
      "Book expert physiotherapy in Swakopmund. Sports rehab, pain management, manual therapy. HPCNA registered.",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "PhysicalTherapist",
  name: "Physioflex",
  image: `${BASE_URL}/opengraph-image`,
  url: BASE_URL,
  telephone: "+264640000000",
  email: "info@physioflex.na",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Sam Nujoma Avenue",
    addressLocality: "Swakopmund",
    addressRegion: "Erongo",
    postalCode: "9000",
    addressCountry: "NA",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -22.6785,
    longitude: 14.5252,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "08:00",
      closes: "13:00",
    },
  ],
  currenciesAccepted: "NAD",
  paymentAccepted: "Cash, Card, Medical Aid",
  areaServed: {
    "@type": "City",
    name: "Swakopmund",
  },
  sameAs: [
    "https://www.facebook.com/physioflex.na",
    "https://www.instagram.com/physioflex.na",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body
        className="min-h-full flex flex-col"
        style={{ fontFeatureSettings: '"ss01"' }}
      >
        {children}
        <WhatsAppButton />
        <StickyBookingBar />
        <ChatWidget />
      </body>
    </html>
  );
}
