import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lunchmate BOS",
  description: "Mobile-first POS and order management"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
