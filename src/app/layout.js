import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { DataProvider } from "@/components/DataProvider";
import SmoothScroll from "@/components/SmoothScroll";

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata = {
  title: 'Housing Grand Finale 2024',
  description: 'Premium Sports Management Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>
          <DataProvider>
            {children}
            <BottomNav />
          </DataProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
