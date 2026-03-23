import type { Metadata } from "next";
import "./globals.css";
import "@/styles/cinema.css";

export const metadata: Metadata = {
  title: "Dental Cinematic Experience",
  description:
    "A CRED Garage–style cinematic scroll experience for premium dental practices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
