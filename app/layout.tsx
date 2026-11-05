import type { Metadata, Viewport } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Recipe Finder — what's cooking today?", template: "%s · Recipe Finder" },
  description: "Search thousands of recipes by name, ingredients, cuisine or diet. Save your favorites and cook something great.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff7ec" },
    { media: "(prefers-color-scheme: dark)", color: "#17110c" },
  ],
};

const themeScript = `try{var t=localStorage.getItem('theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,800&family=Poppins:wght@400;500;600&family=Vazirmatn:wght@400;600&display=swap"
        />
      </head>
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
