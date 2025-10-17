import "./globals.css";
import { Providers } from "@/components/providers";
import { ReactNode } from "react";

export const metadata = {
  title: "Swyft Blog",
  description: "Multi-user blogging platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <header className="bg-gray-800 text-white p-4">
            <nav className="container mx-auto flex justify-between">
              <a href="/" className="font-bold">
                Kapybara Blog
              </a>
              <div className="space-x-4">
                <a href="/dashboard">Dashboard</a>
                <a href="/blog/new">New Post</a>
                <a href="/categories">Categories</a>
              </div>
            </nav>
          </header>
          <main className="container mx-auto mt-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
