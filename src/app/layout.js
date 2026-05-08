import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { DataProvider } from "@/components/DataProvider";

export const metadata = {
  title: "Housing Program Leaderboard",
  description: "Real-time scores and performance tracking",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <DataProvider>
          {children}
          <BottomNav />
        </DataProvider>
      </body>
    </html>
  );
}
