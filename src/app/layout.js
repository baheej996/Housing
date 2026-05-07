import "./globals.css";

export const metadata = {
  title: "Housing Program Leaderboard",
  description: "Real-time scores and performance tracking",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
