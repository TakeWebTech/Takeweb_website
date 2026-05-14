import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Preloader } from "@/components/ui/preloader";
import { PageTransition } from "@/components/ui/page-transition";

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
    "Accelerating digital transformation for global enterprises through world-class IT consulting, bespoke software engineering, and AI-driven innovations. Trusted by 500+ industry leaders.",
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
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
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
        <Preloader />
        <ThemeProvider>
          <Navigation />
          <PageTransition>
            <main>{children}</main>
          </PageTransition>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
