import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Barber Hub Painel",
  description: "Painel Master do SaaS de barbearias",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
