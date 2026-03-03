import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tymur Bondar",
  description: "Developer based in Toronto. CS student at Purdue, passionate about building automated AI systems for software engineering and digital marketing.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen text-white">
        {/* Layout UI */}
        <Navbar />
        <main className="bg-gray-900 flex-grow content-center">{children}</main>
        <Footer/>
      </body>
    </html>
  )
}