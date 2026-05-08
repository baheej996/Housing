import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { DataProvider } from "@/components/DataProvider";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata = {
  title: "Housing Program Leaderboard",
  description: "Real-time scores and performance tracking",
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
