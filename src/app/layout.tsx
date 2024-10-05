import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "QuickBun | AI-Powered NPM Package Discovery",
  description: "Discover and explore NPM packages with ease using Package Finder. Get AI-generated documentation and usage examples for any package.",
  keywords: "npm, package finder,quickbun, bun, javascript libraries, AI documentation, developer tools",
  openGraph: {
    title: "QuickBun | Discover NPM Packages with AI",
    description: "Find the perfect NPM package for your project with AI-generated documentation and examples.",
    type: "website",
    url: "https://www.quickbun.vercel.app",
    images: [
      {
        url: "/favicon.ico",
        width: 100,
        height: 100,
        alt: "QuickBun - AI-Powered NPM Package Discovery",
      },
    ],
  },
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="dark:bg-neutral-900"
      >
        <ThemeProvider attribute="class" defaultTheme="light" >
          <Toaster richColors/>
          <SessionProvider>
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
