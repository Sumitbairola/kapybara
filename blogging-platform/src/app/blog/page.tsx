'use client';
import { trpc } from '@/lib/trpc';
import Link from 'next/link';
import { useState } from 'react';

export default function BlogPage() {
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const { data: posts, isLoading } = trpc.post.getAll.useQuery({ categoryId });
  const { data: categories } = trpc.category.getAll.useQuery();

  if (isLoading) return <div>Loading posts...</div>;

  return (
    <div className="space-y-4">
      <div>
        <label>Filter by Category:</label>
        <select
          className="ml-2 p-1 border"
          onChange={(e) => setCategoryId(Number(e.target.value) || undefined)}
        >
          <option value="">All</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      {posts?.map((post: any) => (
        <div key={post.id} className="border p-4 rounded shadow-sm">
          <Link href={`/blog/${post.slug}`}>
            <h2 className="text-xl font-bold">{post.title}</h2>
          </Link>
          <div className="text-gray-600">
            Categories: {post.categories.map((c: any) => c.name).join(', ')}
          </div>
        </div>
      ))}
    </div>
  );
}
