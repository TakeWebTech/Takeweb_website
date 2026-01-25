import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://takeweb.in"),
  title: {
    default: "TakeWeb Enterprise | Next-Generation IT Solutions & Digital Transformation",
    template: "%s | TakeWeb Enterprise",
  },
  description:
    "TakeWeb delivers world-class enterprise IT solutions, custom software development, cloud services, AI integration, and cybersecurity to enterprises and governments worldwide.",
  keywords: [
    "enterprise IT solutions",
    "software development",
    "cloud solutions",
    "AI solutions",
    "cybersecurity",
    "digital transformation",
    "IT consulting",
    "TakeWeb",
  ],
  authors: [{ name: "TakeWeb", url: "https://takeweb.in" }],
  creator: "TakeWeb Enterprise",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://takeweb.in",
    siteName: "TakeWeb Enterprise",
    title: "TakeWeb Enterprise | Next-Generation IT Solutions",
    description:
      "World-class enterprise IT consulting, software development, cloud, AI, and cybersecurity services.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TakeWeb Enterprise - Next-Generation IT Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TakeWeb Enterprise | Next-Generation IT Solutions",
    description:
      "World-class enterprise IT consulting, software development, cloud, AI, and cybersecurity services.",
    images: ["/og-image.png"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
                            (function() {
                                const theme = localStorage.getItem('theme') || 'system';
                                const resolved = theme === 'system' 
                                    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                                    : theme;
                                document.documentElement.classList.add(resolved);
                            })();
                        `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} font-sans`}
      >
        <ThemeProvider>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
