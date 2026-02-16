import type { Metadata } from "next";
import "./globals.css";
import ClientShell from "@/components/ClientShell";

export const metadata: Metadata = {
  title: "0nMCP — Universal AI API Orchestrator",
  description: "59 services, 1,385+ capabilities. The most comprehensive MCP orchestrator. Visualize, explore, and execute.",
  openGraph: {
    title: "0nMCP — Universal AI API Orchestrator",
    description: "59 services, 1,385+ capabilities. Chain, combine, and automate everything.",
    url: "https://app.0nmcp.com",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
