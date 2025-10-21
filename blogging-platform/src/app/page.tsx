import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { features } from "@/data";
import { Book, Edit, Send } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] py-6 sm:py-10 bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 lg:mb-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-4 sm:mb-6">
          Your Platform for <span className="text-blue-600">Inspiring</span>{" "}
          Stories
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-700 mb-6 sm:mb-8 lg:mb-10 max-w-2xl mx-auto px-4">
          Create, share, and discover amazing content. A modern blogging
          platform built for performance and simplicity.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
          <Link href="/blog/new" passHref className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            >
              <Edit className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Start Blogging
            </Button>
          </Link>
          <Link href="/blog" passHref className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              <Book className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Explore Posts
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 bg-white rounded-lg shadow-xl mb-12 sm:mb-16 lg:mb-20">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-900 mb-8 sm:mb-10 lg:mb-12 px-4">
          Key Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="flex flex-col items-center text-center p-4 sm:p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <CardHeader className="flex flex-col items-center p-0 mb-3 sm:mb-4">
                <feature.icon className="h-10 w-10 sm:h-12 sm:w-12 text-blue-500 mb-3 sm:mb-4" />
                <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-800">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <CardDescription className="text-sm sm:text-base text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="text-center max-w-4xl mx-2 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 bg-blue-600 text-white rounded-lg shadow-xl">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 px-4">
          Ready to Share Your Voice?
        </h2>
        <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 lg:mb-10 px-4">
          Join our community of passionate writers and start publishing today.
        </p>
        <Link href="/blog/new" passHref className="inline-block px-4">
          <Button
            size="lg"
            className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 shadow-lg"
          >
            <Send className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Publish Your First
            Post
          </Button>
        </Link>
      </section>
    </div>
  );
}
