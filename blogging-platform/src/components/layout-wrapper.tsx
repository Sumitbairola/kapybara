"use client";

import Link from "next/link";
import { ReactNode } from "react";
import {
  BookOpen,
  Folder,
  LayoutDashboard,
  Tag,
  Plus,
  Menu,
  Twitter,
  Github,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function LayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Kapybara Blog
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" asChild className="hover:bg-blue-100 hover:text-blue-600">
                <Link href="/blog">
                  <Folder className="w-5 h-5" />
                  Blog
                </Link>
              </Button>
              <Button variant="ghost" asChild className="hover:bg-blue-100 hover:text-blue-600">
                <Link href="/dashboard">
                  <LayoutDashboard className="w-5 h-5" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="ghost" asChild className="hover:bg-blue-100 hover:text-blue-600">
                <Link href="/categories">
                  <Tag className="w-5 h-5" />
                  Categories
                </Link>
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                <Link href="/blog/new">
                  <Plus className="w-5 h-5" />
                  New Post
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => {
                const menu = document.getElementById("mobile-menu");
                menu?.classList.toggle("hidden");
              }}
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div
            id="mobile-menu"
            className="hidden md:hidden pb-4 border-t border-gray-100 mt-2"
          >
            <div className="flex flex-col gap-1 pt-2">
              <Button variant="ghost" asChild className="gap-3 justify-start">
                <Link href="/blog">
                  <Folder className="w-5 h-5" />
                  Blog
                </Link>
              </Button>
              <Button variant="ghost" asChild className="gap-3 justify-start">
                <Link href="/dashboard">
                  <LayoutDashboard className="w-5 h-5" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="ghost" asChild className="gap-3 justify-start">
                <Link href="/categories">
                  <Tag className="w-5 h-5" />
                  Categories
                </Link>
              </Button>
              <Button asChild className="gap-2 mt-2">
                <Link href="/blog/new">
                  <Plus className="w-5 h-5" />
                  New Post
                </Link>
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-80px)]">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Kapybara Blog
                </span>
              </div>
              <p className="text-sm text-gray-600">
                A modern blogging platform for sharing your thoughts and ideas
                with the world.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/blog"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Blog Posts
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categories"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    API Reference
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Connect</h3>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-9 h-9 bg-gray-100 hover:bg-blue-100 rounded-lg flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-gray-100 hover:bg-blue-100 rounded-lg flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-gray-100 hover:bg-blue-100 rounded-lg flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 text-center sm:text-left">
              © {new Date().getFullYear()} Kapybara Blog. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-blue-600 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
