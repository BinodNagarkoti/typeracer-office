import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_NAME = "TypeRacer Office";
const DEFAULT_DESCRIPTION =
  "Free online typing speed test and competition platform. Challenge your colleagues, improve your WPM, and climb the leaderboard with fun office typing challenges.";
const OG_IMAGE = "https://placehold.co/1200x630/2563EB/FFFFFF?text=TypeRacer+Office&font=montserrat";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://typeracer.binodnagarkoti.com.np"),
  title: {
    default: `${SITE_NAME} — Online Typing Speed Test & Competition`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "typing test",
    "typing speed",
    "WPM test",
    "typing competition",
    "online typing game",
    "office typing race",
    "keyboard speed test",
    "typing practice",
    "words per minute",
    "typing accuracy",
  ],
  authors: [{ name: "TypeRacer Office" }],
  creator: "TypeRacer Office",
  icons: {
    icon: [
      { url: "/globe.svg", type: "image/svg+xml" },
      { url: "https://placehold.co/32x32/2563EB/FFFFFF.png?text=TR", sizes: "32x32", type: "image/png" },
    ],
    apple: "https://placehold.co/180x180/2563EB/FFFFFF.png?text=TR",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://typeracer.binodnagarkoti.com.np",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Online Typing Speed Test & Competition`,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "TypeRacer Office — Typing Speed Competition",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Online Typing Speed Test & Competition`,
    description: DEFAULT_DESCRIPTION,
    images: [OG_IMAGE],
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
  alternates: {
    canonical: "https://typeracer.binodnagarkoti.com.np",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'system';
                  var resolved = theme === 'system'
                    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                    : theme;
                  document.documentElement.classList.add(resolved);
                } catch(e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "TypeRacer Office",
              description:
                "Free online typing speed test and competition platform. Challenge your colleagues, improve your WPM, and climb the leaderboard.",
              url: "https://typeracer.binodnagarkoti.com.np",
              applicationCategory: "GameApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              featureList: [
                "Typing speed test",
                "Accuracy measurement",
                "Office vocabulary challenges",
                "Team leaderboards",
                "Timed typing rounds",
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
