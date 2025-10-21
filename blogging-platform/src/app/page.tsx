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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] py-10 bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto px-4 mb-20">
        <h1 className="text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          Your Platform for <span className="text-blue-600">Inspiring</span>{" "}
          Stories
        </h1>
        <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
          Create, share, and discover amazing content. A modern blogging
          platform built for performance and simplicity.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/blog/new" passHref>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            >
              <Edit className="mr-2 h-5 w-5" /> Start Blogging
            </Button>
          </Link>
          <Link href="/blog" passHref>
            <Button
              size="lg"
              variant="outline"
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              <Book className="mr-2 h-5 w-5" /> Explore Posts
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-6xl mx-auto px-4 py-16 bg-white rounded-lg shadow-xl mb-20">
        <h2 className="text-5xl font-bold text-center text-gray-900 mb-12">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="flex flex-col items-center text-center p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <CardHeader className="flex flex-col items-center p-0 mb-4">
                <feature.icon className="h-12 w-12 text-blue-500 mb-4" />
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="text-center max-w-4xl mx-auto px-4 py-16 bg-blue-600 text-white rounded-lg shadow-xl">
        <h2 className="text-4xl font-bold mb-6">Ready to Share Your Voice?</h2>
        <p className="text-xl mb-10">
          Join our community of passionate writers and start publishing today.
        </p>
        <Link href="/blog/new" passHref>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg"
          >
            <Send className="mr-2 h-5 w-5" /> Publish Your First Post
          </Button>
        </Link>
      </section>
    </div>
  );
}
