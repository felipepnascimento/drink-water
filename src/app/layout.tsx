import type { Metadata, Viewport } from "next";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aquário da Sede",
  description: "Beba água pra encher o aquário do peixinho.",
  appleWebApp: {
    capable: true,
    title: "Aquário da Sede",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#1f9bab",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      {process.env.NODE_ENV !== "production" && (
        <head>
          {/* Runs before any chunk loads, so it can clean up a stale SW even
              if that stale SW's cached HTML points at chunks that 404 and
              never let the React bundle (and its useEffect) hydrate. */}
          <script
            dangerouslySetInnerHTML={{
              __html: `if ("serviceWorker" in navigator) { navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister())); }
if (window.caches) { caches.keys().then((keys) => keys.forEach((key) => caches.delete(key))); }`,
            }}
          />
        </head>
      )}
      <body>
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
