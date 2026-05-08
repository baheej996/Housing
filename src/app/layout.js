import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { DataProvider } from "@/components/DataProvider";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata = {
  title: 'Housing Grand Finale 2024',
  description: 'Premium Sports Management Platform',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
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
