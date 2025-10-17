"use client";
import { useForm } from "react-hook-form";
import { trpc } from "@/lib/trpc";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

type FormData = {
  title: string;
  content: string;
  categoryId: number | null;
};

export default function EditPostPage() {
  const params = useParams();
  const postId = Number(params.id);
  const router = useRouter();

  const { data: post, isLoading } = trpc.post.getById.useQuery({ id: postId });
  const { data: categories } = trpc.category.getAll.useQuery();
  const updatePost = trpc.post.update.useMutation();

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

  useEffect(() => {
    if (post) {
      setValue("title", post.title);
      setValue("content", post.content);
      setValue("categoryId", post.categories?.[0]?.id || null);
      setStatus(post.status as "draft" | "published");
    }
  }, [post, setValue]);

  const selectCategory = (categoryId: number) => {
    if (selectedCategory === categoryId) {
      setValue("categoryId", null);
    } else {
      setValue("categoryId", categoryId);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
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
          <button
            onClick={() => router.push("/blog")}
            className="text-blue-600 hover:underline font-medium"
          >
            ← Back to blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 lg:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            Edit Post
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Update your post content and settings
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Post Title <span className="text-red-500">*</span>
              </label>
              <input
                {...register("title", { required: "Title is required" })}
                placeholder="Enter post title..."
                className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
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
                  className="border border-gray-300 rounded-lg p-3 w-full h-48 sm:h-64 lg:h-80 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-xs sm:text-sm resize-y"
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white px-2 py-1 rounded hidden sm:block">
                  Markdown supported
                </div>
              </div>
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.content.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Category{" "}
                <span className="text-gray-500 text-xs">(Select one)</span>
              </label>
              {categories && categories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => selectCategory(cat.id)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all text-left
                        ${
                          selectedCategory === cat.id
                            ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                        }
                      `}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
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
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-sm block truncate">
                          {cat.name}
                        </span>
                        {cat.description && (
                          <span className="text-xs text-gray-500 block truncate">
                            {cat.description}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  No categories available.{" "}
                  <a
                    href="/categories"
                    className="text-blue-600 hover:underline"
                  >
                    Create one first
                  </a>
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Publication Status
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <label
                  className={`
                    flex items-center gap-3 px-4 py-3 sm:py-4 rounded-lg border-2 cursor-pointer transition-all
                    ${
                      status === "draft"
                        ? "border-yellow-500 bg-yellow-50 text-yellow-700 shadow-sm"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  <input
                    type="radio"
                    value="draft"
                    checked={status === "draft"}
                    onChange={(e) => setStatus(e.target.value as "draft")}
                    className="w-4 h-4 text-yellow-600 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-sm">Draft</div>
                    <div className="text-xs opacity-75 mt-0.5">
                      Save for later
                    </div>
                  </div>
                </label>
                <label
                  className={`
                    flex items-center gap-3 px-4 py-3 sm:py-4 rounded-lg border-2 cursor-pointer transition-all
                    ${
                      status === "published"
                        ? "border-green-500 bg-green-50 text-green-700 shadow-sm"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  <input
                    type="radio"
                    value="published"
                    checked={status === "published"}
                    onChange={(e) =>
                      setStatus(e.target.value as "published")
                    }
                    className="w-4 h-4 text-green-600 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-sm">Published</div>
                    <div className="text-xs opacity-75 mt-0.5">
                      Make it live
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              onClick={() => router.push("/blog")}
              className="w-full sm:w-auto order-2 sm:order-1 px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updatePost.isPending}
              className="w-full sm:w-auto order-1 sm:order-2 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {updatePost.isPending ? (
                <span className="flex items-center justify-center gap-2">
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
                  Updating...
                </span>
              ) : (
                "Update Post"
              )}
            </button>
          </div>

          {/* Error Message */}
          {updatePost.error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700 font-medium text-sm">
                Error: {updatePost.error.message}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
