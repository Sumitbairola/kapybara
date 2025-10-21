'use client';
import { trpc } from '@/lib/trpc';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { Post, PostCategory } from '@/types';
import { Plus, Tag, Calendar, FileText, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

export default function BlogPage() {
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const { data: posts, isLoading, error } = trpc.post.getAll.useQuery({ categoryId });
  const { data: categories } = trpc.category.getAll.useQuery();

  useEffect(() => {
    if (error) {
      toast.error("Failed to load posts", {
        description: "Please try again later.",
      });
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 lg:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3">
            Blog Posts
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Discover our latest articles and insights
          </p>
        </div>

        {/* Filter and Actions */}
        <Card className="mb-6 sm:mb-8 py-0">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Category Filter */}
              <div className="flex-1">
                <Label className="block text-sm font-semibold text-gray-700 mb-2">
                  Filter by Category
                </Label>
                <Select
                  value={categoryId?.toString() || "all"}
                  onValueChange={(value) => {
                    const newCategoryId = value === "all" ? undefined : Number(value);
                    setCategoryId(newCategoryId);
                    if (newCategoryId) {
                      const categoryName = categories?.find(c => c.id === newCategoryId)?.name;
                      toast.info(`Filtering by ${categoryName}`);
                    }
                  }}
                >
                  <SelectTrigger className="w-full sm:w-auto min-w-[200px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Create New Post Button */}
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                <Link href="/blog/new">
                  <Plus className="w-5 h-5" />
                  <span>Create Post</span>
                </Link>
              </Button>
            </div>

            {/* Active Filter Badge */}
            {categoryId && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-gray-600">Active filter:</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 gap-1.5">
                  {categories?.find(c => c.id === categoryId)?.name}
                  <button
                    onClick={() => {
                      setCategoryId(undefined);
                      toast.info("Filter cleared");
                    }}
                    className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Posts Grid */}
        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {posts.map((post: Post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group"
              >
                <Card className="h-full hover:shadow-md transition-all overflow-hidden py-0">
                  <CardContent className="p-5 sm:p-6">
                    {/* Status Badge */}
                    {post.status === 'draft' && (
                      <div className="mb-3">
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                          Draft
                        </Badge>
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    {/* Content Preview */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {post.content.substring(0, 150)}...
                    </p>

                    {/* Meta Information */}
                    <div className="space-y-2">
                      {/* Categories */}
                      {post.categories && post.categories.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <Tag className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <div className="flex flex-wrap gap-1.5">
                            {post.categories.map((c: PostCategory) => (
                              <Badge
                                key={c.id}
                                variant="secondary"
                                className="text-xs"
                              >
                                {c.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Date */}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <time dateTime={post.createdAt.toISOString()}>
                          {post.createdAt.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </time>
                      </div>
                    </div>

                    {/* Read More Arrow */}
                    <div className="mt-4 flex items-center text-blue-600 text-sm font-medium group-hover:gap-2 transition-all">
                      <span>Read more</span>
                      <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="max-w-sm mx-auto">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts found</h3>
                <p className="text-gray-600 mb-6">
                  {categoryId 
                    ? "No posts in this category yet. Try selecting a different category."
                    : "Get started by creating your first blog post."}
                </p>
                <Button asChild className="gap-2">
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
    </div>
  );
}
