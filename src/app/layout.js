import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Tymur Bondar",
  description: "Developer based in Toronto. CS student at Purdue, passionate about building automated AI systems for software engineering and digital marketing.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex flex-col min-h-screen">
        {/* Layout UI */}
        <Navbar />
        <main className="bg-bark-950 flex-grow content-center">{children}</main>
        <Footer/>
      </body>
    </html>
  )
}
