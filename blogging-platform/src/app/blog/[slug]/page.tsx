"use client";
import { trpc } from "@/lib/trpc";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Calendar, Tag, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { toast } from "sonner";

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const {
    data: post,
    isLoading,
    error,
  } = trpc.post.getBySlug.useQuery({ slug });

  useEffect(() => {
    if (error) {
      toast.error("Failed to load post", {
        description: "Please try again later.",
      });
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
          <p className="text-gray-600 mb-4">Post not found</p>
          <Link
            href="/blog"
            className="text-blue-600 hover:underline font-medium"
          >
            ← Back to blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Post header */}
        <header className="mb-8 sm:mb-12">
          {/* Status badge */}
          {post.status === "draft" && (
            <div className="mb-4">
              <Badge
                variant="secondary"
                className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
              >
                Draft
              </Badge>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta information */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 text-sm text-gray-600">
            {/* Date */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={new Date(post.createdAt).toISOString()}>
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>

            {/* Categories */}
            {post.categories && post.categories.length > 0 && (
              <>
                <span className="hidden sm:inline text-gray-400">•</span>
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="w-4 h-4 flex-shrink-0" />
                  <div className="flex flex-wrap gap-2">
                    {post.categories.map((c: { id: number; name: string }) => (
                      <Badge
                        key={c.id}
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 hover:bg-blue-100"
                      >
                        {c.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Post content */}
        <Card>
          <CardContent className="p-6 sm:p-8 lg:p-12">
            <div className="prose prose-sm sm:prose lg:prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-pre:bg-gray-900 prose-pre:text-gray-100">
              <div className="whitespace-pre-wrap break-words">
                {post.content}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
            <Link href={`/blog/edit/${post.id}`}>
              <Edit className="w-4 h-4" />
              Edit Post
            </Link>
          </Button>
          <Button asChild variant="ghost" className="gap-2 bg-gray-200 hover:bg-gray-300">
            <Link href="/blog">View All Posts</Link>
          </Button>
        </div>
      </article>
    </div>
  );
}
