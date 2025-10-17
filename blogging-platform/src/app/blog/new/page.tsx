"use client";
import { useForm } from "react-hook-form";
import { trpc } from "@/lib/trpc";
import { useRouter } from "next/navigation";
import { useState } from "react";

type FormData = {
  title: string;
  content: string;
  categoryId: number | null;
};

export default function NewPostPage() {
  const router = useRouter();
  const { data: categories } = trpc.category.getAll.useQuery();
  const createPost = trpc.post.create.useMutation();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      content: "",
      categoryId: null,
    },
  });
  const [status, setStatus] = useState<"draft" | "published">("draft");

  const selectedCategory = watch("categoryId");

  const selectCategory = (categoryId: number) => {
    // If clicking the same category, deselect it
    if (selectedCategory === categoryId) {
      setValue("categoryId", null);
    } else {
      setValue("categoryId", categoryId);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      // Convert single categoryId to array for backend
      await createPost.mutateAsync({
        ...data,
        categoryIds: data.categoryId ? [data.categoryId] : [],
        status,
      });
      router.push("/blog");
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Post</h1>
        <p className="text-gray-600">Share your thoughts with the world</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Post Title <span className="text-red-500">*</span>
            </label>
            <input
              {...register("title", { required: "Title is required" })}
              placeholder="Enter an engaging title..."
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <textarea
                {...register("content", { required: "Content is required" })}
                placeholder="Write your post content in Markdown format..."
                className="border border-gray-300 rounded-lg p-3 w-full h-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm resize-y"
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white px-2 py-1 rounded">
                Markdown supported
              </div>
            </div>
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
            )}
          </div>

          {/* Categories - Single Select */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Category <span className="text-gray-500 text-xs">(Select one)</span>
            </label>
            {categories && categories.length > 0 ? (
              <div className="flex gap-3 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => selectCategory(cat.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-all
                      ${
                        selectedCategory === cat.id
                          ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                      }
                    `}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedCategory === cat.id
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedCategory === cat.id && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="font-medium text-sm">{cat.name}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                No categories available.{" "}
                <a href="/categories" className="text-blue-600 hover:underline">
                  Create one first
                </a>
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Publication Status
            </label>
            <div className="flex gap-4">
              <label
                className={`
                  flex items-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all flex-1
                  ${
                    status === "draft"
                      ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                <input
                  type="radio"
                  value="draft"
                  checked={status === "draft"}
                  onChange={(e) => setStatus(e.target.value as "draft")}
                  className="w-4 h-4 text-yellow-600"
                />
                <div>
                  <div className="font-semibold text-sm">Draft</div>
                  <div className="text-xs opacity-75">Save for later</div>
                </div>
              </label>
              <label
                className={`
                  flex items-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all flex-1
                  ${
                    status === "published"
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                <input
                  type="radio"
                  value="published"
                  checked={status === "published"}
                  onChange={(e) => setStatus(e.target.value as "published")}
                  className="w-4 h-4 text-green-600"
                />
                <div>
                  <div className="font-semibold text-sm">Published</div>
                  <div className="text-xs opacity-75">Make it live</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => router.push("/blog")}
            className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createPost.isPending}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {createPost.isPending ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating...
              </span>
            ) : (
              "Create Post"
            )}
          </button>
        </div>

        {/* Error Message */}
        {createPost.error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700 font-medium">
              Error: {createPost.error.message}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
