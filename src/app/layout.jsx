import { Inter } from "next/font/google";
import "./globals.css";
import { getSession } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    display: "swap",
});
export const metadata = {
    title: {
        default: "CruiserZone — Certified Pre-Owned Car Auctions",
        template: "%s | CruiserZone",
    },
    description: "Bid on certified pre-owned cars. Live timed auctions, verified history, 220-point inspection, and a refundable bidding token from CruiserZone Pvt Ltd.",
};
export default async function RootLayout({ children, }) {
    const session = await getSession();
    return (<html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Navbar session={session}/>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>);
}
