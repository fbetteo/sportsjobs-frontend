import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Sports analytics and data science jobs | Software sports jobs',
  description: 'Find the best sports analytics and data science jobs in sports and betting. Get hired in sports analytics, data science, software development, and more. SportsJobs Online is the best place to find sports analytics jobs.',
  keywords: 'sports analytics jobs, sports data science jobs, sports software jobs, sports betting jobs, sports data jobs, sports analytics careers, sports data science careers, sports software careers, sports betting careers',
  openGraph: {
    title: 'Sports analytics and data science jobs | Software sports jobs',
    description: 'Find the best sports analytics and data science jobs in sports and betting. Get hired in sports analytics, data science, software development, and more. SportsJobs Online is the best place to find sports analytics jobs.',
    type: 'website',
    url: 'https://www.sportsjobs.online',
    images: [
      {
        url: 'https://postimg.cc/CnFZSGLH', // 'https://styles.redditmedia.com/t5_7z0so/styles/profileIcon_dgkx9ubgaqrc1.png',
        alt: `Logo of Sportsjobs Online`,
      }]
  },
  twitter: {
    title: 'Sports analytics and data science jobs | Software sports jobs',
    description: 'Find the best sports analytics and data science jobs in sports and betting. Get hired in sports analytics, data science, software development, and more. SportsJobs Online is the best place to find sports analytics jobs.',
  },
  // You can add more metadata as needed
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
      </head>
      <body className={inter.className}><Providers>{children}</Providers></body>
    </html>
  );
}
