'use client';
import { trpc } from '@/lib/trpc';
import { useParams } from 'next/navigation';

export default function PostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: post, isLoading } = trpc.post.getBySlug.useQuery({ slug });

  if (isLoading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <div className="text-gray-600">
        Categories: {post.categories.map((c: any) => c.name).join(', ')}
      </div>
      <div className="prose">{post.content}</div>
    </div>
  );
}
