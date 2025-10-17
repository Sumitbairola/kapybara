import "./globals.css";
import { Providers } from "@/components/providers";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { ReactNode } from "react";

export const metadata = {
  title: "Kapybara Blog",
  description: "Multi-user blogging platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
