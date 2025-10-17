"use client";
import Link from "next/link";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function DashboardPage() {
  const { data: posts, refetch } = trpc.post.getAll.useQuery();
  const deletePost = trpc.post.delete.useMutation();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      setDeletingId(id);
      await deletePost.mutateAsync({ id });
      await refetch();
    } catch (error) {
      console.error("Failed to delete post:", error);
      alert("Failed to delete post");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link
          href="/blog/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create New Post
        </Link>
      </div>
      <div className="space-y-2">
        {posts?.map((post: any) => (
          <div
            key={post.id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{post.title}</h3>
              <p className="text-sm text-gray-500">
                Status: {post.status} | Created:{" "}
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/blog/${post.slug}`}
                className="text-gray-600 hover:text-gray-800"
              >
                View
              </Link>
              <Link
                href={`/blog/edit/${post.id}`}
                className="text-blue-600 hover:text-blue-800"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(post.id, post.title)}
                disabled={deletingId === post.id}
                className="text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                {deletingId === post.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
        {posts?.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            No posts yet. Create your first post!
          </p>
        )}
      </div>
    </div>
  );
}
