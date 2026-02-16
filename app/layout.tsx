import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "0nMCP — Universal AI API Orchestrator",
  description: "550 tools, 26 services, 13 categories. The most comprehensive MCP server. Visualize, explore, and execute.",
  openGraph: {
    title: "0nMCP — Universal AI API Orchestrator",
    description: "550 tools across 26 services. Chain, combine, and automate everything.",
    url: "https://app.0nmcp.com",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
