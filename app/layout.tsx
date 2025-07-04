import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Script from "next/script";
import PromotekitScript from '@/components/PromotekitScript'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Sportsjobs Online | Find Your Dream Job in Sports Analytics and Betting',
  description: 'Find the best sports analytics and data science jobs in sports and betting. Get hired in sports analytics, data science, software development, and more.',
  keywords: 'sports analytics jobs, sports data science jobs, sports software jobs, sports betting jobs, sports data jobs, sports analytics careers, sports data science careers, sports software careers, sports betting careers',
  openGraph: {
    siteName: 'Sportsjobs Online',
    title: 'Sports analytics and data science jobs | Software sports jobs',
    description: 'Find the best sports analytics and data science jobs in sports and betting. Get hired in sports analytics, data science, software development, and more.',
    type: 'website',
    url: 'https://www.sportsjobs.online',
    images: [
      {
        url: 'https://i.postimg.cc/gjWHz15T/www-sportsjobs-online-High-res-Screenshot.png',
        alt: `Logo of Sportsjobs Online`,
      }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sports analytics and data science jobs | Software sports jobs',
    description: 'Find the best sports analytics and data science jobs in sports and betting. Get hired in sports analytics, data science, software development, and more. ',
    images: [
      {
        url: 'https://i.postimg.cc/gjWHz15T/www-sportsjobs-online-High-res-Screenshot.png',
        alt: `Logo of Sportsjobs Online`,
      }]
  },
  // You can add more metadata as needed
  // 'https://styles.redditmedia.com/t5_7z0so/styles/profileIcon_dgkx9ubgaqrc1.png',
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <head>
        {/* Google Tag (gtag.js) */}
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=G-YEWMS73Q97`}
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-YEWMS73Q97');
            `,
          }}
        />
        <PromotekitScript />
        {/* <link rel="canonical" href="https://www.sportsjobs.online" /> */}
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
