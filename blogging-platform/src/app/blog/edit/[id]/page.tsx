"use client";
import { useForm } from "react-hook-form";
import { trpc } from "@/lib/trpc";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

type FormData = {
  title: string;
  content: string;
  categoryId: number | null;
};

export default function EditPostPage() {
  const params = useParams();
  const postId = Number(params.id);
  const router = useRouter();

  const { data: post, isLoading, error: loadError } = trpc.post.getById.useQuery({ id: postId });
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

  useEffect(() => {
    if (loadError) {
      toast.error("Failed to load post", {
        description: "Please try again later.",
      });
    }
  }, [loadError]);

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
      toast.success("Post updated successfully!", {
        description: "Your changes have been saved.",
      });
      router.push("/blog");
    } catch (error) {
      console.error("Failed to update post:", error);
      toast.error("Failed to update post", {
        description: "Please try again later.",
      });
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
          <Button
            variant="link"
            onClick={() => router.push("/blog")}
            className="text-blue-600 hover:underline font-medium"
          >
            ← Back to blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 lg:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </Button>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            Edit Post
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Update your post content and settings
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardContent className="p-4 sm:p-6 lg:p-8 space-y-6">
              {/* Title */}
              <div>
                <Label className="block text-sm font-semibold text-gray-700 mb-2">
                  Post Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register("title", { required: "Title is required" })}
                  placeholder="Enter post title..."
                  className="text-sm sm:text-base"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Content */}
              <div>
                <Label className="block text-sm font-semibold text-gray-700 mb-2">
                  Content <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Textarea
                    {...register("content", {
                      required: "Content is required",
                    })}
                    placeholder="Write your post content in Markdown format..."
                    className="h-48 sm:h-64 lg:h-80 font-mono text-xs sm:text-sm resize-y"
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
                <Label className="block text-sm font-semibold text-gray-700 mb-3">
                  Category{" "}
                  <span className="text-gray-500 text-xs">(Select one)</span>
                </Label>
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
                            <Check className="w-3 h-3 text-white" />
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
                <Label className="block text-sm font-semibold text-gray-700 mb-3">
                  Publication Status
                </Label>
                <RadioGroup
                  value={status}
                  onValueChange={(value) =>
                    setStatus(value as "draft" | "published")
                  }
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
                >
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
                    <RadioGroupItem value="draft" className="flex-shrink-0" />
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
                    <RadioGroupItem
                      value="published"
                      className="flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-sm">Published</div>
                      <div className="text-xs opacity-75 mt-0.5">
                        Make it live
                      </div>
                    </div>
                  </label>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/blog")}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updatePost.isPending}
              className="w-full sm:w-auto order-1 sm:order-2 bg-green-600 hover:bg-green-700"
            >
              {updatePost.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Updating...
                </span>
              ) : (
                "Update Post"
              )}
            </Button>
          </div>

          {/* Error Message */}
          {updatePost.error && (
            <Alert variant="destructive">
              <AlertDescription>
                Error: {updatePost.error.message}
              </AlertDescription>
            </Alert>
          )}
        </form>
      </div>
    </div>
  );
}
