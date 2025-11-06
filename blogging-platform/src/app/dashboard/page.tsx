"use client";
import Link from "next/link";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import {
  Loader2,
  Plus,
  FileText,
  CheckCircle2,
  Clock,
  Calendar,
  Tag,
  Eye,
  Edit,
  Trash2,
  ChevronRight,
  Folder,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

type PostCategory = {
  id: number;
  name: string;
  slug: string;
};

type Post = {
  id: number;
  title: string;
  content: string;
  slug: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  categories?: PostCategory[];
};

export default function DashboardPage() {
  const {
    data: posts,
    refetch,
    isLoading,
    error,
  } = trpc.post.getAll.useQuery();
  const deletePost = trpc.post.delete.useMutation();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (error) {
      toast.error("Failed to load posts", {
        description: "Please try again later.",
      });
    }
  }, [error]);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      setDeletingId(id);
      await deletePost.mutateAsync({ id });
      toast.success("Post deleted successfully", {
        description: `"${title}" has been removed.`,
      });
      await refetch();
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast.error("Failed to delete post", {
        description: "Please try again later.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const draftPosts = posts?.filter((p: Post) => p.status === "draft") || [];
  const publishedPosts =
    posts?.filter((p: Post) => p.status === "published") || [];

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Dashboard
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Manage all your blog posts in one place
              </p>
            </div>
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            >
              <Link href="/blog/new">
                <Plus className="w-5 h-5" />
                Create New Post
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <Card className="py-0">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Posts</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {posts?.length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="py-0">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Published</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {publishedPosts.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="py-0">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Drafts</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {draftPosts.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            All Posts
          </h2>

          {posts && posts.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {posts.map((post: Post) => (
                <Card
                  key={post.id}
                  className="hover:shadow-md transition-all py-0"
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Post Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 mb-2">
                          {/* Status Badge */}
                          <Badge
                            variant="secondary"
                            className={`flex-shrink-0 ${
                              post.status === "published"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            }`}
                          >
                            {post.status === "published"
                              ? "Published"
                              : "Draft"}
                          </Badge>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2">
                            {post.title}
                          </h3>
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(post.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>

                          {post.categories && post.categories.length > 0 && (
                            <>
                              <span className="text-gray-300">•</span>
                              <div className="flex items-center gap-1.5">
                                <Tag className="w-4 h-4" />
                                <span>
                                  {post.categories
                                    .map((c) => c.name)
                                    .join(", ")}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="gap-1.5"
                        >
                          <Link href={`/blog/${post.slug}`}>
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">View</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="gap-1.5 text-blue-700 hover:text-blue-900 hover:bg-blue-50"
                        >
                          <Link href={`/blog/edit/${post.id}`}>
                            <Edit className="w-4 h-4" />
                            <span className="hidden sm:inline">Edit</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(post.id, post.title)}
                          disabled={deletingId === post.id}
                          className="gap-1.5 text-red-700 hover:text-red-900 hover:bg-red-50"
                        >
                          {deletingId === post.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                          <span className="hidden sm:inline">
                            {deletingId === post.id ? "Deleting..." : "Delete"}
                          </span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="py-0">
              <CardContent className="p-8 sm:p-12 text-center">
                <div className="max-w-sm mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No posts yet
                  </h3>
                  <p className="text-gray-600 mb-6 text-sm sm:text-base">
                    Get started by creating your first blog post.
                  </p>
                  <Button
                    asChild
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                  >
                    <Link href="/blog/new">
                      <Plus className="w-5 h-5" />
                      Create Your First Post
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Links */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/categories" className="group">
            <Card className="hover:shadow-md hover:border-gray-300 transition-all py-0">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Tag className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                      Manage Categories
                    </h3>
                    <p className="text-sm text-gray-600">
                      Organize your posts with categories
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/blog" className="group">
            <Card className="hover:shadow-md hover:border-gray-300 transition-all py-0">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Folder className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                      View Blog
                    </h3>
                    <p className="text-sm text-gray-600">
                      See all published posts
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
