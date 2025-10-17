"use client";
import { useForm } from "react-hook-form";
import { trpc } from "@/lib/trpc";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

type FormData = {
  title: string;
  content: string;
  categoryId: number; // Changed from categoryIds to categoryId
};

export default function EditPostPage() {
  const params = useParams();
  const postId = Number(params.id);
  const router = useRouter();

  const { data: post, isLoading } = trpc.post.getById.useQuery({ id: postId });
  const { data: categories } = trpc.category.getAll.useQuery();
  const updatePost = trpc.post.update.useMutation();

  const { register, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      title: "",
      content: "",
      categoryId: 0,
    },
  });

  const [status, setStatus] = useState<"draft" | "published">("draft");
  const selectedCategory = watch("categoryId");

  useEffect(() => {
    if (post) {
      setValue("title", post.title);
      setValue("content", post.content);
      // Get the first category ID if exists
      setValue("categoryId", post.categories?.[0]?.id || 0);
      setStatus(post.status as "draft" | "published");
    }
  }, [post, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      // Convert single categoryId back to array for backend
      await updatePost.mutateAsync({
        id: postId,
        ...data,
        categoryIds: data.categoryId ? [data.categoryId] : [],
        status,
      });
      router.push("/blog");
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            {...register("title", { required: true })}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Content (Markdown)</label>
          <textarea
            {...register("content", { required: true })}
            className="border p-2 w-full h-40 rounded"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">
            Category (Select One)
          </label>
          <div className="flex flex-col gap-2">
            {categories?.map((cat) => (
              <label
                key={cat.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  value={cat.id}
                  checked={selectedCategory === cat.id}
                  onChange={() => setValue("categoryId", cat.id)}
                  className="cursor-pointer"
                />
                <span>{cat.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium">Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "draft" | "published")}
            className="border p-2 rounded"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={updatePost.isPending}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {updatePost.isPending ? "Updating..." : "Update Post"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/blog")}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
        {updatePost.error && (
          <p className="text-red-600">Error: {updatePost.error.message}</p>
        )}
      </form>
    </div>
  );
}
