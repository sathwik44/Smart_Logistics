import "./globals.css";

export const metadata = {
  title: "Smart Logistics",
  description: "Logistics monitoring and routing dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}