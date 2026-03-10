import "./globals.css";

export const metadata = {
  title: "AMS",
  description: "Absence Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
