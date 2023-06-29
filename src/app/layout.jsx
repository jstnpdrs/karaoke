import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Karaoke - By Justine Pedrosa",
  description: "Free Online Karaoke",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-black">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
